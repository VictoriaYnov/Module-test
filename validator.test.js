describe('validationAge Unit Test Suites', () => {

	// Cas accepté : Age super à 18 ans
	it('should accept person 18 or older', () => {
		const today = new Date('02/06/2026').getTime();
		jest.spyOn(Date, 'now').mockReturnValue(today);

		const youngAdult = { birth: new Date("02/06/2008") };
		const adult = { birth: new Date("02/03/1997") };
		expect(validateAge(youngAdult)).toBeTruthy();
		expect(validateAge(adult)).toBeTruthy();
	})
	// Cas refusé : Age inférieur à 18 ans
	it('should reject person under 18', () => {
		const today = new Date('02/06/2026').getTime();
		jest.spyOn(Date, 'now').mockReturnValue(today);

		const minor = { birth: new Date("02/06/2009") };
		const child = { birth: new Date("02/03/2020") };
		expect(validateAge(minor)).toBeTruthy();
		expect(validateAge(child)).toBeTruthy();
	})
	#####
	// Cas d'erreur : gérés par les tests de calculAge qui est appelé par validationAge
})

describe('validationCodePostal Unit Test Suites', () => {
	// Cas correct : Le code postal est valide
	it('should accept valid postal codes', () => {
		expect(validationCodePostal(40130)).toBeTruthy();
		expect(validationCodePostal(97300)).toBeTruthy();
	})

	// Aucun paramètre
	it('should throw a "missing param c" error', () => {
		expect(() => validationCodePostal()).toThrow("missing param c");
	})

	// Le paramètre c n'est pas un string
	it('should throw an error when parameter is not an string', () => {
		expect(() => validationCodePostal(11234)).toThrow("c is not a string");
		expect(() => validationCodePostal({ name: "Victoria" })).toThrow("c is not a string");
	})

	// Le paramètre c n'est pas composé uniquement de chiffres
	it('should generate an error when the parameter is not composed only of numbers', () => {
		expect(() => validationCodePostal("123ju")).toThrow("c is not only numbers");
		expect(() => validationCodePostal("ju123")).toThrow("c is not only numbers");
	})

	// Il n'y a pax exactement 5 chiffres
	it('should generate an error when the parameter does not contain exactly 5 digits', () => {
		expect(() => validationCodePostal("123")).toThrow("c is not a code postal");
		expect(() => validationCodePostal("123456")).toThrow("c is not a code postal");
	})

	// Les 2 premiers chiffres sont (<01 ou >95) ou les 3 premiers chiffres sont (<971 ou >978) ou (<984 ou >989) ou =985
	it('should generate an error when the postal code is not defined in France', () => {
		expect(() => validationCodePostal("00000")).toThrow("c is not a postal code");
		expect(() => validationCodePostal("96000")).toThrow("c is not a postal code");
		expect(() => validationCodePostal("97000")).toThrow("c is not a postal code");
		expect(() => validationCodePostal("98300")).toThrow("c is not a postal code");
		expect(() => validationCodePostal("98500")).toThrow("c is not a postal code");
		expect(() => validationCodePostal("99000")).toThrow("c is not a postal code");
	})
})

describe('validationIdentity Unit Test Suites', () => {
	// Cas correct : Le Nom et le prénom sont valides sans acccent ni tiret
	it('should accept valid first and last names', () => {
		expect(validationIdentity({ name: "Martini", first: "Victoria" })).toBeTruthy();
	})

	// Cas correct : Le nom et le prénom avec un tiret
	it('should accept valid first and/or last names with a hyphen or an accent', () => {
		expect(validationIdentity({ name: "Martini-Muscat", first: "Victoria-Maika" })).toBeTruthy();
		expect(validationIdentity({ name: "Martinï", first: "Victoriaé" })).toBeTruthy();
		expect(validationIdentity({ name: "Martini-Muscat", first: "Victoria" })).toBeTruthy();
		expect(validationIdentity({ name: "Martinï", first: "Victoria" })).toBeTruthy();
		expect(validationIdentity({ name: "Martini", first: "Victoria-Maika" })).toBeTruthy();
		expect(validationIdentity({ name: "Martini", first: "Victoriaé" })).toBeTruthy();
		expect(validationIdentity({ name: "Martini", first: "Victoriaé" })).toBeTruthy();
	})

	// Cas en erreur : Le nom et/ou le prénom contient un caractère spécial
	it('should return an error if the name or surname contains a number', () => {
		expect(validationIdentity({ name: "Martini1", first: "2Victoria" })).toThrow("parameters are invalid");
		expect(validationIdentity({ name: "Martini1", first: "Victoria" })).toThrow("parameters are invalid");
		expect(validationIdentity({ name: "Martini", first: "2Victoria" })).toThrow("parameters are invalid");
	})
	// Cas en erreur : Les paramètres sont vides
	it('It should return an error if the parameters are empty', () => {
		expect(validationIdentity()).toThrow("parameters are empty");
	})
	// Cas en erreur : Il manque un paramètre
	it('should return an error if the name or surname contains a number', () => {
		expect(validationIdentity({ name: "Martini"})).toThrow("missing parameter");
		expect(validationIdentity({ first: "Victoria" })).toThrow("missing parameter");
	})
	// Cas en erreur : Le paramètre n'est pas un objet
	it('should throw an error when parameter is not an objet',() => {
		expect(() => validationIdentity("string")).toThrow("c is not an object")
		expect(() => validationIdentity(123)).toThrow("c is not an object")
	})
	// Cas en erreur : Ce ne sont pas des strings
	it('should return an error if the name or surname contains a number', () => {
		expect(validationIdentity({ name: 112, first: "Victoria" })).toThrow("Parameters are invalid")
		expect(validationIdentity({ name: "Martini", first: 112 })).toThrow("Parameters are invalid")
		expect(validationIdentity({ name: 112, first: 123 })).toThrow("Parameters are invalid")
	})
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


