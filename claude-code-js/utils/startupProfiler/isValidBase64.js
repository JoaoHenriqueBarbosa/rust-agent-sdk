// function: isValidBase64
function isValidBase64(data) {
  if (data === "")
    return !0;
  if (data.length % 4 !== 0)
    return !1;
  try {
    return atob(data), !0;
  } catch {
    return !1;
  }
}
