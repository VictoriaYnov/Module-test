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
| Champ `city` non-string | Throw "Parameters are invalid" |
| Champ `city` vide | Throw "Parameters cannot be empty" |
| Ville avec chiffres ou underscore | Throw "parameters are invalid" |
| Injection XSS (`<script>`) | Throw "parameters are invalid" |

### `Home` (pages/Home.js)

| Cas | Resultat attendu |
|-----|-----------------|
| Rendu avec liste vide | Titre, sous-titre et lien vers formulaire affiches |
| Rendu avec liste vide | Aucun utilisateur affiche |
| Rendu avec un utilisateur | Prenom et nom affiches |
| Rendu avec plusieurs utilisateurs | Tous les utilisateurs affiches |

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
