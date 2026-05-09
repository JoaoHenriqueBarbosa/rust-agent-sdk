// function: getSignatureBinary
function getSignatureBinary(signature4) {
  let buf = Buffer.from(signature4, "hex");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
}
