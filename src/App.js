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
      <h1 style={{margin: 'auto', width: 400}}>Mosaic Form Builder</h1>
      <hr/>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/"><i className="fa fa-home"></i>&nbsp;Home</Link>
            </li>
            <li>
              <Link to="/add"><i className="fa fa-plus-square"></i>&nbsp;New Form</Link>
            </li>
            <li>
              <Link to="/explorer"><i className="fa fa-search"></i>&nbsp;Explorer</Link>
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
          
          <Route path="/viewer/:formId" component={Viewer} />

          <Route path="/explorer" component={Explorer} />

          <Route path="/" >
            <New />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
