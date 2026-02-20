import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import { countUsers, postUser } from './api';

/**
 * Composant racine de l'application.
 * Gère l'état global du compteur d'utilisateurs et le routage entre les pages.
 * Récupère le nombre d'utilisateurs depuis l'API au chargement.
 *
 * @component
 * @returns {JSX.Element} L'application avec le routeur
 */
function App() {
  const [usersCount, setUsersCount] = useState(0);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await countUsers();
        setUsersCount(count);
      } catch (error) {
        setApiError('Impossible de récupérer les utilisateurs.');
      }
    };

    fetchCount();
  }, []);

  /**
   * Envoie un nouvel utilisateur à l'API et incrémente le compteur.
   * @param {Object} user - L'utilisateur à ajouter
   * @returns {Promise<void>}
   */
  const addUser = async (user) => {
    try {
      await postUser(user);
      setUsersCount((prev) => prev + 1);
    } catch (error) {
      setApiError('Impossible d\'enregistrer l\'utilisateur.');
    }
  };

  return (
    <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/Module-test' : ''}>
      <Routes>
        <Route path="/" element={<Home usersCount={usersCount} apiError={apiError} />} />
        <Route path="/register" element={<Register addUser={addUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
