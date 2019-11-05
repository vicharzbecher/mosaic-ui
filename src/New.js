import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FormEdit } from "react-formio";
import axios from "axios";
import { get } from "lodash";

function New() {
  const [message, setMessage] = useState("");
  const env = process.env;
  const API_URL = get(env, "REACT_APP_API_URL", "http://localhost:8080");

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2">Create Form</h1>
      </div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Forms</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create
          </li>
        </ol>
      </nav>

      <div className="panel panel-default">
        {message && message !== "" && (
          <div className="alert alert-success" role="alert">
            {message}
          </div>
        )}

        <FormEdit
          form={{ display: "form" }}
          saveText="Save Form"
          saveForm={form => {
            axios.post(`${API_URL}/forms/`, form).then(response => {
              setMessage(`${response.data.message} ID: ${response.data.id}`);
            });
          }}
        />
      </div>
    </React.Fragment>
  );
}

export default New;
