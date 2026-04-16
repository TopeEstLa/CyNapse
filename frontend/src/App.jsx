import React from "react";
import { useState } from "react";
import { Register, Login } from "./Form.jsx";
//import Login from './Form.jsx';

/* lancer le serveur en local : npm run dev a cette adresse http://localhost:5173*/
/*
function Register(){
    return(
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
                  <input type="radio" id="H" name="ChoseSexe" value="Homme"/>
                  <label for="H">Homme</label>
                  <input type="radio" id="F" name="ChoseSexe" value="Femme"/>
                  <label for="F">Femme</label>
                  <input type="radio" id="O" name="ChoseSexe" value="Autre"/>
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
                  <input type="password" placeholder="MotDePasse"/>
                </label>
              </tr>
              <tr> <input type="submit" value="Envoyer" /> </tr>
            </tbody>
          </table>
        </form>
    );
}

function Login(){
    return(
        <form>
          <table>
            <tbody>
              <tr>
                <label>
                  Pseudonyme :
                  <input type="text" placeholder="Entrez votre pseudonyme" id="pseudonym"/>
                </label>
              </tr>
              <tr>
                <label>
                  Mot de passe :
                  <input type="password" placeholder="MotDePasse" id="password"/>
                </label>
              </tr>
            </tbody>
          </table>
        </form>
    );
}

function ShowThermostat(){
  
}

<Register(render()) />
*/
/*export default function MyApp() {
  
  return (
    <div>
      <h1>CyNapse</h1>
      <Register/>
    </div>
  );
}*/


class Menu extends React.Component{
  constructor(props) {
  super(props);
  this.state = {value: "default"};

  this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(event){
    
    this.setState({value: event});
    //alert(event);
  }

  render(){
    let x;
    switch (this.state.value) {
          case "main":
            x=<h1>main</h1>;
            break;
          case "login":
            x=<Login/>;
            break;
          case "register":
            x=<Register/>;
            break;
          default:
            x=<h1>default</h1>;
            break;
        }
    return (
    <div>
      <button onClick={()=>{this.handleClick("main")}}>Main</button>
      <button onClick={()=>{this.handleClick("login")}}>Login</button>
        <button onClick={()=>{this.handleClick("register")}}>Register</button>
      {x}
    </div>

    );
  }
}


function App() {
  const [page, setPage] = React.useState("login");

  return (
    <div>
      <Menu/>
    </div>
  );
}

export default App;