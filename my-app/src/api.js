import axios from 'axios';

const API = process.env.REACT_APP_SERVER_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Fetches the total number of registered users from the API.
 *
 * @returns {Promise<number>} The number of users
 * @throws {Error} If the request fails
 */
export const countUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`);
    return response.data.length;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches the list of all registered users from the API.
 *
 * @returns {Promise<Array>} The list of users
 * @throws {Error} If the request fails
 */
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sends a new user to the API.
 *
 * @param {Object} user - The user data to send
 * @returns {Promise<Object>} The created user returned by the API (with id)
 * @throws {Error} If the request fails
 */
export const postUser = async (user) => {
  try {
    const response = await axios.post(`${API}/users`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};
