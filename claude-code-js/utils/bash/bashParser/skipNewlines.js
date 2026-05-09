// function: skipNewlines
function skipNewlines(P2) {
  while (!0) {
    let save = saveLex(P2.L);
    if (nextToken(P2.L, "cmd").type !== "NEWLINE") {
      restoreLex(P2.L, save);
      break;
    }
  }
}
