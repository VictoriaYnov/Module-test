"use strict";

var _react = require("@testing-library/react");
var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));
var _reactRouterDom = require("react-router-dom");
var _Register = _interopRequireDefault(require("../pages/Register"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
test('utilisateur chaotique ', async () => {
  // Scénario décrit dans TEST_PLAN.md
  jest.useFakeTimers();
  const mockAddUser = jest.fn();
  (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.MemoryRouter, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Register.default, {
      addUser: mockAddUser
    })
  }));

  // 1. Le bouton "Soumettre" est désactive au demarrage
  const submitBtn = _react.screen.getByTestId('submit');
  expect(submitBtn).toBeDisabled();

  // Récupère les inputs
  const inputs = _react.screen.getAllByRole('textbox');

  // 2. Email : saisie invalide
  _userEvent.default.type(inputs[4], 'mauvaismail');
  expect(_react.screen.getByTestId('email-error')).toBeInTheDocument();
  expect(_react.screen.getByTestId('email-error')).toHaveStyle('color: red');

  // 2. Correction de l'email
  _userEvent.default.clear(inputs[4]);
  _userEvent.default.type(inputs[4], 'victoria@example.com');
  expect(_react.screen.queryByTestId('email-error')).not.toBeInTheDocument();

  // 3. Le bouton "Soumettre" reste désactivé
  expect(submitBtn).toBeDisabled();

  // 4. Nom : saisie invalide
  _userEvent.default.type(inputs[0], 'Martini1');
  expect(_react.screen.getByTestId('identity-error')).toBeInTheDocument();
  expect(_react.screen.getByTestId('identity-error')).toHaveStyle('color: red');

  // 4. Correction du nom
  _userEvent.default.clear(inputs[0]);
  _userEvent.default.type(inputs[0], 'Martini');

  // 5. Prénom : saisie invalide
  _userEvent.default.type(inputs[1], 'Vic$toria');
  expect(_react.screen.getByTestId('identity-error')).toBeInTheDocument();
  expect(_react.screen.getByTestId('identity-error')).toHaveStyle('color: red');

  // 5. Prenom : saisie valide
  _userEvent.default.clear(inputs[1]);
  _userEvent.default.type(inputs[1], 'Victoria');
  expect(_react.screen.queryByTestId('identity-error')).not.toBeInTheDocument();

  // 6. Ville : saisie invalide
  _userEvent.default.type(inputs[2], 'Cap_breton');
  expect(_react.screen.getByTestId('city-error')).toBeInTheDocument();
  expect(_react.screen.getByTestId('city-error')).toHaveStyle('color: red');

  // 6. Correction de la ville
  _userEvent.default.clear(inputs[2]);
  _userEvent.default.type(inputs[2], 'Capbreton');
  expect(_react.screen.queryByTestId('city-error')).not.toBeInTheDocument();

  // 7. Code Postal : saisie trop courte
  _userEvent.default.type(inputs[3], '401');
  expect(_react.screen.getByTestId('cp-error')).toBeInTheDocument();
  expect(_react.screen.getByTestId('cp-error')).toHaveStyle('color: red');

  // 7. Correction du code postal
  _userEvent.default.clear(inputs[3]);
  _userEvent.default.type(inputs[3], '40130');
  expect(_react.screen.queryByTestId('cp-error')).not.toBeInTheDocument();

  // 8 Date de naissance : saisie invalide
  const dateInput = _react.screen.getByDisplayValue('');
  _userEvent.default.type(dateInput, '1000-01-01');
  expect(_react.screen.queryByTestId('age-error')).toBeInTheDocument();

  // 8. Date : saisie valide
  const dateInput2 = _react.screen.getByDisplayValue('1000-01-01');
  _userEvent.default.type(dateInput2, '1997-02-03');
  expect(_react.screen.queryByTestId('age-error')).not.toBeInTheDocument();

  // 9. Re-saisie du nom
  _userEvent.default.clear(inputs[0]);
  _userEvent.default.type(inputs[0], ' ');
  expect(_react.screen.getByTestId('identity-error')).toBeInTheDocument();

  // Le bouton redevient grisé
  expect(submitBtn).toBeDisabled();

  // 9. Correction : re-saisie valide
  _userEvent.default.clear(inputs[0]);
  _userEvent.default.type(inputs[0], 'Martini');
  expect(_react.screen.queryByTestId('identity-error')).not.toBeInTheDocument();

  // 10. Bouton active : toutes les validations passent
  expect(submitBtn).toBeEnabled();

  // 11. Soumission (handleSubmit est async : on attend la résolution)
  _userEvent.default.click(submitBtn);
  await (0, _react.act)(async () => {
    await Promise.resolve();
  });

  // 11. Le toaster vert apparaît
  expect(_react.screen.getByTestId('toast')).toBeInTheDocument();
  expect(_react.screen.getByTestId('toast')).toHaveStyle('background-color: green');

  // 11. Le toaster disparaît après 3 secondes
  (0, _react.act)(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(_react.screen.queryByTestId('toast')).not.toBeInTheDocument();

  // 11. Les champs sont vidés
  inputs.forEach(input => {
    expect(input).toHaveValue('');
  });

  // 11. addUser a bien été appelé avec les bonnes données
  expect(mockAddUser).toHaveBeenCalledTimes(1);
  expect(mockAddUser).toHaveBeenCalledWith({
    name: 'Martini',
    first: 'Victoria',
    email: 'victoria@example.com',
    city: 'Capbreton',
    cp: '40130',
    birthDate: '1997-02-03'
  });

  // 11. Le bouton redevient désactivé
  expect(submitBtn).toBeDisabled();
  jest.useRealTimers();
});