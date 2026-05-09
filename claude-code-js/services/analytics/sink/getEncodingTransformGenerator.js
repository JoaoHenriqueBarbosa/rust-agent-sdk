// var: getEncodingTransformGenerator
var getEncodingTransformGenerator = (binary, encoding, skipped) => {
  if (skipped)
    return;
  if (binary)
    return { transform: encodingUint8ArrayGenerator.bind(void 0, /* @__PURE__ */ new TextEncoder) };
  let stringDecoder = new StringDecoder2(encoding);
  return {
    transform: encodingStringGenerator.bind(void 0, stringDecoder),
    final: encodingStringFinal.bind(void 0, stringDecoder)
  };
}, encodingUint8ArrayGenerator = function* (textEncoder3, chunk) {
  if (Buffer5.isBuffer(chunk))
    yield bufferToUint8Array(chunk);
  else if (typeof chunk === "string")
    yield textEncoder3.encode(chunk);
  else
    yield chunk;
}, encodingStringGenerator = function* (stringDecoder, chunk) {
  yield isUint8Array(chunk) ? stringDecoder.write(chunk) : chunk;
}, encodingStringFinal = function* (stringDecoder) {
  let lastChunk = stringDecoder.end();
  if (lastChunk !== "")
    yield lastChunk;
};
