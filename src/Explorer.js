import React from 'react';
import {FormGrid} from 'react-formio';
import axios from 'axios';
import {get} from 'lodash';

class Explorer extends React.Component {

  

  constructor(props) {
    super(props);
    this.state = {forms: {}, loading: true};
    this.env = process.env;
    this.API_URL = get(this.env, 'REACT_APP_API_URL', 'http://localhost:8080');
  }

  async componentDidMount() {
    console.log(this.props);
    //const formId = this.props.match.params.formId;
    const url = `${this.API_URL}forms`;
    const result = await axios.get(url);
    console.log(result.data);
    this.setState({forms: result.data, loading: false});
  }
ß

  render() {
    
    const {forms, loading} = this.state;
    
    if(loading) return (
      <div className="alert alert-success">Loading, please wait a little<br/> If it is taking to much? try <a href=".">reloading</a> this page</div>
    );
    
    return (
      
      <div className="App">

  
        <header className="App-header">
        
        </header>

        <div className="panel panel-default">
          <FormGrid forms={forms}></FormGrid>
        </div>
      </div>
    );
  }

  

  
}

export default Explorer;
