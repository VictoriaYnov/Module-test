"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _reactRouterDom = require("react-router-dom");
var _Home = _interopRequireDefault(require("./pages/Home"));
var _Register = _interopRequireDefault(require("./pages/Register"));
var _api = require("./api");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Composant racine de l'application.
 * Gère l'état global du compteur d'utilisateurs et le routage entre les pages.
 * Récupère le nombre d'utilisateurs depuis l'API au chargement.
 *
 * @component
 * @returns {JSX.Element} L'application avec le routeur
 */function App() {
  const [usersCount, setUsersCount] = (0, _react.useState)(0);
  const [apiError, setApiError] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    const fetchCount = async () => {
      try {
        const count = await (0, _api.countUsers)();
        setUsersCount(count);
      } catch (error) {
        setApiError('Impossible de récupérer les utilisateurs.');
      }
    };
    fetchCount();
  }, []);

  /**
   * Envoie un nouvel utilisateur à l'API et incrémente le compteur.
   * @param {Object} user - L'utilisateur à ajouter
   * @returns {Promise<void>}
   */
  const addUser = async user => {
    await (0, _api.postUser)(user);
    setUsersCount(prev => prev + 1);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.BrowserRouter, {
    basename: process.env.NODE_ENV === 'production' ? '/Module-test' : '',
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactRouterDom.Routes, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
        path: "/",
        element: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
          usersCount: usersCount,
          apiError: apiError
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
        path: "/register",
        element: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Register.default, {
          addUser: addUser
        })
      })]
    })
  });
}
var _default = exports.default = App;