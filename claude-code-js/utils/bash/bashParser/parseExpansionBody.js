// function: parseExpansionBody
function parseExpansionBody(P2) {
  let out = [];
  skipBlanks(P2.L);
  {
    let c0 = peek2(P2.L), c1 = peek2(P2.L, 1);
    if (c0 === "#" && c1 === "!" && peek2(P2.L, 2) === "}")
      return advance(P2.L), advance(P2.L), out;
    if (c0 === "!" && c1 === "#") {
      let j4 = 2;
      if (peek2(P2.L, j4) === "#")
        j4++;
      if (peek2(P2.L, j4) === " ")
        j4++;
      if (peek2(P2.L, j4) === "}") {
        while (j4-- > 0)
          advance(P2.L);
        return out;
      }
    }
