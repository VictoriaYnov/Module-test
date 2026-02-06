import { calculateAge } from "./module";

/**
 * Validate a person object and check if they are 18+
 *
 * @param {Object} p - Person object with birth date
 * @returns {boolean} True if person is 18 or older
 * @throws {Error} If validation fails or person is under 18
 */
export function validateAge(p) {
   const age = calculateAge(p);

   if (age < 18)
      throw new Error("Person must be at least 18 years old");

    return true;
}

/**
 * Validate French postal code
 * Accepts metropolitan France (01-95) and DOM-TOM (971-978, 984-989, except 985)
 *
 * @param {Object} p - Person object with cp field
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export function validateCodePostal(p) {
   // Vérifier que le paramètre p existe
   if (!p)
      throw new Error("missing param p");

   // Vérifier que p est un objet
   if (typeof p !== 'object')
      throw new Error("c is not an object");

   // Vérifier que le champ cp existe
   if (!p.cp)
      throw new Error("missing cp field");

   // Vérifier que cp est un string
   if (typeof p.cp !== 'string')
      throw new Error("cp must be a string");

   // Vérifier que cp n'est pas vide
   if (p.cp.trim() === '')
      throw new Error("cp cannot be empty");

   // Vérifier que cp est composé uniquement de chiffres
   const onlyDigitsRegex = /^\d+$/;
   if (!onlyDigitsRegex.test(p.cp))
      throw new Error("cp is not only numbers");

   // Vérifier que cp est composé exactement de 5 chiffres
   if (p.cp.length !== 5)
      throw new Error("cp is not a code postal");

   // Extraire les départements
   const dept2 = parseInt(p.cp.substring(0, 2), 10);
   const dept3 = parseInt(p.cp.substring(0, 3), 10);

   // Vérifier les codes postaux valides en France
   const isMetropole = dept2 >= 1 && dept2 <= 95;
   const isDOMTOM1 = dept3 >= 971 && dept3 <= 978
   const isDOMTOM2 = dept3 >= 984 && dept3 <= 989;

   if (!isMetropole &&!isDOMTOM0 && !isDOMTOM1 && !isDOMTOM2)
      throw new Error("cp is not a postal code");

   const isDOMTOM0 = dept3 !== 985;
   if (!isDOMTOM0)
        throw new Error("cp is not a postal code");

   return true;
}

/**
 * Validate email format
 *
 * @param {object} p - An object representing a person, implementing an email parameter
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export function validateEmail(p) {
    // Vérifier que le paramètre p existe
    if (!p)
        throw new Error("Missing parameter: email is required");

    // Vérifier que p est un objet
    if (typeof p !== 'object')
       throw new Error("Email must be an object");

   // Vérifier que le champ email existe
   if (!p.email)
      throw new Error("Missing email field");

   // Vérifier que l'email n'est pas vide
   if (p.email.trim() === '')
      throw new Error("Email cannot be empty");

   // Vérifier le format du champ email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(p.email))
      throw new Error("Invalid email format");

   return true;
}

/**
 * Validate a person's identity
 * Accepts letters (with accents), hyphens
 * Rejects numbers and special characters
 *
 * @param {Object} p - Person object with name and first fields
 * @returns {boolean} True if valid
 * @throws {Error} If validation fails
 */
export function validateIdentity(p) {
   // Vérifier que le paramètre p existe
   if (!p)
      throw new Error("parameters are empty");

   // Vérifier que p est un objet
   if (typeof p !== 'object' )
      throw new Error("c is not an object");

   // Vérifier que les champs name et first existent
   if (!p.name || !p.first)
      throw new Error("missing parameter");

   // Vérifier que name et first sont des string
   if (typeof p.name !== 'string' || typeof p.first !== 'string')
      throw new Error("Parameters are invalid");

   // Vérifier que name et first ne sont pas vides
   if (p.name.trim() === '' || p.first.trim() === '')
      throw new Error("Parameters cannot be empty");

   // Protection XSS
   const dangerousChars = /[<>"&{}[\]()=;:`\\|]/;
   if (dangerousChars.test(p.name) || dangerousChars.test(p.first))
      throw new Error("parameters are invalid");

   // Vérifier que les champs name et first ne contiennent pas de chiffres
   if (/\d/.test(p.name) || /\d/.test(p.first))
      throw new Error("parameters are invalid");

   // Vérifier le format du champ name et first
   const validNameRegex = /^[a-zA-ZÀ-ÿs-]+$/;
   if (!validNameRegex.test(p.name) ||!validNameRegex.test(p.first) )
      throw new Error("parameters are invalid");

   return true;
}
