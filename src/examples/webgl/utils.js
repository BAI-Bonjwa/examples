const uniformsConverter = (uniforms) => {
  const results = {};
  Object.keys(uniforms).forEach((key) => {
    if (key.startsWith('iChannel')) {
      // console.log(uniforms[key])
      results[key] = {
        type: 'Texture',
        value: uniforms[key].value.image.src,
      } 
      // console.log(uniforms[key].value.image.src)
    } else {
      results[key] = uniforms[key];
    }
  });
  return results;
}

export { uniformsConverter };