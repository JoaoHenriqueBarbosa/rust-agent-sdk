// function: parseFor
function parseFor(P2, forTok) {
  let forKw = leaf(P2, forTok.value, forTok);
  if (skipBlanks(P2.L), forTok.value === "for" && peek2(P2.L) === "(" && peek2(P2.L, 1) === "(") {
    let oStart = P2.L.b;
    advance(P2.L), advance(P2.L);
    let open5 = mk(P2, "((", oStart, P2.L.b, []), kids2 = [forKw, open5];
    for (let k3 = 0;k3 < 3; k3++) {
      skipBlanks(P2.L);
      let es = parseArithCommaList(P2, k3 < 2 ? ";" : "))", "assign");
      if (kids2.push(...es), k3 < 2) {
        if (peek2(P2.L) === ";") {
          let s2 = P2.L.b;
          advance(P2.L), kids2.push(mk(P2, ";", s2, P2.L.b, []));
        }
      }
    }
    if (skipBlanks(P2.L), peek2(P2.L) === ")" && peek2(P2.L, 1) === ")") {
      let cStart = P2.L.b;
      advance(P2.L), advance(P2.L), kids2.push(mk(P2, "))", cStart, P2.L.b, []));
    }
    let save3 = saveLex(P2.L), sep14 = nextToken(P2.L, "cmd");
    if (sep14.type === "OP" && sep14.value === ";")
      kids2.push(leaf(P2, ";", sep14));
    else if (sep14.type !== "NEWLINE")
      restoreLex(P2.L, save3);
    let dg2 = parseDoGroup(P2);
    if (dg2)
      kids2.push(dg2);
    else if (skipNewlines(P2), skipBlanks(P2.L), peek2(P2.L) === "{") {
      let bOpen = P2.L.b;
      advance(P2.L);
      let brace = mk(P2, "{", bOpen, P2.L.b, []), body = parseStatements(P2, "}"), bClose;
      if (peek2(P2.L) === "}") {
        let cs = P2.L.b;
        advance(P2.L), bClose = mk(P2, "}", cs, P2.L.b, []);
      } else
        bClose = mk(P2, "}", P2.L.b, P2.L.b, []);
      kids2.push(mk(P2, "compound_statement", brace.startIndex, bClose.endIndex, [
        brace,
        ...body,
        bClose
      ]));
    }
