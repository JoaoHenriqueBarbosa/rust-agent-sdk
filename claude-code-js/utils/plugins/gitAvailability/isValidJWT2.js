// function: isValidJWT2
function isValidJWT2(jwt3, alg) {
  if (!jwtRegex.test(jwt3))
    return !1;
  try {
    let [header] = jwt3.split(".");
    if (!header)
      return !1;
    let base644 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "="), decoded = JSON.parse(atob(base644));
    if (typeof decoded !== "object" || decoded === null)
      return !1;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return !1;
    if (!decoded.alg)
      return !1;
    if (alg && decoded.alg !== alg)
      return !1;
    return !0;
  } catch {
    return !1;
  }
}
