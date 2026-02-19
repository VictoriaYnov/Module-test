import { Link } from 'react-router-dom';

/**
 * Page d'accueil
 * Présente l'application et propose un lien vers le formulaire d'inscription.
 *
 * @param {{ users: Array }} props - La liste des utilisateurs inscrits à afficher
 * @returns {JSX.Element} La page d'accueil
 */
function Home({ users }) {
  return (
    <div>
      <h1>Bienvenue</h1>
      <p>Cliquez sur le bouton ci-dessous pour accéder au formulaire d'inscription.</p>
      <Link to="/register">
        <button>Accéder au formulaire</button>
      </Link>
      <h1>Utilisateurs inscrits</h1>
      <p data-testid="user-count">{users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}</p>
      {users.map((user, index) => (
        <p key={index}>{user.first} {user.name}</p>
      ))}
    </div>
  );
}

export default Home;
