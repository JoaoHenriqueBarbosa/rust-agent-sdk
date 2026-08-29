// function: StopHookSummaryMessage
function StopHookSummaryMessage(t0) {
  let $3 = import_compiler_runtime95.c(47), {
    message,
    addMargin,
    verbose,
    isTranscriptMode
  } = t0, bg = useSelectedMessageBg(), {
    hookCount,
    hookInfos,
    hookErrors,
    preventedContinuation,
    stopReason
  } = message, {
    columns
  } = useTerminalSize(), t1;
  if ($3[0] !== hookInfos || $3[1] !== message.totalDurationMs)
    t1 = message.totalDurationMs ?? hookInfos.reduce(_temp21, 0), $3[0] = hookInfos, $3[1] = message.totalDurationMs, $3[2] = t1;
  else
    t1 = $3[2];
  let totalDurationMs = t1;
  if (hookErrors.length === 0 && !preventedContinuation && !message.hookLabel)
    return null;
  let t2;
  if ($3[3] !== totalDurationMs)
    t2 = "", $3[3] = totalDurationMs, $3[4] = t2;
  else
    t2 = $3[4];
  let totalStr = t2;
  if (message.hookLabel) {
    let t32 = hookCount === 1 ? "hook" : "hooks", t42;
    if ($3[5] !== hookCount || $3[6] !== message.hookLabel || $3[7] !== t32 || $3[8] !== totalStr)
      t42 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  \u23BF  ",
          "Ran ",
          hookCount,
          " ",
          message.hookLabel,
          " ",
          t32,
          totalStr
        ]
      }, void 0, !0, void 0, this), $3[5] = hookCount, $3[6] = message.hookLabel, $3[7] = t32, $3[8] = totalStr, $3[9] = t42;
    else
      t42 = $3[9];
    let t52;
    if ($3[10] !== hookInfos || $3[11] !== isTranscriptMode)
      t52 = isTranscriptMode && hookInfos.map(_temp29), $3[10] = hookInfos, $3[11] = isTranscriptMode, $3[12] = t52;
    else
      t52 = $3[12];
    let t62;
    if ($3[13] !== t42 || $3[14] !== t52)
      t62 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: "100%",
        children: [
          t42,
          t52
        ]
      }, void 0, !0, void 0, this), $3[13] = t42, $3[14] = t52, $3[15] = t62;
    else
      t62 = $3[15];
    return t62;
  }
  let t3 = addMargin ? 1 : 0, t4;
  if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      minWidth: 2,
      children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        children: BLACK_CIRCLE
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = t4;
  else
    t4 = $3[16];
  let t5 = columns - 10, t6;
  if ($3[17] !== hookCount)
    t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      bold: !0,
      children: hookCount
    }, void 0, !1, void 0, this), $3[17] = hookCount, $3[18] = t6;
  else
    t6 = $3[18];
  let t7 = message.hookLabel ?? "stop", t8 = hookCount === 1 ? "hook" : "hooks", t9;
  if ($3[19] !== hookInfos || $3[20] !== verbose)
    t9 = !verbose && hookInfos.length > 0 && /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(jsx_dev_runtime106.Fragment, {
      children: [
        " ",
        /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[19] = hookInfos, $3[20] = verbose, $3[21] = t9;
  else
    t9 = $3[21];
  let t10;
  if ($3[22] !== t6 || $3[23] !== t7 || $3[24] !== t8 || $3[25] !== t9 || $3[26] !== totalStr)
    t10 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      children: [
        "Ran ",
        t6,
        " ",
        t7,
        " ",
        t8,
        totalStr,
        t9
      ]
    }, void 0, !0, void 0, this), $3[22] = t6, $3[23] = t7, $3[24] = t8, $3[25] = t9, $3[26] = totalStr, $3[27] = t10;
  else
    t10 = $3[27];
  let t11;
  if ($3[28] !== hookInfos || $3[29] !== verbose)
    t11 = verbose && hookInfos.length > 0 && hookInfos.map(_temp37), $3[28] = hookInfos, $3[29] = verbose, $3[30] = t11;
  else
    t11 = $3[30];
  let t12;
  if ($3[31] !== preventedContinuation || $3[32] !== stopReason)
    t12 = preventedContinuation && stopReason && /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\u23BF \xA0"
        }, void 0, !1, void 0, this),
        stopReason
      ]
    }, void 0, !0, void 0, this), $3[31] = preventedContinuation, $3[32] = stopReason, $3[33] = t12;
  else
    t12 = $3[33];
  let t13;
  if ($3[34] !== hookErrors || $3[35] !== message.hookLabel)
    t13 = hookErrors.length > 0 && hookErrors.map((err2, idx_1) => /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "\u23BF \xA0"
        }, void 0, !1, void 0, this),
        message.hookLabel ?? "Stop",
        " hook error: ",
        err2
      ]
    }, idx_1, !0, void 0, this)), $3[34] = hookErrors, $3[35] = message.hookLabel, $3[36] = t13;
  else
    t13 = $3[36];
  let t14;
  if ($3[37] !== t10 || $3[38] !== t11 || $3[39] !== t12 || $3[40] !== t13 || $3[41] !== t5)
    t14 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: t5,
      children: [
        t10,
        t11,
        t12,
        t13
      ]
    }, void 0, !0, void 0, this), $3[37] = t10, $3[38] = t11, $3[39] = t12, $3[40] = t13, $3[41] = t5, $3[42] = t14;
  else
    t14 = $3[42];
  let t15;
  if ($3[43] !== bg || $3[44] !== t14 || $3[45] !== t3)
    t15 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: t3,
      backgroundColor: bg,
      width: "100%",
      children: [
        t4,
        t14
      ]
    }, void 0, !0, void 0, this), $3[43] = bg, $3[44] = t14, $3[45] = t3, $3[46] = t15;
  else
    t15 = $3[46];
  return t15;
}
