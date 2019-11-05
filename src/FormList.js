import React from "react";
import { Link } from "react-router-dom";
import { FormGrid } from "react-formio";
import axios from "axios";
import { get } from "lodash";

class FormList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { forms: {}, loading: true };
    this.env = process.env;
    this.API_URL = get(this.env, "REACT_APP_API_URL", "http://localhost:8080");
  }

  async componentDidMount() {
    const url = `${this.API_URL}/forms`;
    const result = await axios.get(url);
    this.setState({ forms: result.data, loading: false });
  }

  handleAction(action, event) {
    const id = get(event, "_id", "");
    switch (action) {
      case "view":
        window.open(`./viewer/${id}`);
        break;
      case "editor":
        window.open(`./editor/${id}`);
        break;
      default:
        return;
    }
  }

  render() {
    const { forms, loading } = this.state;

    if (loading) {
      return (
        <div className="alert alert-success">
          Loading, please wait a little
          <br /> If it is taking to much? try <a href=".">reloading</a> this
          page
        </div>
      );
    }

    const gridConfig = {
      forms: forms.data,
      pagination: {
        page: 0
      }
    };

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

    return (
      <React.Fragment>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">Forms</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <Link to="/new" className="btn btn-primary">
              Create Form
            </Link>
          </div>
        </div>
        <div className="panel panel-default">
          <FormGrid
            forms={gridConfig}
            onAction={(event, action) => this.handleAction(action, event)}
            columns={columns}
            operations={operations}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default FormList;
