// function: compileUnsafe
function compileUnsafe(selector, options2, context6) {
  let token = typeof selector === "string" ? parse15(selector) : selector;
  return compileToken(token, options2, context6);
}
