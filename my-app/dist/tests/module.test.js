"use strict";

var _module = require("../module");
describe('calculateAge Unit Test Suites', () => {
  // Cas en succès
  it('should return a correct age', () => {
    const today = new Date("02/06/2026").getTime();
    jest.spyOn(Date, 'now').mockReturnValue(today);
    expect((0, _module.calculateAge)({
      birth: new Date("02/03/1997")
    })).toEqual(29);
    expect((0, _module.calculateAge)({
      birth: new Date("10/21/2018")
    })).toEqual(7);
    expect((0, _module.calculateAge)({
      birth: new Date("02/29/2020")
    })).toEqual(5);
    expect((0, _module.calculateAge)({
      birth: new Date("02/06/2020")
    })).toEqual(6);
  });

  // Aucun argument n’a été envoyé
  it('should throw a "missing param p" error', () => {
    expect(() => (0, _module.calculateAge)()).toThrow("missing param p");
    expect(() => (0, _module.calculateAge)(null)).toThrow("missing param p");
  });

  // Le format envoyé n'est pas un objet
  it('should throw an error when parameter is not an objet', () => {
    expect(() => (0, _module.calculateAge)("string")).toThrow("p is not an object");
    expect(() => (0, _module.calculateAge)(123)).toThrow("p is not an object");
  });

  // L'objet ne contient pas le champ birth
  it('should throw an error when object does not contain a birth field', () => {
    const withoutBirth = {
      name: "Victoria"
    };
    expect(() => (0, _module.calculateAge)(withoutBirth)).toThrow("missing birth field");
  });

  // Le champ birth n'est pas une date
  it('should throw an error when birth field is not a Date', () => {
    const InvalidBirth = {
      birth: "not a date"
    };
    const InvalidBirth2 = {
      birth: 123
    };
    expect(() => (0, _module.calculateAge)(InvalidBirth)).toThrow("birth must be a valid Date");
    expect(() => (0, _module.calculateAge)(InvalidBirth2)).toThrow("birth must be a valid Date");
  });

  // La date envoyée est fausse
  it('should throw an error when birth is an invalid date', () => {
    const invalidDate = {
      birth: new Date("30/40/2026")
    };
    const invalidDate2 = {
      birth: new Date("30/40/92026")
    };
    expect(() => (0, _module.calculateAge)(invalidDate)).toThrow("birth must be a valid Date");
    expect(() => (0, _module.calculateAge)(invalidDate2)).toThrow("birth must be a valid Date");
  });

  // La date est dans le futur
  it('should throw an error when birth is in the futur', () => {
    const today = new Date("02/06/2026").getTime();
    jest.spyOn(Date, 'now').mockReturnValue(today);
    const invalidDate = {
      birth: new Date("03/03/3026")
    };
    const tomorrow = {
      birth: new Date("07/02/2026")
    };
    expect(() => (0, _module.calculateAge)(invalidDate)).toThrow("birth cannot be in the future");
    expect(() => (0, _module.calculateAge)(tomorrow)).toThrow("birth cannot be in the future");
  });

  // La date est il y a plus de 150 ans
  it('should return an error if the date is more than 150 years in the past', () => {
    const today = new Date("02/06/2026").getTime();
    jest.spyOn(Date, 'now').mockReturnValue(today);
    const invalidDate = {
      birth: new Date("02/05/1875")
    };
    const invalidDate2 = {
      birth: new Date("0026-02-05")
    };
    expect(() => (0, _module.calculateAge)(invalidDate)).toThrow("age cannot exceed 150 years");
    expect(() => (0, _module.calculateAge)(invalidDate2)).toThrow("age cannot exceed 150 years");
  });
});