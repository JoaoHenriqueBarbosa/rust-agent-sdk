// function: createDomStream
function createDomStream(callback, options2, elementCallback) {
  let handler = new DomHandler(callback, options2, elementCallback);
  return new Parser2(handler, options2);
}
