// function: tryParseAssignment
function tryParseAssignment(P2) {
  let save = saveLex(P2.L);
  skipBlanks(P2.L);
  let startB = P2.L.b;
  if (!isIdentStart(peek2(P2.L)))
    return restoreLex(P2.L, save), null;
  while (isIdentChar(peek2(P2.L)))
    advance(P2.L);
  let nameEnd = P2.L.b, subEnd = nameEnd;
  if (peek2(P2.L) === "[") {
    advance(P2.L);
    let depth = 1;
    while (P2.L.i < P2.L.len && depth > 0) {
      let c4 = peek2(P2.L);
      if (c4 === "[")
        depth++;
      else if (c4 === "]")
        depth--;
      advance(P2.L);
    }
    subEnd = P2.L.b;
  }
  let c3 = peek2(P2.L), c1 = peek2(P2.L, 1), op;
  if (c3 === "=" && c1 !== "=")
    op = "=";
  else if (c3 === "+" && c1 === "=")
    op = "+=";
  else
    return restoreLex(P2.L, save), null;
  let nameNode = mk(P2, "variable_name", startB, nameEnd, []), lhs = nameNode;
  if (subEnd > nameEnd) {
    let brOpen = mk(P2, "[", nameEnd, nameEnd + 1, []), idx = parseSubscriptIndex(P2, nameEnd + 1, subEnd - 1), brClose = mk(P2, "]", subEnd - 1, subEnd, []);
    lhs = mk(P2, "subscript", startB, subEnd, [nameNode, brOpen, idx, brClose]);
  }
  let opStart = P2.L.b;
  if (advance(P2.L), op === "+=")
    advance(P2.L);
  let opEnd = P2.L.b, opNode = mk(P2, op, opStart, opEnd, []), val = null;
  if (peek2(P2.L) === "(") {
    let aoTok = nextToken(P2.L, "cmd"), aOpen = leaf(P2, "(", aoTok), elems = [aOpen];
    while (!0) {
      if (skipBlanks(P2.L), peek2(P2.L) === ")")
        break;
      let e = parseWord(P2, "arg");
      if (!e)
        break;
      elems.push(e);
    }
    let acTok = nextToken(P2.L, "cmd"), aClose = acTok.value === ")" ? leaf(P2, ")", acTok) : mk(P2, ")", aOpen.endIndex, aOpen.endIndex, []);
    elems.push(aClose), val = mk(P2, "array", aOpen.startIndex, aClose.endIndex, elems);
  } else {
    let c22 = peek2(P2.L);
    if (c22 && c22 !== " " && c22 !== "\t" && c22 !== `
` && c22 !== ";" && c22 !== "&" && c22 !== "|" && c22 !== ")" && c22 !== "}")
      val = parseWord(P2, "arg");
  }
