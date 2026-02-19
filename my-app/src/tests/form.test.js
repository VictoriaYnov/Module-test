import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../pages/Register';

test('utilisateur chaotique ', async () => {
  // Scénario décrit dans TEST_PLAN.md
  jest.useFakeTimers();
  render(<Register />);

  // 1. Le bouton "Soumettre" est désactive au demarrage
  const submitBtn = screen.getByTestId('submit');
  expect(submitBtn).toBeDisabled();

  // Récupère les inputs
  const inputs = screen.getAllByRole('textbox');

  // 2. Email : saisie invalide
  userEvent.type(inputs[4], 'mauvaismail');
  expect(screen.getByTestId('email-error')).toBeInTheDocument();
  expect(screen.getByTestId('email-error')).toHaveStyle('color: red');

  // 2. Correction de l'email
  userEvent.clear(inputs[4]);
  userEvent.type(inputs[4], 'victoria@example.com');
  expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();

  // 3. Le bouton "Soumettre" reste désactivé
  expect(submitBtn).toBeDisabled();

  // 4. Nom : saisie invalide
  userEvent.type(inputs[0], 'Martini1');
  expect(screen.getByTestId('identity-error')).toBeInTheDocument();
  expect(screen.getByTestId('identity-error')).toHaveStyle('color: red');

  // 4. Correction du nom
  userEvent.clear(inputs[0]);
  userEvent.type(inputs[0], 'Martini');

  // 5. Prénom : saisie invalide
  userEvent.type(inputs[1], 'Vic$toria');
  expect(screen.getByTestId('identity-error')).toBeInTheDocument();
  expect(screen.getByTestId('identity-error')).toHaveStyle('color: red');

  // 5. Prenom : saisie valide
  userEvent.clear(inputs[1]);
  userEvent.type(inputs[1], 'Victoria');
  expect(screen.queryByTestId('identity-error')).not.toBeInTheDocument();

  // 6. Ville : saisie invalide
  userEvent.type(inputs[2], 'Cap_breton');
  expect(screen.getByTestId('city-error')).toBeInTheDocument();
  expect(screen.getByTestId('city-error')).toHaveStyle('color: red');

  // 6. Correction de la ville
  userEvent.clear(inputs[2]);
  userEvent.type(inputs[2], 'Capbreton');
  expect(screen.queryByTestId('city-error')).not.toBeInTheDocument();

  // 7. Code Postal : saisie trop courte
  userEvent.type(inputs[3], '401');
  expect(screen.getByTestId('cp-error')).toBeInTheDocument();
  expect(screen.getByTestId('cp-error')).toHaveStyle('color: red');

  // 7. Correction du code postal
  userEvent.clear(inputs[3]);
  userEvent.type(inputs[3], '40130');
  expect(screen.queryByTestId('cp-error')).not.toBeInTheDocument();

  // 8 Date de naissance : saisie invalide
  const dateInput = screen.getByDisplayValue('');
  userEvent.type(dateInput, '1000-01-01');
  expect(screen.queryByTestId('age-error')).toBeInTheDocument();

  // 8. Date : saisie valide
  const dateInput2 = screen.getByDisplayValue('1000-01-01');
  userEvent.type(dateInput2, '1997-02-03');
  expect(screen.queryByTestId('age-error')).not.toBeInTheDocument();

  // 9. Re-saisie du nom
  userEvent.clear(inputs[0]);
  userEvent.type(inputs[0], ' ');
  expect(screen.getByTestId('identity-error')).toBeInTheDocument();

  // Le bouton redevient grisé
  expect(submitBtn).toBeDisabled();

  // 9. Correction : re-saisie valide
  userEvent.clear(inputs[0]);
  userEvent.type(inputs[0], 'Martini');
  expect(screen.queryByTestId('identity-error')).not.toBeInTheDocument();

  // 10. Bouton active : toutes les validations passent
  expect(submitBtn).toBeEnabled();

  // 11. Soumission
  userEvent.click(submitBtn);

  // 11. Le toaster vert apparaît
  expect(screen.getByTestId('toast')).toBeInTheDocument();
  expect(screen.getByTestId('toast')).toHaveStyle('background-color: green');

  // 11. Le toaster disparaît après 3 secondes
  act(() => {
    jest.advanceTimersByTime(3000);
  });
  expect(screen.queryByTestId('toast')).not.toBeInTheDocument();

  // 11. Les champs sont vidés
  inputs.forEach(input => {
    expect(input).toHaveValue('');
  });

  // 11. Les données sont dans le localStorage
  const saved = JSON.parse(localStorage.getItem('formData'));
  expect(saved.name).toBe('Martini');
  expect(saved.first).toBe('Victoria');
  expect(saved.email).toBe('victoria@example.com');
  expect(saved.city).toBe('Capbreton');
  expect(saved.cp).toBe('40130');
  expect(saved.birthDate).toBe('1997-02-03');

  // 11. Le bouton redevient désactivé
  expect(submitBtn).toBeDisabled();

  jest.useRealTimers();
});
