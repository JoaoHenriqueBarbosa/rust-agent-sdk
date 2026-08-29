// function: parseProcessSub
function parseProcessSub(P2) {
  let c3 = peek2(P2.L);
  if (c3 !== "<" && c3 !== ">" || peek2(P2.L, 1) !== "(")
    return null;
  let start = P2.L.b;
  advance(P2.L), advance(P2.L);
  let open5 = mk(P2, c3 + "(", start, P2.L.b, []), body = parseStatements(P2, ")");
  skipBlanks(P2.L);
  let close;
  if (peek2(P2.L) === ")") {
    let cs = P2.L.b;
    advance(P2.L), close = mk(P2, ")", cs, P2.L.b, []);
  } else
    close = mk(P2, ")", P2.L.b, P2.L.b, []);
  return mk(P2, "process_substitution", start, close.endIndex, [
    open5,
    ...body,
    close
  ]);
}
