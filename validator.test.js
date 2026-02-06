describe('validationAge Unit Test Suites', () => {
	// Cas accepté : Age super à 18 ans

	// Cas refusé : Age inférieur à 18 ans

	// Cas d'erreur : gérés par les tests de calculAge qui est appelé par validationAge
})

describe('codePostal Unit Test Suites', () => {
	// Cas correct : Le code postal est valide

	// Le paramètre n'est pas un nombre

	// Il y a plus ou moins 5 chiffres

	// Les 2 premiers chiffres sont (<01 ou >95) ou (<971 ou >978) ou (<984 ou >989) ou =985

})

describe('identite Unit Test Suites', () => {
	// Cas correct : Le Nom et le prénom sont valides sans acccent ni tiret

	// Cas correct : Le nom et le prénom avec un tiret

	// Cas correct : Le nom et le prénom avec un accent

	// Cas correct : Le nom avec un tiret

	// Cas correct : Le nom avec un accent

	// Cas correct : Le prénom avec un tiret

	// Cas correct : Le prénom avec un accent

	// Cas en erreur : Le nom et/ou le prénom contient un chiffre

	// Cas en erreur : Le nom et/ou le prénom contient un caractère spécial

	// Cas en erreur : Les paramètres sont vides

	// Cas en erreur : Il manque un paramètre

	// Cas en erreur : Ce ne sont pas des strings

})

describe('email Unit Test Suites', ()=>{
	// Cas correct : email valide

	// Cas incorrect : pas de caractère @

	// Cas incorrect : pas de nom de dommaine victoria@exemple victoria@.com

	// Cas incorrect : pas de caractère avant/après le @

	// Cas incorrect : espace dans le mail

	// Cas incorrect : Aucun paramètre

	// Cas incorrect : Paramètre autre que string

	// Cas incorrect : Paramètre string vide
})


