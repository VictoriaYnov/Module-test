"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAge = validateAge;
exports.validateCity = validateCity;
exports.validateCodePostal = validateCodePostal;
exports.validateEmail = validateEmail;
exports.validateIdentity = validateIdentity;
var _module = require("./module");
/**
 * Validation de l'âge d'une personne et vérification qu'elle est majeure
 *
 * @param {Object} p - Objet représentant une personne, implémentant un champ birth de type Date
 * @returns {boolean} Vrai si la personne est majeure, sinon une erreur est levée
 * @throws {Error} Si la validation de l'âge échoue, avec un message d'erreur spécifique
 */
function validateAge(p) {
  const age = (0, _module.calculateAge)(p);
  if (age < 18) throw new Error("Person must be at least 18 years old");
  return true;
}

/**
 * Validation d'un code postal français
 * Accepte les codes postaux de la France métropolitaine (01-95) et des DOM-TOM (971-978, 984-989, excepté 985)
 *
 * @param {Object} p - Objet contenant un champ cp représentant le code postal à valider
 * @returns {boolean} Vrai si le code postal est valide, sinon une erreur est levée
 * @throws {Error} Si la validation échoue, avec un message d'erreur spécifique indiquant la raison de l'échec
 */
function validateCodePostal(p) {
  // Vérifier que le paramètre p existe
  if (!p) throw new Error("missing param p");

  // Vérifier que p est un objet
  if (typeof p !== 'object') throw new Error("c is not an object");

  // Vérifier que le champ cp existe
  if (!p.cp) throw new Error("missing cp field");

  // Vérifier que cp est un string
  if (typeof p.cp !== 'string') throw new Error("cp must be a string");

  // Vérifier que cp n'est pas vide
  if (p.cp.trim() === '') throw new Error("cp cannot be empty");

  // Vérifier que cp est composé uniquement de chiffres
  const onlyDigitsRegex = /^\d+$/;
  if (!onlyDigitsRegex.test(p.cp)) throw new Error("cp is not only numbers");

  // Vérifier que cp est composé exactement de 5 chiffres
  if (p.cp.length !== 5) throw new Error("cp is not a code postal");

  // Extraire les départements
  const dept2 = parseInt(p.cp.substring(0, 2), 10);
  const dept3 = parseInt(p.cp.substring(0, 3), 10);

  // Vérifier les codes postaux valides en France
  const isMetropole = dept2 >= 1 && dept2 <= 95;
  const isDOMTOM0 = dept3 !== 985;
  const isDOMTOM1 = dept3 >= 971 && dept3 <= 978;
  const isDOMTOM2 = dept3 >= 984 && dept3 <= 989;
  if (!isMetropole && !isDOMTOM1 && !isDOMTOM2) throw new Error("cp is not a postal code");
  if (!isDOMTOM0) throw new Error("cp is not a postal code");
  return true;
}

/**
 * Valide l'adresse email d'une personne
 *
 * @param {Object} p - Un objet contenant un champ email représentant l'adresse email à valider
 * @returns {boolean} Vrai si l'email est valide, sinon une erreur est levée
 * @throws {Error} Si la validation échoue, avec un message d'erreur spécifique indiquant la raison de l'échec
 */
function validateEmail(p) {
  // Vérifier que le paramètre p existe
  if (!p) throw new Error("Missing parameter: email is required");

  // Vérifier que p est un objet
  if (typeof p !== 'object') throw new Error("Email must be an object");

  // Vérifier que le champ email existe
  if (!p.email) throw new Error("Missing email field");

  // Vérifier que l'email n'est pas vide
  if (p.email.trim() === '') throw new Error("Email cannot be empty");

  // Vérifier le format du champ email (lettres, chiffres, points, tirets, underscores uniquement)
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(p.email)) throw new Error("Invalid email format");
  return true;
}

/**
 * Valide l'identité d'une personne
 * Accepte les lettres (avec accents), les tirets
 * Rejette les chiffres et les caractères spéciaux
 *
 * @param {Object} p - Personne à valider, doit contenir les champs name et first
 * @returns {boolean} Vrai si l'identité est valide, sinon une erreur est levée
 * @throws {Error} Si la validation échoue, avec un message d'erreur spécifique indiquant la raison de l'échec
 */
function validateIdentity(p) {
  // Vérifier que le paramètre p existe
  if (!p) throw new Error("parameters are empty");

  // Vérifier que p est un objet
  if (typeof p !== 'object') throw new Error("c is not an object");

  // Vérifier que les champs name et first existent
  if (!p.name || !p.first) throw new Error("missing parameter");

  // Vérifier que name et first sont des string
  if (typeof p.name !== 'string' || typeof p.first !== 'string') throw new Error("Parameters are invalid");

  // Vérifier que name et first ne sont pas vides
  if (p.name.trim() === '' || p.first.trim() === '') throw new Error("Parameters cannot be empty");

  // Protection XSS
  const dangerousChars = /[<>"&{}[\]()=;:`\\|]/;
  if (dangerousChars.test(p.name) || dangerousChars.test(p.first)) throw new Error("parameters are invalid");

  // Vérifier que les champs name et first ne contiennent pas de chiffres
  if (/\d/.test(p.name) || /\d/.test(p.first)) throw new Error("parameters are invalid");

  // Vérifier le format du champ name et first
  const validNameRegex = /^[a-zA-ZÀ-ÿs-]+$/;
  if (!validNameRegex.test(p.name) || !validNameRegex.test(p.first)) throw new Error("parameters are invalid");
  return true;
}

/**
 * Valide un nom de ville
 * Accepte les lettres (avec accents) et les tirets
 * Rejette les chiffres, les caractères spéciaux et les tentatives d'injection XSS
 *
 * @param {Object} p - Objet contenant un champ city représentant le nom de la ville à valider
 * @returns {boolean} Vrai si le nom de ville est valide, sinon une erreur est levée
 * @throws {Error} Si la validation échoue, avec un message d'erreur spécifique indiquant la raison de l'échec
 */
function validateCity(p) {
  // Vérifier que le paramètre p existe
  if (!p) throw new Error("parameters are empty");

  // Vérifier que p est un objet
  if (typeof p !== 'object') throw new Error("c is not an object");

  // Vérifier que le champ city existe
  if (!p.city) throw new Error("missing parameter");

  // Vérifier que city est un string
  if (typeof p.city !== 'string') throw new Error("Parameters are invalid");

  // Vérifier que city n'est pas vide
  if (p.city.trim() === '') throw new Error("Parameters cannot be empty");

  // Protection XSS
  const dangerousChars = /[<>"&{}[\]()=;:`\\|]/;
  if (dangerousChars.test(p.city)) throw new Error("parameters are invalid");

  // Vérifier que le champ city ne contient pas de chiffres
  if (/\d/.test(p.city)) throw new Error("parameters are invalid");

  // Vérifier le format du champ city
  const validNameRegex = /^[a-zA-ZÀ-ÿs-]+$/;
  if (!validNameRegex.test(p.city)) throw new Error("parameters are invalid");
  return true;
}