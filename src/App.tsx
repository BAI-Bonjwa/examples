import React from 'react';
import './App.scss';
import WebGL from './components/WebGL';
import CSS from './components/CSS';
import Games from './components/Games';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <nav className="nav">
          <h1 className="header brightgreen">Examples</h1>

          <ul className="links">
            {/* <li><a href="home">Home</a></li> */}
            <li>
              <Link to="/webgl">WebGL</Link>
            </li>
            <li>
              <Link to="/css">CSS</Link>
            </li>
            <li>
              <Link to="/games">Games</Link>
            </li>
          </ul>

        </nav>

        <Switch>
          <Route path="/webgl">
            <WebGL />
          </Route>
          <Route path="/css">
            <CSS />
          </Route>
          <Route path="/games">
            <Games />
          </Route>
        </Switch>

      </div>
    </Router>
  );
}

export default App;
