// function: nodeTypeId
function nodeTypeId(nodeType) {
  if (!nodeType)
    return -2;
  if (nodeType === "ERROR")
    return -1;
  let i5 = DANGEROUS_TYPE_IDS.indexOf(nodeType);
  return i5 >= 0 ? i5 + 1 : 0;
}
