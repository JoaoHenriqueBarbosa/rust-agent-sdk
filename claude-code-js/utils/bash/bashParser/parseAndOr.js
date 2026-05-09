// function: parseAndOr
function parseAndOr(P2) {
  let left = parsePipeline(P2);
  if (!left)
    return null;
  while (!0) {
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
    if (t2.type === "OP" && (t2.value === "&&" || t2.value === "||")) {
      let op = leaf(P2, t2.value, t2);
      skipNewlines(P2);
      let right = parsePipeline(P2);
      if (!right) {
        left = mk(P2, "list", left.startIndex, op.endIndex, [left, op]);
        break;
      }
      if (right.type === "redirected_statement" && right.children.length >= 2) {
        let inner = right.children[0], redirs = right.children.slice(1), listNode = mk(P2, "list", left.startIndex, inner.endIndex, [
          left,
          op,
          inner
        ]), lastR = redirs[redirs.length - 1];
        left = mk(P2, "redirected_statement", listNode.startIndex, lastR.endIndex, [listNode, ...redirs]);
      } else
        left = mk(P2, "list", left.startIndex, right.endIndex, [left, op, right]);
    } else {
      restoreLex(P2.L, save);
      break;
    }
  }
  return left;
}
