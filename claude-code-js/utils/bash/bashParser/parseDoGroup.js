// function: parseDoGroup
function parseDoGroup(P2) {
  skipNewlines(P2);
  let save = saveLex(P2.L), doTok = nextToken(P2.L, "cmd");
  if (doTok.type !== "WORD" || doTok.value !== "do")
    return restoreLex(P2.L, save), null;
  let doKw = leaf(P2, "do", doTok), body = parseStatements(P2, null), kids = [doKw, ...body];
  consumeKeyword(P2, "done", kids);
  let last2 = kids[kids.length - 1];
  return mk(P2, "do_group", doKw.startIndex, last2.endIndex, kids);
}
