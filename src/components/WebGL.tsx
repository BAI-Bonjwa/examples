import React, { Component, RefObject }  from 'react';
import * as THREE from 'three';

import vertexShader from '../examples/webgl/2d-tunnel/vertexShader.vs';
import fragmentShader from '../examples/webgl/2d-tunnel/fragmentShader.fs';

class WebGL extends Component {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera;
  canvasRef: RefObject<HTMLCanvasElement>;

  constructor(props :any) {
    super(props);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      600 / 360,
      0.1,
      1000
    );
    this.canvasRef = React.createRef();
    this.renderer = null;
  }

  componentDidMount() {
    if (this.canvasRef.current) {
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current });
      this.renderer.setSize(600, 360);
    } else {
      console.error('Cannot find canvas element');
    }

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
      uniforms,
      vertexShader,
      fragmentShader,
    });

    var obj = new THREE.Mesh( new THREE.PlaneGeometry(6, 3.6, 1, 1), material);
    this.scene.add(obj);

    this.camera.position.z = 2;

    let clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame( animate );

      uniforms.iGlobalTime.value += clock.getDelta();

      if (this.renderer) this.renderer.render( this.scene, this.camera );
    }
    animate();

  }

  render() {
    return (
      <div className="webgl">
        <canvas ref={this.canvasRef}></canvas>
      </div>
    );
  }
}

export default WebGL;
