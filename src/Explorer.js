import React from 'react';
import { FormGrid } from 'react-formio';
import axios from 'axios';
import { get } from 'lodash';
import Loader from './Loader';

class Explorer extends React.Component {



  constructor(props) {
    super(props);
    this.state = { forms: {}, loading: true };
    this.env = process.env;
    this.API_URL = get(this.env, 'REACT_APP_API_URL', 'http://localhost:8080');
  }

  async componentDidMount() {
    console.log(this.props);
    //const formId = this.props.match.params.formId;
    const url = `${this.API_URL}/forms`;
    const result = await axios.get(url);
    console.log('Result', result.data);
    this.setState({ forms: result.data, loading: false });
  }
  ß

  render() {

    const { forms, loading } = this.state;

    if (loading) return <Loader />

    console.log('forms', forms.data);
    const gridConfig = {
      forms: forms.data,
      pagination: {
        page: 0
      }
    }

    const columns = [{
      key: '_id',
      width: 8
    }, {
      key: 'title',
      sort: true,
      title: 'Form',
      width: 8
    }, {
      key: 'operations',
      title: 'Operations',
      width: 4
    }];

    const operations = [{
      action: 'view',
      buttonType: 'primary',
      icon: 'pencil',
      permissionsResolver: function permissionsResolver() {
        return true;
      },

      title: 'Enter Data'
    }, {
      action: 'edit',
      buttonType: 'secondary',
      icon: 'edit',
      permissionsResolver: function permissionsResolver() {
        return true;
      },

      title: 'Edit Form'
    }, {
      action: 'delete',
      buttonType: 'danger',
      icon: 'trash',
      permissionsResolver: function permissionsResolver() {
        return true;
      }
    }];
    console.log('Config', gridConfig);

    return (

      <div className="row">
        <div className="col">
          <FormGrid forms={gridConfig} onAction={(event, action) => {
            this.handleAction(action, event);
            console.log(event, action)
          }}
            columns={columns}
            operations={operations}
          ></FormGrid>
        </div>
      </div>
    );
  }

  async handleAction(action, event) {
    const id = get(event, '_id', '');
    switch (action) {
      case 'view':
        window.open(`./viewer/${id}`);
        break;
      case 'edit':
        window.open(`./editor/${id}`)
        break;
      default:
        axios.post(`${this.API_URL}/forms/delete`, { _id: id }).then(() => {
          window.location.reload();
        })
        return;
    }
  }




}

export default Explorer;
