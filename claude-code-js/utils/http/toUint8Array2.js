// var: toUint8Array2
var toUint8Array2 = (data) => {
  if (typeof data === "string")
    return fromUtf810(data);
  if (ArrayBuffer.isView(data))
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
  return new Uint8Array(data);
};
