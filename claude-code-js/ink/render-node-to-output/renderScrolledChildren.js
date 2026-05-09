// function: renderScrolledChildren
function renderScrolledChildren(node, output, offsetX, offsetY, hasRemovedChild, prevScreen, scrollTopY, scrollBottomY, inheritedBackgroundColor, preserveCulledCache = !1) {
  let seenDirtyChild = !1, cumHeightShift = 0;
  for (let childNode of node.childNodes) {
    let childElem = childNode, cy = childElem.yogaNode;
    if (cy) {
      let cached2 = nodeCache.get(childElem), top, height;
      if (cached2?.top !== void 0 && !childElem.dirty && cumHeightShift === 0)
        top = cached2.top, height = cached2.height;
      else {
        if (top = cy.getComputedTop(), height = cy.getComputedHeight(), childElem.dirty)
          cumHeightShift += height - (cached2 ? cached2.height : 0);
        if (cached2)
          cached2.top = top;
      }
      if (top + height <= scrollTopY || top >= scrollBottomY) {
        if (!preserveCulledCache)
          dropSubtreeCache(childElem);
        continue;
      }
    }
    let wasDirty = childElem.dirty;
    if (renderNodeToOutput(childElem, output, {
      offsetX,
      offsetY,
      prevScreen: hasRemovedChild || seenDirtyChild ? void 0 : prevScreen,
      inheritedBackgroundColor
    }), wasDirty)
      seenDirtyChild = !0;
  }
}
