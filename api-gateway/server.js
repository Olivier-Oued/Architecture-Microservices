import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Middleware JWT pour protéger certains endpoints ---
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token manquant" });

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token invalide" });
    }
}

// --- Proxy vers Auth Service ---
app.use(
    "/auth",
    createProxyMiddleware({
        target: process.env.AUTH_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/auth": "" }
    })
);

// --- Proxy vers File Service (protégé par JWT) ---
app.use(
    "/files",
    verifyToken,
    createProxyMiddleware({
        target: process.env.FILE_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/files": "" }
    })
);

// --- Test Gateway ---
app.get("/", (req, res) => res.json({ message: "API Gateway running ✅" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API Gateway running on port ${PORT}`));
