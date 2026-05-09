// Original: src/components/tasks/InProcessTeammateDetailDialog.tsx
function InProcessTeammateDetailDialog(t0) {
  let $3 = import_compiler_runtime226.c(63), {
    teammate,
    onDone,
    onKill,
    onBack,
    onForeground
  } = t0, [theme] = useTheme(), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getTools(getEmptyToolPermissionContext()), $3[0] = t1;
  else
    t1 = $3[0];
  let tools = t1, elapsedTime = useElapsedTime(teammate.startTime, teammate.status === "running", 1000, teammate.totalPausedMs ?? 0), t2;
  if ($3[1] !== onDone)
    t2 = {
      "confirm:yes": onDone
    }, $3[1] = onDone, $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      context: "Confirmation"
    }, $3[3] = t3;
  else
    t3 = $3[3];
  useKeybindings(t2, t3);
  let t4;
  if ($3[4] !== onBack || $3[5] !== onDone || $3[6] !== onForeground || $3[7] !== onKill || $3[8] !== teammate.status)
    t4 = (e) => {
      if (e.key === " ")
        e.preventDefault(), onDone();
      else if (e.key === "left" && onBack)
        e.preventDefault(), onBack();
      else if (e.key === "x" && teammate.status === "running" && onKill)
        e.preventDefault(), onKill();
      else if (e.key === "f" && teammate.status === "running" && onForeground)
        e.preventDefault(), onForeground();
    }, $3[4] = onBack, $3[5] = onDone, $3[6] = onForeground, $3[7] = onKill, $3[8] = teammate.status, $3[9] = t4;
  else
    t4 = $3[9];
  let handleKeyDown = t4, t5;
  if ($3[10] !== teammate)
    t5 = describeTeammateActivity(teammate), $3[10] = teammate, $3[11] = t5;
  else
    t5 = $3[11];
  let activity = t5, tokenCount = teammate.result?.totalTokens ?? teammate.progress?.tokenCount, toolUseCount = teammate.result?.totalToolUseCount ?? teammate.progress?.toolUseCount, t6;
  if ($3[12] !== teammate.prompt)
    t6 = truncateToWidth(teammate.prompt, 300), $3[12] = teammate.prompt, $3[13] = t6;
  else
    t6 = $3[13];
  let displayPrompt = t6, t7;
  if ($3[14] !== teammate.identity.color)
    t7 = toInkColor(teammate.identity.color), $3[14] = teammate.identity.color, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== t7 || $3[17] !== teammate.identity.agentName)
    t8 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      color: t7,
      children: [
        "@",
        teammate.identity.agentName
      ]
    }, void 0, !0, void 0, this), $3[16] = t7, $3[17] = teammate.identity.agentName, $3[18] = t8;
  else
    t8 = $3[18];
  let t9;
  if ($3[19] !== activity)
    t9 = activity && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " (",
        activity,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[19] = activity, $3[20] = t9;
  else
    t9 = $3[20];
  let t10;
  if ($3[21] !== t8 || $3[22] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      children: [
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[21] = t8, $3[22] = t9, $3[23] = t10;
  else
    t10 = $3[23];
  let title = t10, t11;
  if ($3[24] !== teammate.status)
    t11 = teammate.status !== "running" && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      color: teammate.status === "completed" ? "success" : teammate.status === "killed" ? "warning" : "error",
      children: [
        teammate.status === "completed" ? "Completed" : teammate.status === "failed" ? "Failed" : "Stopped",
        " \xB7 "
      ]
    }, void 0, !0, void 0, this), $3[24] = teammate.status, $3[25] = t11;
  else
    t11 = $3[25];
  let t12;
  if ($3[26] !== tokenCount)
    t12 = tokenCount !== void 0 && tokenCount > 0 && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(jsx_dev_runtime286.Fragment, {
      children: [
        " \xB7 ",
        formatNumber(tokenCount),
        " tokens"
      ]
    }, void 0, !0, void 0, this), $3[26] = tokenCount, $3[27] = t12;
  else
    t12 = $3[27];
  let t13;
  if ($3[28] !== toolUseCount)
    t13 = toolUseCount !== void 0 && toolUseCount > 0 && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(jsx_dev_runtime286.Fragment, {
      children: [
        " ",
        "\xB7 ",
        toolUseCount,
        " ",
        toolUseCount === 1 ? "tool" : "tools"
      ]
    }, void 0, !0, void 0, this), $3[28] = toolUseCount, $3[29] = t13;
  else
    t13 = $3[29];
  let t14;
  if ($3[30] !== elapsedTime || $3[31] !== t12 || $3[32] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        elapsedTime,
        t12,
        t13
      ]
    }, void 0, !0, void 0, this), $3[30] = elapsedTime, $3[31] = t12, $3[32] = t13, $3[33] = t14;
  else
    t14 = $3[33];
  let t15;
  if ($3[34] !== t11 || $3[35] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      children: [
        t11,
        t14
      ]
    }, void 0, !0, void 0, this), $3[34] = t11, $3[35] = t14, $3[36] = t15;
  else
    t15 = $3[36];
  let subtitle = t15, t16;
  if ($3[37] !== onBack || $3[38] !== onForeground || $3[39] !== onKill || $3[40] !== teammate.status)
    t16 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(Byline, {
      children: [
        onBack && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2190",
          action: "go back"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Esc/Enter/Space",
          action: "close"
        }, void 0, !1, void 0, this),
        teammate.status === "running" && onKill && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(KeyboardShortcutHint, {
          shortcut: "x",
          action: "stop"
        }, void 0, !1, void 0, this),
        teammate.status === "running" && onForeground && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(KeyboardShortcutHint, {
          shortcut: "f",
          action: "foreground"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[37] = onBack, $3[38] = onForeground, $3[39] = onKill, $3[40] = teammate.status, $3[41] = t16;
  else
    t16 = $3[41];
  let t17;
  if ($3[42] !== teammate.progress || $3[43] !== teammate.status || $3[44] !== theme)
    t17 = teammate.status === "running" && teammate.progress?.recentActivities && teammate.progress.recentActivities.length > 0 && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: "Progress"
        }, void 0, !1, void 0, this),
        teammate.progress.recentActivities.map((activity_0, i5) => /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
          dimColor: i5 < teammate.progress.recentActivities.length - 1,
          wrap: "truncate-end",
          children: [
            i5 === teammate.progress.recentActivities.length - 1 ? "\u203A " : "  ",
            renderToolActivity(activity_0, tools, theme)
          ]
        }, i5, !0, void 0, this))
      ]
    }, void 0, !0, void 0, this), $3[42] = teammate.progress, $3[43] = teammate.status, $3[44] = theme, $3[45] = t17;
  else
    t17 = $3[45];
  let t18;
  if ($3[46] === Symbol.for("react.memo_cache_sentinel"))
    t18 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
      bold: !0,
      dimColor: !0,
      children: "Prompt"
    }, void 0, !1, void 0, this), $3[46] = t18;
  else
    t18 = $3[46];
  let t19;
  if ($3[47] !== displayPrompt)
    t19 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t18,
        /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
          wrap: "wrap",
          children: displayPrompt
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[47] = displayPrompt, $3[48] = t19;
  else
    t19 = $3[48];
  let t20;
  if ($3[49] !== teammate.error || $3[50] !== teammate.status)
    t20 = teammate.status === "failed" && teammate.error && /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: "Error"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedText, {
          color: "error",
          wrap: "wrap",
          children: teammate.error
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[49] = teammate.error, $3[50] = teammate.status, $3[51] = t20;
  else
    t20 = $3[51];
  let t21;
  if ($3[52] !== onDone || $3[53] !== subtitle || $3[54] !== t16 || $3[55] !== t17 || $3[56] !== t19 || $3[57] !== t20 || $3[58] !== title)
    t21 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(Dialog, {
      title,
      subtitle,
      onCancel: onDone,
      color: "background",
      inputGuide: t16,
      children: [
        t17,
        t19,
        t20
      ]
    }, void 0, !0, void 0, this), $3[52] = onDone, $3[53] = subtitle, $3[54] = t16, $3[55] = t17, $3[56] = t19, $3[57] = t20, $3[58] = title, $3[59] = t21;
  else
    t21 = $3[59];
  let t22;
  if ($3[60] !== handleKeyDown || $3[61] !== t21)
    t22 = /* @__PURE__ */ jsx_dev_runtime286.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      tabIndex: 0,
      autoFocus: !0,
      onKeyDown: handleKeyDown,
      children: t21
    }, void 0, !1, void 0, this), $3[60] = handleKeyDown, $3[61] = t21, $3[62] = t22;
  else
    t22 = $3[62];
  return t22;
}
var import_compiler_runtime226, jsx_dev_runtime286;
var init_InProcessTeammateDetailDialog = __esm(() => {
  init_useElapsedTime();
  init_ink2();
  init_useKeybinding();
  init_Tool();
  init_tools2();
  init_format();
  init_ink3();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_renderToolActivity();
  init_taskStatusUtils();
  import_compiler_runtime226 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime286 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
