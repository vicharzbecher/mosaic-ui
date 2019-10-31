import React from 'react';
import {FormEdit} from 'react-formio';
import axios from 'axios';


class Editor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {form: '', loading: true};
    this.saveButtonText = React.createRef();
  }

  async componentDidMount() {
    console.log(this.props);
    const formId = this.props.match.params.formId;
    const url = `http://localhost:8080/forms/${formId}`;
    const result = await axios.get(url);
    console.log(result.data);
    this.setState({form: result.data, loading: false});
  }


  render() {
    const {form, loading} = this.state;
    
    if(loading) return 'loading';
    
    return (
      <div className="Editor">
  
        <header className="App-header">
          Form Editor
        </header>

        <div>Saved</div>

        <div className="panel panel-default">
          <FormEdit  form={form}
            saveText="Save form"
            ref={this.saveButtonText}
            //onChange={(schema) => {console.log("Changed"); console.log(JSON.stringify(schema));}}
            saveForm={(form) => {
              axios.post('http://localhost:8080/forms/update', form).then((response)=>{console.log(response); })
            }}
            ></FormEdit>
        </div>
      </div>
    );
  }

  

  
}

export default Editor;
