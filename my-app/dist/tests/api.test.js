"use strict";

var _axios = _interopRequireDefault(require("axios"));
var _api = require("../api");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Remplace le vrai module axios par un mock Jest pour simuler les réponses de l'API sans faire de requêtes réseau réelles.
jest.mock('axios');

// 10 utilisateurs fictifs simulant la reponse de JSONPlaceholder
const mockUsers = Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  name: "User ".concat(i + 1)
}));

// Reinitialise les mocks apres chaque test pour eviter les interferences entre tests
afterEach(() => jest.clearAllMocks());
describe('countUsers', () => {
  // Cas nominal : l'API retourne un tableau de 10 utilisateurs
  // countUsers() doit renvoyer la longueur du tableau, pas le tableau lui-meme
  it('should return the number of users', async () => {
    _axios.default.get.mockResolvedValue({
      data: mockUsers
    });
    await expect((0, _api.countUsers)()).resolves.toBe(10);
  });

  // Cas erreur : l'API est inaccessible
  // countUsers() doit laisser l'erreur se propager (pas de catch interne)
  it('should throw on network error', async () => {
    _axios.default.get.mockRejectedValue(new Error('Network Error'));
    await expect((0, _api.countUsers)()).rejects.toThrow('Network Error');
  });
});
describe('getAllUsers', () => {
  // Cas nominal : l'API retourne le tableau complet
  // getAllUsers() doit renvoyer le tableau tel quel
  it('should return the full list of users', async () => {
    _axios.default.get.mockResolvedValue({
      data: mockUsers
    });
    await expect((0, _api.getAllUsers)()).resolves.toEqual(mockUsers);
  });

  // Cas erreur : meme comportement que countUsers — l'erreur remonte
  it('should throw on network error', async () => {
    _axios.default.get.mockRejectedValue(new Error('Network Error'));
    await expect((0, _api.getAllUsers)()).rejects.toThrow('Network Error');
  });
});
describe('postUser', () => {
  // Cas nominal : le serveur accepte la creation et renvoie { id: 101 }
  // postUser() doit renvoyer directement response.data
  it('should return the created user', async () => {
    _axios.default.post.mockResolvedValue({
      data: {
        id: 101
      }
    });
    await expect((0, _api.postUser)({
      name: 'Test'
    })).resolves.toEqual({
      id: 101
    });
  });

  // Cas erreur : le serveur rejette la requete
  // postUser() ne catch pas — l'erreur remonte a l'appelant
  it('should throw on server error', async () => {
    _axios.default.post.mockRejectedValue(new Error('Server Error'));
    await expect((0, _api.postUser)({
      name: 'Test'
    })).rejects.toThrow('Server Error');
  });
});