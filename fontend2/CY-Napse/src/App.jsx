import React from "react";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Register, Login } from "./Form.jsx";
import './App.css'








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
      <nav>
        <ul>
          <li> <button onClick={()=>{this.handleClick("main")}} className="bg-blue-900 hover:bg-green-600 text-white px-4 py-2 rounded display:None" >Main</button> </li>
          <li> <button onClick={()=>{this.handleClick("login")}} className="bg-blue-900 hover:bg-green-600 text-white px-4 py-2 rounded">Login</button> </li>
          <li> <button onClick={()=>{this.handleClick("register")}} className="bg-blue-900 hover:bg-green-600 text-white px-4 py-2 rounded">Register</button> </li>
        </ul>
      </nav>
      {x}
    </div>

    );
  }
}




class Admin extends React.Component{
  constructor(props) {
  super(props);
  liste.array=[];
  }

  render(liste){
    let tableLine;
     for (let index = 0; index < liste.array.length; index++) {
          tableLine+= <div><p>{liste.array[index]}</p></div>;
        }
    return (
      tableLine
    );
  }
}


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Cy Napse</p>
      <Menu className="align:right"/>
      <p className="bg-green-500">admin</p>
      <Admin array={["15","2"]}/>
    </div>
    
  )
}

export default App
