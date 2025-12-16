ArchitectureMicroservices
 3.1 Objectif
 Transformer l’application précédente(client-sercer) en trois microservices indépendants:
 Service Rôle Description
 AuthService Authentification GèrelesutilisateursviaSupabase
 FileService Fichiers Gèrel’accèsaustockage
 Gateway Pointd’entrée Redirigelesrequêtesetsécurise
 3.2 Préparationdel’environnement
 1. InstallerDockerDesktop
 2. Créerundossier :
 safedocs-micro/
 auth-service/
 file-service/
 gateway/
 3.3 AuthService(exemple)
 import express from ’express’;
 import { createClient } from ’@supabase/supabase-js’;
 const app = express();
 app.use(express.json());
 const supabase = createClient(process.env.SUPABASE_URL, process.env.
 →SUPABASE_KEY);
 app.post(’/login’, async (req, res) => {
 const { email, password } = req.body;
 const { data, error } = await supabase.auth.signInWithPassword({
 →email, password });
 if (error) return res.status(400).json(error);
 res.json(data);
 });
 app.listen(3001, () => console.log(’Auth service running on port 3001’)
 →);
 3.4 Dockerfile
 FROM node:18
 WORKDIR /app
 COPY . .
 RUN npm install
 CMD ["node", "index.js"]
 5
3.5 Docker Compose
 version: "3"
 services:
 auth:
 build: ./auth-service
 ports:- "3001:3001"
 file:
 build: ./file-service
 ports:- "3002:3002"
 gateway:
 build: ./gateway
 ports:- "8080:8080"
 Lancer l’ensemble :
 docker-compose up--build
 Résultat : chaque service fonctionne indépendamment.
 3.6 Sécurité
 — Utilisation de JWT pour sécuriser les requêtes
 — Mise en place d’un proxy HTTPS (bonus)
 — Tests via Postma