// var: initArrayBuffer
var initArrayBuffer = () => ({ contents: new ArrayBuffer(0) }), useTextEncoder = (chunk) => textEncoder2.encode(chunk), textEncoder2, useUint8Array = (chunk) => new Uint8Array(chunk), useUint8ArrayWithOffset = (chunk) => new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength), truncateArrayBufferChunk = (convertedChunk, chunkSize) => convertedChunk.slice(0, chunkSize), addArrayBufferChunk = (convertedChunk, { contents, length: previousLength }, length) => {
  let newContents = hasArrayBufferResize() ? resizeArrayBuffer(contents, length) : resizeArrayBufferSlow(contents, length);
  return new Uint8Array(newContents).set(convertedChunk, previousLength), newContents;
}, resizeArrayBufferSlow = (contents, length) => {
  if (length <= contents.byteLength)
    return contents;
  let arrayBuffer = new ArrayBuffer(getNewContentsLength(length));
  return new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0), arrayBuffer;
}, resizeArrayBuffer = (contents, length) => {
  if (length <= contents.maxByteLength)
    return contents.resize(length), contents;
  let arrayBuffer = new ArrayBuffer(length, { maxByteLength: getNewContentsLength(length) });
  return new Uint8Array(arrayBuffer).set(new Uint8Array(contents), 0), arrayBuffer;
}, getNewContentsLength = (length) => SCALE_FACTOR ** Math.ceil(Math.log(length) / Math.log(SCALE_FACTOR)), SCALE_FACTOR = 2, finalizeArrayBuffer = ({ contents, length }) => hasArrayBufferResize() ? contents : contents.slice(0, length), hasArrayBufferResize = () => ("resize" in ArrayBuffer.prototype), arrayBufferMethods;
