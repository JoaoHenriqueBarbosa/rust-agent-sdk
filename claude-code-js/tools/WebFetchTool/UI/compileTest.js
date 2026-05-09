// function: compileTest
function compileTest(options2) {
  let funcs = Object.keys(options2).map((key2) => {
    let value = options2[key2];
    return Object.prototype.hasOwnProperty.call(Checks, key2) ? Checks[key2](value) : getAttribCheck(key2, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
