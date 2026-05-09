// function: compileRules
function compileRules(rules, options2, context6) {
  var _a4;
  return rules.reduce((previous, rule) => previous === import_boolbase5.default.falseFunc ? import_boolbase5.default.falseFunc : compileGeneralSelector(previous, rule, options2, context6, compileToken), (_a4 = options2.rootFunc) !== null && _a4 !== void 0 ? _a4 : import_boolbase5.default.trueFunc);
}
