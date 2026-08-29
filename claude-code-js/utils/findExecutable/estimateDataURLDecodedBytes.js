// function: estimateDataURLDecodedBytes
function estimateDataURLDecodedBytes(url3) {
  if (!url3 || typeof url3 !== "string")
    return 0;
  if (!url3.startsWith("data:"))
    return 0;
  let comma = url3.indexOf(",");
  if (comma < 0)
    return 0;
  let meta = url3.slice(5, comma), body = url3.slice(comma + 1);
  if (/;base64/i.test(meta)) {
    let { length: effectiveLen, length: len } = body;
    for (let i2 = 0;i2 < len; i2++)
      if (body.charCodeAt(i2) === 37 && i2 + 2 < len) {
        let a2 = body.charCodeAt(i2 + 1), b = body.charCodeAt(i2 + 2);
        if ((a2 >= 48 && a2 <= 57 || a2 >= 65 && a2 <= 70 || a2 >= 97 && a2 <= 102) && (b >= 48 && b <= 57 || b >= 65 && b <= 70 || b >= 97 && b <= 102))
          effectiveLen -= 2, i2 += 2;
      }
    let pad = 0, idx = len - 1, tailIsPct3D = (j2) => j2 >= 2 && body.charCodeAt(j2 - 2) === 37 && body.charCodeAt(j2 - 1) === 51 && (body.charCodeAt(j2) === 68 || body.charCodeAt(j2) === 100);
    if (idx >= 0) {
      if (body.charCodeAt(idx) === 61)
        pad++, idx--;
      else if (tailIsPct3D(idx))
        pad++, idx -= 3;
    }
    if (pad === 1 && idx >= 0) {
      if (body.charCodeAt(idx) === 61)
        pad++;
      else if (tailIsPct3D(idx))
        pad++;
    }
    let bytes = Math.floor(effectiveLen / 4) * 3 - (pad || 0);
    return bytes > 0 ? bytes : 0;
  }
  return Buffer.byteLength(body, "utf8");
}
