// function: parseTestRegexRhs
function parseTestRegexRhs(P2) {
  skipBlanks(P2.L);
  let start = P2.L.b, parenDepth = 0, bracketDepth = 0;
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === `
`)
      break;
    if (parenDepth === 0 && bracketDepth === 0) {
      if (c3 === "]" && peek2(P2.L, 1) === "]")
        break;
      if (c3 === " " || c3 === "\t") {
        let j4 = P2.L.i;
        while (j4 < P2.L.len && (P2.L.src[j4] === " " || P2.L.src[j4] === "\t"))
          j4++;
        let nc = P2.L.src[j4] ?? "", nc1 = P2.L.src[j4 + 1] ?? "";
        if (nc === "]" && nc1 === "]" || nc === "&" && nc1 === "&" || nc === "|" && nc1 === "|")
          break;
        advance(P2.L);
        continue;
      }
    }
    if (c3 === "(")
      parenDepth++;
    else if (c3 === ")" && parenDepth > 0)
      parenDepth--;
    else if (c3 === "[")
      bracketDepth++;
    else if (c3 === "]" && bracketDepth > 0)
      bracketDepth--;
    advance(P2.L);
  }
  if (P2.L.b === start)
    return null;
  return mk(P2, "regex", start, P2.L.b, []);
}
