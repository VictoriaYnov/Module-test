import { calculateAge } from "./module.js"


describe('calculateAge Unit Test Suites', () => {
        it('should return a correct age', () => {
                const loise = {
                        birth: new Date("02/03/1997")
                };
                expect(calculateAge(loise)).toEqual(29)
        })

        it('should throw a "missing param p" error', () => {
                expect(()=> calculateAge()).toThrow("missing param p")
        })

        it('should throw an error when parameter is not an objet',() => {
                expect(() => calculateAge("string")).toThrow("p is not an object")
                expect(() => calculateAge(123)).toThrow("p is not an object")
                expect(() => calculateAge(null)).toThrow("missing param p")
        })

        it('should throw an error when object does not contain a birth field',()=> {
                const withoutBirth = { name: Victoria };
                expect(()=> calculateAge(withoutBirth)).toThrow("missing birth field")
        })

        it('should throw an error when birth field is not a Date', () => {
                const InvalidBirth = { birth: "not a date" };
                const InvalidBirth2 = { birth: 123 };
                const InvalidBirth3 = { birth: null };
                expect(() => calculateAge(InvalidBirth)).toThrow("birth must be a valid Date")
                expect(() => calculateAge(InvalidBirth2)).toThrow("birth must be a valid Date")
                expect(() => calculateAge(InvalidBirth3)).toThrow("birth must be a valid Date")
        })

        it('should throw an error when birth is an invalid date', () => {
                const invalidDate = { birth: new Date("invalid date") };
                const invalidDate2 = { birth: new Date("30/40/2026") };
                expect(() => calculateAge(personWithInvalidDate)).toThrow("birth must be a valid Date")
                expect(() => calculateAge(personWithInvalidDate2)).toThrow("birth must be a valid Date")
        })

        it('should return a correct age', () => {
                const today = new Date('2026-02-06').getTime();
                jest.spyOn(Date, 'now').mockReturnValue(today);

                const loise = {
                        birth: new Date("03/02/1997")
                };

                expect(calculateAge({ birth: loise })).toEqual(29);
                expect(calculateAge({ birth: new Date("22/06/1992") })).toEqual(33);
                expect(calculateAge({ birth: new Date("22/03/2013") })).toEqual(12);
                expect(calculateAge({ birth: new Date("21/10/2018") })).toEqual(7);


        })


})


