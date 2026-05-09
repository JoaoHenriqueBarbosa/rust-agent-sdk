// Original: src/components/tasks/DreamDetailDialog.tsx
function DreamDetailDialog(t0) {
  let $3 = import_compiler_runtime225.c(70), {
    task,
    onDone,
    onBack,
    onKill
  } = t0, elapsedTime = useElapsedTime(task.startTime, task.status === "running", 1000, 0), t1;
  if ($3[0] !== onDone)
    t1 = {
      "confirm:yes": onDone
    }, $3[0] = onDone, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      context: "Confirmation"
    }, $3[2] = t2;
  else
    t2 = $3[2];
  useKeybindings(t1, t2);
  let t3;
  if ($3[3] !== onBack || $3[4] !== onDone || $3[5] !== onKill || $3[6] !== task.status)
    t3 = (e) => {
      if (e.key === " ")
        e.preventDefault(), onDone();
      else if (e.key === "left" && onBack)
        e.preventDefault(), onBack();
      else if (e.key === "x" && task.status === "running" && onKill)
        e.preventDefault(), onKill();
    }, $3[3] = onBack, $3[4] = onDone, $3[5] = onKill, $3[6] = task.status, $3[7] = t3;
  else
    t3 = $3[7];
  let handleKeyDown = t3, T0, T1, T2, t10, t11, t12, t13, t14, t15, t16, t4, t5, t6, t7, t8, t9;
  if ($3[8] !== elapsedTime || $3[9] !== handleKeyDown || $3[10] !== onBack || $3[11] !== onDone || $3[12] !== onKill || $3[13] !== task.filesTouched.length || $3[14] !== task.sessionsReviewing || $3[15] !== task.status || $3[16] !== task.turns) {
    let visibleTurns = task.turns.filter(_temp137), shown = visibleTurns.slice(-VISIBLE_TURNS), hidden2 = visibleTurns.length - shown.length;
    T2 = ThemedBox_default, t13 = "column", t14 = 0, t15 = !0, t16 = handleKeyDown, T1 = Dialog, t8 = "Memory consolidation";
    let t172 = task.sessionsReviewing, t182;
    if ($3[33] !== task.sessionsReviewing)
      t182 = plural(task.sessionsReviewing, "session"), $3[33] = task.sessionsReviewing, $3[34] = t182;
    else
      t182 = $3[34];
    let t192;
    if ($3[35] !== task.filesTouched.length)
      t192 = task.filesTouched.length > 0 && /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(jsx_dev_runtime285.Fragment, {
        children: [
          " ",
          "\xB7 ",
          task.filesTouched.length,
          " ",
          plural(task.filesTouched.length, "file"),
          " touched"
        ]
      }, void 0, !0, void 0, this), $3[35] = task.filesTouched.length, $3[36] = t192;
    else
      t192 = $3[36];
    if ($3[37] !== elapsedTime || $3[38] !== t182 || $3[39] !== t192 || $3[40] !== task.sessionsReviewing)
      t9 = /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          elapsedTime,
          " \xB7 reviewing ",
          t172,
          " ",
          t182,
          t192
        ]
      }, void 0, !0, void 0, this), $3[37] = elapsedTime, $3[38] = t182, $3[39] = t192, $3[40] = task.sessionsReviewing, $3[41] = t9;
    else
      t9 = $3[41];
    if (t10 = onDone, t11 = "background", $3[42] !== onBack || $3[43] !== onKill || $3[44] !== task.status)
      t12 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(Byline, {
        children: [
          onBack && /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(KeyboardShortcutHint, {
            shortcut: "\u2190",
            action: "go back"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Esc/Enter/Space",
            action: "close"
          }, void 0, !1, void 0, this),
          task.status === "running" && onKill && /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(KeyboardShortcutHint, {
            shortcut: "x",
            action: "stop"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[42] = onBack, $3[43] = onKill, $3[44] = task.status, $3[45] = t12;
    else
      t12 = $3[45];
    T0 = ThemedBox_default, t4 = "column", t5 = 1;
    let t20;
    if ($3[46] === Symbol.for("react.memo_cache_sentinel"))
      t20 = /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
        bold: !0,
        children: "Status:"
      }, void 0, !1, void 0, this), $3[46] = t20;
    else
      t20 = $3[46];
    if ($3[47] !== task.status)
      t6 = /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
        children: [
          t20,
          " ",
          task.status === "running" ? /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
            color: "background",
            children: "running"
          }, void 0, !1, void 0, this) : task.status === "completed" ? /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
            color: "success",
            children: task.status
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
            color: "error",
            children: task.status
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[47] = task.status, $3[48] = t6;
    else
      t6 = $3[48];
    t7 = shown.length === 0 ? /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
      dimColor: !0,
      children: task.status === "running" ? "Starting\u2026" : "(no text output)"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(jsx_dev_runtime285.Fragment, {
      children: [
        hidden2 > 0 && /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "(",
            hidden2,
            " earlier ",
            plural(hidden2, "turn"),
            ")"
          ]
        }, void 0, !0, void 0, this),
        shown.map(_temp253)
      ]
    }, void 0, !0, void 0, this), $3[8] = elapsedTime, $3[9] = handleKeyDown, $3[10] = onBack, $3[11] = onDone, $3[12] = onKill, $3[13] = task.filesTouched.length, $3[14] = task.sessionsReviewing, $3[15] = task.status, $3[16] = task.turns, $3[17] = T0, $3[18] = T1, $3[19] = T2, $3[20] = t10, $3[21] = t11, $3[22] = t12, $3[23] = t13, $3[24] = t14, $3[25] = t15, $3[26] = t16, $3[27] = t4, $3[28] = t5, $3[29] = t6, $3[30] = t7, $3[31] = t8, $3[32] = t9;
  } else
    T0 = $3[17], T1 = $3[18], T2 = $3[19], t10 = $3[20], t11 = $3[21], t12 = $3[22], t13 = $3[23], t14 = $3[24], t15 = $3[25], t16 = $3[26], t4 = $3[27], t5 = $3[28], t6 = $3[29], t7 = $3[30], t8 = $3[31], t9 = $3[32];
  let t17;
  if ($3[49] !== T0 || $3[50] !== t4 || $3[51] !== t5 || $3[52] !== t6 || $3[53] !== t7)
    t17 = /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(T0, {
      flexDirection: t4,
      gap: t5,
      children: [
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[49] = T0, $3[50] = t4, $3[51] = t5, $3[52] = t6, $3[53] = t7, $3[54] = t17;
  else
    t17 = $3[54];
  let t18;
  if ($3[55] !== T1 || $3[56] !== t10 || $3[57] !== t11 || $3[58] !== t12 || $3[59] !== t17 || $3[60] !== t8 || $3[61] !== t9)
    t18 = /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(T1, {
      title: t8,
      subtitle: t9,
      onCancel: t10,
      color: t11,
      inputGuide: t12,
      children: t17
    }, void 0, !1, void 0, this), $3[55] = T1, $3[56] = t10, $3[57] = t11, $3[58] = t12, $3[59] = t17, $3[60] = t8, $3[61] = t9, $3[62] = t18;
  else
    t18 = $3[62];
  let t19;
  if ($3[63] !== T2 || $3[64] !== t13 || $3[65] !== t14 || $3[66] !== t15 || $3[67] !== t16 || $3[68] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(T2, {
      flexDirection: t13,
      tabIndex: t14,
      autoFocus: t15,
      onKeyDown: t16,
      children: t18
    }, void 0, !1, void 0, this), $3[63] = T2, $3[64] = t13, $3[65] = t14, $3[66] = t15, $3[67] = t16, $3[68] = t18, $3[69] = t19;
  else
    t19 = $3[69];
  return t19;
}
function _temp253(turn, i5) {
  return /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
        wrap: "wrap",
        children: turn.text
      }, void 0, !1, void 0, this),
      turn.toolUseCount > 0 && /* @__PURE__ */ jsx_dev_runtime285.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  ",
          "(",
          turn.toolUseCount,
          " ",
          plural(turn.toolUseCount, "tool"),
          ")"
        ]
      }, void 0, !0, void 0, this)
    ]
  }, i5, !0, void 0, this);
}
function _temp137(t2) {
  return t2.text !== "";
}
var import_compiler_runtime225, jsx_dev_runtime285, VISIBLE_TURNS = 6;
var init_DreamDetailDialog = __esm(() => {
  init_useElapsedTime();
  init_ink2();
  init_useKeybinding();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  import_compiler_runtime225 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime285 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
