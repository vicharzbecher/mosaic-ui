import React from 'react';
//import logo from './logo.svg';
import {Form} from 'react-formio';
import './App.css';
require('dotenv').config();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Form render example
      </header>
      <div className="panel panel-default">
        <div className="panel-heding">
          <div className="panel-title">
            Form
          </div>
        </div>
        <Form src="https://osnodsjcwhrwjsk.form.io/dropdown"></Form>
      </div>
    </div>
  );
}

export default App;
