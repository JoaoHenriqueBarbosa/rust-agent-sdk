// function: parseDeclaration
function parseDeclaration(P2, kwTok) {
  let kw = leaf(P2, kwTok.value, kwTok), kids = [kw];
  while (!0) {
    skipBlanks(P2.L);
    let c3 = peek2(P2.L);
    if (c3 === "" || c3 === `
` || c3 === ";" || c3 === "&" || c3 === "|" || c3 === ")" || c3 === "<" || c3 === ">")
      break;
    let a2 = tryParseAssignment(P2);
    if (a2) {
      kids.push(a2);
      continue;
    }
    if (c3 === '"' || c3 === "'" || c3 === "$") {
      let w2 = parseWord(P2, "arg");
      if (w2) {
        kids.push(w2);
        continue;
      }
      break;
    }
    let save = saveLex(P2.L), tok = nextToken(P2.L, "arg");
    if (tok.type === "WORD" || tok.type === "NUMBER")
      if (tok.value.startsWith("-"))
        kids.push(leaf(P2, "word", tok));
      else if (isIdentStart(tok.value[0] ?? ""))
        kids.push(mk(P2, "variable_name", tok.start, tok.end, []));
      else
        kids.push(leaf(P2, "word", tok));
    else {
      restoreLex(P2.L, save);
      break;
    }
  }
  let last2 = kids[kids.length - 1];
  return mk(P2, "declaration_command", kw.startIndex, last2.endIndex, kids);
}
