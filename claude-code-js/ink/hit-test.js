// Original: src/ink/hit-test.ts
function hitTest(node, col, row) {
  let rect = nodeCache.get(node);
  if (!rect)
    return null;
  if (col < rect.x || col >= rect.x + rect.width || row < rect.y || row >= rect.y + rect.height)
    return null;
  for (let i4 = node.childNodes.length - 1;i4 >= 0; i4--) {
    let child = node.childNodes[i4];
    if (child.nodeName === "#text")
      continue;
    let hit = hitTest(child, col, row);
    if (hit)
      return hit;
  }
  return node;
}
function dispatchClick(root2, col, row, cellIsBlank = !1) {
  let target = hitTest(root2, col, row) ?? void 0;
  if (!target)
    return !1;
  if (root2.focusManager) {
    let focusTarget = target;
    while (focusTarget) {
      if (typeof focusTarget.attributes.tabIndex === "number") {
        root2.focusManager.handleClickFocus(focusTarget);
        break;
      }
      focusTarget = focusTarget.parentNode;
    }
  }
  let event = new ClickEvent(col, row, cellIsBlank), handled = !1;
  while (target) {
    let handler = target._eventHandlers?.onClick;
    if (handler) {
      handled = !0;
      let rect = nodeCache.get(target);
      if (rect)
        event.localCol = col - rect.x, event.localRow = row - rect.y;
      if (handler(event), event.didStopImmediatePropagation())
        return !0;
    }
    target = target.parentNode;
  }
  return handled;
}
function dispatchHover(root2, col, row, hovered) {
  let next = /* @__PURE__ */ new Set, node = hitTest(root2, col, row) ?? void 0;
  while (node) {
    let h4 = node._eventHandlers;
    if (h4?.onMouseEnter || h4?.onMouseLeave)
      next.add(node);
    node = node.parentNode;
  }
  for (let old of hovered)
    if (!next.has(old)) {
      if (hovered.delete(old), old.parentNode)
        old._eventHandlers?.onMouseLeave?.();
    }
  for (let n5 of next)
    if (!hovered.has(n5))
      hovered.add(n5), n5._eventHandlers?.onMouseEnter?.();
}
var init_hit_test = __esm(() => {
  init_click_event();
  init_node_cache();
});
