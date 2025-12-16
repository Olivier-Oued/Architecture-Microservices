// ==============================
// 📦 Import des dépendances
// ==============================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

// ==============================
// ⚙️ Configuration
// ==============================
dotenv.config();
const app = express();

// ✅ Configuration CORS (autorise les appels depuis ton frontend)
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

// Gestion des fichiers en mémoire avant upload vers Supabase
const upload = multer({ storage: multer.memoryStorage() });

// Connexion au client Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// ==============================
// 🔒 Middleware d’authentification
// ==============================
// Vérifie le token JWT envoyé dans le header Authorization
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token manquant" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contient user.id
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token invalide" });
    }
}

// ==============================
// 🚀 Routes principales
// ==============================

// ✅ Route de test
app.get("/", (req, res) => res.json({ message: "✅ File service is running" }));

// 📤 Upload d’un fichier vers Supabase Storage + enregistrement en base
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
    try {
        console.log("📤 Upload reçu :", req.file ? req.file.originalname : "Aucun fichier");

        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu" });
        }

        const { originalname, buffer } = req.file;
        const userId = req.user.id;

        // 🔹 1. Upload dans Supabase Storage (bucket "documents")
        const { data, error } = await supabase.storage
            .from("documents") // ✅ nom du bucket en minuscule
            .upload(`${userId}/${originalname}`, buffer, {
                contentType: req.file.mimetype,
                upsert: true, // permet d’écraser si déjà présent
            });

        if (error) throw error;

        // 🔹 2. Enregistrement des métadonnées dans la table "files"
        const { error: dbError } = await supabase
            .from("files")
            .insert([{ user_id: userId, file_name: originalname }]);

        if (dbError) throw dbError;

        res.json({ message: "✅ Upload réussi", path: data.path });
    } catch (err) {
        console.error("❌ Erreur upload :", err);
        res.status(500).json({ error: err.message });
    }
});

// 📜 Liste des fichiers appartenant à l’utilisateur connecté
app.get("/list", verifyToken, async (req, res) => {
    const userId = req.user.id;

    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("user_id", userId);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

// ==============================
// 🚪 Démarrage du serveur
// ==============================
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log(`✅ File service running on port ${PORT}`));
