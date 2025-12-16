# Dockerfile (pour file-service)
FROM node:20-alpine

WORKDIR /app

# copie package.json + package-lock si présent
COPY package.json package-lock.json* ./

# installe les dépendances (production)
RUN npm install --production

# copie le reste du code
COPY . .

# expose: (pas strictement nécessaire mais utile)
EXPOSE 3000

# commande par défaut (le port réel est lu depuis .env dans le container)
CMD ["npm", "start"]
