// function: createDocumentStream
function createDocumentStream(callback, options2, elementCallback) {
  let handler = new DomHandler((error44) => callback(error44, handler.root), options2, elementCallback);
  return new Parser2(handler, options2);
}
