// function: parseDocument
function parseDocument(data, options2) {
  let handler = new DomHandler(void 0, options2);
  return new Parser2(handler, options2).end(data), handler.root;
}
