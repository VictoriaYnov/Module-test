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
})