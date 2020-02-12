import React from 'react';
import './App.scss';

const App = () => {
  return (
    <div className="App">
      <nav className="nav">
        <h1 className="header brightgreen">Examples</h1>

        <ul className="links">
          <li><a href="/webgl">WebGL</a></li>
          <li><a href="/css">CSS</a></li>
          <li><a href="/games">Games</a></li>
        </ul>

      </nav>
    </div>
  );
}

export default App;
