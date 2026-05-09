// function: decodeBase64
function decodeBase64(input) {
  let binary = typeof atob === "function" ? atob(input) : typeof Buffer.from === "function" ? Buffer.from(input, "base64").toString("binary") : new Buffer(input, "base64").toString("binary"), evenLength = binary.length & -2, out = new Uint16Array(evenLength / 2);
  for (let index = 0, outIndex = 0;index < evenLength; index += 2) {
    let lo = binary.charCodeAt(index), hi = binary.charCodeAt(index + 1);
    out[outIndex++] = lo | hi << 8;
  }
  return out;
}
