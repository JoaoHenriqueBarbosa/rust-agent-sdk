// function: parseCaseItem
function parseCaseItem(P2) {
  skipBlanks(P2.L);
  let start = P2.L.b, kids = [];
  if (peek2(P2.L) === "(") {
    let s2 = P2.L.b;
    advance(P2.L), kids.push(mk(P2, "(", s2, P2.L.b, []));
  }
  let isFirstAlt = !0;
  while (!0) {
    skipBlanks(P2.L);
    let c3 = peek2(P2.L);
    if (c3 === ")" || c3 === "")
      break;
    let pats = parseCasePattern(P2);
    if (pats.length === 0)
      break;
    if (!isFirstAlt && pats.length > 1) {
      let rewritten = pats.map((p4) => p4.type === "extglob_pattern" ? mk(P2, "word", p4.startIndex, p4.endIndex, []) : p4), first = rewritten[0], last3 = rewritten[rewritten.length - 1];
      kids.push(mk(P2, "concatenation", first.startIndex, last3.endIndex, rewritten));
    } else
      kids.push(...pats);
    if (isFirstAlt = !1, skipBlanks(P2.L), peek2(P2.L) === "\\" && peek2(P2.L, 1) === `
`)
      advance(P2.L), advance(P2.L), skipBlanks(P2.L);
    if (peek2(P2.L) === "|") {
      let s2 = P2.L.b;
      if (advance(P2.L), kids.push(mk(P2, "|", s2, P2.L.b, [])), peek2(P2.L) === "\\" && peek2(P2.L, 1) === `
`)
        advance(P2.L), advance(P2.L);
    } else
      break;
  }
  if (peek2(P2.L) === ")") {
    let s2 = P2.L.b;
    advance(P2.L), kids.push(mk(P2, ")", s2, P2.L.b, []));
  }
  let body = parseStatements(P2, null);
  kids.push(...body);
  let save = saveLex(P2.L), term = nextToken(P2.L, "cmd");
  if (term.type === "OP" && (term.value === ";;" || term.value === ";&" || term.value === ";;&"))
    kids.push(leaf(P2, term.value, term));
  else
    restoreLex(P2.L, save);
  if (kids.length === 0)
    return null;
  if (body.length === 0)
    for (let i5 = 0;i5 < kids.length; i5++) {
      let k3 = kids[i5];
      if (k3.type !== "extglob_pattern")
        continue;
      let text2 = sliceBytes(P2, k3.startIndex, k3.endIndex);
      if (/^[-+?*@!][a-zA-Z]/.test(text2) && !/[*?(]/.test(text2))
        kids[i5] = mk(P2, "word", k3.startIndex, k3.endIndex, []);
    }
  let last2 = kids[kids.length - 1];
  return mk(P2, "case_item", start, last2.endIndex, kids);
}
