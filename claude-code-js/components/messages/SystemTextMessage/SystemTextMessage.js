// function: SystemTextMessage
function SystemTextMessage(t0) {
  let $3 = import_compiler_runtime95.c(51), {
    message,
    addMargin,
    verbose,
    isTranscriptMode
  } = t0, bg = useSelectedMessageBg();
  if (message.subtype === "turn_duration") {
    let t12;
    if ($3[0] !== addMargin || $3[1] !== message)
      t12 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(TurnDurationMessage, {
        message,
        addMargin
      }, void 0, !1, void 0, this), $3[0] = addMargin, $3[1] = message, $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  if (message.subtype === "memory_saved") {
    let t12;
    if ($3[3] !== addMargin || $3[4] !== message)
      t12 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(MemorySavedMessage, {
        message,
        addMargin
      }, void 0, !1, void 0, this), $3[3] = addMargin, $3[4] = message, $3[5] = t12;
    else
      t12 = $3[5];
    return t12;
  }
  if (message.subtype === "away_summary") {
    let t12 = addMargin ? 1 : 0, t22;
    if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        minWidth: 2,
        children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
          dimColor: !0,
          children: REFERENCE_MARK
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[6] = t22;
    else
      t22 = $3[6];
    let t32;
    if ($3[7] !== message.content)
      t32 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: message.content
      }, void 0, !1, void 0, this), $3[7] = message.content, $3[8] = t32;
    else
      t32 = $3[8];
    let t42;
    if ($3[9] !== bg || $3[10] !== t12 || $3[11] !== t32)
      t42 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        marginTop: t12,
        backgroundColor: bg,
        width: "100%",
        children: [
          t22,
          t32
        ]
      }, void 0, !0, void 0, this), $3[9] = bg, $3[10] = t12, $3[11] = t32, $3[12] = t42;
    else
      t42 = $3[12];
    return t42;
  }
  if (message.subtype === "agents_killed") {
    let t12 = addMargin ? 1 : 0, t22, t32;
    if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        minWidth: 2,
        children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
          color: "error",
          children: BLACK_CIRCLE
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), t32 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "All background agents stopped"
      }, void 0, !1, void 0, this), $3[13] = t22, $3[14] = t32;
    else
      t22 = $3[13], t32 = $3[14];
    let t42;
    if ($3[15] !== bg || $3[16] !== t12)
      t42 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        marginTop: t12,
        backgroundColor: bg,
        width: "100%",
        children: [
          t22,
          t32
        ]
      }, void 0, !0, void 0, this), $3[15] = bg, $3[16] = t12, $3[17] = t42;
    else
      t42 = $3[17];
    return t42;
  }
  if (message.subtype === "thinking")
    return null;
  if (message.subtype === "bridge_status") {
    let t12;
    if ($3[18] !== addMargin || $3[19] !== message)
      t12 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(BridgeStatusMessage, {
        message,
        addMargin
      }, void 0, !1, void 0, this), $3[18] = addMargin, $3[19] = message, $3[20] = t12;
    else
      t12 = $3[20];
    return t12;
  }
  if (message.subtype === "scheduled_task_fire") {
    let t12 = addMargin ? 1 : 0, t22;
    if ($3[21] !== message.content)
      t22 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          TEARDROP_ASTERISK,
          " ",
          message.content
        ]
      }, void 0, !0, void 0, this), $3[21] = message.content, $3[22] = t22;
    else
      t22 = $3[22];
    let t32;
    if ($3[23] !== bg || $3[24] !== t12 || $3[25] !== t22)
      t32 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        marginTop: t12,
        backgroundColor: bg,
        width: "100%",
        children: t22
      }, void 0, !1, void 0, this), $3[23] = bg, $3[24] = t12, $3[25] = t22, $3[26] = t32;
    else
      t32 = $3[26];
    return t32;
  }
  if (message.subtype === "permission_retry") {
    let t12 = addMargin ? 1 : 0, t22, t32;
    if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          TEARDROP_ASTERISK,
          " "
        ]
      }, void 0, !0, void 0, this), t32 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        children: "Allowed "
      }, void 0, !1, void 0, this), $3[27] = t22, $3[28] = t32;
    else
      t22 = $3[27], t32 = $3[28];
    let t42;
    if ($3[29] !== message.commands)
      t42 = message.commands.join(", "), $3[29] = message.commands, $3[30] = t42;
    else
      t42 = $3[30];
    let t5;
    if ($3[31] !== t42)
      t5 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        bold: !0,
        children: t42
      }, void 0, !1, void 0, this), $3[31] = t42, $3[32] = t5;
    else
      t5 = $3[32];
    let t6;
    if ($3[33] !== bg || $3[34] !== t12 || $3[35] !== t5)
      t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
        marginTop: t12,
        backgroundColor: bg,
        width: "100%",
        children: [
          t22,
          t32,
          t5
        ]
      }, void 0, !0, void 0, this), $3[33] = bg, $3[34] = t12, $3[35] = t5, $3[36] = t6;
    else
      t6 = $3[36];
    return t6;
  }
  if (message.subtype !== "stop_hook_summary" && !verbose && message.level === "info")
    return null;
  if (message.subtype === "api_error") {
    let t12;
    if ($3[37] !== message || $3[38] !== verbose)
      t12 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(SystemAPIErrorMessage, {
        message,
        verbose
      }, void 0, !1, void 0, this), $3[37] = message, $3[38] = verbose, $3[39] = t12;
    else
      t12 = $3[39];
    return t12;
  }
  if (message.subtype === "stop_hook_summary") {
    let t12;
    if ($3[40] !== addMargin || $3[41] !== isTranscriptMode || $3[42] !== message || $3[43] !== verbose)
      t12 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(StopHookSummaryMessage, {
        message,
        addMargin,
        verbose,
        isTranscriptMode
      }, void 0, !1, void 0, this), $3[40] = addMargin, $3[41] = isTranscriptMode, $3[42] = message, $3[43] = verbose, $3[44] = t12;
    else
      t12 = $3[44];
    return t12;
  }
  let content = message.content;
  if (typeof content !== "string")
    return null;
  let t1 = message.level !== "info", t2 = message.level === "warning" ? "warning" : void 0, t3 = message.level === "info", t4;
  if ($3[45] !== addMargin || $3[46] !== content || $3[47] !== t1 || $3[48] !== t2 || $3[49] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      width: "100%",
      children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(SystemTextMessageInner, {
        content,
        addMargin,
        dot: t1,
        color: t2,
        dimColor: t3
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[45] = addMargin, $3[46] = content, $3[47] = t1, $3[48] = t2, $3[49] = t3, $3[50] = t4;
  else
    t4 = $3[50];
  return t4;
}
