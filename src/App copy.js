import React from 'react';
//import logo from './logo.svg';
import {Form} from 'react-formio';
import './styles.scss'
import './App.css';
require('dotenv').config();

function App() {
  return (
    <div className="App">

      <header className="App-header">
        Form render example (source: form.io)
      </header>
      <br/>
      <br/>
      <div className="panel panel-default"  style={{width: 300, margin: 'auto'}}>
        <div className="panel-heding">
          <div className="panel-title">
            CNS test Form
          </div>
        </div>
        
        <Form src="https://osnodsjcwhrwjsk.form.io/cns"></Form>
      </div>
    </div>
  );
}

export default App;
