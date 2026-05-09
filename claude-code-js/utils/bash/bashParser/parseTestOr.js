// function: parseTestOr
function parseTestOr(P2, closer) {
  let left = parseTestAnd(P2, closer);
  if (!left)
    return null;
  while (!0) {
    skipBlanks(P2.L);
    let save = saveLex(P2.L);
    if (peek2(P2.L) === "|" && peek2(P2.L, 1) === "|") {
      let s2 = P2.L.b;
      advance(P2.L), advance(P2.L);
      let op = mk(P2, "||", s2, P2.L.b, []), right = parseTestAnd(P2, closer);
      if (!right) {
        restoreLex(P2.L, save);
        break;
      }
      left = mk(P2, "binary_expression", left.startIndex, right.endIndex, [
        left,
        op,
        right
      ]);
    } else
      break;
  }
  return left;
}
