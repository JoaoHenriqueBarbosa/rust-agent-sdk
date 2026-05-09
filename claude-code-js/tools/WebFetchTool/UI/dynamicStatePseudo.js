// function: dynamicStatePseudo
function dynamicStatePseudo(name3) {
  return function(next, _rule, { adapter: adapter2 }) {
    let func = adapter2[name3];
    if (typeof func !== "function")
      return import_boolbase3.default.falseFunc;
    return function(elem) {
      return func(elem) && next(elem);
    };
  };
}
