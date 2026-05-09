// var: INFINITY3
var INFINITY3 = 1 / 0, createSet, _createSet_default;
var init__createSet = __esm(() => {
  init__Set();
  init_noop();
  init__setToArray();
  createSet = !(_Set_default && 1 / _setToArray_default(new _Set_default([, -0]))[1] == INFINITY3) ? noop_default : function(values3) {
    return new _Set_default(values3);
  }, _createSet_default = createSet;
});
