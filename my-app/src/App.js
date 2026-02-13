import { useState } from 'react';
import { validateAge, validateCodePostal, validateIdentity , validateEmail} from './validator';
import './App.css';

function App() {
  let [count, setCount] = useState(0);
  const clickOnMe = () => {
    setCount(count+1);
  }

  let [birthDate, setBirthDate] = useState('');
  const [ageError, setAgeError] = useState('');
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
  const handleValidateEmail = () => {
    try {
      validateEmail({ email: email});
      setEmailError('');
    } catch (e) {
      setEmailError(e.message);
    }
  };




  return (<>
    <div>
      <button onClick={clickOnMe}>Click me</button>
      <span data-testid="count">{count}</span>
    </div>

    <div>
      Date de naissance
      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      <button onClick={handleValidateAge}>Valider l'âge</button>
      {ageError && <span data-testid="age-error" style={{color: 'red'}}>{ageError}</span>}
    </div>

    <div>
      Nom
      <input value={name} onChange={(e) => setName(e.target.value)} />
    </div>
    <div>
      Prénom
      <input value={first} onChange={(e) => setfirst(e.target.value)} />
      <button onClick={handleValidateIdentity}>Valider le nom</button>
      {setIdentityError && <span data-testid="identity-error" style={{color: 'red'}}>{identityError}</span>}
    </div>

    <div>
      Code Postal
      <input value={cp} onChange={(e) => setCp(e.target.value)} />
      <button onClick={handleValidateCp}>Valider le code postal</button>
      {setCpError && <span data-testid="cp-error" style={{color: 'red'}}>{cpError}</span>}
    </div>

    <div>
      Email
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleValidateEmail}>Valider l'email</button>
      {setEmailError && <span data-testid="email-error" style={{color: 'red'}}>{emailError}</span>}
    </div>



  </>)
}

export default App;
