// Original: src/components/ui/TreeSelect.tsx
function TreeSelect(t0) {
  let $3 = import_compiler_runtime215.c(48), {
    nodes,
    onSelect,
    onCancel,
    onFocus,
    focusNodeId,
    visibleOptionCount,
    layout: t1,
    isDisabled: t2,
    hideIndexes: t3,
    isNodeExpanded,
    onExpand,
    onCollapse,
    getParentPrefix,
    getChildPrefix,
    onUpFromFirstItem
  } = t0, layout = t1 === void 0 ? "expanded" : t1, isDisabled = t2 === void 0 ? !1 : t2, hideIndexes = t3 === void 0 ? !1 : t3, t4;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ new Set, $3[0] = t4;
  else
    t4 = $3[0];
  let [internalExpandedIds, setInternalExpandedIds] = import_react158.default.useState(t4), isProgrammaticFocusRef = import_react158.default.useRef(!1), lastFocusedIdRef = import_react158.default.useRef(null), t5;
  if ($3[1] !== internalExpandedIds || $3[2] !== isNodeExpanded)
    t5 = (nodeId) => {
      if (isNodeExpanded)
        return isNodeExpanded(nodeId);
      return internalExpandedIds.has(nodeId);
    }, $3[1] = internalExpandedIds, $3[2] = isNodeExpanded, $3[3] = t5;
  else
    t5 = $3[3];
  let isExpanded = t5, result;
  if ($3[4] !== isExpanded || $3[5] !== nodes) {
    let traverse = function(node2, depth, parentId) {
      let hasChildren2 = !!node2.children && node2.children.length > 0, nodeIsExpanded = isExpanded(node2.id);
      if (result.push({
        node: node2,
        depth,
        isExpanded: nodeIsExpanded,
        hasChildren: hasChildren2,
        parentId
      }), hasChildren2 && nodeIsExpanded && node2.children)
        for (let child of node2.children)
          traverse(child, depth + 1, node2.id);
    };
    result = [];
    for (let node_0 of nodes)
      traverse(node_0, 0);
    $3[4] = isExpanded, $3[5] = nodes, $3[6] = result;
  } else
    result = $3[6];
  let flattenedNodes = result, defaultGetParentPrefix = _temp129, defaultGetChildPrefix = _temp248, parentPrefixFn = getParentPrefix ?? defaultGetParentPrefix, childPrefixFn = getChildPrefix ?? defaultGetChildPrefix, t6;
  if ($3[7] !== childPrefixFn || $3[8] !== parentPrefixFn)
    t6 = (flatNode) => {
      let prefix = "";
      if (flatNode.hasChildren)
        prefix = parentPrefixFn(flatNode.isExpanded);
      else if (flatNode.depth > 0)
        prefix = childPrefixFn(flatNode.depth);
      return prefix + flatNode.node.label;
    }, $3[7] = childPrefixFn, $3[8] = parentPrefixFn, $3[9] = t6;
  else
    t6 = $3[9];
  let buildLabel = t6, t7;
  if ($3[10] !== buildLabel || $3[11] !== flattenedNodes)
    t7 = flattenedNodes.map((flatNode_0) => ({
      label: buildLabel(flatNode_0),
      description: flatNode_0.node.description,
      dimDescription: flatNode_0.node.dimDescription ?? !0,
      value: flatNode_0.node.id
    })), $3[10] = buildLabel, $3[11] = flattenedNodes, $3[12] = t7;
  else
    t7 = $3[12];
  let options2 = t7, map8;
  if ($3[13] !== flattenedNodes)
    map8 = /* @__PURE__ */ new Map, flattenedNodes.forEach((fn) => map8.set(fn.node.id, fn.node)), $3[13] = flattenedNodes, $3[14] = map8;
  else
    map8 = $3[14];
  let nodeMap = map8, t8;
  if ($3[15] !== flattenedNodes)
    t8 = (nodeId_0) => flattenedNodes.find((fn_0) => fn_0.node.id === nodeId_0), $3[15] = flattenedNodes, $3[16] = t8;
  else
    t8 = $3[16];
  let findFlattenedNode = t8, t9;
  if ($3[17] !== findFlattenedNode || $3[18] !== onCollapse || $3[19] !== onExpand)
    t9 = (nodeId_1, shouldExpand) => {
      let flatNode_1 = findFlattenedNode(nodeId_1);
      if (!flatNode_1 || !flatNode_1.hasChildren)
        return;
      if (shouldExpand)
        if (onExpand)
          onExpand(nodeId_1);
        else
          setInternalExpandedIds((prev) => new Set(prev).add(nodeId_1));
      else if (onCollapse)
        onCollapse(nodeId_1);
      else
        setInternalExpandedIds((prev_0) => {
          let newSet = new Set(prev_0);
          return newSet.delete(nodeId_1), newSet;
        });
    }, $3[17] = findFlattenedNode, $3[18] = onCollapse, $3[19] = onExpand, $3[20] = t9;
  else
    t9 = $3[20];
  let toggleExpand = t9, t10;
  if ($3[21] !== findFlattenedNode || $3[22] !== focusNodeId || $3[23] !== isDisabled || $3[24] !== nodeMap || $3[25] !== onFocus || $3[26] !== toggleExpand)
    t10 = (e) => {
      if (!focusNodeId || isDisabled)
        return;
      let flatNode_2 = findFlattenedNode(focusNodeId);
      if (!flatNode_2)
        return;
      if (e.key === "right" && flatNode_2.hasChildren)
        e.preventDefault(), toggleExpand(focusNodeId, !0);
      else if (e.key === "left") {
        if (flatNode_2.hasChildren && flatNode_2.isExpanded)
          e.preventDefault(), toggleExpand(focusNodeId, !1);
        else if (flatNode_2.parentId !== void 0) {
          if (e.preventDefault(), isProgrammaticFocusRef.current = !0, toggleExpand(flatNode_2.parentId, !1), onFocus) {
            let parentNode = nodeMap.get(flatNode_2.parentId);
            if (parentNode)
              onFocus(parentNode);
          }
        }
      }
    }, $3[21] = findFlattenedNode, $3[22] = focusNodeId, $3[23] = isDisabled, $3[24] = nodeMap, $3[25] = onFocus, $3[26] = toggleExpand, $3[27] = t10;
  else
    t10 = $3[27];
  let handleKeyDown = t10, t11;
  if ($3[28] !== nodeMap || $3[29] !== onSelect)
    t11 = (nodeId_2) => {
      let node_1 = nodeMap.get(nodeId_2);
      if (!node_1)
        return;
      onSelect(node_1);
    }, $3[28] = nodeMap, $3[29] = onSelect, $3[30] = t11;
  else
    t11 = $3[30];
  let handleChange4 = t11, t12;
  if ($3[31] !== nodeMap || $3[32] !== onFocus)
    t12 = (nodeId_3) => {
      if (isProgrammaticFocusRef.current) {
        isProgrammaticFocusRef.current = !1;
        return;
      }
      if (lastFocusedIdRef.current === nodeId_3)
        return;
      if (lastFocusedIdRef.current = nodeId_3, onFocus) {
        let node_2 = nodeMap.get(nodeId_3);
        if (node_2)
          onFocus(node_2);
      }
    }, $3[31] = nodeMap, $3[32] = onFocus, $3[33] = t12;
  else
    t12 = $3[33];
  let handleFocus = t12, t13;
  if ($3[34] !== focusNodeId || $3[35] !== handleChange4 || $3[36] !== handleFocus || $3[37] !== hideIndexes || $3[38] !== isDisabled || $3[39] !== layout || $3[40] !== onCancel || $3[41] !== onUpFromFirstItem || $3[42] !== options2 || $3[43] !== visibleOptionCount)
    t13 = /* @__PURE__ */ jsx_dev_runtime271.jsxDEV(Select, {
      options: options2,
      onChange: handleChange4,
      onFocus: handleFocus,
      onCancel,
      defaultFocusValue: focusNodeId,
      visibleOptionCount,
      layout,
      isDisabled,
      hideIndexes,
      onUpFromFirstItem
    }, void 0, !1, void 0, this), $3[34] = focusNodeId, $3[35] = handleChange4, $3[36] = handleFocus, $3[37] = hideIndexes, $3[38] = isDisabled, $3[39] = layout, $3[40] = onCancel, $3[41] = onUpFromFirstItem, $3[42] = options2, $3[43] = visibleOptionCount, $3[44] = t13;
  else
    t13 = $3[44];
  let t14;
  if ($3[45] !== handleKeyDown || $3[46] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime271.jsxDEV(ThemedBox_default, {
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: t13
    }, void 0, !1, void 0, this), $3[45] = handleKeyDown, $3[46] = t13, $3[47] = t14;
  else
    t14 = $3[47];
  return t14;
}
function _temp248(_depth) {
  return "  \u25B8 ";
}
function _temp129(isExpanded_0) {
  return isExpanded_0 ? "\u25BC " : "\u25B6 ";
}
var import_compiler_runtime215, import_react158, jsx_dev_runtime271;
var init_TreeSelect = __esm(() => {
  init_ink2();
  init_select();
  import_compiler_runtime215 = __toESM(require_react_compiler_runtime_development(), 1), import_react158 = __toESM(require_react_development(), 1), jsx_dev_runtime271 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
