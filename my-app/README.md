# Module Test - Formulaire d'inscription React

[![npm version](https://img.shields.io/npm/v/victoria-ynov)](https://www.npmjs.com/package/victoria-ynov)

Application React de formulaire d'inscription avec validation en temps reel des champs (date de naissance, nom, prenom, ville, code postal, email). Les donnees sont envoyees a une API REST Python (FastAPI) via Axios et le compteur d'utilisateurs est recupere au chargement depuis l'API.

## Package NPM

Ce projet est publié sur npm : [https://www.npmjs.com/package/victoria-ynov](https://www.npmjs.com/package/victoria-ynov)

```bash
npm install victoria-ynov
```

## Pre-requis

- Node.js (v22 ou superieur)
- npm
- Docker & Docker Compose (pour la stack complète)

## Installation

```bash
git clone <url-du-repo>
cd my-app
npm install
```

## Lancer l'application

```bash
npm start
```

L'application s'ouvre sur [http://localhost:3000](http://localhost:3000).

## Lancer les tests unitaires et d'integration

```bash
npm test
```

Les tests s'executent avec coverage. Le rapport de couverture est genere dans le dossier `coverage/`.

### Strategie de mock (Jest)

Les tests d'integration utilisent `jest.mock('axios')` pour simuler les reponses de l'API sans connexion reseau reelle. La structure mockee reflete celle retournee par l'API (`{ utilisateurs: [...] }`) :

```js
jest.mock('axios');

// Simuler un succes GET
axios.get.mockResolvedValue({ data: { utilisateurs: mockUsers } });

// Simuler une erreur metier (400)
const error400 = new Error('Bad Request');
error400.response = { status: 400, data: { message: 'Cet email est deja utilise.' } };
axios.post.mockRejectedValue(error400);

// Simuler un crash serveur (500)
const error500 = new Error('Internal Server Error');
error500.response = { status: 500 };
axios.post.mockRejectedValue(error500);
```

Cela permet de tester les trois scenarios API sans dependre du backend :

| Scenario | Mock | Comportement attendu |
| -------- | ---- | -------------------- |
| Succes (201) | `mockResolvedValue` | Toast vert, compteur incremente |
| Erreur metier (400) | `mockRejectedValue` status 400 | Toast rouge avec message du back |
| Crash serveur (500) | `mockRejectedValue` status 500 | Toast rouge d'alerte, app stable |

## Lancer les tests End-to-End (Cypress)

Les tests E2E s'executent contre la vraie API. La stack complete doit etre demarree via Docker Compose avant de lancer Cypress.

**1. Demarrer la stack** (depuis le dossier `api/`)

```bash
cd ../api
MYSQL_ROOT_PASSWORD=secret docker compose up -d --build
```

**2. Ouvrir Cypress** (depuis `my-app/`)

```bash
npm run cypress
```

Cypress ouvre une interface graphique. Les specs sont separees par etat de l'API :

- `api-up.cy.js` — tests avec l'API active (201 nominal, 400 email duplique)
- `api-down.cy.js` — tests avec l'API arretee (500, message d'erreur generique)

Pour lancer les tests en ligne de commande :

```bash
# Tests API active
npm run cypress:api-up

# Arreter l'API puis tester les erreurs 500
npm run cypress:api-down
```

### Strategie des tests Cypress

Les tests E2E effectuent de vrais appels HTTP contre l'API (pas de `cy.intercept`). Les tests sont tagués avec `@cypress/grep` (`@apiup`, `@apidown`, `@nominal`, `@400`, `@500`) et repartis dans deux fichiers specs pour permettre l'ordonnancement : les tests `@apiup` passent en premier, puis l'API est stoppee pour les tests `@apidown`.

**Scenarios couverts :**

- **Nominal (201)** : inscription complete, toast vert, compteur incremente (compte reel recupere via `cy.request` pour eviter les race conditions).
- **Erreur metier (400)** : email deja utilise, toast rouge avec le message du back.
- **Crash serveur (500)** : API arretee, message d'erreur sur l'accueil, toast generique a la soumission.

## Pipeline CI/CD

Le pipeline GitHub Actions (`build_test_react.yml`) enchaîne quatre jobs :

```text
build_test → publish_npm ──┐
           → integration_test ──┤→ deploy
```

`publish_npm` et `integration_test` s'exécutent en parallèle après `build_test`.
Le `deploy` attend que les deux réussissent.

### Logique de publication (publish_npm)

Le job compare la version locale (`package.json`) avec la version publiée sur npm avant de publier :

- **Version locale > version NPM** → build + publication automatique
- **Version identique ou inférieure** → skip sans faire échouer le pipeline
- **Première publication (E404)** → fallback à `0.0.0`, publication déclenchée normalement
- **Toute autre erreur** (réseau, 500, auth...) → le job échoue immédiatement (principe *Fail Fast*)

Pour déclencher une publication, incrémenter la version dans `package.json` selon [SemVer](https://semver.org/) avant de pousser :

| Type | Quand | Exemple |
| --- | --- | --- |
| `PATCH` | Correction de bug | `1.1.1` → `1.1.2` |
| `MINOR` | Nouvelle fonctionnalité rétro-compatible | `1.1.1` → `1.2.0` |
| `MAJOR` | Changement cassant | `1.1.1` → `2.0.0` |

### Test d'intégration Docker (integration_test)

Le job construit et démarre la stack complète via `docker compose up -d --build` :

1. **MySQL** — image avec les migrations SQL pré-chargées, healthcheck sur `USE ynov_ci`
2. **API Python** (`api-ynov`) — FastAPI exposant `GET /users` et `POST /users`, healthcheck Python urllib
3. **React** (`react-ynov`) — application de production sur le port 3000
4. **Adminer** — interface de gestion de base de données sur le port 8080

Le job verifie ensuite :

- Que `GET /users` repond HTTP 200 avec des donnees non vides
- Les tests Cypress `api-up.cy.js` contre la vraie API
- Les tests Cypress `api-down.cy.js` apres arret du conteneur API

Si tout passe, l'image API est poussee automatiquement sur Docker Hub.

## Stack Docker Compose

Lancez toute la stack depuis le dossier `api/` :

```bash
MYSQL_ROOT_PASSWORD=secret docker compose up -d --build
```

| Service | Port | Description |
| --- | --- | --- |
| `db` | 3306 | MySQL 9.2 avec migrations SQL |
| `api` | 8000 | FastAPI Python (`GET /users`, `POST /users`) |
| `react` | 3000 | Frontend React (production) |
| `adminer` | 8080 | Interface de gestion de base de données |

Les secrets (`MYSQL_ROOT_PASSWORD`) sont injectes via variable d'environnement, jamais hardcodes.

## Structure du projet

```text
.
├── api/
│   ├── main.py              - API FastAPI exposant GET /users
│   ├── requirements.txt     - Dependances Python
│   ├── Dockerfile           - Image Python 3.11-alpine
│   └── .dockerignore
├── my-app/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js          - Page d'accueil (compteur d'utilisateurs)
│   │   │   └── Register.js      - Page formulaire d'inscription avec validation
│   │   ├── tests/
│   │   │   ├── home.test.js     - Tests unitaires du composant Home
│   │   │   ├── register.test.js - Tests d'integration du formulaire (scenario chaotique)
│   │   │   ├── app.test.js      - Tests d'integration API avec jest.mock('axios')
│   │   │   ├── api.test.js      - Tests unitaires des fonctions Axios
│   │   │   ├── module.test.js   - Tests unitaires de calculateAge
│   │   │   └── validator.test.js - Tests unitaires des validateurs
│   │   ├── App.js               - Composant racine avec routeur et etat global
│   │   ├── api.js               - Fonctions Axios (countUsers, getAllUsers, postUser)
│   │   ├── module.js            - Fonction de calcul d'age
│   │   └── validator.js         - Fonctions de validation (age, email, CP, identite, ville)
│   ├── sqlfiles/
│   │   ├── migration-v001.sql   - CREATE DATABASE ynov_ci
│   │   ├── migration-v002.sql   - CREATE TABLE utilisateur
│   │   ├── migration-v003.sql   - INSERT utilisateurs
│   │   └── migration-v004.sql   - CREATE TABLE admin + INSERT
│   ├── cypress/
│   │   ├── e2e/
│   │   │   ├── api-up.cy.js     - Tests E2E avec API active (201, 400)
│   │   │   ├── api-down.cy.js   - Tests E2E avec API arretee (500)
│   │   │   └── navigation.cy.js - Fichier de reference (tous les tests tagués)
│   │   └── support/
│   │       └── e2e.js           - Support @cypress/grep
│   ├── react.Dockerfile         - Image React de production (nginx)
│   └── TEST_PLAN.md             - Plan de test et documentation des cas testes
├── api/
│   ├── docker-compose.yml       - Stack complète (MySQL, API, React, Adminer)
│   ├── main.py                  - API FastAPI (GET /users, POST /users)
│   ├── requirements.txt         - Dependances Python
│   └── Dockerfile               - Image Python 3.11-alpine
└── .github/workflows/
    └── build_test_react.yml     - Pipeline CI/CD (build/test → publish/integration → deploy)
```
