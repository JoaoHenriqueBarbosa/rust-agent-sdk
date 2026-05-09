// var: rsAstralRange
var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange, rsVarRange = "\\ufe0e\\ufe0f", rsZWJ = "\\u200d", reHasUnicode, _hasUnicode_default;
var init__hasUnicode = __esm(() => {
  rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
  _hasUnicode_default = hasUnicode;
});
