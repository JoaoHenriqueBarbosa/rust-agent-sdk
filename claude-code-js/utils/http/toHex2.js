// function: toHex2
function toHex2(bytes) {
  let out = "";
  for (let i4 = 0;i4 < bytes.byteLength; i4++)
    out += SHORT_TO_HEX2[bytes[i4]];
  return out;
}
