// function: parseIf
function parseIf(P2, ifTok) {
  let ifKw = leaf(P2, "if", ifTok), kids = [ifKw], cond = parseStatements(P2, null);
  kids.push(...cond), consumeKeyword(P2, "then", kids);
  let body = parseStatements(P2, null);
  kids.push(...body);
  while (!0) {
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
    if (t2.type === "WORD" && t2.value === "elif") {
      let eKw = leaf(P2, "elif", t2), eCond = parseStatements(P2, null), eKids = [eKw, ...eCond];
      consumeKeyword(P2, "then", eKids);
      let eBody = parseStatements(P2, null);
      eKids.push(...eBody);
      let last3 = eKids[eKids.length - 1];
      kids.push(mk(P2, "elif_clause", eKw.startIndex, last3.endIndex, eKids));
    } else if (t2.type === "WORD" && t2.value === "else") {
      let elKw = leaf(P2, "else", t2), elBody = parseStatements(P2, null), last3 = elBody.length > 0 ? elBody[elBody.length - 1] : elKw;
      kids.push(mk(P2, "else_clause", elKw.startIndex, last3.endIndex, [elKw, ...elBody]));
    } else {
      restoreLex(P2.L, save);
      break;
    }
  }
  consumeKeyword(P2, "fi", kids);
  let last2 = kids[kids.length - 1];
  return mk(P2, "if_statement", ifKw.startIndex, last2.endIndex, kids);
}
