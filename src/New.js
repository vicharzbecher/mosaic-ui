import React from 'react';
import {FormEdit} from 'react-formio';
import axios from 'axios';

function New() {
  return (
    <div className="App">

      <header className="App-header">
        Form Editor
      </header>
      <div className="panel panel-default">
        <FormEdit  form={{display: 'form'}}
          saveText="Save form"
          //onChange={(schema) => {console.log("Changed"); console.log(JSON.stringify(schema));}}
          saveForm={(form) => {
            axios.post('http://ec2-3-89-92-22.compute-1.amazonaws.com/forms/', form).then((response)=>{console.log(response);
            alert('Form saved');})
          }}
          ></FormEdit>
      </div>
    </div>
  );
}

export default New;
