// function: parseSubscriptIndexInline
function parseSubscriptIndexInline(P2) {
  skipBlanks(P2.L);
  let c3 = peek2(P2.L);
  if ((c3 === "@" || c3 === "*") && peek2(P2.L, 1) === "]") {
    let s2 = P2.L.b;
    return advance(P2.L), mk(P2, "word", s2, P2.L.b, []);
  }
  if (c3 === "(" && peek2(P2.L, 1) === "(") {
    let oStart = P2.L.b;
    advance(P2.L), advance(P2.L);
    let open5 = mk(P2, "((", oStart, P2.L.b, []), inner = parseArithExpr(P2, "))", "var");
    skipBlanks(P2.L);
    let close;
    if (peek2(P2.L) === ")" && peek2(P2.L, 1) === ")") {
      let cs = P2.L.b;
      advance(P2.L), advance(P2.L), close = mk(P2, "))", cs, P2.L.b, []);
    } else
      close = mk(P2, "))", P2.L.b, P2.L.b, []);
    let kids = inner ? [open5, inner, close] : [open5, close];
    return mk(P2, "compound_statement", open5.startIndex, close.endIndex, kids);
  }
  return parseArithExpr(P2, "]", "word");
}
