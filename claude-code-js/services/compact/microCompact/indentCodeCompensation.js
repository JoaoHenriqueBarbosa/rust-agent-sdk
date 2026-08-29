// function: indentCodeCompensation
function indentCodeCompensation(raw, text2, rules) {
  let matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
  if (matchIndentToCode === null)
    return text2;
  let indentToCode = matchIndentToCode[1];
  return text2.split(`
`).map((node) => {
    let matchIndentInNode = node.match(rules.other.beginningSpace);
    if (matchIndentInNode === null)
      return node;
    let [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length)
      return node.slice(indentToCode.length);
    return node;
  }).join(`
`);
}
