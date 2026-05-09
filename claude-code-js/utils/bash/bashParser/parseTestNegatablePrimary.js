// function: parseTestNegatablePrimary
function parseTestNegatablePrimary(P2, closer) {
  skipBlanks(P2.L);
  let c3 = peek2(P2.L);
  if (c3 === "!") {
    let s2 = P2.L.b;
    advance(P2.L);
    let bang = mk(P2, "!", s2, P2.L.b, []), inner = parseTestNegatablePrimary(P2, closer);
    if (!inner)
      return bang;
    return mk(P2, "unary_expression", bang.startIndex, inner.endIndex, [
      bang,
      inner
    ]);
  }
  if (c3 === "-" && isIdentStart(peek2(P2.L, 1))) {
    let s2 = P2.L.b;
    advance(P2.L);
    while (isIdentChar(peek2(P2.L)))
      advance(P2.L);
    let op = mk(P2, "test_operator", s2, P2.L.b, []);
    skipBlanks(P2.L);
    let arg = parseTestPrimary(P2, closer);
    if (!arg)
      return op;
    return mk(P2, "unary_expression", op.startIndex, arg.endIndex, [op, arg]);
  }
  return parseTestPrimary(P2, closer);
}
