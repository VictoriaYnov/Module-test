/**
 * Calculate a person's age in years.
 *
 * @param {Object} p An object representing a person, implementing a birth Date parameter
 * @returns {number} The age in years of p.
 * @throws {Error} "missing param p" - if p is null or undefined
 * @throws {Error} "p is not an object" - if p is not an object
 * @throws {Error} "missing birth field" - if p.birth is missing
 * @throws {Error} "birth must be a valid Date" - if p.birth is not a valid Date
 * @throws {Error} "birth cannot be in the future" - if p.birth is in the future
 * @throws {Error} "age cannot exceed 150 years" - if age exceeds 150 years
 */

export function calculateAge(p) {
   // Aucun argument n’a été envoyé
   if(!p)
      throw new Error("missing param p")

   // Le format envoyé n'est pas un objet
   if (typeof p !== 'object')
      throw new Error("p is not an object")

   // L'objet ne contient pas le champ birth
   if (!p.birth)
      throw new Error("missing birth field")

   // Le champ birth n'est pas une date et la date envoyée est fausse
   if (!(p.birth instanceof Date) || isNaN(p.birth.getTime()))
      throw new Error("birth must be a valid Date")

   // La date de naissance ne peut pas être dans le futur
   if (p.birth > new Date())
      throw new Error("birth cannot be in the future")

   // La personne ne peut pas avoir plus de 150 ans
   let dateDiff = new Date(Date.now() - p.birth.getTime())
   let age = Math.abs(dateDiff.getUTCFullYear() - 1970);

   if (age > 150)
      throw new Error("age cannot exceed 150 years")

   return age;
}