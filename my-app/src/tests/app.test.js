import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';

jest.mock('axios');

// 10 utilisateurs fictifs simulant la réponse de JSONPlaceholder
const mockUsers = Array(10).fill(null).map((_, i) => ({ id: i + 1, name: `User ${i + 1}` }));

// Helper : navigue vers le formulaire, le remplit et le soumet
const fillAndSubmit = () => {
  userEvent.click(screen.getByText('Accéder au formulaire'));
  userEvent.type(screen.getByTestId('input-name'), 'Martini');
  userEvent.type(screen.getByTestId('input-first'), 'Victoria');
  userEvent.type(screen.getByTestId('input-city'), 'Capbreton');
  userEvent.type(screen.getByTestId('input-cp'), '40130');
  userEvent.type(screen.getByTestId('input-email'), 'victoria@example.com');
  userEvent.type(screen.getByTestId('input-birthdate'), '1997-02-03');
  userEvent.click(screen.getByTestId('submit'));
};

describe('App - Tests d\'intégration avec API (Axios)', () => {

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // Succès GET : le compteur affiche le bon nombre au chargement
  it('should display user count fetched from API on load', async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });
  });

  // Erreur GET : l'API est indisponible → message d'erreur affiché
  it('should display error message when GET /users fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('api-error')).toBeInTheDocument();
      expect(screen.getByText('Impossible de récupérer les utilisateurs.')).toBeInTheDocument();
    });
  });

  // Succès POST (201) : inscription réussie → toast vert + compteur incrémenté
  it('should show success toast and increment counter after successful registration', async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    axios.post.mockResolvedValue({ data: { id: 101 } });

    render(<App />);

    // Attendre le chargement initial (timers réels)
    await waitFor(() => {
      expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });

    // Passer aux timers simulés pour le toast
    jest.useFakeTimers();

    fillAndSubmit();

    // Attendre la résolution du POST + exécution du try block de handleSubmit
    await act(async () => { await Promise.resolve(); });

    // Toast de succès visible
    expect(screen.getByTestId('toast')).toBeInTheDocument();
    expect(screen.getByText('Formulaire envoyé avec succès !')).toBeInTheDocument();

    // Faire disparaître le toast
    act(() => { jest.advanceTimersByTime(3000); });
    expect(screen.queryByTestId('toast')).not.toBeInTheDocument();

    // Retour à l'accueil
    userEvent.click(screen.getByText("Retour à l'accueil"));

    // Compteur incrémenté à 11
    expect(screen.getByText('11 utilisateurs inscrits')).toBeInTheDocument();

    // Vérifier que POST a été appelé avec les bonnes données
    expect(axios.post).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.objectContaining({
        name: 'Martini',
        first: 'Victoria',
        email: 'victoria@example.com',
      })
    );
  });

  // Erreur métier (400) : email déjà utilisé → toast rouge avec le message du back
  it('should show backend error message in toast when POST returns 400', async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    const error400 = new Error('Bad Request');
    error400.response = { status: 400, data: { message: 'Cet email est déjà utilisé.' } };
    axios.post.mockRejectedValue(error400);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });

    jest.useFakeTimers();

    fillAndSubmit();

    // Attendre la rejection du POST + exécution du catch block
    await act(async () => { await Promise.resolve(); });

    // Toast d'erreur visible avec le message spécifique du back
    expect(screen.getByTestId('toast')).toBeInTheDocument();
    expect(screen.getByText('Cet email est déjà utilisé.')).toBeInTheDocument();

    // Faire disparaître le toast
    act(() => { jest.advanceTimersByTime(3000); });

    // Retour à l'accueil : compteur toujours à 10, pas d'erreur API
    userEvent.click(screen.getByText("Retour à l'accueil"));
    expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    expect(screen.queryByTestId('api-error')).not.toBeInTheDocument();
  });

  // Crash serveur (500) : toast d'alerte + l'application ne plante pas
  it('should show server error toast and not crash when POST returns 500', async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    const error500 = new Error('Internal Server Error');
    error500.response = { status: 500 };
    axios.post.mockRejectedValue(error500);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
    });

    jest.useFakeTimers();

    fillAndSubmit();

    // Attendre la rejection du POST + exécution du catch block
    await act(async () => { await Promise.resolve(); });

    // Toast d'alerte visible (l'app ne plante pas)
    expect(screen.getByTestId('toast')).toBeInTheDocument();
    expect(screen.getByText('Le serveur est indisponible. Veuillez réessayer plus tard.')).toBeInTheDocument();

    // L'application reste fonctionnelle : on peut naviguer
    act(() => { jest.advanceTimersByTime(3000); });
    userEvent.click(screen.getByText("Retour à l'accueil"));

    // Compteur toujours à 10
    expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
  });
});
