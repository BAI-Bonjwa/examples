import { stripIndent } from 'common-tags';

const fs = stripIndent`
  uniform float iGlobalTime;
  uniform vec2 iResolution;
  uniform sampler2D iChannel0;
  uniform sampler2D iChannel1;

  void main(void) {
    vec2 p = gl_FragCoord.xy / iResolution.y - .5;
    gl_FragColor.w = length(p);
    gl_FragColor = texture2D(iChannel0, vec2(atan(p.y, p.x), .2 / gl_FragColor.w) + iGlobalTime) * gl_FragColor.w;
  }
`;

export default fs;
