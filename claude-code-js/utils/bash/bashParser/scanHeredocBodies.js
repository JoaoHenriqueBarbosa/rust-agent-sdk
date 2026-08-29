// function: scanHeredocBodies
function scanHeredocBodies(P2) {
  while (P2.L.i < P2.L.len && P2.L.src[P2.L.i] !== `
`)
    advance(P2.L);
  if (P2.L.i < P2.L.len)
    advance(P2.L);
  for (let hd of P2.L.heredocs) {
    hd.bodyStart = P2.L.b;
    let delimLen = hd.delim.length;
    while (P2.L.i < P2.L.len) {
      let lineStart = P2.L.i, lineStartB = P2.L.b, checkI = lineStart;
      if (hd.stripTabs)
        while (checkI < P2.L.len && P2.L.src[checkI] === "\t")
          checkI++;
      if (P2.L.src.startsWith(hd.delim, checkI) && (checkI + delimLen >= P2.L.len || P2.L.src[checkI + delimLen] === `
` || P2.L.src[checkI + delimLen] === "\r")) {
        hd.bodyEnd = lineStartB;
        while (P2.L.i < checkI)
          advance(P2.L);
        hd.endStart = P2.L.b;
        for (let k3 = 0;k3 < delimLen; k3++)
          advance(P2.L);
        if (hd.endEnd = P2.L.b, P2.L.i < P2.L.len && P2.L.src[P2.L.i] === `
`)
          advance(P2.L);
        return;
      }
      while (P2.L.i < P2.L.len && P2.L.src[P2.L.i] !== `
`)
        advance(P2.L);
      if (P2.L.i < P2.L.len)
        advance(P2.L);
    }
    hd.bodyEnd = P2.L.b, hd.endStart = P2.L.b, hd.endEnd = P2.L.b;
  }
}
