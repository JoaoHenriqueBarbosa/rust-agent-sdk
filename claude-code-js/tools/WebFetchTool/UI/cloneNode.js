// function: cloneNode
function cloneNode(node, recursive = !1) {
  let result;
  if (isText(node))
    result = new Text4(node.data);
  else if (isComment(node))
    result = new Comment2(node.data);
  else if (isTag2(node)) {
    let children = recursive ? cloneChildren(node.children) : [], clone3 = new Element(node.name, { ...node.attribs }, children);
    if (children.forEach((child) => child.parent = clone3), node.namespace != null)
      clone3.namespace = node.namespace;
    if (node["x-attribsNamespace"])
      clone3["x-attribsNamespace"] = { ...node["x-attribsNamespace"] };
    if (node["x-attribsPrefix"])
      clone3["x-attribsPrefix"] = { ...node["x-attribsPrefix"] };
    result = clone3;
  } else if (isCDATA(node)) {
    let children = recursive ? cloneChildren(node.children) : [], clone3 = new CDATA2(children);
    children.forEach((child) => child.parent = clone3), result = clone3;
  } else if (isDocument(node)) {
    let children = recursive ? cloneChildren(node.children) : [], clone3 = new Document(children);
    if (children.forEach((child) => child.parent = clone3), node["x-mode"])
      clone3["x-mode"] = node["x-mode"];
    result = clone3;
  } else if (isDirective(node)) {
    let instruction = new ProcessingInstruction(node.name, node.data);
    if (node["x-name"] != null)
      instruction["x-name"] = node["x-name"], instruction["x-publicId"] = node["x-publicId"], instruction["x-systemId"] = node["x-systemId"];
    result = instruction;
  } else
    throw Error(`Not implemented yet: ${node.type}`);
  if (result.startIndex = node.startIndex, result.endIndex = node.endIndex, node.sourceCodeLocation != null)
    result.sourceCodeLocation = node.sourceCodeLocation;
  return result;
}
