// Original: src/components/SessionPreview.tsx
function SessionPreview(t0) {
  let $3 = import_compiler_runtime214.c(33), {
    log: log3,
    onExit: onExit2,
    onSelect
  } = t0, [fullLog, setFullLog] = import_react157.default.useState(null), t1, t2;
  if ($3[0] !== log3)
    t1 = () => {
      if (setFullLog(null), isLiteLog(log3))
        loadFullLog(log3).then(setFullLog);
    }, t2 = [log3], $3[0] = log3, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react157.default.useEffect(t1, t2);
  let isLoading = isLiteLog(log3) && fullLog === null, displayLog = fullLog ?? log3, t3;
  if ($3[3] !== displayLog)
    t3 = getSessionIdFromLog(displayLog) || "", $3[3] = displayLog, $3[4] = t3;
  else
    t3 = $3[4];
  let conversationId = t3, t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = getAllBaseTools(), $3[5] = t4;
  else
    t4 = $3[5];
  let tools = t4, t5;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      context: "Confirmation"
    }, $3[6] = t5;
  else
    t5 = $3[6];
  useKeybinding("confirm:no", onExit2, t5);
  let t6;
  if ($3[7] !== fullLog || $3[8] !== log3 || $3[9] !== onSelect)
    t6 = () => {
      onSelect(fullLog ?? log3);
    }, $3[7] = fullLog, $3[8] = log3, $3[9] = onSelect, $3[10] = t6;
  else
    t6 = $3[10];
  let handleSelect = t6, t7;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t7 = {
      context: "Confirmation"
    }, $3[11] = t7;
  else
    t7 = $3[11];
  if (useKeybinding("confirm:yes", handleSelect, t7), isLoading) {
    let t82;
    if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
      t82 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(LoadingState, {
        message: "Loading session\u2026"
      }, void 0, !1, void 0, this), $3[12] = t82;
    else
      t82 = $3[12];
    let t92;
    if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
      t92 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        padding: 1,
        children: [
          t82,
          /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ThemedText, {
            dimColor: !0,
            children: /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(Byline, {
              children: /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[13] = t92;
    else
      t92 = $3[13];
    return t92;
  }
  let t8;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t8 = [], $3[14] = t8;
  else
    t8 = $3[14];
  let t10, t9;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t9 = [], t10 = /* @__PURE__ */ new Set, $3[15] = t10, $3[16] = t9;
  else
    t10 = $3[15], t9 = $3[16];
  let t11;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t11 = [], $3[17] = t11;
  else
    t11 = $3[17];
  let t12;
  if ($3[18] !== conversationId || $3[19] !== displayLog.messages)
    t12 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(Messages4, {
      messages: displayLog.messages,
      tools,
      commands: t8,
      verbose: !0,
      toolJSX: null,
      toolUseConfirmQueue: t9,
      inProgressToolUseIDs: t10,
      isMessageSelectorVisible: !1,
      conversationId,
      screen: "transcript",
      streamingToolUses: t11,
      showAllInTranscript: !0,
      isLoading: !1
    }, void 0, !1, void 0, this), $3[18] = conversationId, $3[19] = displayLog.messages, $3[20] = t12;
  else
    t12 = $3[20];
  let t13;
  if ($3[21] !== displayLog.modified)
    t13 = formatRelativeTimeAgo(displayLog.modified), $3[21] = displayLog.modified, $3[22] = t13;
  else
    t13 = $3[22];
  let t14 = displayLog.gitBranch ? ` \xB7 ${displayLog.gitBranch}` : "", t15;
  if ($3[23] !== displayLog.messageCount || $3[24] !== t13 || $3[25] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ThemedText, {
      children: [
        t13,
        " \xB7",
        " ",
        displayLog.messageCount,
        " messages",
        t14
      ]
    }, void 0, !0, void 0, this), $3[23] = displayLog.messageCount, $3[24] = t13, $3[25] = t14, $3[26] = t15;
  else
    t15 = $3[26];
  let t16;
  if ($3[27] === Symbol.for("react.memo_cache_sentinel"))
    t16 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ThemedText, {
      dimColor: !0,
      children: /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Enter",
            action: "resume"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Confirmation",
            fallback: "Esc",
            description: "cancel"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[27] = t16;
  else
    t16 = $3[27];
  let t17;
  if ($3[28] !== t15)
    t17 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      flexDirection: "column",
      borderTopDimColor: !0,
      borderBottom: !1,
      borderLeft: !1,
      borderRight: !1,
      borderStyle: "single",
      paddingLeft: 2,
      children: [
        t15,
        t16
      ]
    }, void 0, !0, void 0, this), $3[28] = t15, $3[29] = t17;
  else
    t17 = $3[29];
  let t18;
  if ($3[30] !== t12 || $3[31] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime269.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t12,
        t17
      ]
    }, void 0, !0, void 0, this), $3[30] = t12, $3[31] = t17, $3[32] = t18;
  else
    t18 = $3[32];
  return t18;
}
var import_compiler_runtime214, import_react157, jsx_dev_runtime269;
var init_SessionPreview = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_tools2();
  init_format();
  init_sessionStorage();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_KeyboardShortcutHint();
  init_LoadingState();
  init_Messages();
  import_compiler_runtime214 = __toESM(require_react_compiler_runtime_development(), 1), import_react157 = __toESM(require_react_development(), 1), jsx_dev_runtime269 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
