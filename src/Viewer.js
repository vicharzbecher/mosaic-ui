import React from 'react';
import {Form} from 'react-formio';
import {useParams} from 'react-router-dom';

function Viewer() {
    const {formId} = useParams();
    const url = `http://ec2-3-89-92-22.compute-1.amazonaws.com/forms/${formId}`;
    console.log(url);
  return (
    <div className="Editor">

      <header className="App-header">
        Form render example
      </header>
      <div className="panel panel-default" style={{maxWidth: 500, margin: "auto"}}>
        <Form src={url} 
            onChange={(submission)=>{console.log(submission)}} 
            beforeSubmit={(submission, next)=>{console.log(submission)}}/>
      </div>
    </div>
  );
}

export default Viewer;
