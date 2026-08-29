// function: setProperty
function setProperty(text, originalPath, value, options) {
  let path9 = originalPath.slice(), root2 = parseTree(text, []), parent = void 0, lastSegment = void 0;
  while (path9.length > 0)
    if (lastSegment = path9.pop(), parent = findNodeAtLocation(root2, path9), parent === void 0 && value !== void 0)
      if (typeof lastSegment === "string")
        value = { [lastSegment]: value };
      else
        value = [value];
    else
      break;
  if (!parent) {
    if (value === void 0)
      throw Error("Can not delete in empty document");
    return withFormatting(text, { offset: root2 ? root2.offset : 0, length: root2 ? root2.length : 0, content: JSON.stringify(value) }, options);
  } else if (parent.type === "object" && typeof lastSegment === "string" && Array.isArray(parent.children)) {
    let existing = findNodeAtLocation(parent, [lastSegment]);
    if (existing !== void 0)
      if (value === void 0) {
        if (!existing.parent)
          throw Error("Malformed AST");
        let propertyIndex = parent.children.indexOf(existing.parent), removeBegin, removeEnd = existing.parent.offset + existing.parent.length;
        if (propertyIndex > 0) {
          let previous = parent.children[propertyIndex - 1];
          removeBegin = previous.offset + previous.length;
        } else if (removeBegin = parent.offset + 1, parent.children.length > 1)
          removeEnd = parent.children[1].offset;
        return withFormatting(text, { offset: removeBegin, length: removeEnd - removeBegin, content: "" }, options);
      } else
        return withFormatting(text, { offset: existing.offset, length: existing.length, content: JSON.stringify(value) }, options);
    else {
      if (value === void 0)
        return [];
      let newProperty = `${JSON.stringify(lastSegment)}: ${JSON.stringify(value)}`, index = options.getInsertionIndex ? options.getInsertionIndex(parent.children.map((p) => p.children[0].value)) : parent.children.length, edit;
      if (index > 0) {
        let previous = parent.children[index - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      } else if (parent.children.length === 0)
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      else
        edit = { offset: parent.offset + 1, length: 0, content: newProperty + "," };
      return withFormatting(text, edit, options);
    }
  } else if (parent.type === "array" && typeof lastSegment === "number" && Array.isArray(parent.children)) {
    let insertIndex = lastSegment;
    if (insertIndex === -1) {
      let newProperty = `${JSON.stringify(value)}`, edit;
      if (parent.children.length === 0)
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      else {
        let previous = parent.children[parent.children.length - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text, edit, options);
    } else if (value === void 0 && parent.children.length >= 0) {
      let removalIndex = lastSegment, toRemove = parent.children[removalIndex], edit;
      if (parent.children.length === 1)
        edit = { offset: parent.offset + 1, length: parent.length - 2, content: "" };
      else if (parent.children.length - 1 === removalIndex) {
        let previous = parent.children[removalIndex - 1], offset = previous.offset + previous.length, parentEndOffset = parent.offset + parent.length;
        edit = { offset, length: parentEndOffset - 2 - offset, content: "" };
      } else
        edit = { offset: toRemove.offset, length: parent.children[removalIndex + 1].offset - toRemove.offset, content: "" };
      return withFormatting(text, edit, options);
    } else if (value !== void 0) {
      let edit, newProperty = `${JSON.stringify(value)}`;
      if (!options.isArrayInsertion && parent.children.length > lastSegment) {
        let toModify = parent.children[lastSegment];
        edit = { offset: toModify.offset, length: toModify.length, content: newProperty };
      } else if (parent.children.length === 0 || lastSegment === 0)
        edit = { offset: parent.offset + 1, length: 0, content: parent.children.length === 0 ? newProperty : newProperty + "," };
      else {
        let index = lastSegment > parent.children.length ? parent.children.length : lastSegment, previous = parent.children[index - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text, edit, options);
    } else
      throw Error(`Can not ${value === void 0 ? "remove" : options.isArrayInsertion ? "insert" : "modify"} Array index ${insertIndex} as length is not sufficient`);
  } else
    throw Error(`Can not add ${typeof lastSegment !== "number" ? "index" : "property"} to parent of type ${parent.type}`);
}
