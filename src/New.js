import React, {useState} from 'react';
import {FormEdit} from 'react-formio';
import axios from 'axios';
import {get} from 'lodash';

function New() {

  const [message, setMessage] = useState('');
  const env = process.env;
  const API_URL = get(env, 'REACT_APP_API_URL', 'http://localhost:8080');

  return (
    <div className="App">
      <h2 className="">{message}</h2>
      <header className="App-header">
        Form Editor
      </header>
      <div className="panel panel-default">
        <FormEdit  form={{display: 'form'}}
          saveText="Save form"
          //onChange={(schema) => {console.log("Changed"); console.log(JSON.stringify(schema));}}
          saveForm={(form) => {
            axios.post(`${API_URL}forms/`, form).then((response)=>{console.log(response);
              setMessage(`${response.data.message} ID: ${response.data.id}`);
            })
          }}
          ></FormEdit>
      </div>
    </div>
  );
}

export default New;
