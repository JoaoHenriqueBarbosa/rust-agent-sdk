// function: wrapCompile
function wrapCompile(func) {
  return function(selector, options2, context6) {
    let opts = convertOptionFormats(options2);
    return func(selector, opts, context6);
  };
}
