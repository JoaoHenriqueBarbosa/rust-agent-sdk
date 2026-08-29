// function: parseTestUnary
function parseTestUnary(P2, closer) {
  if (skipBlanks(P2.L), peek2(P2.L) === "(") {
    let s2 = P2.L.b;
    advance(P2.L);
    let open5 = mk(P2, "(", s2, P2.L.b, []), inner = parseTestOr(P2, closer);
    skipBlanks(P2.L);
    let close;
    if (peek2(P2.L) === ")") {
      let cs = P2.L.b;
      advance(P2.L), close = mk(P2, ")", cs, P2.L.b, []);
    } else
      close = mk(P2, ")", P2.L.b, P2.L.b, []);
    let kids = inner ? [open5, inner, close] : [open5, close];
    return mk(P2, "parenthesized_expression", open5.startIndex, close.endIndex, kids);
  }
  return parseTestBinary(P2, closer);
}
