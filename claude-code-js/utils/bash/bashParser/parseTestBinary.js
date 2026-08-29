// function: parseTestBinary
function parseTestBinary(P2, closer) {
  skipBlanks(P2.L);
  let left = parseTestNegatablePrimary(P2, closer);
  if (!left)
    return null;
  skipBlanks(P2.L);
  let c3 = peek2(P2.L), c1 = peek2(P2.L, 1), op = null, os6 = P2.L.b;
  if (c3 === "=" && c1 === "=")
    advance(P2.L), advance(P2.L), op = mk(P2, "==", os6, P2.L.b, []);
  else if (c3 === "!" && c1 === "=")
    advance(P2.L), advance(P2.L), op = mk(P2, "!=", os6, P2.L.b, []);
  else if (c3 === "=" && c1 === "~")
    advance(P2.L), advance(P2.L), op = mk(P2, "=~", os6, P2.L.b, []);
  else if (c3 === "=" && c1 !== "=")
    advance(P2.L), op = mk(P2, "=", os6, P2.L.b, []);
  else if (c3 === "<" && c1 !== "<")
    advance(P2.L), op = mk(P2, "<", os6, P2.L.b, []);
  else if (c3 === ">" && c1 !== ">")
    advance(P2.L), op = mk(P2, ">", os6, P2.L.b, []);
  else if (c3 === "-" && isIdentStart(c1)) {
    advance(P2.L);
    while (isIdentChar(peek2(P2.L)))
      advance(P2.L);
    op = mk(P2, "test_operator", os6, P2.L.b, []);
  }
  if (!op)
    return left;
  if (skipBlanks(P2.L), closer === "]]") {
    let opText = op.type;
    if (opText === "=~") {
      skipBlanks(P2.L);
      let rc = peek2(P2.L), rhs = null;
      if (rc === '"' || rc === "'") {
        let save = saveLex(P2.L), quoted = rc === '"' ? parseDoubleQuoted(P2) : leaf(P2, "raw_string", nextToken(P2.L, "arg")), j4 = P2.L.i;
        while (j4 < P2.L.len && (P2.src[j4] === " " || P2.src[j4] === "\t"))
          j4++;
        let nc = P2.src[j4] ?? "", nc1 = P2.src[j4 + 1] ?? "";
        if (nc === "]" && nc1 === "]" || nc === "&" && nc1 === "&" || nc === "|" && nc1 === "|" || nc === `
` || nc === "")
          rhs = quoted;
        else
          restoreLex(P2.L, save);
      }
      if (!rhs)
        rhs = parseTestRegexRhs(P2);
      if (!rhs)
        return left;
      return mk(P2, "binary_expression", left.startIndex, rhs.endIndex, [
        left,
        op,
        rhs
      ]);
    }
    if (opText === "=") {
      let rhs = parseTestRegexRhs(P2);
      if (!rhs)
        return left;
      return mk(P2, "binary_expression", left.startIndex, rhs.endIndex, [
        left,
        op,
        rhs
      ]);
    }
    if (opText === "==" || opText === "!=") {
      let parts = parseTestExtglobRhs(P2);
      if (parts.length === 0)
        return left;
      let last2 = parts[parts.length - 1];
      return mk(P2, "binary_expression", left.startIndex, last2.endIndex, [
        left,
        op,
        ...parts
      ]);
    }
  }
  let right = parseTestPrimary(P2, closer);
  if (!right)
    return left;
  return mk(P2, "binary_expression", left.startIndex, right.endIndex, [
    left,
    op,
    right
  ]);
}
