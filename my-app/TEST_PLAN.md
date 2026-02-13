# Plan de Tests

## Tests d'Integration

### Scenario : Utilisateur chaotique

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
9. **Re-saisie** : l'utilisateur revient sur le nom  -> erreur reapparait, bouton re-désactive -> re-correction -> erreur disparait
10. **Bouton active** : toutes les validations passent
11. **Soumission** : clic sur le bouton -> le toaster vert apparait, les champs sont vidés, les donnees sont dans le localStorage, le bouton redevient désactivé

**Ce test verifie :**

- L'affichage et la disparition des messages d'erreur en temps reel
- La mise en forme des messages
- Le bouton désactive/active selon l'état de validation
- La persistance de la validation apres correction
- La re-invalidation apres une modification
- La sauvegarde dans le localStorage au submit
- Le vidage des champs apres soumission
- L'affichage du toaster de succès
- Le toaster disparaît après 3 secondes (fake timers + act)

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
| Nom avec chiffres ("Martini1") | Erreur rouge immediate |
| Prenom avec caractere interdit ("Vic$toria") | Erreur rouge immediate |
| Ville avec underscore ("Cap_breton") | Erreur rouge immediate |
| Code postal trop court ("401") | Erreur rouge immediate |
| Date de naissance > 150 ans ("1000-01-01") | Erreur immediate |
| Correction d'un champ invalide | Erreur disparait |
