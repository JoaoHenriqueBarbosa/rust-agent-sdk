// function: getStreamAsString
async function getStreamAsString(stream, options) {
  return getStreamContents(stream, stringMethods, options);
}
