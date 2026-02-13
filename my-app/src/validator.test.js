import { validateAge } from "./validator";
import { validateCodePostal } from "./validator";
import { validateEmail } from "./validator";
import { validateIdentity } from "./validator";
import { validateCity } from "./validator";

describe('validateAge Unit Test Suites', () => {

	// Cas accepté : Age superieur à 18 ans
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
		expect(() => validateAge(minor)).toThrow("Person must be at least 18 years old")
		expect(() => validateAge(child)).toThrow("Person must be at least 18 years old")
	})

	// Cas d'erreur : gérés par les tests de calculAge qui est appelé par validationAge
})

describe('validateCodePostal Unit Test Suites', () => {
	// Cas correct : Le code postal est valide
	it('should accept valid postal codes', () => {
		expect(validateCodePostal({ cp: "40130" })).toBeTruthy();
		expect(validateCodePostal({ cp: "97300" })).toBeTruthy();
	})

	// Aucun paramètre
	it('should throw a "missing param p" error', () => {
		expect(() => validateCodePostal()).toThrow("missing param p");
		expect(() => validateCodePostal(null)).toThrow("missing param p");
	})

	// Le paramètre p n'est pas un objet
	it('should throw an error when parameter is not an objetc', () => {
		expect(() => validateCodePostal("string")).toThrow("c is not an object");
		expect(() => validateCodePostal(123)).toThrow("c is not an object");
	})

	// Le paramètre p contient le champ cp
	it('should throw an error when object does not contain a cp field',()=> {
		expect(() => validateCodePostal({ name: "Victoria" })).toThrow("missing cp field")
		expect(() => validateCodePostal({ cp: "" })).toThrow("missing cp field")
	})

	// Le champ cp est un string
	it('should throw an error when co field is not a String',()=> {
		expect(()=> validateCodePostal({ cp: 123 })).toThrow("cp must be a string")
	})

	// Le champs cp n'est pas vide
	it('should throw an error when cp field is empty',()=> {
		expect(()=> validateCodePostal({ cp: "   " })).toThrow("cp cannot be empty")
	})

	// Le paramètre c n'est pas composé uniquement de chiffres
	it('should generate an error when the parameter is not composed only of numbers', () => {
		expect(() => validateCodePostal({ cp: "123ju" })).toThrow("cp is not only numbers");
		expect(() => validateCodePostal({ cp: "ju123" })).toThrow("cp is not only numbers");
	})

	// Il n'y a pax exactement 5 chiffres
	it('should generate an error when the parameter cp does not contain exactly 5 digits', () => {
		expect(() => validateCodePostal({ cp: "123" })).toThrow("cp is not a code postal");
		expect(() => validateCodePostal({ cp: "123456" })).toThrow("cp is not a code postal");
	})

	// Les 2 premiers chiffres sont (<01 ou >95) ou les 3 premiers chiffres sont (<971 ou >978) ou (<984 ou >989) ou =985
	it('should generate an error when the postal code is not defined in France', () => {
		expect(() => validateCodePostal({ cp: "00000" })).toThrow("cp is not a postal code");
		expect(() => validateCodePostal({ cp: "96000" })).toThrow("cp is not a postal code");
		expect(() => validateCodePostal({ cp: "97000" })).toThrow("cp is not a postal code");
		expect(() => validateCodePostal({ cp: "98300" })).toThrow("cp is not a postal code");
		expect(() => validateCodePostal({ cp: "98500" })).toThrow("cp is not a postal code");
		expect(() => validateCodePostal({ cp: "99000" })).toThrow("cp is not a postal code");
	})
})

describe('validateEmail Unit Test Suites', ()=>{
	// Cas correct : email valide
	it('should accept valid email addresses', () => {
		expect(validateEmail({ email: "victoria@exemple.com" })).toBeTruthy();
		expect(validateEmail({ email: "alice.bob@gmail.com" })).toBeTruthy();
		expect(validateEmail({ email: "marie_test@domain.fr" })).toBeTruthy();
		expect(validateEmail({ email: "user+tag@example.co.uk" })).toBeTruthy();
	})

	// Aucun paramètre
	it('should reject missing parameter', () => {
		expect(() => validateEmail()).toThrow("Missing parameter: email is required");
      expect(() => validateEmail(null)).toThrow("Missing parameter: email is required");
		expect(() => validateEmail(undefined)).toThrow("Missing parameter: email is required");
    })

	// Le paramètre p n'est pas un objet
	it('should reject non-string parameter', () => {
		expect(() => validateEmail(123)).toThrow("Email must be an object");
		expect(() => validateEmail(true)).toThrow("Email must be an object");
	})

	// Le paramètre p ne contient pas contient le champ email
	it('should throw an error when object does not contain a email field',()=> {
		expect(() => validateEmail({ name: "Victoria" })).toThrow("Missing email field")

	})

	// Le champ email n'est pas vide
	it('should reject empty string parameter', () => {
		expect(() => validateEmail({ email: "   " })).toThrow("Email cannot be empty");
	})

	// Pas de caractère @
	it('should reject email without @ character', () => {
		expect(() => validateEmail({ email: "victoriaexemple.com" })).toThrow("Invalid email format");
		expect(() => validateEmail({ email: "alicebob.fr" })).toThrow("Invalid email format");
    })

	// Pas de nom de dommaine
	it('should reject email without proper domain name', () => {
		expect(() => validateEmail({ email: "victoria@exemple" })).toThrow("Invalid email format");
		expect(() => validateEmail({ email: "victoria@.com" })).toThrow("Invalid email format");
   })

	// Pas de caractère avant/après le @
	it('should reject email without characters before or after @', () => {
		expect(() => validateEmail({ email: "@exemple.com" })).toThrow("Invalid email format");
		expect(() => validateEmail({ email: "victoria@" })).toThrow("Invalid email format");
   })

	// Espace dans le mail
	it('should reject email with spaces', () => {
		expect(() => validateEmail({ email: "victoria @exemple.com" })).toThrow("Invalid email format");
		expect(() => validateEmail({ email: "victoria@ exemple.com" })).toThrow("Invalid email format");
		expect(() => validateEmail({ email: "victoria@exemple .com" })).toThrow("Invalid email format");
		expect(() => validateEmail({ email: "vic toria@exemple.com" })).toThrow("Invalid email format");
   })
})

describe('validateIdentity Unit Test Suites', () => {
	// Cas correct : Le Nom et le prénom sont valides sans acccent ni tiret
	it('should accept valid first and last names', () => {
		expect(()=>validateIdentity({ name: "Martini", first: "Victoria" })).toBeTruthy();
	})

	// Le paramètre p est vide
	it('It should return an error if the parameters are empty', () => {
		expect(()=>validateIdentity()).toThrow("parameters are empty");
	})

	// Le paramètre p n'est pas un objet
	it('should throw an error when parameter is not an objet',() => {
		expect(() => validateIdentity("string")).toThrow("c is not an object")
		expect(() => validateIdentity(123)).toThrow("c is not an object")
	})

	// Il manque un paramètre
	it('should return an error if the name or surname contains a number', () => {
		expect(()=>validateIdentity({ name: "Martini"})).toThrow("missing parameter");
		expect(()=>validateIdentity({ first: "Victoria" })).toThrow("missing parameter");
	})

	// Ce ne sont pas des strings
	it('should return an error if the name or surname contains a number', () => {
		expect(()=>validateIdentity({ name: 112, first: "Victoria" })).toThrow("Parameters are invalid")
		expect(()=>validateIdentity({ name: "Martini", first: 112 })).toThrow("Parameters are invalid")
		expect(()=>validateIdentity({ name: 112, first: 123 })).toThrow("Parameters are invalid")
	})

	// Cas erreur : Le noms et/ou le prénom sont vides
	it('It should return an error if the first and last name are empty', () => {
		expect(() => validateIdentity({ name: "  ", first: "Victoria" })).toThrow("Parameters cannot be empty");
		expect(()=>validateIdentity({ name: "Martini  ", first: "   " })).toThrow("Parameters cannot be empty");
		expect(()=>validateIdentity({ name: "  ", first: "   " })).toThrow("Parameters cannot be empty");
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

	// Le nom et/ou le prénom contient un caractère spécial
	it('should return an error if the name or surname contains a number', () => {
		expect(()=>validateIdentity({ name: "Martini1", first: "2Victoria" })).toThrow("parameters are invalid");
		expect(()=>validateIdentity({ name: "Martini1", first: "Victoria" })).toThrow("parameters are invalid");
		expect(() => validateIdentity({ name: "Martini", first: "2Victoria" })).toThrow("parameters are invalid");
		expect(()=>validateIdentity({ name: "Martini_Muscat", first: "Victoria_Maïka" })).toThrow("parameters are invalid");
	})

	// Cas d'erreur : Injection XSS
	it('should return an error if the name or surname contains a dangerous caracter', () => {
		expect(()=>validateIdentity({ name: "<script>", first: "Victoria" })).toThrow("parameters are invalid");
		expect(()=>validateIdentity({ name: "Martini", first: "<script>" })).toThrow("parameters are invalid");
		expect(()=>validateIdentity({ name: "<script>", first: "<script>" })).toThrow("parameters are invalid");
	})

})


describe('validateCity Unit Test Suites', () => {
	// Cas correct : La ville est valide sans acccent ni tiret
	it('should accept valid city', () => {
		expect(()=>validateCity({ city: "Capbreton" })).toBeTruthy();
	})

	// Le paramètre p est vide
	it('It should return an error if the parameters are empty', () => {
		expect(()=>validateCity()).toThrow("parameters are empty");
	})

	// Le paramètre p n'est pas un objet
	it('should throw an error when parameter is not an objet',() => {
		expect(() => validateCity("string")).toThrow("c is not an object")
		expect(() => validateCity(123)).toThrow("c is not an object")
	})

	// Le champ city n'est pas un string
	it('should return an error if the city contains a number', () => {
		expect(() => validateCity({ city: 112 })).toThrow("Parameters are invalid")
	})

	// Cas erreur : Le champs city est vide
	it('It should return an error if the city is empty', () => {
		expect(() => validateCity({ city: "  "})).toThrow("Parameters cannot be empty");
	})

	// Cas correct : La ville a un tiret
	it('should accept valid city with a hyphen or an accent', () => {
		expect(validateCity({ city: "Capbreton-Nice" })).toBeTruthy();
	})

	// La ville contient un caractère spécial
	it('should return an error if the city contains a number', () => {
		expect(()=> validateCity({ city: "Capbreton1" })).toThrow("parameters are invalid");
		expect(()=> validateCity({ city: "Capbreton_Nice" })).toThrow("parameters are invalid");
	})

	// Cas d'erreur : Injection XSS
	it('should return an error if the city contains a dangerous caracter', () => {
		expect(()=>validateCity({ city: "<script>"})).toThrow("parameters are invalid");
	})
})

