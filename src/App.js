import React from 'react';
import Viewer from './Viewer';
import Editor from './Editor';
import Explorer from './Explorer';
import New from './New';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import './styles.scss'
import './App.css';




function App() {
  return (


    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/"><i className="fa fa-cubes"></i>&nbsp;Mosaic Form Builder</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/explorer"><i className="fa fa-home"></i>&nbsp;Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/add"><i className="fa fa-plus-square"></i>&nbsp;New Form</Link>
            </li>
          </ul>

        </div>
      </nav>
      <div className="container-fluid">

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/editor/:formId" component={Editor} />

          <Route path="/viewer/:formId" component={Viewer} />

          <Route path="/explorer" component={Explorer} />

          <Route path="/add" component={New} />

          <Route path="/" >
            <Explorer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
