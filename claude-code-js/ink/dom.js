// Original: src/ink/dom.ts
function collectRemovedRects(parent, removed, underAbsolute = !1) {
  if (removed.nodeName === "#text")
    return;
  let elem = removed, isAbsolute5 = underAbsolute || elem.style.position === "absolute", cached2 = nodeCache.get(elem);
  if (cached2)
    addPendingClear(parent, cached2, isAbsolute5), nodeCache.delete(elem);
  for (let child of elem.childNodes)
    collectRemovedRects(parent, child, isAbsolute5);
}
function stylesEqual(a2, b) {
  return shallowEqual(a2, b);
}
function shallowEqual(a2, b) {
  if (a2 === b)
    return !0;
  if (a2 === void 0 || b === void 0)
    return !1;
  let aKeys = Object.keys(a2), bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length)
    return !1;
  for (let key of aKeys)
    if (a2[key] !== b[key])
      return !1;
  return !0;
}
function isDOMElement(node) {
  return node.nodeName !== "#text";
}
function findOwnerChainAtRow(root2, y2) {
  let best = [];
  return walk(root2, 0), best;
  function walk(node, offsetY) {
    let yoga = node.yogaNode;
    if (!yoga || yoga.getDisplay() === LayoutDisplay.None)
      return;
    let top = offsetY + yoga.getComputedTop(), height = yoga.getComputedHeight();
    if (y2 < top || y2 >= top + height)
      return;
    if (node.debugOwnerChain)
      best = node.debugOwnerChain;
    for (let child of node.childNodes)
      if (isDOMElement(child))
        walk(child, top);
  }
}
var createNode = (nodeName) => {
  let node = {
    nodeName,
    style: {},
    attributes: {},
    childNodes: [],
    parentNode: void 0,
    yogaNode: nodeName !== "ink-virtual-text" && nodeName !== "ink-link" && nodeName !== "ink-progress" ? createLayoutNode() : void 0,
    dirty: !1
  };
  if (nodeName === "ink-text")
    node.yogaNode?.setMeasureFunc(measureTextNode.bind(null, node));
  else if (nodeName === "ink-raw-ansi")
    node.yogaNode?.setMeasureFunc(measureRawAnsiNode.bind(null, node));
  return node;
}, appendChildNode = (node, childNode) => {
  if (childNode.parentNode)
    removeChildNode(childNode.parentNode, childNode);
  if (childNode.parentNode = node, node.childNodes.push(childNode), childNode.yogaNode)
    node.yogaNode?.insertChild(childNode.yogaNode, node.yogaNode.getChildCount());
  markDirty(node);
}, insertBeforeNode = (node, newChildNode, beforeChildNode) => {
  if (newChildNode.parentNode)
    removeChildNode(newChildNode.parentNode, newChildNode);
  newChildNode.parentNode = node;
  let index = node.childNodes.indexOf(beforeChildNode);
  if (index >= 0) {
    let yogaIndex = 0;
    if (newChildNode.yogaNode && node.yogaNode) {
      for (let i4 = 0;i4 < index; i4++)
        if (node.childNodes[i4]?.yogaNode)
          yogaIndex++;
    }
    if (node.childNodes.splice(index, 0, newChildNode), newChildNode.yogaNode && node.yogaNode)
      node.yogaNode.insertChild(newChildNode.yogaNode, yogaIndex);
    markDirty(node);
    return;
  }
  if (node.childNodes.push(newChildNode), newChildNode.yogaNode)
    node.yogaNode?.insertChild(newChildNode.yogaNode, node.yogaNode.getChildCount());
  markDirty(node);
}, removeChildNode = (node, removeNode) => {
  if (removeNode.yogaNode)
    removeNode.parentNode?.yogaNode?.removeChild(removeNode.yogaNode);
  collectRemovedRects(node, removeNode), removeNode.parentNode = void 0;
  let index = node.childNodes.indexOf(removeNode);
  if (index >= 0)
    node.childNodes.splice(index, 1);
  markDirty(node);
}, setAttribute = (node, key, value) => {
  if (key === "children")
    return;
  if (node.attributes[key] === value)
    return;
  node.attributes[key] = value, markDirty(node);
}, setStyle = (node, style) => {
  if (stylesEqual(node.style, style))
    return;
  node.style = style, markDirty(node);
}, setTextStyles = (node, textStyles) => {
  if (shallowEqual(node.textStyles, textStyles))
    return;
  node.textStyles = textStyles, markDirty(node);
}, createTextNode = (text) => {
  let node = {
    nodeName: "#text",
    nodeValue: text,
    yogaNode: void 0,
    parentNode: void 0,
    style: {}
  };
  return setTextNodeValue(node, text), node;
}, measureTextNode = function(node, width, widthMode) {
  let rawText = node.nodeName === "#text" ? node.nodeValue : squash_text_nodes_default(node), text = expandTabs(rawText), dimensions = measure_text_default(text, width);
  if (dimensions.width <= width)
    return dimensions;
  if (dimensions.width >= 1 && width > 0 && width < 1)
    return dimensions;
  if (text.includes(`
`) && widthMode === LayoutMeasureMode.Undefined) {
    let effectiveWidth = Math.max(width, dimensions.width);
    return measure_text_default(text, effectiveWidth);
  }
  let textWrap = node.style?.textWrap ?? "wrap", wrappedText = wrapText2(text, width, textWrap);
  return measure_text_default(wrappedText, width);
}, measureRawAnsiNode = function(node) {
  return {
    width: node.attributes.rawWidth,
    height: node.attributes.rawHeight
  };
}, markDirty = (node) => {
  let current = node, markedYoga = !1;
  while (current) {
    if (current.nodeName !== "#text") {
      if (current.dirty = !0, !markedYoga && (current.nodeName === "ink-text" || current.nodeName === "ink-raw-ansi") && current.yogaNode)
        current.yogaNode.markDirty(), markedYoga = !0;
    }
    current = current.parentNode;
  }
}, scheduleRenderFrom = (node) => {
  let cur = node;
  while (cur?.parentNode)
    cur = cur.parentNode;
  if (cur && cur.nodeName !== "#text")
    cur.onRender?.();
}, setTextNodeValue = (node, text) => {
  if (typeof text !== "string")
    text = String(text);
  if (node.nodeValue === text)
    return;
  node.nodeValue = text, markDirty(node);
}, clearYogaNodeReferences = (node) => {
  if ("childNodes" in node)
    for (let child of node.childNodes)
      clearYogaNodeReferences(child);
  node.yogaNode = void 0;
};
var init_dom = __esm(() => {
  init_engine();
  init_node4();
  init_measure_text();
  init_node_cache();
  init_squash_text_nodes();
  init_tabstops();
  init_wrap_text();
});
