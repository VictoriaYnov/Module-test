"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateAge = calculateAge;
/**
 * Calule l'âge d'une personne à partir de sa date de naissance.
 *
 * @param {Object} p Un objet représentant une personne, implémentant un champ birth de type Date
 * @returns {number} L'age de la personne en années
 * @throws {Error} "missing param p" - si aucun argument n'est envoyé
 * @throws {Error} "p is not an object" - si p n'est pas un objet
 * @throws {Error} "missing birth field" - si p.birth est manquant
 * @throws {Error} "birth must be a valid Date" - si p.birth n'est pas une date valide
 * @throws {Error} "birth cannot be in the future" - si p.birth est une date future
 * @throws {Error} "age cannot exceed 150 years" - si l'âge calculé est supérieur à 150 ans
 */

function calculateAge(p) {
  // Aucun argument n’a été envoyé
  if (!p) throw new Error("missing param p");

  // Le format envoyé n'est pas un objet
  if (typeof p !== 'object') throw new Error("p is not an object");

  // L'objet ne contient pas le champ birth
  if (!p.birth) throw new Error("missing birth field");

  // Le champ birth n'est pas une date et la date envoyée est fausse
  if (!(p.birth instanceof Date) || isNaN(p.birth.getTime())) throw new Error("birth must be a valid Date");

  // La date de naissance ne peut pas être dans le futur
  if (p.birth > new Date()) throw new Error("birth cannot be in the future");

  // La personne ne peut pas avoir plus de 150 ans
  let dateDiff = new Date(Date.now() - p.birth.getTime());
  let age = Math.abs(dateDiff.getUTCFullYear() - 1970);
  if (age > 150) throw new Error("age cannot exceed 150 years");
  return age;
}