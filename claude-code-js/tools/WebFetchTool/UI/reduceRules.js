// function: reduceRules
function reduceRules(a2, b) {
  if (b === import_boolbase5.default.falseFunc || a2 === import_boolbase5.default.trueFunc)
    return a2;
  if (a2 === import_boolbase5.default.falseFunc || b === import_boolbase5.default.trueFunc)
    return b;
  return function(elem) {
    return a2(elem) || b(elem);
  };
}
