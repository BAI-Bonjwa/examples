import React, { useEffect, useRef }  from 'react';
import './WebGL.scss';
import * as THREE from 'three';
import * as examples from '../../examples/webgl';

import { useQuery, gql } from '@apollo/client';


const hljs = require('highlight.js/lib/highlight');
const glsl = require('highlight.js/lib/languages/glsl');
require('highlight.js/styles/codepen-embed.css');
hljs.registerLanguage('glsl', glsl);

const WebGL = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    600 / 360,
    0.1,
    1000
  );
  const canvasNode = useRef<HTMLCanvasElement>(null);
  const fpsNode = useRef<HTMLSpanElement>(null);
  const timeNode = useRef<HTMLSpanElement>(null);
  const vertexShaderNode = useRef<HTMLDivElement>(null);
  const fragmentShaderNode = useRef<HTMLDivElement>(null);

  const GET_USER_INFO = gql`
    {
      users(last: null) {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_USER_INFO);

  const uniforms = {
    time: { value: 1.0 },
    iResolution: { value: new THREE.Vector2(600, 360) },
    iGlobalTime:    { type: 'f', value: 0.1 },
    // iChannel0:  { type: 't', value: new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/webgl/2d-tunnel/1.jpg`) },
    iChannel0:  { type: 't', value: new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/webgl/one-tweet-tunnel/1.jpg`) },
    iChannel1:  { type: 't', value: new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/webgl/2d-tunnel/2.jpg`) },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: examples.oneTweetTunnel.vertexShader,
    fragmentShader: examples.oneTweetTunnel.fragmentShader,
  });

  uniforms.iChannel0.value.wrapS = uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
  uniforms.iChannel1.value.wrapS = uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;


  let renderer: THREE.WebGLRenderer;
  let clock = new THREE.Clock();
  let fps = 0;
  let frameTime = 0;
  let time = 0;
  const animate = () => {
    const delta = clock.getDelta();
    uniforms.iGlobalTime.value += delta;

    time += delta;
    frameTime += (delta - frameTime) / 30;
    fps = 1 / frameTime;

    if (renderer) renderer.render(scene, camera);
    requestAnimationFrame( animate );
  }

  animate();

  setInterval(() => {
    fpsNode &&
    fpsNode.current &&
    (fpsNode.current.innerHTML = `FPS: ${fps.toFixed(1)}`);
  }, 1000)

  setInterval(() => {
    timeNode &&
    timeNode.current &&
    (timeNode.current.innerHTML = `Time: ${time.toFixed(2)}s`);
  }, 60)

  if (canvasNode !== null && canvasNode.current) {
    renderer = new THREE.WebGLRenderer({ canvas: canvasNode.current });
    if (renderer) renderer.setSize(600, 360);
  }

  vertexShaderNode && vertexShaderNode.current && hljs.highlightBlock(vertexShaderNode.current);
  fragmentShaderNode && fragmentShaderNode.current && hljs.highlightBlock(fragmentShaderNode.current);

  var obj = new THREE.Mesh( new THREE.PlaneGeometry(6, 3.6, 1, 1), material);
  scene.add(obj);

  camera.position.z = 2;

  return(
    <div className="webgl">
      <div className="column">
        <h2 className="white">WebGL Example: 2D Tunnel</h2>
        <canvas ref={canvasNode}></canvas>
        <div className="playerbar">
          <span ref={timeNode}>Time: 10s</span>
          &nbsp;&nbsp;
          <span ref={fpsNode}>FPS: 0</span>
          &nbsp;&nbsp;
          <span>Size: 640x360</span>
        </div>
        <h2 className="white">Description</h2>
        <p className="white description">
          Simple 2D tunnel with crossfading between two textures
        </p>
        { loading &&  <p>Loading...</p> }
        { error &&  <p>Error...</p> }
        { data && data.users.map(({ id, name } : { id: any, name: any }) => (
            <div key={id}>
              <p>
                {id}: {name}
              </p>
            </div>)
          )
        }
      </div>
      <div className="column">
        <h2 className="white">Vertex Shader</h2>
        <div className="yellow">
          <pre>
            <code className={'glsl'} ref={vertexShaderNode}>
              { examples.tunnel.vertexShader }
            </code>
          </pre>
        </div>
        <h2 className="white">Fragment Shader</h2>
        <div className="green">
          <pre>
            <code ref={fragmentShaderNode}>
              { examples.tunnel.fragmentShader }
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default WebGL;
