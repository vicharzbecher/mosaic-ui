import React from 'react';
import {FormEdit} from 'react-formio';
import axios from 'axios';


class Editor extends React.Component {

  

  constructor(props) {
    super(props);
    this.state = {form: '', loading: true, message: ''};
    this.message = 'Saved';
    this.saveButtonText = React.createRef();
  }

  async componentDidMount() {
    console.log(this.props);
    const formId = this.props.match.params.formId;
    const url = `http://ec2-3-89-92-22.compute-1.amazonaws.com/forms/${formId}`;
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
            ref={this.saveButtonText}
            //onChange={(schema) => {console.log("Changed"); console.log(JSON.stringify(schema));}}
            saveForm={(form) => {
              axios.post('http://ec2-3-89-92-22.compute-1.amazonaws.com/forms/update', form).then((response)=>{
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
