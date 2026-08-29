// var: boolTag3
var boolTag3 = "[object Boolean]", dateTag3 = "[object Date]", mapTag4 = "[object Map]", numberTag3 = "[object Number]", regexpTag3 = "[object RegExp]", setTag4 = "[object Set]", stringTag3 = "[object String]", symbolTag3 = "[object Symbol]", arrayBufferTag3 = "[object ArrayBuffer]", dataViewTag4 = "[object DataView]", float32Tag2 = "[object Float32Array]", float64Tag2 = "[object Float64Array]", int8Tag2 = "[object Int8Array]", int16Tag2 = "[object Int16Array]", int32Tag2 = "[object Int32Array]", uint8Tag2 = "[object Uint8Array]", uint8ClampedTag2 = "[object Uint8ClampedArray]", uint16Tag2 = "[object Uint16Array]", uint32Tag2 = "[object Uint32Array]", _initCloneByTag_default;
var init__initCloneByTag = __esm(() => {
  init__cloneArrayBuffer();
  init__cloneDataView();
  init__cloneRegExp();
  init__cloneSymbol();
  init__cloneTypedArray();
  _initCloneByTag_default = initCloneByTag;
});
