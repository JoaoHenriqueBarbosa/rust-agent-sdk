// var: toBase647
var toBase647 = (_input) => {
  let input;
  if (typeof _input === "string")
    input = fromUtf812(_input);
  else
    input = _input;
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
    throw Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
  return fromArrayBuffer2(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};
