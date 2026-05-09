// function: toHex3
function toHex3(bytes) {
  let out = "";
  for (let i4 = 0;i4 < bytes.byteLength; i4++)
    out += SHORT_TO_HEX3[bytes[i4]];
  return out;
}
