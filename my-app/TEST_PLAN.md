# Plan de Tests

## Tests d'Integration (IT)

### Scenario : Utilisateur chaotique

Ce test simule un utilisateur reel qui fait des erreurs, corrige, refait des erreurs, puis finit par soumettre le formulaire.

**Deroulement du scenario :**

1. Le bouton "Soumettre" est désactive au demarrage
2. **Email** : saisie invalide -> message d'erreur rouge -> correction -> erreur disparait
3. Le bouton "Soumettre" reste désactivé
4. **Nom** : saisie invalide avec chiffres -> erreur -> correction
5. **Prenom** : saisie valide -> erreur identite disparait
6. **Ville** : saisie invalide -> erreur -> correction -> erreur disparait
7. **Code Postal** : saisie trop courte -> erreur -> correction -> erreur disparait
8. **Date de naissance** : saisie valide
9. **Re-saisie** : l'utilisateur revient sur l'email  -> erreur reapparait, bouton re-désactive -> re-correction -> erreur disparait
10. **Bouton active** : toutes les validations passent
11. **Soumission** : clic sur le bouton -> le toaster vert apparait, les champs sont vidés, les donnees sont dans le localStorage, le bouton redevient désactivé

**Ce test verifie :**

- L'affichage et la disparition des messages d'erreur en temps reel
- Le bouton désactive/active selon l'etat de validation
- La persistance de la validation apres correction
- La re-invalidation apres une modification
- La sauvegarde dans le localStorage au submit
- Le vidage des champs apres soumission
- L'affichage du toaster de succes
