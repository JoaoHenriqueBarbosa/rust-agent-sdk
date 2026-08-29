// function: parsePipeline
function parsePipeline(P2) {
  let first = parseCommand2(P2);
  if (!first)
    return null;
  let parts = [first];
  while (!0) {
    let save = saveLex(P2.L), t2 = nextToken(P2.L, "cmd");
    if (t2.type === "OP" && (t2.value === "|" || t2.value === "|&")) {
      let op = leaf(P2, t2.value, t2);
      skipNewlines(P2);
      let next = parseCommand2(P2);
      if (!next) {
        parts.push(op);
        break;
      }
      if (next.type === "redirected_statement" && next.children.length >= 2 && parts.length >= 1) {
        let inner = next.children[0], redirs = next.children.slice(1), pipeKids = [...parts, op, inner], pipeNode = mk(P2, "pipeline", pipeKids[0].startIndex, inner.endIndex, pipeKids), lastR = redirs[redirs.length - 1], wrapped = mk(P2, "redirected_statement", pipeNode.startIndex, lastR.endIndex, [pipeNode, ...redirs]);
        parts.length = 0, parts.push(wrapped), first = wrapped;
        continue;
      }
      parts.push(op, next);
    } else {
      restoreLex(P2.L, save);
      break;
    }
  }
  if (parts.length === 1)
    return parts[0];
  let last2 = parts[parts.length - 1];
  return mk(P2, "pipeline", parts[0].startIndex, last2.endIndex, parts);
}
