// function: maybeRedirect
function maybeRedirect(P2, node, allowHerestring = !1) {
  let redirects = [];
  while (!0) {
    skipBlanks(P2.L);
    let save = saveLex(P2.L), r4 = tryParseRedirect(P2);
    if (!r4)
      break;
    if (r4.type === "herestring_redirect" && !allowHerestring) {
      restoreLex(P2.L, save);
      break;
    }
    redirects.push(r4);
  }
  if (redirects.length === 0)
    return node;
  let last2 = redirects[redirects.length - 1];
  return mk(P2, "redirected_statement", node.startIndex, last2.endIndex, [
    node,
    ...redirects
  ]);
}
