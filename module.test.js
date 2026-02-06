import { calculateAge } from "./module.js"


describe('calculateAge Unit Test Suites', () => {
        // Aucun argument n’a été envoyé
        it('should throw a "missing param p" error', () => {
                expect(()=> calculateAge()).toThrow("missing param p")
        })

        // Le format envoyé n'est pas un objet
        it('should throw an error when parameter is not an objet',() => {
                expect(() => calculateAge("string")).toThrow("p is not an object")
                expect(() => calculateAge(123)).toThrow("p is not an object")
        })

        // L'objet ne contient pas le champ birth
        it('should throw an error when object does not contain a birth field',()=> {
                const withoutBirth = { name: "Victoria" };
                expect(()=> calculateAge(withoutBirth)).toThrow("missing birth field")
        })

        // Le champ birth n'est pas une date
        it('should throw an error when birth field is not a Date', () => {
                const InvalidBirth = { birth: "not a date" };
                const InvalidBirth2 = { birth: 123 };
                expect(() => calculateAge(InvalidBirth)).toThrow("birth must be a valid Date")
                expect(() => calculateAge(InvalidBirth2)).toThrow("birth must be a valid Date")
        })

        // La date envoyée est fausse
        it('should throw an error when birth is an invalid date', () => {
                const invalidDate = { birth: new Date("30/40/2026") };
                expect(() => calculateAge(invalidDate)).toThrow("birth must be a valid Date")
        })

        it('should return a correct age', () => {
                const today = new Date("02/06/2026").getTime();
                jest.spyOn(Date, 'now').mockReturnValue(today);

                expect(calculateAge({ birth: new Date("02/03/1997") })).toEqual(29);
                expect(calculateAge({ birth: new Date("10/21/2018") })).toEqual(7);
                expect(calculateAge({ birth: new Date("02/29/2020") })).toEqual(5);
                expect(calculateAge({ birth: new Date("02/06/2020") })).toEqual(6);
        })


})


