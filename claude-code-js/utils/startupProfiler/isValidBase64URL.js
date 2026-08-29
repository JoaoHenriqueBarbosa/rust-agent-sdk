// function: isValidBase64URL
function isValidBase64URL(data) {
  if (!base64url.test(data))
    return !1;
  let base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/"), padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
