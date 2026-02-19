import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';

/**
 * Composant racine de l'application.
 * Gère l'état global des utilisateurs inscrits et le routage entre les pages.
 *
 * @component
 * @returns {JSX.Element} L'application avec le routeur
 */
function App() {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem('users') || '[]')
  );

  /**
   * Ajoute un nouvel utilisateur à la liste et sauvegarde dans le localStorage.
   * @param {Object} user - L'utilisateur à ajouter
   */
  const addUser = (user) => {
    const updated = [...users, user];
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  return (
    <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/Module-test' : ''}>
      <Routes>
        <Route path="/" element={<Home users={users} />} />
        <Route path="/register" element={<Register addUser={addUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
