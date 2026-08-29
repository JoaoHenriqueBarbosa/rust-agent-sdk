// function: consumeKeyword
function consumeKeyword(P2, name3, kids) {
  skipNewlines(P2);
  let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
  if (t2.type === "WORD" && t2.value === name3)
    kids.push(leaf(P2, name3, t2));
  else
    restoreLex(P2.L, save);
}
