// function: parseCasePattern
function parseCasePattern(P2) {
  skipBlanks(P2.L);
  let save = saveLex(P2.L), start = P2.L.b, startI = P2.L.i, parenDepth = 0, hasDollar = !1, hasBracketOutsideParen = !1, hasQuote = !1;
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === '"' || c3 === "'") {
      hasQuote = !0, advance(P2.L);
      while (P2.L.i < P2.L.len && peek2(P2.L) !== c3) {
        if (peek2(P2.L) === "\\" && P2.L.i + 1 < P2.L.len)
          advance(P2.L);
        advance(P2.L);
      }
      if (peek2(P2.L) === c3)
        advance(P2.L);
      continue;
    }
    if (c3 === "(") {
      parenDepth++, advance(P2.L);
      continue;
    }
    if (parenDepth > 0) {
      if (c3 === ")") {
        parenDepth--, advance(P2.L);
        continue;
      }
      if (c3 === `
`)
        break;
      advance(P2.L);
      continue;
    }
    if (c3 === ")" || c3 === "|" || c3 === " " || c3 === "\t" || c3 === `
`)
      break;
    if (c3 === "$")
      hasDollar = !0;
    if (c3 === "[")
      hasBracketOutsideParen = !0;
    advance(P2.L);
  }
  if (P2.L.b === start)
    return [];
  let text2 = P2.src.slice(startI, P2.L.i), hasExtglobParen = /[*?+@!]\(/.test(text2);
  if (hasQuote && !hasExtglobParen)
    return restoreLex(P2.L, save), parseCasePatternSegmented(P2);
  if (!hasExtglobParen && (hasDollar || hasBracketOutsideParen)) {
    restoreLex(P2.L, save);
    let w2 = parseWord(P2, "arg");
    return w2 ? [w2] : [];
  }
  let type = hasExtglobParen || /[*?]/.test(text2) || /^[-+?*@!][a-zA-Z]/.test(text2) ? "extglob_pattern" : "word";
  return [mk(P2, type, start, P2.L.b, [])];
}
