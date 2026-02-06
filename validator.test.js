describe('validationAge Unit Test Suites', () => {

	// Cas accepté : Age super à 18 ans
	it('should accept person 18 or older', () => {
		const today = new Date('02/06/2026').getTime();
		jest.spyOn(Date, 'now').mockReturnValue(today);

		const youngAdult = { birth: new Date("02/06/2008") };
		const adult = { birth: new Date("02/03/1997") };
		expect(() => validateAge(youngAdult)).toBeTruthy();
		expect(()=> validateAge(adult)).toBeTruthy();
	})
	// Cas refusé : Age inférieur à 18 ans
	it('should reject person under 18', () => {
		const today = new Date('02/06/2026').getTime();
		jest.spyOn(Date, 'now').mockReturnValue(today);

		const minor = { birth: new Date("02/06/2009") };
		const child = { birth: new Date("02/03/2020") };
		expect(() => validateAge(minor)).toBeTruthy();
		expect(()=> validateAge(child)).toBeTruthy();
	})
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


