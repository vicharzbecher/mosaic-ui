import React from 'react';
import {Form} from 'react-formio';
import axios from 'axios';

class Viewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {form: '', loading: true};
    }

    async componentDidMount() {
        
        const formId = this.props.match.params.formId;
        const url = `http://ec2-3-89-92-22.compute-1.amazonaws.com/forms/${formId}`;
        const result = await axios.get(url);
        console.log(result.data);
        this.setState({form: result.data, loading: false, message: ''});
      }

    render() {
        const {form, loading} = this.state;
        if(loading) return (
            <div className="alert alert-success">Loading, please wait a little<br/> If it is taking to much? try <a href=".">reloading</a> this page</div>
        );

        return (
            <div className="Editor">
        
              <header className="App-header">
                {form.name}
              </header>
              <div className="panel panel-default" style={{maxWidth: 500, margin: "auto"}}>
                <Form form={form} 
                    onChange={(submission)=>{console.log(submission)}} 
                    beforeSubmit={(submission, next)=>{console.log(submission)}}
                    onRender={(data)=>{console.log('THis is on render', data)}}
                    />
              </div>
            </div>
          )
    }
  
}
export default Viewer;
