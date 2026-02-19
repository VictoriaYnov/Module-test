import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App - Navigation and persistence integration test', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('full stream', async () => {
    jest.useFakeTimers();
    render(<App />);

    // 1. On est sur Home, liste vide
    expect(screen.getByText('Bienvenue')).toBeInTheDocument();
    expect(screen.queryByText('Victoria Martini')).not.toBeInTheDocument();

    // 2. Navigation vers le formulaire
    userEvent.click(screen.getByText('Accéder au formulaire'));
    expect(screen.getByTestId('submit')).toBeDisabled();

    // 3. Remplir le formulaire
    const inputs = screen.getAllByRole('textbox');
    userEvent.type(inputs[0], 'Martini');
    userEvent.type(inputs[1], 'Victoria');
    userEvent.type(inputs[2], 'Capbreton');
    userEvent.type(inputs[3], '40130');
    userEvent.type(inputs[4], 'victoria@example.com');
    userEvent.type(screen.getByDisplayValue(''), '1997-02-03');

    // 4. Soumettre
    expect(screen.getByTestId('submit')).toBeEnabled();
    userEvent.click(screen.getByTestId('submit'));
    expect(screen.getByTestId('toast')).toBeInTheDocument();

    // 5. Faire disparaître le toast
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();

    // 6. Retour à l'accueil
    userEvent.click(screen.getByText("Retour à l'accueil"));

    // 7. L'utilisateur apparaît dans la liste
    expect(screen.getByText('Victoria Martini')).toBeInTheDocument();

    // 8. Le localStorage contient le tableau avec le bon utilisateur
    const users = JSON.parse(localStorage.getItem('users'));
    expect(users).toHaveLength(1);
    expect(users[0].name).toBe('Martini');
    expect(users[0].first).toBe('Victoria');
    expect(users[0].email).toBe('victoria@example.com');

    jest.useRealTimers();
  });

});
