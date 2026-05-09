// function: isHttpsUrl
function isHttpsUrl(value) {
  if (!value)
    return !1;
  try {
    let url3 = new URL(value);
    return url3.protocol === "https:" && url3.pathname !== "/";
  } catch {
    return !1;
  }
}
