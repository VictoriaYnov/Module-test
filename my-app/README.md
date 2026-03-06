# Module Test - Formulaire d'inscription React

[![npm version](https://img.shields.io/npm/v/victoria-ynov)](https://www.npmjs.com/package/victoria-ynov)

Application React de formulaire d'inscription avec validation en temps reel des champs (date de naissance, nom, prenom, ville, code postal, email). Les donnees sont envoyees a une API REST via Axios et le compteur d'utilisateurs est recupere au chargement depuis JSONPlaceholder.

## Package NPM

Ce projet est publié sur npm : [https://www.npmjs.com/package/victoria-ynov](https://www.npmjs.com/package/victoria-ynov)

```bash
npm install victoria-ynov
```

## Pre-requis

- Node.js (v21 ou superieur)
- npm

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

Les tests d'integration utilisent `jest.mock('axios')` pour simuler les reponses de l'API sans connexion reseau reelle :

```js
jest.mock('axios');

// Simuler un succes GET
axios.get.mockResolvedValue({ data: mockUsers });

// Simuler une erreur metier (400)
const error400 = new Error('Bad Request');
error400.response = { status: 400, data: { message: 'Cet email est deja utilise.' } };
axios.post.mockRejectedValue(error400);

// Simuler un crash serveur (500)
const error500 = new Error('Internal Server Error');
error500.response = { status: 500 };
axios.post.mockRejectedValue(error500);
```

Cela permet de tester les trois scenarios API sans dependre de JSONPlaceholder :

| Scenario | Mock | Comportement attendu |
| -------- | ---- | -------------------- |
| Succes (201) | `mockResolvedValue` | Toast vert, compteur incremente |
| Erreur metier (400) | `mockRejectedValue` status 400 | Toast rouge avec message du back |
| Crash serveur (500) | `mockRejectedValue` status 500 | Toast rouge d'alerte, app stable |

## Lancer les tests End-to-End (Cypress)

Les tests E2E s'executent dans un vrai navigateur contre l'application en cours d'execution.

**1. Lancer l'application** (dans un terminal)

```bash
npm start
```

**2. Ouvrir Cypress** (dans un autre terminal)

```bash
npm run cypress
```

Cypress ouvre une interface graphique. Cliquer sur `navigation.cy.js` pour lancer les tests E2E.

### Strategie de mock (Cypress)

Les tests E2E utilisent `cy.intercept` pour bouchonner les routes API et permettre aux tests de passer sans backend reel. Chaque requete HTTP est interceptee avant d'atteindre le reseau et remplacee par une reponse fictive :

```js
// Intercepter le GET /users (dans beforeEach : actif pour tous les tests)
cy.intercept('GET', 'https://jsonplaceholder.typicode.com/users', {
  statusCode: 200,
  body: mockUsers,
}).as('getUsers');

// Intercepter le POST /users avec une erreur 400
cy.intercept('POST', 'https://jsonplaceholder.typicode.com/users', {
  statusCode: 400,
  body: { message: 'Cet email est deja utilise.' },
}).as('postUser');
```

**Scenarios couverts :**

- **Nominal (201)** : inscription complete, toast vert, compteur passe de 10 a 11.
- **Erreur metier (400)** : le message specifique du back s'affiche dans un toast rouge, compteur inchange.
- **Crash serveur (500)** : toast d'alerte generique, l'application ne plante pas, compteur inchange.

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

Le job construit et démarre deux conteneurs Docker :

1. **MySQL** (`migration-ynov`) — image avec les migrations SQL pré-chargées
2. **API Python** (`api-ynov`) — FastAPI exposant `GET /users`

Il vérifie ensuite que l'endpoint répond HTTP 200 avec des données non vides.
Si le test passe, l'image API est poussée automatiquement sur Docker Hub.

## Images Docker

| Image | Description |
| --- | --- |
| `migration-ynov` | MySQL 9.2 avec migrations SQL (base `ynov_ci`, table `utilisateur`) |
| `api-ynov` | FastAPI Python exposant `GET /users` sur le port 8000 |

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
│   │   └── e2e/
│   │       └── navigation.cy.js - Tests E2E avec cy.intercept (201, 400, 500)
│   ├── Dockerfile               - Image MySQL 9.2 avec migrations
│   └── TEST_PLAN.md             - Plan de test et documentation des cas testes
└── .github/workflows/
    └── build_test_react.yml     - Pipeline CI/CD (build/test → publish/integration → deploy)
```
