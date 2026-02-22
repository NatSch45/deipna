# Deipna

Application web intelligente de planification et de réservation de salles de restaurant.

## Description

Deipna permet aux restaurateurs de gérer leurs salles, optimiser leurs stocks et dynamiser la réservation de leurs tables. Les clients finaux peuvent facilement rechercher et réserver des tables dans les restaurants de leur choix.

## Architecture

Ce projet est un **monorepo** composé de :

- **Backend** : API REST développée avec AdonisJS v6
- **Frontend** : Application web développée avec Vue.js 3.x
- **Base de données** : PostgreSQL

## Prérequis

- **Node.js** : Version 20+ (géré via fnm)
- **Docker** : Pour la base de données PostgreSQL

## Installation

### 1. Cloner le repository

```bash
git clone <repository-url>
cd deipna
```

### 2. Configurer la version de Node.js

```bash
fnm use
```

### 3. Démarrer la base de données

```bash
docker-compose up -d
```

### 4. Démarrer le backend

```bash
cd backend
npm install
cp .env.example .env
# Générer APP_KEY : node ace generate:key
node ace migration:run
node ace serve
```

L'API sera disponible sur : http://localhost:8080

### 5. Démarrer le frontend

```bash
cd frontend
npm install
npm run dev
```

L'application sera disponible sur : http://localhost:5173

## Structure du projet

```
deipna/
├── backend/                 # API AdonisJS
│   ├── app/
│   │   ├── controllers/     # Contrôleurs
│   │   ├── middleware/      # Middlewares
│   │   ├── models/          # Modèles Lucid
│   │   ├── services/       # Services
│   │   └── validators/       # Validateurs VineJS
│   ├── database/
│   │   └── migrations/      # Migrations
│   └── start/
│       └── routes.ts        # Routes
├── frontend/                # Application Vue.js
│   ├── src/
│   │   ├── components/      # Composants Vue
│   │   ├── views/           # Pages
│   │   ├── stores/          # État Pinia
│   │   ├── services/        # Services API
│   │   └── router/          # Configuration routes
│   └── package.json
├── docker-compose.yml       # Configuration Docker
└── README.md
```

## Scripts disponibles

### Backend

| Commande | Description |
|----------|-------------|
| `node ace serve` | Démarrer l'application |
| `node ace test` | Exécuter les tests |
| `node ace migration:run` | Exécuter les migrations |
| `node ace migrate:fresh` | Réinitialiser la BDD et migrer |

### Frontend

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Construire pour la production |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Vérifier le code avec ESLint |
| `npm run type-check` | Vérifier les types TypeScript |

## Authentification

L'API utilise JWT avec access token (15 min) et refresh token (7 jours). Endpoints :

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur connecté (authentifié)
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Renouvellement du token

## Documentation API (Swagger)

Documentation OpenAPI 3.0 manuelle :

- **Spécification YAML** : `GET /docs` — Fichier `swagger.yaml` à la racine du backend
- **Interface Swagger UI** : http://localhost:8080/docs/ui — Visualisation et test des endpoints

## Vérification de l'API

Pour vérifier le bon fonctionnement :

```bash
# Health check
curl http://localhost:8080/api/health

# Inscription
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Connexion puis /auth/me avec le token retourné
```

## Technologies utilisées

### Backend
- AdonisJS v6
- Lucid ORM (PostgreSQL)
- VineJS (validation)
- Japa (tests)
- JWT (authentification)

### Frontend
- Vue.js 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Axios

## Licence

Projet privé - Tous droits réservés
