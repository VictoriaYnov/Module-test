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

## Lancer les tests

```bash
npm test
```

Les tests s'executent avec coverage. Le rapport de couverture est genere dans le dossier `coverage/`.

## Structure du projet

- `src/App.js` - Composant principal du formulaire
- `src/module.js` - Fonction de calcul d'age
- `src/validator.js` - Fonctions de validation (age, email, code postal, identite, ville)
- `src/App.test.js` - Tests d'integration (scenario utilisateur chaotique)
- `src/module.test.js` - Tests unitaires de calculateAge
- `src/validator.test.js` - Tests unitaires des validateurs
- `TEST_PLAN.md` - Plan de test et documentation des cas testes
