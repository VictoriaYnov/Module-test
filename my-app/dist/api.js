"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postUser = exports.getAllUsers = exports.countUsers = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const API = process.env.REACT_APP_SERVER_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Récupère le nombre d'utilisateurs enregistrés via l'API.
 *
 * @returns {Promise<number>} Le nombre d'utilisateurs
 * @throws {Error} Si la requête échoue
 */
const countUsers = async () => {
  try {
    const response = await _axios.default.get("".concat(API, "/users"));
    return response.data.length;
  } catch (error) {
    throw error;
  }
};

/**
 * Récupère la liste complète des utilisateurs depuis l'API.
 *
 * @returns {Promise<Array>} La liste des utilisateurs
 * @throws {Error} Si la requête échoue
 */
exports.countUsers = countUsers;
const getAllUsers = async () => {
  try {
    const response = await _axios.default.get("".concat(API, "/users"));
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Envoie une requête POST à l'API pour créer un nouvel utilisateur avec les données fournies.
 *
 * @param {Object} user - L'utilisateur à créer (doit contenir au moins une propriété "name")
 * @returns {Promise<Object>} L'utilisateur créé tel que retourné par l'API
 * @throws {Error} Si la requête échoue
 */
exports.getAllUsers = getAllUsers;
const postUser = async user => {
  try {
    const response = await _axios.default.post("".concat(API, "/users"), user);
    return response.data;
  } catch (error) {
    throw error;
  }
};
exports.postUser = postUser;