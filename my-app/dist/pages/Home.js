"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactRouterDom = require("react-router-dom");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * Page d'accueil
 * Présente l'application et propose un lien vers le formulaire d'inscription.
 * Affiche le nombre d'utilisateurs inscrits récupéré depuis l'API.
 *
 * @param {Object} props
 * @param {number} props.usersCount - Le nombre d'utilisateurs inscrits
 * @param {string} [props.apiError] - Message d'erreur à afficher si le chargement a échoué
 * @returns {JSX.Element} La page d'accueil
 */function Home(_ref) {
  let {
    usersCount,
    apiError
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Bienvenue"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      children: "Cliquez sur le bouton ci-dessous pour acc\xE9der au formulaire d'inscription."
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Link, {
      to: "/register",
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        children: "Acc\xE9der au formulaire"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Utilisateurs inscrits"
    }), apiError ? /*#__PURE__*/(0, _jsxRuntime.jsx)("p", {
      "data-testid": "api-error",
      style: {
        color: 'red'
      },
      children: apiError
    }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      "data-testid": "user-count",
      children: [usersCount, " utilisateur", usersCount > 1 ? 's' : '', " inscrit", usersCount > 1 ? 's' : '']
    })]
  });
}
var _default = exports.default = Home;