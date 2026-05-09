// var: fromUtf810
var fromUtf810 = (input) => {
  let buf = fromString5(input, "utf8");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
