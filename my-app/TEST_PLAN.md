# Plan de Tests

## Tests Unitaires

### `calculateAge` (module.js)

| Cas | Resultat attendu |
|-----|-----------------|
| Date de naissance valide  | Retourne l'age correct |
| Aucun argument / null | Throw "missing param p" |
| Parametre non-objet | Throw "p is not an object" |
| Objet sans champ `birth` | Throw "missing birth field" |
| Champ `birth` pas une Date | Throw "birth must be a valid Date" |
| Date invalide | Throw "birth must be a valid Date" |
| Date dans le futur | Throw "birth cannot be in the future" |
| Date de plus de 150 ans | Throw "age cannot exceed 150 years" |

### `validateAge` (validator.js)

| Cas | Resultat attendu |
|-----|-----------------|
| Personne de 18 ans ou plus | Retourne `true` |
| Personne de moins de 18 ans | Throw "Person must be at least 18 years old" |

### `validateCodePostal` (validator.js)

| Cas | Resultat attendu |
|-----|-----------------|
| CP valide metropole  | Retourne `true` |
| CP valide DOM-TOM | Retourne `true` |
| Aucun parametre / null | Throw "missing param p" |
| Parametre non-objet | Throw "c is not an object" |
| Objet sans champ `cp` / cp vide | Throw "missing cp field" |
| Champ `cp` non-string | Throw "cp must be a string" |
| Champ `cp` uniquement espaces | Throw "cp cannot be empty" |
| CP avec des lettres  | Throw "cp is not only numbers" |
| CP pas 5 chiffres | Throw "cp is not a code postal" |
| CP hors France | Throw "cp is not a postal code" |

### `validateEmail` (validator.js)

| Cas | Resultat attendu |
|-----|-----------------|
| Email valide | Retourne `true` |
| Aucun parametre / null / undefined | Throw "Missing parameter: email is required" |
| Parametre non-objet  | Throw "Email must be an object" |
| Objet sans champ `email` | Throw "Missing email field" |
| Email vide | Throw "Email cannot be empty" |
| Email sans @ | Throw "Invalid email format" |
| Email sans domaine valide | Throw "Invalid email format" |
| Email sans caractere avant/apres @ | Throw "Invalid email format" |
| Email avec espaces | Throw "Invalid email format" |
| Email avec symboles interdits (+!#$%&=^`{}~) | Throw "Invalid email format" |

### `validateIdentity` (validator.js)

| Cas | Resultat attendu |
|-----|-----------------|
| Nom et prenom valides  | Retourne `true` |
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
|-----|-----------------|
| Ville valide | Retourne `true` |
| Ville avec tiret  | Retourne `true` |
| Aucun parametre | Throw "parameters are empty" |
| Parametre non-objet | Throw "c is not an object" |
| Objet sans champ `city` | Throw "missing parameter" |
| Champ `city` non-string | Throw "Parameters are invalid" |
| Champ `city` vide | Throw "Parameters cannot be empty" |
| Ville avec chiffres ou underscore | Throw "parameters are invalid" |
| Injection XSS (`<script>`) | Throw "parameters are invalid" |

### `Home` (pages/Home.js)

| Cas | Resultat attendu |
|-----|-----------------|
| Rendu avec liste vide | Titre, sous-titre, lien `/register`, compteur "0 utilisateur inscrit" affiches et aucun utilisateur affiche |
| Rendu avec un utilisateur | Prenom et nom affiches, compteur "1 utilisateur inscrit" |
| Rendu avec plusieurs utilisateurs | Tous les utilisateurs affiches, compteur "N utilisateurs inscrits" (pluriel) |

---

## Tests d'Integration

### Scenario 1 : Utilisateur chaotique (register.test.js)

Ce test simule un utilisateur reel qui fait des erreurs, corrige, refait des erreurs, puis finit par soumettre le formulaire.

**Deroulement du scenario :**

1. Le bouton "Soumettre" est désactive au demarrage
2. **Email** : saisie invalide -> message d'erreur rouge -> correction -> erreur disparait
3. Le bouton "Soumettre" reste désactivé
4. **Nom** : saisie invalide avec chiffres -> erreur -> correction
5. **Prenom** : saisie invalide avec caractère interdit -> saisie valide -> erreur identite disparait
6. **Ville** : saisie invalide -> erreur -> correction -> erreur disparait
7. **Code Postal** : saisie trop courte -> erreur -> correction -> erreur disparait
8. **Date de naissance** : saisie valide
9. **Re-saisie** : l'utilisateur revient sur le nom -> erreur reapparait, bouton re-désactive -> re-correction -> erreur disparait
10. **Bouton active** : toutes les validations passent
11. **Soumission** : clic sur le bouton -> toaster vert, champs vides, `addUser` appele avec les bonnes donnees, bouton desactive

**Ce test verifie :**

- L'affichage et la disparition des messages d'erreur en temps reel
- La couleur rouge des messages d'erreur
- Le bouton désactive/active selon l'etat de validation
- La re-invalidation apres une modification
- `addUser` appele avec les bonnes donnees (separation logique/composant)
- Le toaster disparait apres 3 secondes (fake timers + act)

---

### Scenario 2 : Flux complet avec navigation (app.test.js)

Ce test simule le parcours complet depuis la page d'accueil jusqu'a l'inscription et le retour.
L'application entiere (`App`) est rendue avec son routeur et son state global.

**Deroulement du scenario :**

1. **Home** : page d'accueil affichee, liste vide
2. **Navigation** : clic sur "Acceder au formulaire" -> page Register affichee
3. **Formulaire** : remplissage de tous les champs valides
4. **Soumission** : bouton active -> clic -> toaster apparait -> disparait apres 3s
5. **Retour accueil** : clic sur "Retour a l'accueil"
6. **Persistance** : l'utilisateur inscrit apparait dans la liste de Home
7. **localStorage** : tableau `users` contient le bon utilisateur

**Ce test verifie :**

- La navigation entre les pages (react-router-dom)
- Le "Lift State Up" : `addUser` remonte l'etat vers `App.js`
- La mise a jour reactive de `Home` apres inscription (sans rechargement)
- La persistance des donnees dans le localStorage
- La coherence entre state React et localStorage

---

---

## Tests End-to-End (Cypress)

Les tests E2E sont dans `cypress/e2e/navigation.cy.js`. Ils s'executent dans un vrai navigateur contre l'application en cours d'execution (`npm start`). L'isolation du localStorage est desactivee (`testIsolation: false`) pour que les deux scenarios s'enchainent et partagent l'etat.

### Scenario Nominal (Nominal Scenario)

**Deroulement :**

1. **Accueil** : visite de `/`, verification "0 utilisateur inscrit" et absence de "Victoria Martini"
2. **Navigation** : clic sur "Acceder au formulaire" -> URL `/register`, bouton desactive
3. **Inscription** : saisie de tous les champs valides (nom, prenom, ville, CP, email, date)
4. **Soumission** : bouton active -> clic -> toast de confirmation visible
5. **Retour** : clic sur "Retour a l'accueil" -> URL `/`
6. **Persistance** : compteur "1 utilisateur inscrit" et "Victoria Martini" visibles dans la liste

**Ce scenario verifie :**

- La navigation reelle entre pages via react-router
- La validation et la soumission d'un formulaire complet
- L'affichage du toast de confirmation
- La persistance des donnees dans le localStorage apres soumission
- La mise a jour du compteur et de la liste sur la page d'accueil

### Scenario d'Erreur (Error Scenario)

Enchaîne directement apres le Scenario Nominal (1 utilisateur deja inscrit en localStorage).

**Deroulement :**

1. **Accueil** : visite de `/`, verification "1 utilisateur inscrit" et presence de "Victoria Martini"
2. **Navigation** : clic sur "Acceder au formulaire" -> URL `/register`
3. **Tentative invalide** : saisie de tous les champs valides SAUF l'email (`alice@example`, sans TLD valide)
4. **Verification erreur** : message d'erreur email visible, bouton "Soumettre" reste desactive
5. **Retour** : clic sur "Retour a l'accueil" sans soumettre
6. **Liste inchangee** : compteur toujours "1 utilisateur inscrit", "Victoria Martini" presente, "Alice Bob" absente

**Ce scenario verifie :**

- L'affichage du message d'erreur en temps reel pour un email invalide
- Le blocage de la soumission en cas de champ invalide
- L'absence d'effet de bord : un formulaire invalide non soumis ne modifie pas la liste

---

## Robustesse : Cas limites testés

### Le bouton "Soumettre" ne permet pas de soumission invalide

| Cas limite | Comportement attendu |
|------------|---------------------|
| Tous les champs vides au chargement | Bouton desactive |
| Un seul champ valide, les autres vides | Bouton reste desactive |
| Champ corrige puis re-invalide | Bouton re-desactive |
| Soumission reussie | Bouton re-desactive apres vidage des champs |

### Validation en temps reel

| Cas limite | Comportement attendu |
|------------|---------------------|
| Email sans @ ("mauvaismail") | Erreur rouge immediate |
| Email avec symboles ("<user+tag@mail.com>") | Erreur rouge immediate |
| Nom avec chiffres ("Martini1") | Erreur rouge immediate |
| Prenom avec caractere interdit ("Vic$toria") | Erreur rouge immediate |
| Ville avec underscore ("Cap_breton") | Erreur rouge immediate |
| Code postal trop court ("401") | Erreur rouge immediate |
| Date de naissance > 150 ans ("1000-01-01") | Erreur immediate |
| Correction d'un champ invalide | Erreur disparait |

### Gestion d'etat et navigation

| Cas limite | Comportement attendu |
|------------|---------------------|
| Home affichee sans utilisateurs | Liste vide, pas d'erreur |
| Retour sur Home apres inscription | Nouvel utilisateur visible sans rechargement |
| Plusieurs inscriptions successives | Tous les utilisateurs accumules dans la liste |
| Rechargement de la page | Utilisateurs restaures depuis le localStorage |
