"use strict";

var _react = require("@testing-library/react");
var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));
var _axios = _interopRequireDefault(require("axios"));
var _App = _interopRequireDefault(require("../App"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
jest.mock('axios');

// 10 utilisateurs fictifs simulant la réponse de JSONPlaceholder
const mockUsers = Array(10).fill(null).map((_, i) => ({
  id: i + 1,
  name: "User ".concat(i + 1)
}));

// Helper : navigue vers le formulaire, le remplit et le soumet
const fillAndSubmit = () => {
  _userEvent.default.click(_react.screen.getByText('Accéder au formulaire'));
  _userEvent.default.type(_react.screen.getByTestId('input-name'), 'Martini');
  _userEvent.default.type(_react.screen.getByTestId('input-first'), 'Victoria');
  _userEvent.default.type(_react.screen.getByTestId('input-city'), 'Capbreton');
  _userEvent.default.type(_react.screen.getByTestId('input-cp'), '40130');
  _userEvent.default.type(_react.screen.getByTestId('input-email'), 'victoria@example.com');
  _userEvent.default.type(_react.screen.getByTestId('input-birthdate'), '1997-02-03');
  _userEvent.default.click(_react.screen.getByTestId('submit'));
};
describe('App - Tests d\'intégration avec API (Axios)', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // Succès GET : le compteur affiche le bon nombre au chargement
  it('should display user count fetched from API on load', async () => {
    _axios.default.get.mockResolvedValue({
      data: mockUsers
    });
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });
  });

  // Erreur GET : l'API est indisponible → message d'erreur affiché
  it('should display error message when GET /users fails', async () => {
    _axios.default.get.mockRejectedValue(new Error('Network Error'));
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByTestId('api-error')).toBeInTheDocument();
      expect(_react.screen.getByText('Impossible de récupérer les utilisateurs.')).toBeInTheDocument();
    });
  });

  // Succès POST (201) : inscription réussie → toast vert + compteur incrémenté
  it('should show success toast and increment counter after successful registration', async () => {
    _axios.default.get.mockResolvedValue({
      data: mockUsers
    });
    _axios.default.post.mockResolvedValue({
      data: {
        id: 101
      }
    });
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));

    // Attendre le chargement initial (timers réels)
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });

    // Passer aux timers simulés pour le toast
    jest.useFakeTimers();
    fillAndSubmit();

    // Attendre la résolution du POST + exécution du try block de handleSubmit
    await (0, _react.act)(async () => {
      await Promise.resolve();
    });

    // Toast de succès visible
    expect(_react.screen.getByTestId('toast')).toBeInTheDocument();
    expect(_react.screen.getByText('Formulaire envoyé avec succès !')).toBeInTheDocument();

    // Faire disparaître le toast
    (0, _react.act)(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(_react.screen.queryByTestId('toast')).not.toBeInTheDocument();

    // Retour à l'accueil
    _userEvent.default.click(_react.screen.getByText("Retour à l'accueil"));

    // Compteur incrémenté à 11
    expect(_react.screen.getByText('11 utilisateurs inscrits')).toBeInTheDocument();

    // Vérifier que POST a été appelé avec les bonnes données
    expect(_axios.default.post).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users', expect.objectContaining({
      name: 'Martini',
      first: 'Victoria',
      email: 'victoria@example.com'
    }));
  });

  // Erreur métier (400) : email déjà utilisé → toast rouge avec le message du back
  it('should show backend error message in toast when POST returns 400', async () => {
    _axios.default.get.mockResolvedValue({
      data: mockUsers
    });
    const error400 = new Error('Bad Request');
    error400.response = {
      status: 400,
      data: {
        message: 'Cet email est déjà utilisé.'
      }
    };
    _axios.default.post.mockRejectedValue(error400);
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });
    jest.useFakeTimers();
    fillAndSubmit();

    // Attendre la rejection du POST + exécution du catch block
    await (0, _react.act)(async () => {
      await Promise.resolve();
    });

    // Toast d'erreur visible avec le message spécifique du back
    expect(_react.screen.getByTestId('toast')).toBeInTheDocument();
    expect(_react.screen.getByText('Cet email est déjà utilisé.')).toBeInTheDocument();

    // Faire disparaître le toast
    (0, _react.act)(() => {
      jest.advanceTimersByTime(3000);
    });

    // Retour à l'accueil : compteur toujours à 10, pas d'erreur API
    _userEvent.default.click(_react.screen.getByText("Retour à l'accueil"));
    expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    expect(_react.screen.queryByTestId('api-error')).not.toBeInTheDocument();
  });

  // Crash serveur (500) : toast d'alerte + l'application ne plante pas
  it('should show server error toast and not crash when POST returns 500', async () => {
    _axios.default.get.mockResolvedValue({
      data: mockUsers
    });
    const error500 = new Error('Internal Server Error');
    error500.response = {
      status: 500
    };
    _axios.default.post.mockRejectedValue(error500);
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });
    jest.useFakeTimers();
    fillAndSubmit();

    // Attendre la rejection du POST + exécution du catch block
    await (0, _react.act)(async () => {
      await Promise.resolve();
    });

    // Toast d'alerte visible (l'app ne plante pas)
    expect(_react.screen.getByTestId('toast')).toBeInTheDocument();
    expect(_react.screen.getByText('Le serveur est indisponible. Veuillez réessayer plus tard.')).toBeInTheDocument();

    // L'application reste fonctionnelle : on peut naviguer
    (0, _react.act)(() => {
      jest.advanceTimersByTime(3000);
    });
    _userEvent.default.click(_react.screen.getByText("Retour à l'accueil"));

    // Compteur toujours à 10
    expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
  });
});