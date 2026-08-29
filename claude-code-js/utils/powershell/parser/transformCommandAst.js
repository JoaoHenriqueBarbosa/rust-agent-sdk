// function: transformCommandAst
function transformCommandAst(raw) {
  let cmdElements = ensureArray(raw.commandElements), name3 = "", args = [], elementTypes = [], children = [], hasChildren = !1, nameType = "unknown";
  if (cmdElements.length > 0) {
    let first = cmdElements[0], rawName = ((first.type === "StringConstantExpressionAst" || first.type === "ExpandableStringExpressionAst") && typeof first.value === "string" ? first.value : first.text).replace(/^['"]|['"]$/g, "");
    if (/[\u0080-\uFFFF]/.test(rawName))
      nameType = "application";
    else
      nameType = classifyCommandName(rawName);
    name3 = stripModulePrefix(rawName), elementTypes.push(mapElementType(first.type, first.expressionType));
    for (let i5 = 1;i5 < cmdElements.length; i5++) {
      let ce = cmdElements[i5], isStringLiteral = ce.type === "StringConstantExpressionAst" || ce.type === "ExpandableStringExpressionAst";
      args.push(isStringLiteral && ce.value != null ? ce.value : ce.text), elementTypes.push(mapElementType(ce.type, ce.expressionType));
      let rawChildren = ensureArray(ce.children);
      if (rawChildren.length > 0)
        hasChildren = !0, children.push(rawChildren.map((c3) => ({
          type: mapElementType(c3.type),
          text: c3.text
        })));
      else
        children.push(void 0);
    }
  }
  let result = {
    name: name3,
    nameType,
    elementType: "CommandAst",
    args,
    text: raw.text,
    elementTypes,
    ...hasChildren ? { children } : {}
  }, rawRedirs = ensureArray(raw.redirections);
  if (rawRedirs.length > 0)
    result.redirections = rawRedirs.map(transformRedirection);
  return result;
}
