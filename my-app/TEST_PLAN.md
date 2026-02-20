# Plan de Tests

## Tests Unitaires

### `calculateAge` (module.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| Date de naissance valide | Retourne l'age correct |
| Aucun argument / null | Throw "missing param p" |
| Parametre non-objet | Throw "p is not an object" |
| Objet sans champ `birth` | Throw "missing birth field" |
| Champ `birth` pas une Date | Throw "birth must be a valid Date" |
| Date invalide | Throw "birth must be a valid Date" |
| Date dans le futur | Throw "birth cannot be in the future" |
| Date de plus de 150 ans | Throw "age cannot exceed 150 years" |

### `validateAge` (validator.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| Personne de 18 ans ou plus | Retourne `true` |
| Personne de moins de 18 ans | Throw "Person must be at least 18 years old" |

### `validateCodePostal` (validator.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| CP valide metropole | Retourne `true` |
| CP valide DOM-TOM | Retourne `true` |
| Aucun parametre / null | Throw "missing param p" |
| Parametre non-objet | Throw "c is not an object" |
| Objet sans champ `cp` / cp vide | Throw "missing cp field" |
| Champ `cp` non-string | Throw "cp must be a string" |
| Champ `cp` uniquement espaces | Throw "cp cannot be empty" |
| CP avec des lettres | Throw "cp is not only numbers" |
| CP pas 5 chiffres | Throw "cp is not a code postal" |
| CP hors France | Throw "cp is not a postal code" |

### `validateEmail` (validator.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| Email valide | Retourne `true` |
| Aucun parametre / null / undefined | Throw "Missing parameter: email is required" |
| Parametre non-objet | Throw "Email must be an object" |
| Objet sans champ `email` | Throw "Missing email field" |
| Email vide | Throw "Email cannot be empty" |
| Email sans @ | Throw "Invalid email format" |
| Email sans domaine valide | Throw "Invalid email format" |
| Email sans caractere avant/apres @ | Throw "Invalid email format" |
| Email avec espaces | Throw "Invalid email format" |
| Email avec symboles interdits (+!#$%&=^`{}~) | Throw "Invalid email format" |

### `validateIdentity` (validator.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| Nom et prenom valides | Retourne `true` |
| Nom/prenom avec tiret ou accent | Retourne `true` |
| Aucun parametre | Throw "parameters are empty" |
| Parametre non-objet | Throw "c is not an object" |
| Champ `name` ou `first` manquant | Throw "missing parameter" |
| Champ `name` ou `first` non-string | Throw "Parameters are invalid" |
| Champ `name` ou `first` vide | Throw "Parameters cannot be empty" |
| Nom/prenom avec chiffres | Throw "parameters are invalid" |
| Nom/prenom avec caracteres speciaux | Throw "parameters are invalid" |
| Injection XSS (`<script>`) | Throw "parameters are invalid" |

### `validateCity` (validator.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| Ville valide | Retourne `true` |
| Ville avec tiret | Retourne `true` |
| Aucun parametre | Throw "parameters are empty" |
| Parametre non-objet | Throw "c is not an object" |
| Objet sans champ `city` | Throw "missing parameter" |
| Champ `city` non-string | Throw "Parameters are invalid" |
| Champ `city` vide | Throw "Parameters cannot be empty" |
| Ville avec chiffres ou underscore | Throw "parameters are invalid" |
| Injection XSS (`<script>`) | Throw "parameters are invalid" |

### Fonctions API (api.js)

| Cas | Fonction | Resultat attendu |
| --- | -------- | ---------------- |
| GET retourne 10 utilisateurs | `countUsers` | Retourne `10` (longueur du tableau) |
| GET echoue (erreur reseau) | `countUsers` | Rejette avec `'Network Error'` |
| GET retourne 10 utilisateurs | `getAllUsers` | Retourne le tableau complet |
| GET echoue (erreur reseau) | `getAllUsers` | Rejette avec `'Network Error'` |
| POST retourne `{ id: 101 }` | `postUser` | Retourne `{ id: 101 }` |
| POST echoue (erreur serveur) | `postUser` | Rejette avec `'Server Error'` |

---

### `Home` (pages/Home.js)

| Cas | Resultat attendu |
| --- | ---------------- |
| Rendu avec `usersCount=0` | Compteur "0 utilisateur inscrit" affiche |
| Rendu avec `usersCount=1` | Compteur "1 utilisateur inscrit" affiche (singulier) |
| Rendu avec `usersCount=10` | Compteur "10 utilisateurs inscrits" affiche (pluriel) |
| Rendu avec `apiError` renseigne | Message d'erreur rouge visible, compteur masque |
| Rendu sans `apiError` | Compteur visible, pas de message d'erreur |

---

## Tests d'Integration

### Scenario 1 : Utilisateur chaotique (register.test.js)

Ce test simule un utilisateur reel qui fait des erreurs, corrige, refait des erreurs, puis finit par soumettre le formulaire. La fonction `addUser` est mockee (`jest.fn()`).

**Deroulement du scenario :**

1. Le bouton "Soumettre" est désactive au demarrage
2. **Email** : saisie invalide -> message d'erreur rouge -> correction -> erreur disparait
3. Le bouton "Soumettre" reste désactivé
4. **Nom** : saisie invalide avec chiffres -> erreur -> correction
5. **Prenom** : saisie invalide avec caractère interdit -> saisie valide -> erreur identite disparait
6. **Ville** : saisie invalide -> erreur -> correction -> erreur disparait
7. **Code Postal** : saisie trop courte -> erreur -> correction -> erreur disparait
8. **Date de naissance** : saisie valide
9. **Re-saisie** : l'utilisateur revient sur le nom -> erreur reapparait, bouton re-desactive -> re-correction
10. **Bouton active** : toutes les validations passent
11. **Soumission** : clic -> toaster vert, champs vides, `addUser` appele avec les bonnes donnees, bouton desactive

**Ce test verifie :**

- L'affichage et la disparition des messages d'erreur en temps reel
- La couleur rouge des messages d'erreur
- Le bouton désactive/active selon l'etat de validation
- La re-invalidation apres une modification
- `addUser` appele avec les bonnes donnees (separation logique/composant)
- Le toaster disparait apres 3 secondes (fake timers + act)

---

### Scenario 2 : Tests d'integration API avec mocks Axios (app.test.js)

Ces tests rendent l'application entiere (`App`) avec son routeur et son state global. Axios est entierement mocke (`jest.mock('axios')`) : aucun appel reseau reel ne sort.

#### Test 1 — GET succes (200)

`axios.get` renvoie 10 utilisateurs fictifs au chargement.

**Resultat attendu :** le compteur affiche "10 utilisateurs inscrits".

#### Test 2 — GET erreur reseau

`axios.get` rejette avec une erreur reseau.

**Resultat attendu :** le message "Impossible de recuperer les utilisateurs." est affiche avec `data-testid="api-error"`.

#### Test 3 — POST succes (201)

`axios.get` renvoie 10 utilisateurs, `axios.post` renvoie `{ id: 101 }`.

**Deroulement :** chargement initial -> navigation formulaire -> remplissage -> soumission -> toast vert -> retour accueil.

**Resultat attendu :**

- Toast "Formulaire envoye avec succes !" visible puis disparait apres 3s
- Compteur passe a "11 utilisateurs inscrits"
- `axios.post` appele avec les bonnes donnees (name, first, email...)

#### Test 4 — POST erreur metier (400)

`axios.post` rejette avec `error.response = { status: 400, data: { message: 'Cet email est deja utilise.' } }`.

**Resultat attendu :**

- Toast rouge avec le message specifique du back
- Compteur reste a "10 utilisateurs inscrits"
- Pas de `api-error` sur la page d'accueil

#### Test 5 — POST crash serveur (500)

`axios.post` rejette avec `error.response = { status: 500 }`.

**Resultat attendu :**

- Toast rouge "Le serveur est indisponible. Veuillez reessayer plus tard."
- L'application ne plante pas, navigation toujours possible
- Compteur reste a "10 utilisateurs inscrits"

---

## Tests End-to-End (Cypress)

Les tests E2E sont dans `cypress/e2e/navigation.cy.js`. Ils s'executent dans un vrai navigateur contre l'application (`npm start`). Les routes API sont bouchonnees avec `cy.intercept` : aucune connexion reseau reelle n'est necessaire.

Le GET `/users` est intercepte dans un `beforeEach` commun a tous les tests et retourne 10 utilisateurs fictifs.

### Scenario 1 — Nominal (201)

`cy.intercept POST` retourne `{ statusCode: 201, body: { id: 101 } }`.

**Deroulement :**

1. Accueil : compteur "10 utilisateurs inscrits" (depuis le GET mocke)
2. Navigation vers le formulaire
3. Remplissage de tous les champs valides
4. Soumission -> toast "Formulaire envoye avec succes !" visible
5. Retour a l'accueil : compteur "11 utilisateurs inscrits"

**Ce scenario verifie :** parcours complet, mise a jour du compteur, affichage du toast de confirmation.

### Scenario 2 — Erreur metier (400)

`cy.intercept POST` retourne `{ statusCode: 400, body: { message: 'Cet email est deja utilise.' } }`.

**Deroulement :**

1. Accueil : compteur "10 utilisateurs inscrits"
2. Formulaire rempli et soumis
3. Toast rouge avec le message du back visible
4. Retour a l'accueil : compteur toujours "10 utilisateurs inscrits"

**Ce scenario verifie :** affichage du message specifique du back, compteur non incremente.

### Scenario 3 — Crash serveur (500)

`cy.intercept POST` retourne `{ statusCode: 500, body: {} }`.

**Deroulement :**

1. Accueil : compteur "10 utilisateurs inscrits"
2. Formulaire rempli et soumis
3. Toast rouge "Le serveur est indisponible..." visible
4. L'application reste navigable : retour a l'accueil possible
5. Compteur toujours "10 utilisateurs inscrits"

**Ce scenario verifie :** l'application ne plante pas en cas de crash serveur, toast d'alerte affiche, compteur non incremente.

---

## Robustesse : Cas limites testes

### Le bouton "Soumettre" ne permet pas de soumission invalide

| Cas limite | Comportement attendu |
| ---------- | -------------------- |
| Tous les champs vides au chargement | Bouton desactive |
| Un seul champ valide, les autres vides | Bouton reste desactive |
| Champ corrige puis re-invalide | Bouton re-desactive |
| Soumission reussie | Bouton re-desactive apres vidage des champs |

### Validation en temps reel

| Cas limite | Comportement attendu |
| ---------- | -------------------- |
| Email sans @ ("mauvaismail") | Erreur rouge immediate |
| Email avec symboles ("<user+tag@mail.com>") | Erreur rouge immediate |
| Nom avec chiffres ("Martini1") | Erreur rouge immediate |
| Prenom avec caractere interdit ("Vic$toria") | Erreur rouge immediate |
| Ville avec underscore ("Cap_breton") | Erreur rouge immediate |
| Code postal trop court ("401") | Erreur rouge immediate |
| Date de naissance > 150 ans ("1000-01-01") | Erreur immediate |
| Correction d'un champ invalide | Erreur disparait |

### Gestion d'etat et API

| Cas limite | Comportement attendu |
| ---------- | -------------------- |
| GET /users reussit au chargement | Compteur initialise avec le nombre retourne par l'API |
| GET /users echoue au chargement | Message d'erreur affiche sur l'accueil |
| POST succes (201) | Compteur incremente de 1 sans rechargement de page |
| POST erreur metier (400) | Toast rouge avec message du back, compteur inchange |
| POST crash serveur (500) | Toast rouge generique, compteur inchange, app stable |
