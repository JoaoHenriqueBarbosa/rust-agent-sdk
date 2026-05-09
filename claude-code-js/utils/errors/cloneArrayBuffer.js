// function: cloneArrayBuffer
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  return new _Uint8Array_default(result).set(new _Uint8Array_default(arrayBuffer)), result;
}
