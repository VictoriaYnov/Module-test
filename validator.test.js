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
	// Cas sans paramètre ?
	// Cas d'erreur : gérés par les tests de calculAge qui est appelé par validationAge
})

describe('validateCodePostal Unit Test Suites', () => {
	// Cas correct : Le code postal est valide
	it('should accept valid postal codes', () => {
		expect(validateCodePostal(40130)).toBeTruthy();
		expect(validateCodePostal(97300)).toBeTruthy();
	})

	// Aucun paramètre
	it('should throw a "missing param c" error', () => {
		expect(() => validateCodePostal()).toThrow("missing param c");
		expect(() => validateCodePostal(null)).toThrow("missing param c");
	})

	// Le paramètre c n'est pas un string
	it('should throw an error when parameter is not an string', () => {
		expect(() => validateCodePostal(11234)).toThrow("c is not a string");
		expect(() => validateCodePostal({ name: "Victoria" })).toThrow("c is not a string");
		expect(() => validateCodePostal([])).toThrow("c is not a string");

	})

	// Le paramètre c n'est pas composé uniquement de chiffres
	it('should generate an error when the parameter is not composed only of numbers', () => {
		expect(() => validateCodePostal("123ju")).toThrow("c is not only numbers");
		expect(() => validateCodePostal("ju123")).toThrow("c is not only numbers");
	})

	// Il n'y a pax exactement 5 chiffres
	it('should generate an error when the parameter does not contain exactly 5 digits', () => {
		expect(() => validateCodePostal("123")).toThrow("c is not a code postal");
		expect(() => validateCodePostal("123456")).toThrow("c is not a code postal");
	})

	// Les 2 premiers chiffres sont (<01 ou >95) ou les 3 premiers chiffres sont (<971 ou >978) ou (<984 ou >989) ou =985
	it('should generate an error when the postal code is not defined in France', () => {
		expect(() => validateCodePostal("00000")).toThrow("c is not a postal code");
		expect(() => validateCodePostal("96000")).toThrow("c is not a postal code");
		expect(() => validateCodePostal("97000")).toThrow("c is not a postal code");
		expect(() => validateCodePostal("98300")).toThrow("c is not a postal code");
		expect(() => validateCodePostal("98500")).toThrow("c is not a postal code");
		expect(() => validateCodePostal("99000")).toThrow("c is not a postal code");
	})
})

describe('validateIdentity Unit Test Suites', () => {
	// Cas correct : Le Nom et le prénom sont valides sans acccent ni tiret
	it('should accept valid first and last names', () => {
		expect(validateIdentity({ name: "Martini", first: "Victoria" })).toBeTruthy();
	})

	// Cas correct : Le nom et le prénom avec un tiret
	it('should accept valid first and/or last names with a hyphen or an accent', () => {
		expect(validateIdentity({ name: "Martini-Muscat", first: "Victoria-Maika" })).toBeTruthy();
		expect(validateIdentity({ name: "Martinï", first: "Victoriaé" })).toBeTruthy();
		expect(validateIdentity({ name: "Martini-Muscat", first: "Victoria" })).toBeTruthy();
		expect(validateIdentity({ name: "Martinï", first: "Victoria" })).toBeTruthy();
		expect(validateIdentity({ name: "Martini", first: "Victoria-Maika" })).toBeTruthy();
		expect(validateIdentity({ name: "Martini", first: "Victoriaé" })).toBeTruthy();
		expect(validateIdentity({ name: "Martini", first: "Victoriaé" })).toBeTruthy();
	})

	// Cas en erreur : Le nom et/ou le prénom contient un caractère spécial
	it('should return an error if the name or surname contains a number', () => {
		expect(validateIdentity({ name: "Martini1", first: "2Victoria" })).toThrow("parameters are invalid");
		expect(validateIdentity({ name: "Martini1", first: "Victoria" })).toThrow("parameters are invalid");
		expect(validateIdentity({ name: "Martini", first: "2Victoria" })).toThrow("parameters are invalid");
	})
	// Cas en erreur : Les paramètres sont vides
	it('It should return an error if the parameters are empty', () => {
		expect(validateIdentity()).toThrow("parameters are empty");
	})
	// Cas en erreur : Il manque un paramètre
	it('should return an error if the name or surname contains a number', () => {
		expect(validateIdentity({ name: "Martini"})).toThrow("missing parameter");
		expect(validateIdentity({ first: "Victoria" })).toThrow("missing parameter");
	})
	// Cas en erreur : Le paramètre n'est pas un objet
	it('should throw an error when parameter is not an objet',() => {
		expect(() => validateIdentity("string")).toThrow("c is not an object")
		expect(() => validateIdentity(123)).toThrow("c is not an object")
		expect(() => validateIdentity([])).toThrow("c is not an object")
	})
	// Cas en erreur : Ce ne sont pas des strings
	it('should return an error if the name or surname contains a number', () => {
		expect(validateIdentity({ name: 112, first: "Victoria" })).toThrow("Parameters are invalid")
		expect(validateIdentity({ name: "Martini", first: 112 })).toThrow("Parameters are invalid")
		expect(validateIdentity({ name: 112, first: 123 })).toThrow("Parameters are invalid")
	})
})

describe('validateEmail Unit Test Suites', ()=>{
	// Cas correct : email valide
	it('should accept valid email addresses', () => {
        expect(validateEmail("victoria@exemple.com")).toBeTruthy();
        expect(validateEmail("alice.bob@gmail.com")).toBeTruthy();
        expect(validateEmail("marie_test@domain.fr")).toBeTruthy();
        expect(validateEmail("user+tag@example.co.uk")).toBeTruthy();
    })

	// Cas incorrect : pas de caractère @
	it('should reject email without @ character', () => {
        expect(() => validateEmail("victoriaexemple.com")).toThrow("Invalid email format");
        expect(() => validateEmail("alicebob.fr")).toThrow("Invalid email format");
    })

	// Cas incorrect : pas de nom de dommaine
	it('should reject email without proper domain name', () => {
        expect(() => validateEmail("victoria@exemple")).toThrow("Invalid email format");
        expect(() => validateEmail("victoria@.com")).toThrow("Invalid email format");
    })

	// Cas incorrect : pas de caractère avant/après le @
	it('should reject email without characters before or after @', () => {
        expect(() => validateEmail("@exemple.com")).toThrow("Invalid email format");
        expect(() => validateEmail("victoria@")).toThrow("Invalid email format");
    })

	// Cas incorrect : espace dans le mail
	it('should reject email with spaces', () => {
        expect(() => validateEmail("victoria @exemple.com")).toThrow("Invalid email format");
        expect(() => validateEmail("victoria@ exemple.com")).toThrow("Invalid email format");
        expect(() => validateEmail("victoria@exemple .com")).toThrow("Invalid email format");
        expect(() => validateEmail("vic toria@exemple.com")).toThrow("Invalid email format");
    })

	// Cas incorrect : Aucun paramètre
	it('should reject missing parameter', () => {
        expect(() => validateEmail()).toThrow("Missing parameter: email is required");
        expect(() => validateEmail(null)).toThrow("Missing parameter: email is required");
        expect(() => validateEmail(undefined)).toThrow("Missing parameter: email is required");
    })

	// Cas incorrect : Paramètre autre que string
	it('should reject non-string parameter', () => {
        expect(() => validateEmail(123)).toThrow("Email must be a string");
        expect(() => validateEmail({})).toThrow("Email must be a string");
        expect(() => validateEmail([])).toThrow("Email must be a string");
        expect(() => validateEmail(true)).toThrow("Email must be a string");
    })

	// Cas incorrect : Paramètre string vide
	it('should reject empty string parameter', () => {
        expect(() => validateEmail("")).toThrow("Email cannot be empty");
        expect(() => validateEmail("   ")).toThrow("Email cannot be empty");
    })
})


