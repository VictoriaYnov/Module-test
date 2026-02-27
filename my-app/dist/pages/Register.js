"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _reactRouterDom = require("react-router-dom");
var _validator = require("../validator");
require("./Register.css");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * Composant principal du formulaire d'inscription.
 * Gère la saisie et la validation en temps réel des champs :
 * date de naissance, nom, prénom, ville, code postal et email.
 * Affiche des messages d'erreur en rouge pour chaque champ invalide.
 * Le bouton de soumission est désactivé tant que tous les champs ne sont pas valides.
 * À la soumission, les données sont sauvegardées dans le localStorage,
 * les champs sont vidés et un toast de confirmation s'affiche pendant 3 secondes.
 *
 * @param {{ addUser: Function }} props - La fonction pour ajouter un utilisateur au state global
 * @returns {JSX.Element} Le formulaire d'inscription avec validation
 */function Register(_ref) {
  let {
    addUser
  } = _ref;
  // Age
  let [birthDate, setBirthDate] = (0, _react.useState)('');
  const [ageError, setAgeError] = (0, _react.useState)('');
  const [ageValid, setAgeValid] = (0, _react.useState)(false);

  // Nom et prénom
  let [name, setName] = (0, _react.useState)('');
  let [first, setFirst] = (0, _react.useState)('');
  const [identityError, setIdentityError] = (0, _react.useState)('');
  const [identityValid, setIdentityValid] = (0, _react.useState)(false);

  // Code postal
  let [cp, setCp] = (0, _react.useState)('');
  const [cpError, setCpError] = (0, _react.useState)('');
  const [cpValid, setCpValid] = (0, _react.useState)(false);

  // Email
  let [email, setEmail] = (0, _react.useState)('');
  const [emailError, setEmailError] = (0, _react.useState)('');
  const [emailValid, setEmailValid] = (0, _react.useState)(false);

  // Ville
  let [city, setCity] = (0, _react.useState)('');
  const [cityError, setCityError] = (0, _react.useState)('');
  const [cityValid, setCityValid] = (0, _react.useState)(false);
  const [toast, setToast] = (0, _react.useState)('');
  const [toastType, setToastType] = (0, _react.useState)('success');

  /**
   * Gère la soumission du formulaire.
   * Envoie les données à l'API, vide les champs et affiche un toast.
   * - Succès (201) : toast vert de confirmation.
   * - Erreur métier (400) : toast rouge avec le message du back.
   * - Crash serveur (500) : toast rouge d'alerte générique.
   */
  const handleSubmit = async () => {
    try {
      await addUser({
        birthDate,
        name,
        first,
        city,
        cp,
        email
      });

      // Videz les champs
      setBirthDate('');
      setAgeError('');
      setAgeValid(false);
      setName('');
      setFirst('');
      setIdentityError('');
      setIdentityValid(false);
      setCp('');
      setCpError('');
      setCpValid(false);
      setEmail('');
      setEmailError('');
      setEmailValid(false);
      setCity('');
      setCityError('');
      setCityValid(false);

      // Toast de succès
      setToastType('success');
      setToast('Formulaire envoyé avec succès !');
    } catch (error) {
      var _error$response;
      // Erreur métier (400) : message spécifique du back
      if (((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.status) === 400) {
        var _error$response$data;
        setToast(((_error$response$data = error.response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.message) || 'Cet email est déjà utilisé.');
      } else {
        // Crash serveur (500) ou erreur réseau
        setToast('Le serveur est indisponible. Veuillez réessayer plus tard.');
      }
      setToastType('error');
    }
    setTimeout(() => setToast(''), 3000);
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_jsxRuntime.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: ["Date de naissance", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        "data-testid": "input-birthdate",
        "data-cy": "input-birthdate",
        type: "date",
        value: birthDate,
        onChange: e => {
          setBirthDate(e.target.value);
          try {
            (0, _validator.validateAge)({
              birth: new Date(e.target.value)
            });
            setAgeError('');
            setAgeValid(true);
          } catch (err) {
            setAgeError(err.message);
            setAgeValid(false);
          }
        }
      }), ageError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        "data-testid": "age-error",
        "data-cy": "age-error",
        style: {
          color: 'red'
        },
        children: ageError
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: ["Nom", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        "data-testid": "input-name",
        "data-cy": "input-name",
        value: name,
        onChange: e => {
          setName(e.target.value);
          try {
            (0, _validator.validateIdentity)({
              name: e.target.value,
              first: first
            });
            setIdentityError('');
            setIdentityValid(true);
          } catch (err) {
            setIdentityError(err.message);
            setIdentityValid(false);
          }
        }
      }), "Pr\xE9nom", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        "data-testid": "input-first",
        "data-cy": "input-first",
        value: first,
        onChange: e => {
          setFirst(e.target.value);
          try {
            (0, _validator.validateIdentity)({
              name: name,
              first: e.target.value
            });
            setIdentityError('');
            setIdentityValid(true);
          } catch (err) {
            setIdentityError(err.message);
            setIdentityValid(false);
          }
        }
      }), identityError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        "data-testid": "identity-error",
        "data-cy": "identity-error",
        style: {
          color: 'red'
        },
        children: identityError
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: ["Ville", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        "data-testid": "input-city",
        "data-cy": "input-city",
        value: city,
        onChange: e => {
          setCity(e.target.value);
          try {
            (0, _validator.validateCity)({
              city: e.target.value
            });
            setCityError('');
            setCityValid(true);
          } catch (err) {
            setCityError(err.message);
            setCityValid(false);
          }
        }
      }), cityError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        "data-testid": "city-error",
        "data-cy": "city-error",
        style: {
          color: 'red'
        },
        children: cityError
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: ["Code Postal", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        "data-testid": "input-cp",
        "data-cy": "input-cp",
        value: cp,
        onChange: e => {
          setCp(e.target.value);
          try {
            (0, _validator.validateCodePostal)({
              cp: e.target.value
            });
            setCpError('');
            setCpValid(true);
          } catch (err) {
            setCpError(err.message);
            setCpValid(false);
          }
        }
      }), cpError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        "data-testid": "cp-error",
        "data-cy": "cp-error",
        style: {
          color: 'red'
        },
        children: cpError
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: ["Email", /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        "data-testid": "input-email",
        "data-cy": "input-email",
        value: email,
        onChange: e => {
          setEmail(e.target.value);
          try {
            (0, _validator.validateEmail)({
              email: e.target.value
            });
            setEmailError('');
            setEmailValid(true);
          } catch (err) {
            setEmailError(err.message);
            setEmailValid(false);
          }
        }
      }), emailError && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        "data-testid": "email-error",
        "data-cy": "email-error",
        style: {
          color: 'red'
        },
        children: emailError
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        "data-testid": "submit",
        "data-cy": "submit",
        disabled: !(ageValid && identityValid && cityValid && cpValid && emailValid),
        onClick: handleSubmit,
        children: "Soumettre le formulaire"
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Link, {
        to: "/",
        children: "Retour \xE0 l'accueil"
      })
    }), toast && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      "data-testid": "toast",
      "data-cy": "toast",
      style: {
        position: 'fixed',
        top: 20,
        right: 20,
        backgroundColor: toastType === 'success' ? 'green' : 'red',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '5px'
      },
      children: toast
    })]
  });
}
var _default = exports.default = Register;