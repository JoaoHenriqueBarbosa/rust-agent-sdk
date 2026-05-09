// Original: src/components/Spinner/TeammateSpinnerTree.tsx
function TeammateSpinnerTree(t0) {
  let $3 = import_compiler_runtime60.c(61), {
    selectedIndex,
    isInSelectionMode,
    allIdle,
    leaderVerb,
    leaderTokenCount,
    leaderIdleText
  } = t0, tasks = useAppState(_temp15), viewingAgentTaskId = useAppState(_temp26), showTeammateMessagePreview = useAppState(_temp34), T0, isHideSelected, t1, t2, t3, t4, t5;
  if ($3[0] !== allIdle || $3[1] !== isInSelectionMode || $3[2] !== leaderIdleText || $3[3] !== leaderTokenCount || $3[4] !== leaderVerb || $3[5] !== selectedIndex || $3[6] !== showTeammateMessagePreview || $3[7] !== tasks || $3[8] !== viewingAgentTaskId) {
    t5 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let teammateTasks = getRunningTeammatesSorted(tasks);
      if (teammateTasks.length === 0) {
        t5 = null;
        break bb0;
      }
      let isLeaderForegrounded = viewingAgentTaskId === void 0, isLeaderSelected = isInSelectionMode && selectedIndex === -1, isLeaderHighlighted = isLeaderForegrounded || isLeaderSelected;
      isHideSelected = isInSelectionMode === !0 && selectedIndex === teammateTasks.length, T0 = ThemedBox_default, t1 = "column", t2 = 1;
      let t62 = isLeaderSelected ? "suggestion" : void 0, t72 = isLeaderSelected ? figures_default.pointer : " ", t8;
      if ($3[16] !== isLeaderHighlighted || $3[17] !== t62 || $3[18] !== t72)
        t8 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          color: t62,
          bold: isLeaderHighlighted,
          children: t72
        }, void 0, !1, void 0, this), $3[16] = isLeaderHighlighted, $3[17] = t62, $3[18] = t72, $3[19] = t8;
      else
        t8 = $3[19];
      let t9 = !isLeaderHighlighted, t10 = isLeaderHighlighted ? "\u2552\u2550" : "\u250C\u2500", t11;
      if ($3[20] !== isLeaderHighlighted || $3[21] !== t10 || $3[22] !== t9)
        t11 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          dimColor: t9,
          bold: isLeaderHighlighted,
          children: [
            t10,
            " "
          ]
        }, void 0, !0, void 0, this), $3[20] = isLeaderHighlighted, $3[21] = t10, $3[22] = t9, $3[23] = t11;
      else
        t11 = $3[23];
      let t12 = isLeaderSelected ? "suggestion" : "cyan_FOR_SUBAGENTS_ONLY", t13;
      if ($3[24] !== isLeaderHighlighted || $3[25] !== t12)
        t13 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          bold: isLeaderHighlighted,
          color: t12,
          children: "team-lead"
        }, void 0, !1, void 0, this), $3[24] = isLeaderHighlighted, $3[25] = t12, $3[26] = t13;
      else
        t13 = $3[26];
      let t14;
      if ($3[27] !== isLeaderForegrounded || $3[28] !== leaderVerb)
        t14 = !isLeaderForegrounded && leaderVerb && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            ": ",
            leaderVerb,
            "\u2026"
          ]
        }, void 0, !0, void 0, this), $3[27] = isLeaderForegrounded, $3[28] = leaderVerb, $3[29] = t14;
      else
        t14 = $3[29];
      let t15;
      if ($3[30] !== isLeaderForegrounded || $3[31] !== leaderIdleText || $3[32] !== leaderVerb)
        t15 = !isLeaderForegrounded && !leaderVerb && leaderIdleText && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            ": ",
            leaderIdleText
          ]
        }, void 0, !0, void 0, this), $3[30] = isLeaderForegrounded, $3[31] = leaderIdleText, $3[32] = leaderVerb, $3[33] = t15;
      else
        t15 = $3[33];
      let t16;
      if ($3[34] !== isLeaderHighlighted || $3[35] !== leaderTokenCount)
        t16 = leaderTokenCount !== void 0 && leaderTokenCount > 0 && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          dimColor: !isLeaderHighlighted,
          children: [
            " ",
            "\xB7 ",
            formatNumber(leaderTokenCount),
            " tokens"
          ]
        }, void 0, !0, void 0, this), $3[34] = isLeaderHighlighted, $3[35] = leaderTokenCount, $3[36] = t16;
      else
        t16 = $3[36];
      let t17;
      if ($3[37] !== isLeaderHighlighted)
        t17 = isLeaderHighlighted && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " \xB7 ",
            TEAMMATE_SELECT_HINT
          ]
        }, void 0, !0, void 0, this), $3[37] = isLeaderHighlighted, $3[38] = t17;
      else
        t17 = $3[38];
      let t18;
      if ($3[39] !== isLeaderForegrounded || $3[40] !== isLeaderSelected)
        t18 = isLeaderSelected && !isLeaderForegrounded && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " \xB7 enter to view"
        }, void 0, !1, void 0, this), $3[39] = isLeaderForegrounded, $3[40] = isLeaderSelected, $3[41] = t18;
      else
        t18 = $3[41];
      if ($3[42] !== t11 || $3[43] !== t13 || $3[44] !== t14 || $3[45] !== t15 || $3[46] !== t16 || $3[47] !== t17 || $3[48] !== t18 || $3[49] !== t8)
        t3 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedBox_default, {
          paddingLeft: 3,
          children: [
            t8,
            t11,
            t13,
            t14,
            t15,
            t16,
            t17,
            t18
          ]
        }, void 0, !0, void 0, this), $3[42] = t11, $3[43] = t13, $3[44] = t14, $3[45] = t15, $3[46] = t16, $3[47] = t17, $3[48] = t18, $3[49] = t8, $3[50] = t3;
      else
        t3 = $3[50];
      t4 = teammateTasks.map((teammate, index) => /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(TeammateSpinnerLine, {
        teammate,
        isLast: !isInSelectionMode && index === teammateTasks.length - 1,
        isSelected: isInSelectionMode && selectedIndex === index,
        isForegrounded: viewingAgentTaskId === teammate.id,
        allIdle,
        showPreview: showTeammateMessagePreview
      }, teammate.id, !1, void 0, this));
    }
    $3[0] = allIdle, $3[1] = isInSelectionMode, $3[2] = leaderIdleText, $3[3] = leaderTokenCount, $3[4] = leaderVerb, $3[5] = selectedIndex, $3[6] = showTeammateMessagePreview, $3[7] = tasks, $3[8] = viewingAgentTaskId, $3[9] = T0, $3[10] = isHideSelected, $3[11] = t1, $3[12] = t2, $3[13] = t3, $3[14] = t4, $3[15] = t5;
  } else
    T0 = $3[9], isHideSelected = $3[10], t1 = $3[11], t2 = $3[12], t3 = $3[13], t4 = $3[14], t5 = $3[15];
  if (t5 !== Symbol.for("react.early_return_sentinel"))
    return t5;
  let t6;
  if ($3[51] !== isHideSelected || $3[52] !== isInSelectionMode)
    t6 = isInSelectionMode && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(HideRow, {
      isSelected: isHideSelected
    }, void 0, !1, void 0, this), $3[51] = isHideSelected, $3[52] = isInSelectionMode, $3[53] = t6;
  else
    t6 = $3[53];
  let t7;
  if ($3[54] !== T0 || $3[55] !== t1 || $3[56] !== t2 || $3[57] !== t3 || $3[58] !== t4 || $3[59] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(T0, {
      flexDirection: t1,
      marginTop: t2,
      children: [
        t3,
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[54] = T0, $3[55] = t1, $3[56] = t2, $3[57] = t3, $3[58] = t4, $3[59] = t6, $3[60] = t7;
  else
    t7 = $3[60];
  return t7;
}
function _temp34(s_1) {
  return s_1.showTeammateMessagePreview;
}
function _temp26(s_0) {
  return s_0.viewingAgentTaskId;
}
function _temp15(s2) {
  return s2.tasks;
}
function HideRow(t0) {
  let $3 = import_compiler_runtime60.c(18), {
    isSelected
  } = t0, t1 = isSelected ? "suggestion" : void 0, t2 = isSelected ? figures_default.pointer : " ", t3;
  if ($3[0] !== isSelected || $3[1] !== t1 || $3[2] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
      color: t1,
      bold: isSelected,
      children: t2
    }, void 0, !1, void 0, this), $3[0] = isSelected, $3[1] = t1, $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  let t4 = !isSelected, t5 = isSelected ? "\u2558\u2550" : "\u2514\u2500", t6;
  if ($3[4] !== isSelected || $3[5] !== t4 || $3[6] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
      dimColor: t4,
      bold: isSelected,
      children: [
        t5,
        " "
      ]
    }, void 0, !0, void 0, this), $3[4] = isSelected, $3[5] = t4, $3[6] = t5, $3[7] = t6;
  else
    t6 = $3[7];
  let t7 = !isSelected, t8;
  if ($3[8] !== isSelected || $3[9] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
      dimColor: t7,
      bold: isSelected,
      children: "hide"
    }, void 0, !1, void 0, this), $3[8] = isSelected, $3[9] = t7, $3[10] = t8;
  else
    t8 = $3[10];
  let t9;
  if ($3[11] !== isSelected)
    t9 = isSelected && /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " \xB7 enter to collapse"
    }, void 0, !1, void 0, this), $3[11] = isSelected, $3[12] = t9;
  else
    t9 = $3[12];
  let t10;
  if ($3[13] !== t3 || $3[14] !== t6 || $3[15] !== t8 || $3[16] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime69.jsxDEV(ThemedBox_default, {
      paddingLeft: 3,
      children: [
        t3,
        t6,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[13] = t3, $3[14] = t6, $3[15] = t8, $3[16] = t9, $3[17] = t10;
  else
    t10 = $3[17];
  return t10;
}
var import_compiler_runtime60, jsx_dev_runtime69;
var init_TeammateSpinnerTree = __esm(() => {
  init_figures();
  init_ink2();
  init_AppState();
  init_InProcessTeammateTask();
  init_format();
  init_TeammateSpinnerLine();
  import_compiler_runtime60 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime69 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
