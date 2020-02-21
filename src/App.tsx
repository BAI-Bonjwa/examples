import React from 'react';
import './App.scss';
import WebGL from './components/webgl/WebGL';
import WebGLExamples from './components/webgl/WebGLExamples';
import CSSList from './components/css/CSSList';
import GameList from './components/games/GameList';
import Main from './components/Main';

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
          <h1 className="header">
            <Link to="/">Examples</Link>
          </h1>

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

          <ul className="end">
            <li>
              <a href="https://baibonjwa.com">Home</a>
            </li>
          </ul>

        </nav>

        <Switch>
          <Route path="/webgl/:id">
            <WebGL />
          </Route>
          <Route path="/webgl" component={WebGLExamples} />
          <Route path="/css">
            <CSSList />
          </Route>
          <Route path="/games">
            <GameList />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>

      </div>
    </Router>
  );
}

export default App;
