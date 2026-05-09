// function: transformExpressionElement
function transformExpressionElement(raw) {
  let elementType = raw.type === "ParenExpressionAst" ? "ParenExpressionAst" : "CommandExpressionAst", elementTypes = [
    mapElementType(raw.type, raw.expressionType)
  ];
  return {
    name: raw.text,
    nameType: "unknown",
    elementType,
    args: [],
    text: raw.text,
    elementTypes
  };
}
