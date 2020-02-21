import * as THREE from 'three';
import _ from 'lodash';

const uniforms = {
  time: { value: 1.0 },
  iResolution: { value: [600, 360] },
  iGlobalTime: { type: 'f', value: 0.1 },
  iChannel0:  { type: 't', value: null },
  iChannel1:  { type: 't', value: null },
}

export default uniforms;