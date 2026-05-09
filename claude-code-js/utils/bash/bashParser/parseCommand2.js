// function: parseCommand2
function parseCommand2(P2) {
  skipBlanks(P2.L);
  let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
  if (t2.type === "EOF")
    return restoreLex(P2.L, save), null;
  if (t2.type === "OP" && t2.value === "!") {
    let bang = leaf(P2, "!", t2), inner = parseCommand2(P2);
    if (!inner)
      return restoreLex(P2.L, save), null;
    if (inner.type === "redirected_statement" && inner.children.length >= 2) {
      let cmd = inner.children[0], redirs = inner.children.slice(1), neg = mk(P2, "negated_command", bang.startIndex, cmd.endIndex, [
        bang,
        cmd
      ]), lastR = redirs[redirs.length - 1];
      return mk(P2, "redirected_statement", neg.startIndex, lastR.endIndex, [
        neg,
        ...redirs
      ]);
    }
    return mk(P2, "negated_command", bang.startIndex, inner.endIndex, [
      bang,
      inner
    ]);
  }
  if (t2.type === "OP" && t2.value === "(") {
    let open5 = leaf(P2, "(", t2), body = parseStatements(P2, ")"), closeTok = nextToken(P2.L, "cmd"), close = closeTok.type === "OP" && closeTok.value === ")" ? leaf(P2, ")", closeTok) : mk(P2, ")", open5.endIndex, open5.endIndex, []), node = mk(P2, "subshell", open5.startIndex, close.endIndex, [
      open5,
      ...body,
      close
    ]);
    return maybeRedirect(P2, node);
  }
  if (t2.type === "OP" && t2.value === "((") {
    let open5 = leaf(P2, "((", t2), exprs = parseArithCommaList(P2, "))", "var"), closeTok = nextToken(P2.L, "cmd"), close = closeTok.value === "))" ? leaf(P2, "))", closeTok) : mk(P2, "))", open5.endIndex, open5.endIndex, []);
    return mk(P2, "compound_statement", open5.startIndex, close.endIndex, [
      open5,
      ...exprs,
      close
    ]);
  }
  if (t2.type === "OP" && t2.value === "{") {
    let open5 = leaf(P2, "{", t2), body = parseStatements(P2, "}"), closeTok = nextToken(P2.L, "cmd"), close = closeTok.type === "OP" && closeTok.value === "}" ? leaf(P2, "}", closeTok) : mk(P2, "}", open5.endIndex, open5.endIndex, []), node = mk(P2, "compound_statement", open5.startIndex, close.endIndex, [
