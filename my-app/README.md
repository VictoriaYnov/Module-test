# Module Test - Formulaire d'inscription React

Application React de formulaire d'inscription avec validation en temps reel des champs (date de naissance, nom, prenom, ville, code postal, email). Les donnees sont sauvegardees dans le localStorage a la soumission.

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

**Scenarios couverts :**

- **Scenario Nominal** : inscription complete d'un utilisateur depuis la page d'accueil, verification de la persistance dans le localStorage et de l'affichage sur la page d'accueil.
- **Scenario d'Erreur** : tentative d'inscription avec un email invalide, verification que le bouton reste desactive et que la liste n'est pas modifiee.

Les deux scenarios s'enchainent (`testIsolation: false`) pour partager l'etat du localStorage.

## Structure du projet

```text
my-app/
├── src/
│   ├── pages/
│   │   ├── Home.js          - Page d'accueil (liste des utilisateurs inscrits)
│   │   └── Register.js      - Page formulaire d'inscription avec validation
│   ├── tests/
│   │   ├── home.test.js     - Tests unitaires du composant Home
│   │   ├── register.test.js - Tests d'integration du formulaire (scenario chaotique)
│   │   ├── app.test.js      - Tests d'integration flux complet avec navigation
│   │   ├── module.test.js   - Tests unitaires de calculateAge
│   │   └── validator.test.js - Tests unitaires des validateurs
│   ├── App.js               - Composant racine avec routeur et etat global
│   ├── module.js            - Fonction de calcul d'age
│   └── validator.js         - Fonctions de validation (age, email, CP, identite, ville)
├── cypress/
│   └── e2e/
│       └── navigation.cy.js - Tests E2E (scenarios nominal et erreur)
└── TEST_PLAN.md             - Plan de test et documentation des cas testes
```
