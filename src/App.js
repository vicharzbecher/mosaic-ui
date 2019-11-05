import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Viewer from "./Viewer";
import Editor from "./Editor";
import New from "./New";
import FormList from "./FormList";
import "./styles.scss";
import "./App.css";



function App() {
  return (
    <Router>
      <nav className="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-0">
        <Link to="/" className="navbar-brand col-sm-3 col-md-2 mr-0">
          Mosaic Form Builder
        </Link>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/" className="nav-link active">
                    <span data-feather="home"></span>
                    Forms
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            <Switch>
              <Route path="/editor/:formId" component={Editor} />
              <Route path="/viewer/:formId" component={Viewer} />
              <Route path="/new" component={New} />
              <Route path="/" component={FormList} />
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
