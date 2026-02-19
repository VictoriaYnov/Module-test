import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

describe('Home - Unit Test Suites', () => {

  // Cas : Vérification IHM
  it('should display the page', () => {
    render(<MemoryRouter><Home users={[]} /></MemoryRouter>);
    expect(screen.getByText('Bienvenue')).toBeInTheDocument();
    expect(screen.getByText('Utilisateurs inscrits')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Accéder au formulaire' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });

  // Cas : aucun utilisateur inscrit - liste vide
  it('should display an empty list when no user', () => {
    render(<MemoryRouter><Home users={[]} /></MemoryRouter>);
    expect(screen.queryByText('Victoria Martini')).not.toBeInTheDocument();
  });

  // Cas : un utilisateur inscrit
  it('should display one user in the list', () => {
    const users = [{ first: 'Victoria', name: 'Martini' }];
    render(<MemoryRouter><Home users={users} /></MemoryRouter>);
    expect(screen.getByText('Victoria Martini')).toBeInTheDocument();
  });

  // Cas : plusieurs utilisateurs inscrits
  it('should display multiple users in the list', () => {
    const users = [
      { first: 'Victoria', name: 'Martini' },
      { first: 'Alice', name: 'Bob' },
    ];
    render(<MemoryRouter><Home users={users} /></MemoryRouter>);
    expect(screen.getByText('Victoria Martini')).toBeInTheDocument();
    expect(screen.getByText('Alice Bob')).toBeInTheDocument();
  });

});
