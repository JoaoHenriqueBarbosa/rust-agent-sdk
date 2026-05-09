// Original: src/components/tasks/ShellDetailDialog.tsx
async function getTaskOutput2(shell) {
  let path25 = getTaskOutputPath(shell.id);
  try {
    let result = await tailFile(path25, SHELL_DETAIL_TAIL_BYTES);
    return {
      content: result.content,
      bytesTotal: result.bytesTotal
    };
  } catch {
    return {
      content: "",
      bytesTotal: 0
    };
  }
}
function ShellDetailDialog(t0) {
  let $3 = import_compiler_runtime228.c(57), {
    shell,
    onDone,
    onKillShell,
    onBack
  } = t0, {
    columns
  } = useTerminalSize(), t1;
  if ($3[0] !== shell)
    t1 = () => getTaskOutput2(shell), $3[0] = shell, $3[1] = t1;
  else
    t1 = $3[1];
  let [outputPromise, setOutputPromise] = import_react164.useState(t1), deferredOutputPromise = import_react164.useDeferredValue(outputPromise), t2;
  if ($3[2] !== shell)
    t2 = () => {
      if (shell.status !== "running")
        return;
      let timer = setInterval(_temp139, 1000, setOutputPromise, shell);
      return () => clearInterval(timer);
    }, $3[2] = shell, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== shell.id || $3[5] !== shell.status)
    t3 = [shell.id, shell.status], $3[4] = shell.id, $3[5] = shell.status, $3[6] = t3;
  else
    t3 = $3[6];
  import_react164.useEffect(t2, t3);
  let t4;
  if ($3[7] !== onDone)
    t4 = () => onDone("Shell details dismissed", {
      display: "system"
    }), $3[7] = onDone, $3[8] = t4;
  else
    t4 = $3[8];
  let handleClose = t4, t5;
  if ($3[9] !== handleClose)
    t5 = {
      "confirm:yes": handleClose
    }, $3[9] = handleClose, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t6 = {
      context: "Confirmation"
    }, $3[11] = t6;
  else
    t6 = $3[11];
  useKeybindings(t5, t6);
  let t7;
  if ($3[12] !== onBack || $3[13] !== onDone || $3[14] !== onKillShell || $3[15] !== shell.status)
    t7 = (e) => {
      if (e.key === " ")
        e.preventDefault(), onDone("Shell details dismissed", {
          display: "system"
        });
      else if (e.key === "left" && onBack)
        e.preventDefault(), onBack();
      else if (e.key === "x" && shell.status === "running" && onKillShell)
        e.preventDefault(), onKillShell();
    }, $3[12] = onBack, $3[13] = onDone, $3[14] = onKillShell, $3[15] = shell.status, $3[16] = t7;
  else
    t7 = $3[16];
  let handleKeyDown = t7, isMonitor = shell.kind === "monitor", t8;
  if ($3[17] !== shell.command)
    t8 = truncateToWidth(shell.command, 280), $3[17] = shell.command, $3[18] = t8;
  else
    t8 = $3[18];
  let displayCommand = t8, t9 = isMonitor ? "Monitor details" : "Shell details", t10;
  if ($3[19] !== onBack || $3[20] !== onKillShell || $3[21] !== shell.status)
    t10 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(Byline, {
      children: [
        onBack && /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2190",
          action: "go back"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Esc/Enter/Space",
          action: "close"
        }, void 0, !1, void 0, this),
        shell.status === "running" && onKillShell && /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(KeyboardShortcutHint, {
          shortcut: "x",
          action: "stop"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[19] = onBack, $3[20] = onKillShell, $3[21] = shell.status, $3[22] = t10;
  else
    t10 = $3[22];
  let t11;
  if ($3[23] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      bold: !0,
      children: "Status:"
    }, void 0, !1, void 0, this), $3[23] = t11;
  else
    t11 = $3[23];
  let t12;
  if ($3[24] !== shell.result || $3[25] !== shell.status)
    t12 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      children: [
        t11,
        " ",
        shell.status === "running" ? /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
          color: "background",
          children: [
            shell.status,
            shell.result?.code !== void 0 && ` (exit code: ${shell.result.code})`
          ]
        }, void 0, !0, void 0, this) : shell.status === "completed" ? /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
          color: "success",
          children: [
            shell.status,
            shell.result?.code !== void 0 && ` (exit code: ${shell.result.code})`
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
          color: "error",
          children: [
            shell.status,
            shell.result?.code !== void 0 && ` (exit code: ${shell.result.code})`
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[24] = shell.result, $3[25] = shell.status, $3[26] = t12;
  else
    t12 = $3[26];
  let t13;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      bold: !0,
      children: "Runtime:"
    }, void 0, !1, void 0, this), $3[27] = t13;
  else
    t13 = $3[27];
  let t14;
  if ($3[28] !== shell.endTime)
    t14 = shell.endTime ?? Date.now(), $3[28] = shell.endTime, $3[29] = t14;
  else
    t14 = $3[29];
  let t15 = t14 - shell.startTime, t16;
  if ($3[30] !== t15)
    t16 = formatDuration(t15), $3[30] = t15, $3[31] = t16;
  else
    t16 = $3[31];
  let t17;
  if ($3[32] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      children: [
        t13,
        " ",
        t16
      ]
    }, void 0, !0, void 0, this), $3[32] = t16, $3[33] = t17;
  else
    t17 = $3[33];
  let t18 = isMonitor ? "Script:" : "Command:", t19;
  if ($3[34] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      bold: !0,
      children: t18
    }, void 0, !1, void 0, this), $3[34] = t18, $3[35] = t19;
  else
    t19 = $3[35];
  let t20;
  if ($3[36] !== displayCommand || $3[37] !== t19)
    t20 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      wrap: "wrap",
      children: [
        t19,
        " ",
        displayCommand
      ]
    }, void 0, !0, void 0, this), $3[36] = displayCommand, $3[37] = t19, $3[38] = t20;
  else
    t20 = $3[38];
  let t21;
  if ($3[39] !== t12 || $3[40] !== t17 || $3[41] !== t20)
    t21 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t12,
        t17,
        t20
      ]
    }, void 0, !0, void 0, this), $3[39] = t12, $3[40] = t17, $3[41] = t20, $3[42] = t21;
  else
    t21 = $3[42];
  let t22;
  if ($3[43] === Symbol.for("react.memo_cache_sentinel"))
    t22 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      bold: !0,
      children: "Output:"
    }, void 0, !1, void 0, this), $3[43] = t22;
  else
    t22 = $3[43];
  let t23;
  if ($3[44] === Symbol.for("react.memo_cache_sentinel"))
    t23 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Loading output\u2026"
    }, void 0, !1, void 0, this), $3[44] = t23;
  else
    t23 = $3[44];
  let t24;
  if ($3[45] !== columns || $3[46] !== deferredOutputPromise)
    t24 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t22,
        /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(import_react164.Suspense, {
          fallback: t23,
          children: /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ShellOutputContent, {
            outputPromise: deferredOutputPromise,
            columns
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[45] = columns, $3[46] = deferredOutputPromise, $3[47] = t24;
  else
    t24 = $3[47];
  let t25;
  if ($3[48] !== handleClose || $3[49] !== t10 || $3[50] !== t21 || $3[51] !== t24 || $3[52] !== t9)
    t25 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(Dialog, {
      title: t9,
      onCancel: handleClose,
      color: "background",
      inputGuide: t10,
      children: [
        t21,
        t24
      ]
    }, void 0, !0, void 0, this), $3[48] = handleClose, $3[49] = t10, $3[50] = t21, $3[51] = t24, $3[52] = t9, $3[53] = t25;
  else
    t25 = $3[53];
  let t26;
  if ($3[54] !== handleKeyDown || $3[55] !== t25)
    t26 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: t25
    }, void 0, !1, void 0, this), $3[54] = handleKeyDown, $3[55] = t25, $3[56] = t26;
  else
    t26 = $3[56];
  return t26;
}
function _temp139(setOutputPromise_0, shell_0) {
  return setOutputPromise_0(getTaskOutput2(shell_0));
}
function ShellOutputContent(t0) {
  let $3 = import_compiler_runtime228.c(19), {
    outputPromise,
    columns
  } = t0, {
    content,
    bytesTotal
  } = import_react164.use(outputPromise);
  if (!content) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "No output available"
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let isIncomplete, rendered;
  if ($3[1] !== bytesTotal || $3[2] !== content) {
    let starts = [], pos = content.length;
    for (let i5 = 0;i5 < 10 && pos > 0; i5++) {
      let prev = content.lastIndexOf(`
`, pos - 1);
      starts.push(prev + 1), pos = prev;
    }
    starts.reverse(), isIncomplete = bytesTotal > content.length, rendered = [];
    for (let i_0 = 0;i_0 < starts.length; i_0++) {
      let start = starts[i_0], end = i_0 < starts.length - 1 ? starts[i_0 + 1] - 1 : content.length, line = content.slice(start, end);
      if (line)
        rendered.push(line);
    }
    $3[1] = bytesTotal, $3[2] = content, $3[3] = isIncomplete, $3[4] = rendered;
  } else
    isIncomplete = $3[3], rendered = $3[4];
  let t1 = columns - 6, t2;
  if ($3[5] !== rendered)
    t2 = rendered.map(_temp255), $3[5] = rendered, $3[6] = t2;
  else
    t2 = $3[6];
  let t3;
  if ($3[7] !== t1 || $3[8] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedBox_default, {
      borderStyle: "round",
      paddingX: 1,
      flexDirection: "column",
      height: 12,
      maxWidth: t1,
      children: t2
    }, void 0, !1, void 0, this), $3[7] = t1, $3[8] = t2, $3[9] = t3;
  else
    t3 = $3[9];
  let t4 = `Showing ${rendered.length} lines`, t5;
  if ($3[10] !== bytesTotal || $3[11] !== isIncomplete)
    t5 = isIncomplete ? ` of ${formatFileSize(bytesTotal)}` : "", $3[10] = bytesTotal, $3[11] = isIncomplete, $3[12] = t5;
  else
    t5 = $3[12];
  let t6;
  if ($3[13] !== t4 || $3[14] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[13] = t4, $3[14] = t5, $3[15] = t6;
  else
    t6 = $3[15];
  let t7;
  if ($3[16] !== t3 || $3[17] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(jsx_dev_runtime288.Fragment, {
      children: [
        t3,
        t6
      ]
    }, void 0, !0, void 0, this), $3[16] = t3, $3[17] = t6, $3[18] = t7;
  else
    t7 = $3[18];
  return t7;
}
function _temp255(line_0, i_1) {
  return /* @__PURE__ */ jsx_dev_runtime288.jsxDEV(ThemedText, {
    wrap: "truncate-end",
    children: line_0
  }, i_1, !1, void 0, this);
}
var import_compiler_runtime228, import_react164, jsx_dev_runtime288, SHELL_DETAIL_TAIL_BYTES = 8192;
var init_ShellDetailDialog = __esm(() => {
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  init_format();
  init_fsOperations();
  init_diskOutput();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  import_compiler_runtime228 = __toESM(require_react_compiler_runtime_development(), 1), import_react164 = __toESM(require_react_development(), 1), jsx_dev_runtime288 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
