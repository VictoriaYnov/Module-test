import axios from 'axios';

const API = process.env.REACT_APP_SERVER_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Récupère le nombre d'utilisateurs enregistrés via l'API.
 *
 * @returns {Promise<number>} Le nombre d'utilisateurs
 * @throws {Error} Si la requête échoue
 */
export const countUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`);
    return response.data.utilisateurs.length;
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
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`);
    return response.data.utilisateurs;
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
export const postUser = async (user) => {
  try {
    const response = await axios.post(`${API}/users`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};
