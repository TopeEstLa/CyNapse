/*class Form extends React.Component {
    constructor(props) {
    super(props);
    //this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this); 
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    alert('Le nom a été soumis : ' + this.state.value);     //changer cette ligne
    event.preventDefault();
  }
}*/

import React from "react";

class Register extends React.Component{
  constructor(props) {
  super(props);
  this.state = {
    pseudonyme: '',
    nom : '',
    prenom : '',
    password : ''
    };
  }

  handleChange(event){
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    alert('Le nom a été soumis : ' + JSON.stringify(this.state));     //changer cette ligne
    event.preventDefault();
  }
  render(){
    return(
      <div>
        <h1>Register</h1>
        <fieldset>
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr> 
                  <td> <label> Pseudonyme :</label> </td>
                  <td> <input type="text" placeholder="Entrez votre pseudonyme" name="pseudonyme" onChange={this.handleChange} value={this.state.pseudonyme}/> </td> 
                </tr>
                <tr> 
                  <td> <label> Nom : </label> </td>
                  <td> <input type="text" placeholder="Entrez votre nom" name="nom" onChange={this.handleChange} value={this.state.nom}/> </td> 
                </tr>
                <tr> 
                  <td> <label> Prénom : </label> </td> 
                  <td> <input type="text" placeholder="Entrez votre prénom" name="prenom" onChange={this.handleChange} value={this.state.prenom}/> </td> 
                </tr>
                <tr>
                  <td> <label>Sexe : </label> </td>
                  <td>
                    <input type="radio" id="H" name="ChoseSexe" value="Homme"/>
                    <label htmlFor="H">Homme</label>
                    <input type="radio" id="F" name="ChoseSexe" value="Femme"/>
                    <label htmlFor="F">Femme</label>
                    <input type="radio" id="O" name="ChoseSexe" value="Autre"/>
                    <label htmlFor="O">Autre</label>
                  </td>
                </tr>
                <tr> 
                  <td> <label> Date de naissance : </label> </td> 
                  <td> <input type="date" /> </td> 
                </tr>
                <tr> 
                  <td> <label> Mot de passe : </label> </td>
                  <td> <input type="password" placeholder="MotDePasse" name="password" onChange={this.handleChange} value={this.state.password}/> </td>
                </tr>
                <tr>
                  <td colSpan={3}> <input type="submit" value="Envoyer" /> </td> 
                </tr>
              </tbody>
            </table>
          </form>
        </fieldset>
      </div>
    );
  }
}

class Login extends React.Component{
  constructor(props) {
  super(props);
  this.state = {
    pseudonyme: '',
    password : ''
    };
  }

  handleChange = (event)=> {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (event)=> {
    alert('Le nom a été soumis : ' + JSON.stringify(this.state));     //changer cette ligne
    event.preventDefault();
  }
  render(){
    return(
      <div>
        <h1>Login</h1>
        <fieldset>
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <tr> 
                  <td> <label> Pseudonyme : </label></td>
                  <td> <input type="text" placeholder="Entrez votre pseudonyme" name="pseudonyme" onChange={this.handleChange} value={this.state.pseudonyme }/> </td> 
                </tr>
                <tr> 
                  <td> <label> Mot de passe : </label> </td>
                  <td> <input type="password" placeholder="MotDePasse" name="password" onChange={this.handleChange} value={this.state.password}/> </td>
                </tr>
                <tr> 
                  <td colSpan={3}> <input type="submit" value="Envoyer" /> </td> 
                </tr>
              </tbody>
            </table>
          </form>
        </fieldset>
      </div>
    );
  }
}

export { Register, Login };