// function: skipBlanks
function skipBlanks(L2) {
  while (L2.i < L2.len) {
    let c3 = L2.src[L2.i];
    if (c3 === " " || c3 === "\t" || c3 === "\r")
      advance(L2);
    else if (c3 === "\\") {
      let nx = L2.src[L2.i + 1];
      if (nx === `
` || nx === "\r" && L2.src[L2.i + 2] === `
`) {
        if (advance(L2), advance(L2), nx === "\r")
          advance(L2);
      } else if (nx === " " || nx === "\t")
        advance(L2), advance(L2);
      else
        break;
    } else
      break;
  }
}
