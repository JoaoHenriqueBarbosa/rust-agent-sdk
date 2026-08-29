// var: init_array_buffer
var init_array_buffer = __esm(() => {
  init_contents();
  textEncoder2 = /* @__PURE__ */ new TextEncoder, arrayBufferMethods = {
    init: initArrayBuffer,
    convertChunk: {
      string: useTextEncoder,
      buffer: useUint8Array,
      arrayBuffer: useUint8Array,
      dataView: useUint8ArrayWithOffset,
      typedArray: useUint8ArrayWithOffset,
      others: throwObjectStream
    },
    getSize: getLengthProperty,
    truncateChunk: truncateArrayBufferChunk,
    addChunk: addArrayBufferChunk,
    getFinalChunk: noop3,
    finalize: finalizeArrayBuffer
  };
});
