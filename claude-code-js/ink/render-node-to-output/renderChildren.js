// function: renderChildren
function renderChildren(node, output, offsetX, offsetY, hasRemovedChild, prevScreen, inheritedBackgroundColor) {
  let seenDirtyChild = !1, seenDirtyClipped = !1;
  for (let childNode of node.childNodes) {
    let childElem = childNode, wasDirty = childElem.dirty, isAbsolute5 = childElem.style.position === "absolute";
    if (renderNodeToOutput(childElem, output, {
      offsetX,
      offsetY,
      prevScreen: hasRemovedChild || seenDirtyChild ? void 0 : prevScreen,
      skipSelfBlit: seenDirtyClipped && isAbsolute5 && !childElem.style.opaque && childElem.style.backgroundColor === void 0,
      inheritedBackgroundColor
    }), wasDirty && !seenDirtyChild)
      if (!clipsBothAxes(childElem) || isAbsolute5)
        seenDirtyChild = !0;
      else
        seenDirtyClipped = !0;
  }
}
