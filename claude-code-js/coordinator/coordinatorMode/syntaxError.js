// function: syntaxError
function syntaxError(message) {
  let DomException = globalThis.DOMException;
  return typeof DomException == "function" ? new DomException(message, "SyntaxError") : SyntaxError(message);
}
