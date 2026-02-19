import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateAge, validateCodePostal, validateIdentity , validateEmail, validateCity} from '../validator';
import './Register.css';

/**
 * Composant principal du formulaire d'inscription.
 * Gère la saisie et la validation en temps réel des champs :
 * date de naissance, nom, prénom, ville, code postal et email.
 * Affiche des messages d'erreur en rouge pour chaque champ invalide.
 * Le bouton de soumission est désactivé tant que tous les champs ne sont pas valides.
 * À la soumission, les données sont sauvegardées dans le localStorage,
 * les champs sont vidés et un toast de confirmation s'affiche pendant 3 secondes.
 *
 * @param {{ addUser: Function }} props - La fonction pour ajouter un utilisateur au state global
 * @returns {JSX.Element} Le formulaire d'inscription avec validation
 */
function Register({ addUser }) {
  // Age
  let [birthDate, setBirthDate] = useState('');
  const [ageError, setAgeError] = useState('');
  const [ageValid, setAgeValid] = useState(false);

  // Nom et prénom
  let [name, setName] = useState('');
  let [first, setfirst] = useState('');
  const [identityError, setIdentityError] = useState('');
  const [identityValid, setIdentityValid] = useState(false);

  // Code postal
  let [cp, setCp] = useState('');
  const [cpError, setCpError] = useState('');
  const [cpValid, setCpValid] = useState(false);

  // Email
  let [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);

  // Ville
  let [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');
  const [cityValid, setCityValid] = useState(false);

  const [toast, setToast] = useState('');

  /**
   * Gère la soumission du formulaire.
   * Sauvegarde les données dans le localStorage, vide tous les champs
   * et affiche un toast de confirmation pendant 3 secondes.
   */
  const handleSubmit = () => {
    // Ajoute l'utilisateur via le state parent dans App.js
    addUser({ birthDate, name, first, city, cp, email });

    // Videz les champs
    setBirthDate(''); setAgeError(''); setAgeValid(false);
    setName(''); setfirst(''); setIdentityError(''); setIdentityValid(false);
    setCp(''); setCpError(''); setCpValid(false);
    setEmail(''); setEmailError(''); setEmailValid(false);
    setCity(''); setCityError(''); setCityValid(false);

    // Affichez un Toaster
    setToast('Formulaire envoyé avec succès !');
    setTimeout(() => setToast(''), 3000);
  };

  return (<>

    <div>
      Date de naissance
      <input type="date" value={birthDate} onChange={(e) => {
        setBirthDate(e.target.value);
        try {
          validateAge({ birth: new Date(e.target.value) });
          setAgeError('');
          setAgeValid(true);
        } catch (err) {
          setAgeError(err.message);
          setAgeValid(false);
        }
      }} />
      {ageError && <span data-testid="age-error" style={{color: 'red'}}>{ageError}</span>}
    </div>

    <div>
      Nom
      <input value={name} onChange={(e) => {
        setName(e.target.value);
        try {
          validateIdentity({ name: e.target.value, first: first });
          setIdentityError('');
          setIdentityValid(true);
        } catch (err) {
          setIdentityError(err.message);
          setIdentityValid(false);
        }
      }} />

      Prénom
      <input value={first} onChange={(e) => {
        setfirst(e.target.value);
        try {
          validateIdentity({ name: name, first: e.target.value });
          setIdentityError('');
          setIdentityValid(true);
        } catch (err) {
          setIdentityError(err.message);
          setIdentityValid(false);
        }
      }} />
      {identityError && <span data-testid="identity-error" style={{color: 'red'}}>{identityError}</span>}
    </div>

    <div>
      Ville
      <input value={city} onChange={(e) => {
        setCity(e.target.value);
        try {
          validateCity({ city: e.target.value });
          setCityError('');
          setCityValid(true);
        } catch (err) {
          setCityError(err.message);
          setCityValid(false);
        }
      }} />
      {cityError && <span data-testid="city-error" style={{color: 'red'}}>{cityError}</span>}
    </div>

    <div>
      Code Postal
      <input value={cp} onChange={(e) => {
        setCp(e.target.value);
        try {
          validateCodePostal({ cp: e.target.value });
          setCpError('');
          setCpValid(true);
        } catch (err) {
          setCpError(err.message);
          setCpValid(false);
        }
        }} />
      {cpError && <span data-testid="cp-error" style={{color: 'red'}}>{cpError}</span>}
    </div>

    <div>
      Email
      <input value={email} onChange={(e) => {
        setEmail(e.target.value);
        try {
          validateEmail({ email: e.target.value });
          setEmailError('');
          setEmailValid(true);
        } catch (err) {
          setEmailError(err.message);
          setEmailValid(false);
        }
    }} />
      {emailError && <span data-testid="email-error" style={{color: 'red'}}>{emailError}</span>}
    </div>

    <div>
      <button
        data-testid="submit"
        disabled={!(ageValid && identityValid && cityValid && cpValid && emailValid)}
        onClick={handleSubmit}
      >
        Soumettre le formulaire
      </button>
    </div>

    <div>
      <Link to="/">Retour à l'accueil</Link>
    </div>

    {toast && <div data-testid="toast" style={{
      position: 'fixed', top: 20, right: 20,
      backgroundColor: 'green', color: 'white',
      padding: '15px 25px', borderRadius: '5px'
    }}>{toast}</div>}

  </>)
}

export default Register;
