const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// ✅ Route racine de test
app.get("/", (req, res) => {
    res.json({ message: "✅ Auth service running" });
});

// 🟩 Route pour inscription
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    console.log("📩 Tentative de signup :", email);

    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log("➡️ Réponse Supabase :", { data, error });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 🟦 Route pour login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// 🚪 Déconnexion
app.post("/logout", async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Déconnexion réussie ✅" });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`✅ Auth service running on port ${PORT}`));
