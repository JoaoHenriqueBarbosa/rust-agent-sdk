// function: parseWhile
function parseWhile(P2, kwTok) {
  let kw = leaf(P2, kwTok.value, kwTok), kids = [kw], cond = parseStatements(P2, null);
  kids.push(...cond);
  let dg = parseDoGroup(P2);
  if (dg)
    kids.push(dg);
  let last2 = kids[kids.length - 1];
  return mk(P2, "while_statement", kw.startIndex, last2.endIndex, kids);
}
