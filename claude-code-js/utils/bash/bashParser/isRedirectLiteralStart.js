// function: isRedirectLiteralStart
function isRedirectLiteralStart(P2) {
  let c3 = peek2(P2.L);
  if (c3 === "" || c3 === `
`)
    return !1;
  if (c3 === "|" || c3 === "&" || c3 === ";" || c3 === "(" || c3 === ")")
    return !1;
  if (c3 === "<" || c3 === ">")
    return peek2(P2.L, 1) === "(";
  if (isDigit2(c3)) {
    let j4 = P2.L.i;
    while (j4 < P2.L.len && isDigit2(P2.L.src[j4]))
      j4++;
    let after = j4 < P2.L.len ? P2.L.src[j4] : "";
    if (after === ">" || after === "<")
      return !1;
  }
  if (c3 === "}")
