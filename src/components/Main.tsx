import React from 'react';
import WebGLExamples from './webgl/WebGLExamples';
import CSSList from './css/CSSList';
import GameList from './games/GameList';


const Main = () => {
  return (
    <React.Fragment>
      <WebGLExamples />
      <CSSList />
      <GameList />
    </React.Fragment>
  );
}

export default Main;
