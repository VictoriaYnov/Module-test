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

  // Cas : aucun utilisateur inscrit - liste vide et compteur à 0
  it('should display an empty list when no user', () => {
    render(<MemoryRouter><Home users={[]} /></MemoryRouter>);
    expect(screen.getByText('0 utilisateur inscrit')).toBeInTheDocument();
    expect(screen.queryByText('Victoria Martini')).not.toBeInTheDocument();
  });

  // Cas : un utilisateur inscrit et compteur à 1
  it('should display one user in the list', () => {
    const users = [{ first: 'Victoria', name: 'Martini' }];
    render(<MemoryRouter><Home users={users} /></MemoryRouter>);
    expect(screen.getByText('1 utilisateur inscrit')).toBeInTheDocument();
    expect(screen.getByText('Victoria Martini')).toBeInTheDocument();
  });

  // Cas : plusieurs utilisateurs inscrits et compteur cohérent
  it('should display multiple users in the list', () => {
    const users = [
      { first: 'Victoria', name: 'Martini' },
      { first: 'Alice', name: 'Bob' },
    ];
    render(<MemoryRouter><Home users={users} /></MemoryRouter>);
    expect(screen.getByText('2 utilisateurs inscrits')).toBeInTheDocument();
    expect(screen.getByText('Victoria Martini')).toBeInTheDocument();
    expect(screen.getByText('Alice Bob')).toBeInTheDocument();
  });

});
