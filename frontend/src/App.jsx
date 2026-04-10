import './App.css';


/* lancer le serveur en local : npm run dev a cette adresse http://localhost:5173*/

function Register() {
  return (
    <form>
      <table>
        <tbody>
          <tr>
            <label>
              Pseudonyme :
              <input type="text" placeholder="Entrez votre pseudonyme" />
            </label>
          </tr>
          <tr>
            <label>
              Nom :
              <input type="text" placeholder="Entrez votre nom" />
            </label>
          </tr>
          <tr>
            <label>
              Prénom :
              <input type="text" placeholder="Entrez votre prénom" />
            </label>
          </tr>
          <tr>
            Sexe :
            <input type="radio" id="H" name="ChoseSexe" value="Homme" />
            <label for="H">Homme</label>
            <input type="radio" id="F" name="ChoseSexe" value="Femme" />
            <label for="F">Femme</label>
            <input type="radio" id="O" name="ChoseSexe" value="Autre" />
            <label for="O">Autre</label>
          </tr>
          <tr>
            <label>
              Date de naissance :
              <input type="date" />
            </label>
          </tr>
          <tr>
            <label>
              Mot de passe :
              <input type="password" placeholder="MotDePasse" />
            </label>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

function Login() {
  return (
    <form>
      <table>
        <tbody>
          <tr>
            <label>
              Pseudonyme :
              <input type="text" placeholder="Entrez votre pseudonyme" id="pseudonym" />
            </label>
          </tr>
          <tr>
            <label>
              Mot de passe :
              <input type="password" placeholder="MotDePasse" id="password" />
            </label>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

function ShowThermostat() {

}

export default function MyApp() {
  return (
    <div>
      <h1>CyNapse</h1>
      <Register />
    </div>
  );
}