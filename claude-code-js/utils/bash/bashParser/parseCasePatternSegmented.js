// function: parseCasePatternSegmented
function parseCasePatternSegmented(P2) {
  let parts = [], segStart = P2.L.b, segStartI = P2.L.i, flushSeg = () => {
    if (P2.L.i > segStartI) {
      let t2 = P2.src.slice(segStartI, P2.L.i), type = /[*?]/.test(t2) ? "extglob_pattern" : "word";
      parts.push(mk(P2, type, segStart, P2.L.b, []));
    }
  };
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === '"') {
      flushSeg(), parts.push(parseDoubleQuoted(P2)), segStart = P2.L.b, segStartI = P2.L.i;
      continue;
    }
    if (c3 === "'") {
      flushSeg();
      let tok = nextToken(P2.L, "arg");
      parts.push(leaf(P2, "raw_string", tok)), segStart = P2.L.b, segStartI = P2.L.i;
      continue;
    }
    if (c3 === ")" || c3 === "|" || c3 === " " || c3 === "\t" || c3 === `
`)
      break;
    advance(P2.L);
  }
  return flushSeg(), parts;
}
