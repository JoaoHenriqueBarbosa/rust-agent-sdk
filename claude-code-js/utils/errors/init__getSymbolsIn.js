// var: init__getSymbolsIn
var init__getSymbolsIn = __esm(() => {
  init__arrayPush();
  init__getPrototype();
  init__getSymbols();
  init_stubArray();
  nativeGetSymbols2 = Object.getOwnPropertySymbols, getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
    var result = [];
    while (object)
      _arrayPush_default(result, _getSymbols_default(object)), object = _getPrototype_default(object);
    return result;
  }, _getSymbolsIn_default = getSymbolsIn;
});
