// var: init_array
var init_array = __esm(() => {
  init_contents();
  arrayMethods = {
    init: initArray,
    convertChunk: {
      string: identity3,
      buffer: identity3,
      arrayBuffer: identity3,
      dataView: identity3,
      typedArray: identity3,
      others: identity3
    },
    getSize: increment,
    truncateChunk: noop3,
    addChunk: addArrayChunk,
    getFinalChunk: noop3,
    finalize: getContentsProperty
  };
});
