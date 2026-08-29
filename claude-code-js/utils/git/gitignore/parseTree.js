// function: parseTree
function parseTree(text, errors3 = [], options = ParseOptions.DEFAULT) {
  let currentParent = { type: "array", offset: -1, length: -1, children: [], parent: void 0 };
  function ensurePropertyComplete(endOffset) {
    if (currentParent.type === "property")
      currentParent.length = endOffset - currentParent.offset, currentParent = currentParent.parent;
  }
  function onValue(valueNode) {
    return currentParent.children.push(valueNode), valueNode;
  }
  visit(text, {
    onObjectBegin: (offset) => {
      currentParent = onValue({ type: "object", offset, length: -1, parent: currentParent, children: [] });
    },
    onObjectProperty: (name, offset, length) => {
      currentParent = onValue({ type: "property", offset, length: -1, parent: currentParent, children: [] }), currentParent.children.push({ type: "string", value: name, offset, length, parent: currentParent });
    },
    onObjectEnd: (offset, length) => {
      ensurePropertyComplete(offset + length), currentParent.length = offset + length - currentParent.offset, currentParent = currentParent.parent, ensurePropertyComplete(offset + length);
    },
    onArrayBegin: (offset, length) => {
      currentParent = onValue({ type: "array", offset, length: -1, parent: currentParent, children: [] });
    },
    onArrayEnd: (offset, length) => {
      currentParent.length = offset + length - currentParent.offset, currentParent = currentParent.parent, ensurePropertyComplete(offset + length);
    },
    onLiteralValue: (value, offset, length) => {
      onValue({ type: getNodeType(value), offset, length, parent: currentParent, value }), ensurePropertyComplete(offset + length);
    },
    onSeparator: (sep4, offset, length) => {
      if (currentParent.type === "property") {
        if (sep4 === ":")
          currentParent.colonOffset = offset;
        else if (sep4 === ",")
          ensurePropertyComplete(offset);
      }
    },
    onError: (error41, offset, length) => {
      errors3.push({ error: error41, offset, length });
    }
  }, options);
  let result = currentParent.children[0];
  if (result)
    delete result.parent;
  return result;
}
