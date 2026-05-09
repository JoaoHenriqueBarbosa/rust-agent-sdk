// function: isValidJWT
function isValidJWT(token, algorithm = null) {
  try {
    let tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return !1;
    let [header] = tokensParts;
    if (!header)
      return !1;
    let parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return !1;
    if (!parsedHeader.alg)
      return !1;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return !1;
    return !0;
  } catch {
    return !1;
  }
}
