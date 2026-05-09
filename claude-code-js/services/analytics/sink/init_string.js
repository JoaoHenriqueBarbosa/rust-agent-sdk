// var: init_string
var init_string = __esm(() => {
  init_contents();
  stringMethods = {
    init: initString,
    convertChunk: {
      string: identity3,
      buffer: useTextDecoder,
      arrayBuffer: useTextDecoder,
      dataView: useTextDecoder,
      typedArray: useTextDecoder,
      others: throwObjectStream
    },
    getSize: getLengthProperty,
    truncateChunk: truncateStringChunk,
    addChunk: addStringChunk,
    getFinalChunk: getFinalStringChunk,
    finalize: getContentsProperty
  };
});
