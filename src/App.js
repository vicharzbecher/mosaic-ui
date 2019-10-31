import React from 'react';
import Viewer from './Viewer';
import Editor from './Editor';
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
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">New Form</Link>
            </li>
            <li>
              <Link to="/editor/1">Editor</Link>
            </li>
            <li>
              <Link to="/viewer/1">Viewer</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/editor/:formId" component={Editor} />
          
          <Route path="/viewer/:formId">
            <Viewer />
          </Route>
          <Route path="/" >
            <New />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
