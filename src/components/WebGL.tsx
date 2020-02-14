import React, { Component, RefObject }  from 'react';
import './WebGL.scss';
import * as THREE from 'three';

import vertexShader from '../examples/webgl/2d-tunnel/vertexShader.vs';
import fragmentShader from '../examples/webgl/2d-tunnel/fragmentShader.fs';

const hljs = require('highlight.js/lib/highlight');
const glsl = require('highlight.js/lib/languages/glsl');
require('highlight.js/styles/hopscotch.css');
hljs.registerLanguage('glsl', glsl);
console.log(hljs);

class WebGL extends Component {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera;
  canvasRef: RefObject<HTMLCanvasElement>;
  vertexShaderNodeRef: RefObject<HTMLDivElement>;
  fragmentShaderNodeRef: RefObject<HTMLDivElement>;
  fpsNodeRef: RefObject<HTMLSpanElement>;

  constructor(props: any) {
    super(props);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      600 / 360,
      0.1,
      1000
    );
    this.canvasRef = React.createRef();
    this.vertexShaderNodeRef = React.createRef();
    this.fragmentShaderNodeRef = React.createRef();
    this.fpsNodeRef = React.createRef();
    this.renderer = null;
    this.state = {
      fps: 0
    }
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current });
      this.renderer.setSize(600, 360);
    } else {
      console.error('Cannot find canvas element');
    }

    this.highlight();

    const uniforms = {
      time: { value: 1.0 },
      iResolution: { value: new THREE.Vector2(600, 360) },
      iGlobalTime:    { type: 'f', value: 0.1 },
      iChannel0:  { type: 't', value: new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/webgl/2d-tunnel/1.jpg`) },
      iChannel1:  { type: 't', value: new THREE.TextureLoader().load(`${process.env.PUBLIC_URL}/webgl/2d-tunnel/2.jpg`) },
    }

    uniforms.iChannel0.value.wrapS = uniforms.iChannel0.value.wrapT = THREE.RepeatWrapping;
    uniforms.iChannel1.value.wrapS = uniforms.iChannel1.value.wrapT = THREE.RepeatWrapping;

    const material = new THREE.ShaderMaterial({
      uniforms, vertexShader, fragmentShader
    });

    var obj = new THREE.Mesh( new THREE.PlaneGeometry(6, 3.6, 1, 1), material);
    this.scene.add(obj);

    this.camera.position.z = 2;

    let clock = new THREE.Clock();
    let fps = 0;
    let frameTime = 0;

    const animate = () => {
      const delta = clock.getDelta();
      uniforms.iGlobalTime.value += delta;

      frameTime += (delta - frameTime) / 30;
      fps = 1 / frameTime;

      if (this.renderer) this.renderer.render( this.scene, this.camera );
      requestAnimationFrame( animate );
    }
    animate();

    setInterval(() => {
      this.fpsNodeRef &&
      this.fpsNodeRef.current &&
      (this.fpsNodeRef.current.innerHTML = `FPS: ${fps.toFixed(1)}`);
    }, 1000)
  }

  componentDidUpdate() {
    this.highlight()
  }

  highlight = () => {
    this.vertexShaderNodeRef && this.vertexShaderNodeRef.current && hljs.highlightBlock(this.vertexShaderNodeRef.current);
    this.fragmentShaderNodeRef && this.fragmentShaderNodeRef.current && hljs.highlightBlock(this.fragmentShaderNodeRef.current);
  }

  render() {
    // const { fps } = this.state;
    return (
      <div className="webgl">
        <div className="column">
          <canvas ref={this.canvasRef}></canvas>
          <div className="playerbar">
            <span>Time: 10s</span>
            &nbsp;&nbsp;
            <span ref={this.fpsNodeRef}>FPS: 0</span>
            &nbsp;&nbsp;
            <span>Size: 640x360</span>
          </div>
          <h2 className="brightgreen">2D Tunnel</h2>
          <p className="white description">
            Simple 2D tunnel with crossfading between two textures
          </p>
        </div>
        <div className="column">
          <h2 className="white">Vertex Shader</h2>
          <div className="yellow">
            <pre>
              <code className={'glsl'} ref={this.vertexShaderNodeRef}>
                { vertexShader }
              </code>
            </pre>
          </div>
          <h2 className="white">Fragment Shader</h2>
          <div className="green">
            <pre>
              <code ref={this.fragmentShaderNodeRef}>
                { fragmentShader }
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }
}

export default WebGL;
