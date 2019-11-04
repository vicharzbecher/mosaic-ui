import React from 'react';
import {FormEdit} from 'react-formio';
import axios from 'axios';
import {get} from 'lodash';


class Editor extends React.Component {

  

  constructor(props) {
    super(props);
    this.env = process.env;
    this.API_URL = get(this.env, 'REACT_APP_API_URL', 'http://localhost:8080');
    console.log(this.API_URL);
    this.state = {form: '', loading: true, message: ''};
  }

  async componentDidMount() {
    
    const formId = this.props.match.params.formId;
    const url = `${this.API_URL}/forms/${formId}`;
    const result = await axios.get(url);
    console.log(result.data);
    this.setState({form: result.data, loading: false, message: ''});
  }


  render() {
    const {form, loading, message} = this.state;
    
    if(loading) return (
      <div className="alert alert-success">Loading, please wait a little<br/> If it is taking to much? try <a href=".">reloading</a> this page</div>
    );
    
    return (
      
      <div className="App">

        <h2 className="">{message}</h2>
  
        <header className="App-header">
        {form.name}
        </header>

        <div className="panel panel-default">
          <FormEdit  form={form}
            saveText="Save form"
            //onChange={(schema) => {console.log("Changed"); console.log(JSON.stringify(schema));}}
            saveForm={(form) => {
              axios.post(`${this.API_URL}forms/update`, form).then((response)=>{
                this.setState({message: `Form successfully saved: ${form._id}`});
                setTimeout(() => {
                  this.setState({message: ''});
                }, 2000);
                console.log(form); 
                this.message = 'saved';
              })
                
            }}
            ></FormEdit>
        </div>
      </div>
    );
  }

  

  
}

export default Editor;
