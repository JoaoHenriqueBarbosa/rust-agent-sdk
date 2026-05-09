// Original: src/ink/focus.ts
class FocusManager {
  activeElement = null;
  dispatchFocusEvent;
  enabled = !0;
  focusStack = [];
  constructor(dispatchFocusEvent) {
    this.dispatchFocusEvent = dispatchFocusEvent;
  }
  focus(node) {
    if (node === this.activeElement)
      return;
    if (!this.enabled)
      return;
    let previous = this.activeElement;
    if (previous) {
      let idx = this.focusStack.indexOf(previous);
      if (idx !== -1)
        this.focusStack.splice(idx, 1);
      if (this.focusStack.push(previous), this.focusStack.length > MAX_FOCUS_STACK)
        this.focusStack.shift();
      this.dispatchFocusEvent(previous, new FocusEvent("blur", node));
    }
    this.activeElement = node, this.dispatchFocusEvent(node, new FocusEvent("focus", previous));
  }
  blur() {
    if (!this.activeElement)
      return;
    let previous = this.activeElement;
    this.activeElement = null, this.dispatchFocusEvent(previous, new FocusEvent("blur", null));
  }
  handleNodeRemoved(node, root2) {
    if (this.focusStack = this.focusStack.filter((n5) => n5 !== node && isInTree(n5, root2)), !this.activeElement)
      return;
    if (this.activeElement !== node && isInTree(this.activeElement, root2))
      return;
    let removed = this.activeElement;
    this.activeElement = null, this.dispatchFocusEvent(removed, new FocusEvent("blur", null));
    while (this.focusStack.length > 0) {
      let candidate = this.focusStack.pop();
      if (isInTree(candidate, root2)) {
        this.activeElement = candidate, this.dispatchFocusEvent(candidate, new FocusEvent("focus", removed));
        return;
      }
    }
  }
  handleAutoFocus(node) {
    this.focus(node);
  }
  handleClickFocus(node) {
    if (typeof node.attributes.tabIndex !== "number")
      return;
    this.focus(node);
  }
  enable() {
    this.enabled = !0;
  }
  disable() {
    this.enabled = !1;
  }
  focusNext(root2) {
    this.moveFocus(1, root2);
  }
  focusPrevious(root2) {
    this.moveFocus(-1, root2);
  }
  moveFocus(direction, root2) {
    if (!this.enabled)
      return;
    let tabbable = collectTabbable(root2);
    if (tabbable.length === 0)
      return;
    let currentIndex = this.activeElement ? tabbable.indexOf(this.activeElement) : -1, nextIndex = currentIndex === -1 ? direction === 1 ? 0 : tabbable.length - 1 : (currentIndex + direction + tabbable.length) % tabbable.length, next = tabbable[nextIndex];
    if (next)
      this.focus(next);
  }
}
function collectTabbable(root2) {
  let result = [];
  return walkTree(root2, result), result;
}
function walkTree(node, result) {
  let tabIndex = node.attributes.tabIndex;
  if (typeof tabIndex === "number" && tabIndex >= 0)
    result.push(node);
  for (let child of node.childNodes)
    if (child.nodeName !== "#text")
      walkTree(child, result);
}
function isInTree(node, root2) {
  let current = node;
  while (current) {
    if (current === root2)
      return !0;
    current = current.parentNode;
  }
  return !1;
}
function getRootNode(node) {
  let current = node;
  while (current) {
    if (current.focusManager)
      return current;
    current = current.parentNode;
  }
  throw Error("Node is not in a tree with a FocusManager");
}
function getFocusManager(node) {
  return getRootNode(node).focusManager;
}
var MAX_FOCUS_STACK = 32;
var init_focus = __esm(() => {
  init_focus_event();
});
