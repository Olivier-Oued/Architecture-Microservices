Architecture Microservices avec API Gateway, Docker & Supabase
🎓 Contexte académique

Ce projet a été réalisé dans le cadre d’un travail pédagogique visant à transformer une application monolithique en architecture microservices sécurisée, déployée localement à l’aide de Docker Compose, et utilisant Supabase pour l’authentification, le stockage et la base de données.

❓ Problématique

Comment concevoir une architecture backend moderne, modulaire et sécurisée permettant :

la gestion des utilisateurs,

le stockage de fichiers,

la communication entre services,
tout en respectant les principes des microservices, de la séparation des responsabilités et de la sécurité des échanges ?

🎯 Objectifs du projet

Mettre en place une architecture microservices fonctionnelle

Séparer les responsabilités en services indépendants

Centraliser les accès via une API Gateway

Sécuriser les échanges par JWT et HTTPS

Déployer l’ensemble via Docker & Docker Compose

Connecter un frontend React à l’architecture backend

🧱 Architecture générale
Microservices développés
Service	Rôle
auth-service	Gestion des utilisateurs (signup, login, logout) via Supabase Auth
file-service	Upload, stockage et métadonnées des fichiers via Supabase Storage & Database
api-gateway	Point d’entrée unique, routage vers les microservices
nginx	Reverse proxy HTTPS, routage sécurisé
client	Frontend React pour l’authentification et l’upload de fichiers


🔐 Sécurité mise en œuvre
✔ Authentification

JWT généré lors de la connexion utilisateur

Token stocké côté client

Vérification du token sur chaque endpoint sensible

✔ Protection des endpoints

Middleware JWT sur :

upload de fichiers

accès aux métadonnées

Rejet des requêtes non authentifiées

✔ Communication HTTPS

Reverse proxy Nginx

Certificats SSL auto-signés

Redirection HTTP → HTTPS

🧪 Tests réalisés
Test	Résultat
Signup utilisateur	✅ Fonctionnel
Login utilisateur	✅ Fonctionnel
Accès API sans token	❌ Refusé
Upload fichier avec token	✅ Fonctionnel
Accès service direct sans gateway	❌ Bloqué
Communication HTTPS	✅ Active
🖥️ Frontend React

Fonctionnalités :

Authentification (login / signup)

Gestion de session via JWT

Dashboard utilisateur

Upload de fichiers sécurisé

Déconnexion

Le frontend communique exclusivement avec l’API Gateway / Nginx.

🚀 Lancement du projet
Prérequis

Docker

Docker Compose

Compte Supabase

Commande
docker-compose up --build


Accès :

Frontend : https://localhost

API Gateway : http://localhost:6002

📊 Résultats obtenus

Architecture microservices fonctionnelle

Services indépendants et conteneurisés

Sécurité JWT + HTTPS opérationnelle

Frontend connecté et fonctionnel


🧩 Variables d’environnement

Un fichier .env.example est fourni pour chaque service.

🏁 Conclusion

Ce projet a permis de comprendre concrètement :

la mise en œuvre d’une architecture microservices,

la sécurisation des échanges inter-services,

l’utilisation de Supabase comme backend-as-a-service,

l’orchestration complète avec Docker Compose.

Il constitue une base solide pour des architectures backend modernes et évolutives.
