// function: createCaseFirst
function createCaseFirst(methodName) {
  return function(string4) {
    string4 = toString_default(string4);
    var strSymbols = _hasUnicode_default(string4) ? _stringToArray_default(string4) : void 0, chr = strSymbols ? strSymbols[0] : string4.charAt(0), trailing = strSymbols ? _castSlice_default(strSymbols, 1).join("") : string4.slice(1);
    return chr[methodName]() + trailing;
  };
}
