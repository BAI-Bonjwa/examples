import React, { useRef, useEffect }  from 'react';
import './WebGL.scss';
import * as THREE from 'three';
import { useQuery, gql } from '@apollo/client';
import { useParams } from "react-router-dom";
import { uniformsConverter } from '../../examples/webgl/utils';

const examples = require('../../examples/webgl');
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

  useEffect(() => {
    vertexShaderNode && vertexShaderNode.current && hljs.highlightBlock(vertexShaderNode.current);
    fragmentShaderNode && fragmentShaderNode.current && hljs.highlightBlock(fragmentShaderNode.current);
  })

  let { id } = useParams();
  const GET_WEBGL_EXAMPLE_BY_ID = gql`
    query WebglExample($id: ID!) {
      webglExample(id: $id) {
        id
        identifier
        name
        description
        publicPath
      }
    }
  `;

  const { loading, error, data } = useQuery(
    GET_WEBGL_EXAMPLE_BY_ID,
    { variables: { id }});

  let uniforms : any;
  let uniformsOutput : any;
  let example, vertexShader, fragmentShader;
  let material;
  if (data) {
    example = examples[data.webglExample.identifier];
    vertexShader = example.vertexShader;
    fragmentShader = example.fragmentShader;
    uniforms = example.uniforms;
    uniformsOutput = uniformsConverter(uniforms);
    material = new THREE.ShaderMaterial({
      uniforms, vertexShader, fragmentShader,
    });
  }

  let renderer: THREE.WebGLRenderer;
  let clock = new THREE.Clock();
  let fps = 0;
  let frameTime = 0;
  let time = 0;

  const animate = () => {
    const delta = clock.getDelta();

    time += delta;
    frameTime += (delta - frameTime) / 30;
    fps = 1 / frameTime;

    if (uniforms) {
      uniforms.iGlobalTime.value = time;
    }

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


  var obj = new THREE.Mesh( new THREE.PlaneGeometry(6, 3.6, 1, 1), material);
  scene.add(obj);

  camera.position.z = 2;

  return(
    <div className="webgl">
      <div className="column">
        <h2 className="white">WebGL Example: { data && data.webglExample.name }</h2>
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
          { loading && <span>Loading..</span> }
          { error && <span>Error..</span> }
          { data && data.webglExample.description }
        </p>
      </div>
      <div className="column">
        <h2 className="white">Uniforms</h2>
        <div className="yellow">
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {
                uniformsOutput && Object.keys(uniformsOutput).map((key) => {
                  return (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{uniformsOutput[key].type}</td>
                      <td>{uniformsOutput[key].value}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <h2 className="white">Vertex Shader</h2>
        <div className="yellow">
          <pre>
            <code className={'glsl'} ref={vertexShaderNode}>
              { vertexShader }
            </code>
          </pre>
        </div>
        <h2 className="white">Fragment Shader</h2>
        <div className="green">
          <pre>
            <code ref={fragmentShaderNode}>
              { fragmentShader }
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default WebGL;
