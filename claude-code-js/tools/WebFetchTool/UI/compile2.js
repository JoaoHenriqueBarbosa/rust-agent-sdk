// function: compile2
function compile2(selector, options2, context6) {
  let next = compileUnsafe(selector, options2, context6);
  return ensureIsTag(next, options2.adapter);
}
