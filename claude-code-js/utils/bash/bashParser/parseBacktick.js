// function: parseBacktick
function parseBacktick(P2) {
  let start = P2.L.b;
  advance(P2.L);
  let open5 = mk(P2, "`", start, P2.L.b, []);
  P2.inBacktick++;
  let body = [];
  while (!0) {
    if (skipBlanks(P2.L), peek2(P2.L) === "`" || peek2(P2.L) === "")
      break;
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
    if (t2.type === "EOF" || t2.type === "BACKTICK") {
      restoreLex(P2.L, save);
      break;
    }
    if (t2.type === "NEWLINE")
      continue;
    restoreLex(P2.L, save);
    let stmt = parseAndOr(P2);
    if (!stmt)
      break;
    if (body.push(stmt), skipBlanks(P2.L), peek2(P2.L) === "`")
      break;
    let save2 = saveLex(P2.L), sep13 = nextToken(P2.L, "cmd");
    if (sep13.type === "OP" && (sep13.value === ";" || sep13.value === "&"))
      body.push(leaf(P2, sep13.value, sep13));
    else if (sep13.type !== "NEWLINE")
      restoreLex(P2.L, save2);
  }
  P2.inBacktick--;
  let close;
  if (peek2(P2.L) === "`") {
    let cStart = P2.L.b;
    advance(P2.L), close = mk(P2, "`", cStart, P2.L.b, []);
  } else
    close = mk(P2, "`", P2.L.b, P2.L.b, []);
  if (body.length === 0)
    return null;
  return mk(P2, "command_substitution", start, close.endIndex, [
    open5,
    ...body,
    close
  ]);
}
