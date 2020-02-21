const uniformsConverter = (uniforms) => {
  const results = {};
  Object.keys(uniforms).forEach((key) => {
    if (key.startsWith('iChannel')) {
      results[key] = {
        type: 'sampler2D',
        value: uniforms[key].value.image.src,
      }
    } else if (key === 'iResolution') {
      const [x, y] = uniforms[key].value;
      results[key] = {
        type: 'vec2',
        value: `[${x}, ${y}]`
      } 
    } else {
      results[key] = {
        ...uniforms[key],
        type: 'float',
      }
    }
  });
  return results;
}

export { uniformsConverter };