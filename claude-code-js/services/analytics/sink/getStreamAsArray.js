// function: getStreamAsArray
async function getStreamAsArray(stream, options) {
  return getStreamContents(stream, arrayMethods, options);
}
