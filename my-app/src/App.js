import { useState } from 'react';
import { validateAge, validateCodePostal, validateIdentity , validateEmail, validateCity} from './validator';
import './App.css';

function App() {
  let [count, setCount] = useState(0);
  const clickOnMe = () => {
    setCount(count+1);
  }

  let [birthDate, setBirthDate] = useState('');
  const [ageError, setAgeError] = useState('');
  const [ageValid, setAgeValid] = useState(false);
  const handleValidateAge = () => {
    try {
      validateAge({ birth: new Date(birthDate) });
      setAgeError('');
    } catch (e) {
      setAgeError(e.message);
    }
  };

  let [name, setName] = useState('');
  let [first, setfirst] = useState('');
  const [identityError, setIdentityError] = useState('');
  const [identityValid, setIdentityValid] = useState(false);
  const handleValidateIdentity = () => {
    try {
      validateIdentity({ name: name, first: first });
      setIdentityError('');
    } catch (e) {
      setIdentityError(e.message);
    }
  };

  let [cp, setCp] = useState('');
  const [cpError, setCpError] = useState('');
  const [cpValid, setCpValid] = useState(false);
  const handleValidateCp = () => {
    try {
      validateCodePostal({ cp: cp});
      setCpError('');
    } catch (e) {
      setCpError(e.message);
    }
  };

  let [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const handleValidateEmail = () => {
    try {
      validateEmail({ email: email});
      setEmailError('');
    } catch (e) {
      setEmailError(e.message);
    }
  };

  let [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');
  const [cityValid, setCityValid] = useState(false);
  const handleValidateCity = () => {
    try {
      validateCity({ city: city});
      setCityError('');
    } catch (e) {
      setCityError(e.message);
    }
  };




  return (<>
    <div>
      <button onClick={clickOnMe}>Click me</button>
      <span data-testid="count">{count}</span>
    </div>

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
      >
        Soumettre le formulaire
      </button>
    </div>



  </>)
}

export default App;
