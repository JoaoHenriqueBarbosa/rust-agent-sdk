// function: parseFunction
function parseFunction(P2, fnTok) {
  let fnKw = leaf(P2, "function", fnTok);
  skipBlanks(P2.L);
  let nameTok = nextToken(P2.L, "arg"), name3 = mk(P2, "word", nameTok.start, nameTok.end, []), kids = [fnKw, name3];
  if (skipBlanks(P2.L), peek2(P2.L) === "(" && peek2(P2.L, 1) === ")") {
    let o5 = nextToken(P2.L, "cmd"), c3 = nextToken(P2.L, "cmd");
    kids.push(leaf(P2, "(", o5)), kids.push(leaf(P2, ")", c3));
  }
  skipBlanks(P2.L), skipNewlines(P2);
  let body = parseCommand2(P2);
  if (body)
    if (body.type === "redirected_statement" && body.children.length >= 2 && body.children[0].type === "compound_statement")
      kids.push(...body.children);
    else
      kids.push(body);
  let last2 = kids[kids.length - 1];
  return mk(P2, "function_definition", fnKw.startIndex, last2.endIndex, kids);
}
