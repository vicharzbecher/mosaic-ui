import React from 'react';
import { FormEdit } from 'react-formio';
import axios from 'axios';
import { get } from 'lodash';
import Loader from './Loader';


class Editor extends React.Component {



  constructor(props) {
    super(props);
    this.env = process.env;
    this.API_URL = get(this.env, 'REACT_APP_API_URL', 'http://localhost:8080');
    console.log(this.API_URL);
    this.state = { form: '', loading: true, message: '', modified: false };
  }

  async componentDidMount() {
    await this.getData();
  }

  async getData() {
    const formId = this.props.match.params.formId;
    const url = `${this.API_URL}/forms/${formId}`;
    const result = await axios.get(url);
    console.log(result.data);
    this.setState({ form: result.data, loading: false, message: '', modified: false });
  }


  render() {
    const { form, loading, message, modified } = this.state;

    if (loading) return <Loader />;
    form.onChange = (event) => { console.log('event', event) };
    return (

      <div className="container-fluid">
        <div className="row">


          <div className="col">
            <div className={`float-md-right ${(!message) ? 'hidden' : ''}`}>
              <div className="alert alert-success">{message}</div>
            </div>

            <h1 className="my-4">
              {form.name}
              {(modified) ? <small>(edition mode)</small> : ''}
            </h1>

            <hr />

            <div className="panel panel-default">
              <FormEdit form={form}
                saveText="Save form"
                saveForm={(form) => {
                  axios.post(`${this.API_URL}/forms/update`, form).then((response) => {
                    this.getData().then(() => {
                      this.setState({ message: `Form successfully saved, ID: ${form._id}` });
                    })

                    setTimeout(() => {
                      this.setState({ message: '' });
                    }, 2000);
                    console.log(form);
                    this.message = 'saved';
                  })

                }}
              ></FormEdit>
            </div>
          </div>
        </div>
      </div >
    );
  }




}

export default Editor;
