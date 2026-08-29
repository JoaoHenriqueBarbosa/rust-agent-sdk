// var: toUtf87
var toUtf87 = (input) => {
  if (typeof input === "string")
    return input;
  if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number")
    throw Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
  return fromArrayBuffer2(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};
