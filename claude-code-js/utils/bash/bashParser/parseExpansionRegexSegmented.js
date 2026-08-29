// function: parseExpansionRegexSegmented
function parseExpansionRegexSegmented(P2) {
  let out = [], segStart = P2.L.b, flushRegex = () => {
    if (P2.L.b > segStart)
      out.push(mk(P2, "regex", segStart, P2.L.b, []));
  };
  while (P2.L.i < P2.L.len) {
    let c3 = peek2(P2.L);
    if (c3 === "}" || c3 === `
`)
      break;
    if (c3 === "\\" && P2.L.i + 1 < P2.L.len) {
      advance(P2.L), advance(P2.L);
      continue;
    }
    if (c3 === '"') {
      flushRegex(), out.push(parseDoubleQuoted(P2)), segStart = P2.L.b;
      continue;
    }
    if (c3 === "'") {
      flushRegex();
      let rStart = P2.L.b;
      advance(P2.L);
      while (P2.L.i < P2.L.len && peek2(P2.L) !== "'")
        advance(P2.L);
      if (peek2(P2.L) === "'")
        advance(P2.L);
      out.push(mk(P2, "raw_string", rStart, P2.L.b, [])), segStart = P2.L.b;
      continue;
    }
    if (c3 === "$") {
      let c1 = peek2(P2.L, 1);
      if (c1 === "{") {
        let d = 1;
        advance(P2.L), advance(P2.L);
        while (P2.L.i < P2.L.len && d > 0) {
          let nc = peek2(P2.L);
          if (nc === "{")
            d++;
          else if (nc === "}")
            d--;
          advance(P2.L);
        }
        continue;
      }
      if (c1 === "(") {
        let d = 1;
        advance(P2.L), advance(P2.L);
        while (P2.L.i < P2.L.len && d > 0) {
          let nc = peek2(P2.L);
          if (nc === "(")
            d++;
          else if (nc === ")")
            d--;
          advance(P2.L);
        }
        continue;
      }
    }
    advance(P2.L);
  }
  flushRegex();
  while (peek2(P2.L) === `
`)
    advance(P2.L);
  return out;
}
