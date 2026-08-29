// Original: src/components/diff/DiffFileList.tsx
function DiffFileList(t0) {
  let $3 = import_compiler_runtime151.c(36), {
    files: files2,
    selectedIndex
  } = t0, {
    columns
  } = useTerminalSize(), t1;
  bb0: {
    if (files2.length === 0 || files2.length <= MAX_VISIBLE_FILES) {
      let t23;
      if ($3[0] !== files2.length)
        t23 = {
          startIndex: 0,
          endIndex: files2.length
        }, $3[0] = files2.length, $3[1] = t23;
      else
        t23 = $3[1];
      t1 = t23;
      break bb0;
    }
    let start = Math.max(0, selectedIndex - Math.floor(MAX_VISIBLE_FILES / 2)), end = start + MAX_VISIBLE_FILES;
    if (end > files2.length)
      end = files2.length, start = Math.max(0, end - MAX_VISIBLE_FILES);
    let t22;
    if ($3[2] !== end || $3[3] !== start)
      t22 = {
        startIndex: start,
        endIndex: end
      }, $3[2] = end, $3[3] = start, $3[4] = t22;
    else
      t22 = $3[4];
    t1 = t22;
  }
  let {
    startIndex,
    endIndex
  } = t1;
  if (files2.length === 0) {
    let t22;
    if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "No changed files"
      }, void 0, !1, void 0, this), $3[5] = t22;
    else
      t22 = $3[5];
    return t22;
  }
  let T0, hasMoreBelow, needsPagination, t2, t3, t4;
  if ($3[6] !== columns || $3[7] !== endIndex || $3[8] !== files2 || $3[9] !== selectedIndex || $3[10] !== startIndex) {
    let visibleFiles = files2.slice(startIndex, endIndex), hasMoreAbove = startIndex > 0;
    hasMoreBelow = endIndex < files2.length, needsPagination = files2.length > MAX_VISIBLE_FILES;
    let maxPathWidth = Math.max(20, columns - 16 - 3 - 4);
    if (T0 = ThemedBox_default, t2 = "column", $3[17] !== hasMoreAbove || $3[18] !== needsPagination || $3[19] !== startIndex)
      t3 = needsPagination && /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
        dimColor: !0,
        children: hasMoreAbove ? ` \u2191 ${startIndex} more ${plural(startIndex, "file")}` : " "
      }, void 0, !1, void 0, this), $3[17] = hasMoreAbove, $3[18] = needsPagination, $3[19] = startIndex, $3[20] = t3;
    else
      t3 = $3[20];
    let t52;
    if ($3[21] !== maxPathWidth || $3[22] !== selectedIndex || $3[23] !== startIndex)
      t52 = (file2, index) => /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(FileItem, {
        file: file2,
        isSelected: startIndex + index === selectedIndex,
        maxPathWidth
      }, file2.path, !1, void 0, this), $3[21] = maxPathWidth, $3[22] = selectedIndex, $3[23] = startIndex, $3[24] = t52;
    else
      t52 = $3[24];
    t4 = visibleFiles.map(t52), $3[6] = columns, $3[7] = endIndex, $3[8] = files2, $3[9] = selectedIndex, $3[10] = startIndex, $3[11] = T0, $3[12] = hasMoreBelow, $3[13] = needsPagination, $3[14] = t2, $3[15] = t3, $3[16] = t4;
  } else
    T0 = $3[11], hasMoreBelow = $3[12], needsPagination = $3[13], t2 = $3[14], t3 = $3[15], t4 = $3[16];
  let t5;
  if ($3[25] !== endIndex || $3[26] !== files2.length || $3[27] !== hasMoreBelow || $3[28] !== needsPagination)
    t5 = needsPagination && /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
      dimColor: !0,
      children: hasMoreBelow ? ` \u2193 ${files2.length - endIndex} more ${plural(files2.length - endIndex, "file")}` : " "
    }, void 0, !1, void 0, this), $3[25] = endIndex, $3[26] = files2.length, $3[27] = hasMoreBelow, $3[28] = needsPagination, $3[29] = t5;
  else
    t5 = $3[29];
  let t6;
  if ($3[30] !== T0 || $3[31] !== t2 || $3[32] !== t3 || $3[33] !== t4 || $3[34] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(T0, {
      flexDirection: t2,
      children: [
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[30] = T0, $3[31] = t2, $3[32] = t3, $3[33] = t4, $3[34] = t5, $3[35] = t6;
  else
    t6 = $3[35];
  return t6;
}
function FileItem(t0) {
  let $3 = import_compiler_runtime151.c(14), {
    file: file2,
    isSelected,
    maxPathWidth
  } = t0, t1;
  if ($3[0] !== file2.path || $3[1] !== maxPathWidth)
    t1 = truncateStartToWidth(file2.path, maxPathWidth), $3[0] = file2.path, $3[1] = maxPathWidth, $3[2] = t1;
  else
    t1 = $3[2];
  let displayPath = t1, line = `${isSelected ? figures_default.pointer + " " : "  "}${displayPath}`, t2 = isSelected ? "background" : void 0, t3;
  if ($3[3] !== isSelected || $3[4] !== line || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
      bold: isSelected,
      color: t2,
      inverse: isSelected,
      children: line
    }, void 0, !1, void 0, this), $3[3] = isSelected, $3[4] = line, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  let t4;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedBox_default, {
      flexGrow: 1
    }, void 0, !1, void 0, this), $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== file2 || $3[9] !== isSelected)
    t5 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(FileStats, {
      file: file2,
      isSelected
    }, void 0, !1, void 0, this), $3[8] = file2, $3[9] = isSelected, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== t3 || $3[12] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[11] = t3, $3[12] = t5, $3[13] = t6;
  else
    t6 = $3[13];
  return t6;
}
function FileStats(t0) {
  let $3 = import_compiler_runtime151.c(20), {
    file: file2,
    isSelected
  } = t0;
  if (file2.isUntracked) {
    let t12 = !isSelected, t22;
    if ($3[0] !== t12)
      t22 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
        dimColor: t12,
        italic: !0,
        children: "untracked"
      }, void 0, !1, void 0, this), $3[0] = t12, $3[1] = t22;
    else
      t22 = $3[1];
    return t22;
  }
  if (file2.isBinary) {
    let t12 = !isSelected, t22;
    if ($3[2] !== t12)
      t22 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
        dimColor: t12,
        italic: !0,
        children: "Binary file"
      }, void 0, !1, void 0, this), $3[2] = t12, $3[3] = t22;
    else
      t22 = $3[3];
    return t22;
  }
  if (file2.isLargeFile) {
    let t12 = !isSelected, t22;
    if ($3[4] !== t12)
      t22 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
        dimColor: t12,
        italic: !0,
        children: "Large file modified"
      }, void 0, !1, void 0, this), $3[4] = t12, $3[5] = t22;
    else
      t22 = $3[5];
    return t22;
  }
  let t1;
  if ($3[6] !== file2.linesAdded || $3[7] !== isSelected)
    t1 = file2.linesAdded > 0 && /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
      color: "diffAddedWord",
      bold: isSelected,
      children: [
        "+",
        file2.linesAdded
      ]
    }, void 0, !0, void 0, this), $3[6] = file2.linesAdded, $3[7] = isSelected, $3[8] = t1;
  else
    t1 = $3[8];
  let t2 = file2.linesAdded > 0 && file2.linesRemoved > 0 && " ", t3;
  if ($3[9] !== file2.linesRemoved || $3[10] !== isSelected)
    t3 = file2.linesRemoved > 0 && /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
      color: "diffRemovedWord",
      bold: isSelected,
      children: [
        "-",
        file2.linesRemoved
      ]
    }, void 0, !0, void 0, this), $3[9] = file2.linesRemoved, $3[10] = isSelected, $3[11] = t3;
  else
    t3 = $3[11];
  let t4;
  if ($3[12] !== file2.isTruncated || $3[13] !== isSelected)
    t4 = file2.isTruncated && /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
      dimColor: !isSelected,
      children: " (truncated)"
    }, void 0, !1, void 0, this), $3[12] = file2.isTruncated, $3[13] = isSelected, $3[14] = t4;
  else
    t4 = $3[14];
  let t5;
  if ($3[15] !== t1 || $3[16] !== t2 || $3[17] !== t3 || $3[18] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime190.jsxDEV(ThemedText, {
      children: [
        t1,
        t2,
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[15] = t1, $3[16] = t2, $3[17] = t3, $3[18] = t4, $3[19] = t5;
  else
    t5 = $3[19];
  return t5;
}
var import_compiler_runtime151, jsx_dev_runtime190, MAX_VISIBLE_FILES = 5;
var init_DiffFileList = __esm(() => {
  init_figures();
  init_useTerminalSize();
  init_ink2();
  init_format();
  import_compiler_runtime151 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime190 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
