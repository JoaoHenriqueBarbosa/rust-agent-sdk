// Original: src/components/diff/DiffDialog.tsx
var exports_DiffDialog = {};
__export(exports_DiffDialog, {
  DiffDialog: () => DiffDialog
});
function turnDiffToDiffData(turn) {
  let files2 = Array.from(turn.files.values()).map((f) => ({
    path: f.filePath,
    linesAdded: f.linesAdded,
    linesRemoved: f.linesRemoved,
    isBinary: !1,
    isLargeFile: !1,
    isTruncated: !1,
    isNewFile: f.isNewFile
  })).sort((a2, b) => a2.path.localeCompare(b.path)), hunks = /* @__PURE__ */ new Map;
  for (let f of turn.files.values())
    hunks.set(f.filePath, f.hunks);
  return {
    stats: {
      filesCount: turn.stats.filesChanged,
      linesAdded: turn.stats.linesAdded,
      linesRemoved: turn.stats.linesRemoved
    },
    files: files2,
    hunks,
    loading: !1
  };
}
function DiffDialog(t0) {
  let $3 = import_compiler_runtime152.c(73), {
    messages,
    onDone
  } = t0, gitDiffData = useDiffData(), turnDiffs = useTurnDiffs(messages), [viewMode, setViewMode] = import_react111.useState("list"), [selectedIndex, setSelectedIndex] = import_react111.useState(0), [sourceIndex, setSourceIndex] = import_react111.useState(0), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      type: "current"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  let t2;
  if ($3[1] !== turnDiffs)
    t2 = [t1, ...turnDiffs.map(_temp78)], $3[1] = turnDiffs, $3[2] = t2;
  else
    t2 = $3[2];
  let sources = t2, currentSource = sources[sourceIndex], currentTurn = currentSource?.type === "turn" ? currentSource.turn : null, t3;
  if ($3[3] !== currentTurn || $3[4] !== gitDiffData)
    t3 = currentTurn ? turnDiffToDiffData(currentTurn) : gitDiffData, $3[3] = currentTurn, $3[4] = gitDiffData, $3[5] = t3;
  else
    t3 = $3[5];
  let diffData = t3, selectedFile = diffData.files[selectedIndex], t4;
  if ($3[6] !== diffData.hunks || $3[7] !== selectedFile)
    t4 = selectedFile ? diffData.hunks.get(selectedFile.path) || [] : [], $3[6] = diffData.hunks, $3[7] = selectedFile, $3[8] = t4;
  else
    t4 = $3[8];
  let selectedHunks = t4, t5, t6;
  if ($3[9] !== sourceIndex || $3[10] !== sources.length)
    t5 = () => {
      if (sourceIndex >= sources.length)
        setSourceIndex(Math.max(0, sources.length - 1));
    }, t6 = [sources.length, sourceIndex], $3[9] = sourceIndex, $3[10] = sources.length, $3[11] = t5, $3[12] = t6;
  else
    t5 = $3[11], t6 = $3[12];
  import_react111.useEffect(t5, t6);
  let prevSourceIndex = import_react111.useRef(sourceIndex), t7, t8;
  if ($3[13] !== sourceIndex)
    t7 = () => {
      if (prevSourceIndex.current !== sourceIndex)
        setSelectedIndex(0), prevSourceIndex.current = sourceIndex;
    }, t8 = [sourceIndex], $3[13] = sourceIndex, $3[14] = t7, $3[15] = t8;
  else
    t7 = $3[14], t8 = $3[15];
  import_react111.useEffect(t7, t8), useRegisterOverlay("diff-dialog");
  let t10, t9;
  if ($3[16] !== sources.length || $3[17] !== viewMode)
    t9 = () => {
      if (viewMode === "detail")
        setViewMode("list");
      else if (viewMode === "list" && sources.length > 1)
        setSourceIndex(_temp223);
    }, t10 = () => {
      if (viewMode === "list" && sources.length > 1)
        setSourceIndex((prev_0) => Math.min(sources.length - 1, prev_0 + 1));
    }, $3[16] = sources.length, $3[17] = viewMode, $3[18] = t10, $3[19] = t9;
  else
    t10 = $3[18], t9 = $3[19];
  let t11;
  if ($3[20] !== viewMode)
    t11 = () => {
      if (viewMode === "detail")
        setViewMode("list");
    }, $3[20] = viewMode, $3[21] = t11;
  else
    t11 = $3[21];
  let t12;
  if ($3[22] !== selectedFile || $3[23] !== viewMode)
    t12 = () => {
      if (viewMode === "list" && selectedFile)
        setViewMode("detail");
    }, $3[22] = selectedFile, $3[23] = viewMode, $3[24] = t12;
  else
    t12 = $3[24];
  let t13;
  if ($3[25] !== viewMode)
    t13 = () => {
      if (viewMode === "list")
        setSelectedIndex(_temp317);
    }, $3[25] = viewMode, $3[26] = t13;
  else
    t13 = $3[26];
  let t14;
  if ($3[27] !== diffData.files.length || $3[28] !== viewMode)
    t14 = () => {
      if (viewMode === "list")
        setSelectedIndex((prev_2) => Math.min(diffData.files.length - 1, prev_2 + 1));
    }, $3[27] = diffData.files.length, $3[28] = viewMode, $3[29] = t14;
  else
    t14 = $3[29];
  let t15;
  if ($3[30] !== t10 || $3[31] !== t11 || $3[32] !== t12 || $3[33] !== t13 || $3[34] !== t14 || $3[35] !== t9)
    t15 = {
      "diff:previousSource": t9,
      "diff:nextSource": t10,
      "diff:back": t11,
      "diff:viewDetails": t12,
      "diff:previousFile": t13,
      "diff:nextFile": t14
    }, $3[30] = t10, $3[31] = t11, $3[32] = t12, $3[33] = t13, $3[34] = t14, $3[35] = t9, $3[36] = t15;
  else
    t15 = $3[36];
  let t16;
  if ($3[37] === Symbol.for("react.memo_cache_sentinel"))
    t16 = {
      context: "DiffDialog"
    }, $3[37] = t16;
  else
    t16 = $3[37];
  useKeybindings(t15, t16);
  let t17;
  if ($3[38] !== diffData.stats)
    t17 = diffData.stats ? /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        diffData.stats.filesCount,
        " ",
        plural(diffData.stats.filesCount, "file"),
        " ",
        "changed",
        diffData.stats.linesAdded > 0 && /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          color: "diffAddedWord",
          children: [
            " +",
            diffData.stats.linesAdded
          ]
        }, void 0, !0, void 0, this),
        diffData.stats.linesRemoved > 0 && /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          color: "diffRemovedWord",
          children: [
            " -",
            diffData.stats.linesRemoved
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null, $3[38] = diffData.stats, $3[39] = t17;
  else
    t17 = $3[39];
  let subtitle = t17, headerTitle = currentTurn ? `Turn ${currentTurn.turnIndex}` : "Uncommitted changes", headerSubtitle = currentTurn ? currentTurn.userPromptPreview ? `"${currentTurn.userPromptPreview}"` : "" : "(git diff HEAD)", t18;
  if ($3[40] !== sourceIndex || $3[41] !== sources)
    t18 = sources.length > 1 ? /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedBox_default, {
      children: [
        sourceIndex > 0 && /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\u25C0 "
        }, void 0, !1, void 0, this),
        sources.map((source, i5) => {
          let isSelected = i5 === sourceIndex, label = source.type === "current" ? "Current" : `T${source.turn.turnIndex}`;
          return /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
            dimColor: !isSelected,
            bold: isSelected,
            children: [
              i5 > 0 ? " \xB7 " : "",
              label
            ]
          }, i5, !0, void 0, this);
        }),
        sourceIndex < sources.length - 1 && /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \u25B6"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null, $3[40] = sourceIndex, $3[41] = sources, $3[42] = t18;
  else
    t18 = $3[42];
  let sourceSelector = t18, dismissShortcut = useShortcutDisplay("diff:dismiss", "DiffDialog", "esc"), t19;
  bb0: {
    if (diffData.loading) {
      t19 = "Loading diff\u2026";
      break bb0;
    }
    if (currentTurn) {
      t19 = "No file changes in this turn";
      break bb0;
    }
    if (diffData.stats && diffData.stats.filesCount > 0 && diffData.files.length === 0) {
      t19 = "Too many files to display details";
      break bb0;
    }
    t19 = "Working tree is clean";
  }
  let emptyMessage = t19, t20;
  if ($3[43] !== headerSubtitle)
    t20 = headerSubtitle && /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " ",
        headerSubtitle
      ]
    }, void 0, !0, void 0, this), $3[43] = headerSubtitle, $3[44] = t20;
  else
    t20 = $3[44];
  let t21;
  if ($3[45] !== headerTitle || $3[46] !== t20)
    t21 = /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
      children: [
        headerTitle,
        t20
      ]
    }, void 0, !0, void 0, this), $3[45] = headerTitle, $3[46] = t20, $3[47] = t21;
  else
    t21 = $3[47];
  let title = t21, t22;
  if ($3[48] !== onDone || $3[49] !== viewMode)
    t22 = function() {
      if (viewMode === "detail")
        setViewMode("list");
      else
        onDone("Diff dialog dismissed", {
          display: "system"
        });
    }, $3[48] = onDone, $3[49] = viewMode, $3[50] = t22;
  else
    t22 = $3[50];
  let handleCancel = t22, t23;
  if ($3[51] !== dismissShortcut || $3[52] !== sources.length || $3[53] !== viewMode)
    t23 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : viewMode === "list" ? /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(Byline, {
      children: [
        sources.length > 1 && /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          children: "\u2190/\u2192 source"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          children: "\u2191/\u2193 select"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          children: "Enter view"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          children: [
            dismissShortcut,
            " close"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          children: "\u2190 back"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
          children: [
            dismissShortcut,
            " close"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[51] = dismissShortcut, $3[52] = sources.length, $3[53] = viewMode, $3[54] = t23;
  else
    t23 = $3[54];
  let t24;
  if ($3[55] !== diffData.files || $3[56] !== emptyMessage || $3[57] !== selectedFile?.isBinary || $3[58] !== selectedFile?.isLargeFile || $3[59] !== selectedFile?.isTruncated || $3[60] !== selectedFile?.isUntracked || $3[61] !== selectedFile?.path || $3[62] !== selectedHunks || $3[63] !== selectedIndex || $3[64] !== viewMode)
    t24 = diffData.files.length === 0 ? /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedText, {
        dimColor: !0,
        children: emptyMessage
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : viewMode === "list" ? /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(DiffFileList, {
        files: diffData.files,
        selectedIndex
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(DiffDetailView, {
        filePath: selectedFile?.path || "",
        hunks: selectedHunks,
        isLargeFile: selectedFile?.isLargeFile,
        isBinary: selectedFile?.isBinary,
        isTruncated: selectedFile?.isTruncated,
        isUntracked: selectedFile?.isUntracked
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[55] = diffData.files, $3[56] = emptyMessage, $3[57] = selectedFile?.isBinary, $3[58] = selectedFile?.isLargeFile, $3[59] = selectedFile?.isTruncated, $3[60] = selectedFile?.isUntracked, $3[61] = selectedFile?.path, $3[62] = selectedHunks, $3[63] = selectedIndex, $3[64] = viewMode, $3[65] = t24;
  else
    t24 = $3[65];
  let t25;
  if ($3[66] !== handleCancel || $3[67] !== sourceSelector || $3[68] !== subtitle || $3[69] !== t23 || $3[70] !== t24 || $3[71] !== title)
    t25 = /* @__PURE__ */ jsx_dev_runtime191.jsxDEV(Dialog, {
      title,
      onCancel: handleCancel,
      color: "background",
      inputGuide: t23,
      children: [
        sourceSelector,
        subtitle,
        t24
      ]
    }, void 0, !0, void 0, this), $3[66] = handleCancel, $3[67] = sourceSelector, $3[68] = subtitle, $3[69] = t23, $3[70] = t24, $3[71] = title, $3[72] = t25;
  else
    t25 = $3[72];
  return t25;
}
function _temp317(prev_1) {
  return Math.max(0, prev_1 - 1);
}
function _temp223(prev) {
  return Math.max(0, prev - 1);
}
function _temp78(turn) {
  return {
    type: "turn",
    turn
  };
}
var import_compiler_runtime152, import_react111, jsx_dev_runtime191;
var init_DiffDialog = __esm(() => {
  init_overlayContext();
  init_useDiffData();
  init_useTurnDiffs();
  init_ink2();
  init_useKeybinding();
  init_useShortcutDisplay();
  init_Byline();
  init_Dialog();
  init_DiffDetailView();
  init_DiffFileList();
  import_compiler_runtime152 = __toESM(require_react_compiler_runtime_development(), 1), import_react111 = __toESM(require_react_development(), 1), jsx_dev_runtime191 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
