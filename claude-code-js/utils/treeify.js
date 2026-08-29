// Original: src/utils/treeify.ts
function treeify(obj, options2 = {}) {
  let {
    showValues = !0,
    hideFunctions = !1,
    themeName = "dark",
    treeCharColors = {}
  } = options2, lines2 = [], visited = /* @__PURE__ */ new WeakSet;
  function colorize2(text2, colorKey) {
    if (!colorKey)
      return text2;
    return color(colorKey, themeName)(text2);
  }
  function growBranch(node2, prefix, _isLast, depth = 0) {
    if (typeof node2 === "string") {
      lines2.push(prefix + colorize2(node2, treeCharColors.value));
      return;
    }
    if (typeof node2 !== "object" || node2 === null) {
      if (showValues) {
        let valueStr = String(node2);
        lines2.push(prefix + colorize2(valueStr, treeCharColors.value));
      }
      return;
    }
    if (visited.has(node2)) {
      lines2.push(prefix + colorize2("[Circular]", treeCharColors.value));
      return;
    }
    visited.add(node2);
    let keys4 = Object.keys(node2).filter((key3) => {
      let value = node2[key3];
      if (hideFunctions && typeof value === "function")
        return !1;
      return !0;
    });
    keys4.forEach((key3, index) => {
      let value = node2[key3], isLastKey = index === keys4.length - 1, nodePrefix = depth === 0 && index === 0 ? "" : prefix, treeChar = isLastKey ? DEFAULT_TREE_CHARS.lastBranch : DEFAULT_TREE_CHARS.branch, coloredTreeChar = colorize2(treeChar, treeCharColors.treeChar), coloredKey = key3.trim() === "" ? "" : colorize2(key3, treeCharColors.key), line = nodePrefix + coloredTreeChar + (coloredKey ? " " + coloredKey : ""), shouldAddColon = key3.trim() !== "";
      if (value && typeof value === "object" && visited.has(value)) {
        let coloredValue = colorize2("[Circular]", treeCharColors.value);
        lines2.push(line + (shouldAddColon ? ": " : line ? " " : "") + coloredValue);
      } else if (value && typeof value === "object" && !Array.isArray(value)) {
        lines2.push(line);
        let continuationChar = isLastKey ? DEFAULT_TREE_CHARS.empty : DEFAULT_TREE_CHARS.line, coloredContinuation = colorize2(continuationChar, treeCharColors.treeChar), nextPrefix = nodePrefix + coloredContinuation + " ";
        growBranch(value, nextPrefix, isLastKey, depth + 1);
      } else if (Array.isArray(value))
        lines2.push(line + (shouldAddColon ? ": " : line ? " " : "") + "[Array(" + value.length + ")]");
      else if (showValues) {
        let valueStr = typeof value === "function" ? "[Function]" : String(value), coloredValue = colorize2(valueStr, treeCharColors.value);
        line += (shouldAddColon ? ": " : line ? " " : "") + coloredValue, lines2.push(line);
      } else
        lines2.push(line);
    });
  }
  let keys3 = Object.keys(obj);
  if (keys3.length === 0)
    return colorize2("(empty)", treeCharColors.value);
  if (keys3.length === 1 && keys3[0] !== void 0 && keys3[0].trim() === "" && typeof obj[keys3[0]] === "string") {
    let firstKey = keys3[0], coloredTreeChar = colorize2(DEFAULT_TREE_CHARS.lastBranch, treeCharColors.treeChar), coloredValue = colorize2(obj[firstKey], treeCharColors.value);
    return coloredTreeChar + " " + coloredValue;
  }
  return growBranch(obj, "", !0), lines2.join(`
`);
}
var DEFAULT_TREE_CHARS;
var init_treeify = __esm(() => {
  init_figures();
  init_color();
  DEFAULT_TREE_CHARS = {
    branch: figures_default.lineUpDownRight,
    lastBranch: figures_default.lineUpRight,
    line: figures_default.lineVertical,
    empty: " "
  };
});
