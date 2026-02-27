"use strict";

var _react = require("@testing-library/react");
var _reactRouterDom = require("react-router-dom");
var _Home = _interopRequireDefault(require("../pages/Home"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
describe('Home - Unit Test Suites', () => {
  // Cas : Vérification IHM
  it('should display the page', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.MemoryRouter, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
        usersCount: 0,
        apiError: ""
      })
    }));
    expect(_react.screen.getByText('Bienvenue')).toBeInTheDocument();
    expect(_react.screen.getByText('Utilisateurs inscrits')).toBeInTheDocument();
    const link = _react.screen.getByRole('link', {
      name: 'Accéder au formulaire'
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });

  // Cas : compteur à 0, aucun utilisateur
  it('should display 0 users when count is 0', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.MemoryRouter, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
        usersCount: 0,
        apiError: ""
      })
    }));
    expect(_react.screen.getByText('0 utilisateur inscrit')).toBeInTheDocument();
  });

  // Cas : compteur à 1
  it('should display singular form when count is 1', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.MemoryRouter, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
        usersCount: 1,
        apiError: ""
      })
    }));
    expect(_react.screen.getByText('1 utilisateur inscrit')).toBeInTheDocument();
  });

  // Cas : compteur à plusieurs
  it('should display plural form when count is greater than 1', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.MemoryRouter, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
        usersCount: 10,
        apiError: ""
      })
    }));
    expect(_react.screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
  });

  // Cas : erreur API - affiche le message d'erreur
  it('should display error message when apiError is set', () => {
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.MemoryRouter, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
        usersCount: 0,
        apiError: "Impossible de r\xE9cup\xE9rer les utilisateurs."
      })
    }));
    expect(_react.screen.getByTestId('api-error')).toBeInTheDocument();
    expect(_react.screen.getByText('Impossible de récupérer les utilisateurs.')).toBeInTheDocument();
    expect(_react.screen.queryByTestId('user-count')).not.toBeInTheDocument();
  });
});