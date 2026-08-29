// function: toUtf16LeBase64
function toUtf16LeBase64(text2) {
  if (typeof Buffer < "u")
    return Buffer.from(text2, "utf16le").toString("base64");
  let bytes = [];
  for (let i5 = 0;i5 < text2.length; i5++) {
    let code = text2.charCodeAt(i5);
    bytes.push(code & 255, code >> 8 & 255);
  }
  return btoa(bytes.map((b) => String.fromCharCode(b)).join(""));
}
