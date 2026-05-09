// function: parseExpansionRest
function parseExpansionRest(P2, nodeType, stopAtSlash) {
  let start = P2.L.b;
  if (nodeType === "word" && peek2(P2.L) === "(") {
    advance(P2.L);
    let elems = [mk(P2, "(", start, P2.L.b, [])];
    while (P2.L.i < P2.L.len) {
      skipBlanks(P2.L);
      let c3 = peek2(P2.L);
      if (c3 === ")" || c3 === "}" || c3 === `
` || c3 === "")
        break;
      let wStart = P2.L.b;
      while (P2.L.i < P2.L.len) {
        let wc = peek2(P2.L);
        if (wc === ")" || wc === "}" || wc === " " || wc === "\t" || wc === `
` || wc === "")
          break;
        advance(P2.L);
      }
      if (P2.L.b > wStart)
        elems.push(mk(P2, "word", wStart, P2.L.b, []));
      else
        break;
    }
