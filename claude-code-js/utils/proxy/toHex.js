// function: toHex
function toHex(bytes) {
  let out = "";
  for (let i3 = 0;i3 < bytes.byteLength; i3++)
    out += SHORT_TO_HEX[bytes[i3]];
  return out;
}
