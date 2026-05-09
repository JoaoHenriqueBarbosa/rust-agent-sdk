// var: init__unicodeToArray
var init__unicodeToArray = __esm(() => {
  rsComboRange2 = rsComboMarksRange2 + reComboHalfMarksRange2 + rsComboSymbolsRange2, rsAstral = "[" + rsAstralRange2 + "]", rsCombo = "[" + rsComboRange2 + "]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange2 + "]", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange2 + "]?", rsOptJoin = "(?:" + rsZWJ2 + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")", reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
  _unicodeToArray_default = unicodeToArray;
});
