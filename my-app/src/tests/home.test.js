import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

describe('Home - Unit Test Suites', () => {

  // Cas : Vérification IHM
  it('should display the page', () => {
    render(<MemoryRouter><Home usersCount={0} apiError="" /></MemoryRouter>);
    expect(screen.getByText('Bienvenue')).toBeInTheDocument();
    expect(screen.getByText('Utilisateurs inscrits')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Accéder au formulaire' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });

  // Cas : compteur à 0, aucun utilisateur
  it('should display 0 users when count is 0', () => {
    render(<MemoryRouter><Home usersCount={0} apiError="" /></MemoryRouter>);
    expect(screen.getByText('0 utilisateur inscrit')).toBeInTheDocument();
  });

  // Cas : compteur à 1
  it('should display singular form when count is 1', () => {
    render(<MemoryRouter><Home usersCount={1} apiError="" /></MemoryRouter>);
    expect(screen.getByText('1 utilisateur inscrit')).toBeInTheDocument();
  });

  // Cas : compteur à plusieurs
  it('should display plural form when count is greater than 1', () => {
    render(<MemoryRouter><Home usersCount={10} apiError="" /></MemoryRouter>);
    expect(screen.getByText('10 utilisateurs inscrits')).toBeInTheDocument();
  });

  // Cas : erreur API - affiche le message d'erreur
  it('should display error message when apiError is set', () => {
    render(<MemoryRouter><Home usersCount={0} apiError="Impossible de récupérer les utilisateurs." /></MemoryRouter>);
    expect(screen.getByTestId('api-error')).toBeInTheDocument();
    expect(screen.getByText('Impossible de récupérer les utilisateurs.')).toBeInTheDocument();
    expect(screen.queryByTestId('user-count')).not.toBeInTheDocument();
  });

});
