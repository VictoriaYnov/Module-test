import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Page d'accueil
 * Présente l'application et propose un lien vers le formulaire d'inscription.
 * Affiche le nombre d'utilisateurs inscrits récupéré depuis l'API.
 *
 * @param {Object} props
 * @param {number} props.usersCount - Le nombre d'utilisateurs inscrits
 * @param {string} [props.apiError] - Message d'erreur à afficher si le chargement a échoué
 * @returns {JSX.Element} La page d'accueil
 */
function Home({ usersCount, apiError }) {
  return (
    <div className="home-container">
      <h1>Bienvenue</h1>
      <p>Cliquez sur le bouton ci-dessous pour accéder au formulaire d'inscription.</p>
      <Link to="/register" className="home-register-btn">Accéder au formulaire</Link>
      <hr className="home-divider" />
      <h1>Utilisateurs inscrits</h1>
      {apiError
        ? <p data-testid="api-error" className="api-error">{apiError}</p>
        : <p data-testid="user-count" data-cy="users-count" className="user-count">{usersCount} utilisateur{usersCount > 1 ? 's' : ''} inscrit{usersCount > 1 ? 's' : ''}</p>
      }
    </div>
  );
}

export default Home;
