import { Link } from 'react-router-dom';

/**
 * Page d'accueil de l'application.
 * Présente l'application et propose un lien vers le formulaire d'inscription.
 *
 * @component
 * @returns {JSX.Element} La page d'accueil
 */
function Home() {
  return (
    <div>
      <h1>Bienvenue</h1>
      <p>Cliquez sur le bouton ci-dessous pour accéder au formulaire d'inscription.</p>
      <Link to="/register">
        <button>Accéder au formulaire</button>
      </Link>
    </div>
  );
}

export default Home;
