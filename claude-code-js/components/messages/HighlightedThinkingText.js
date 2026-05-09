// Original: src/components/messages/HighlightedThinkingText.tsx
function HighlightedThinkingText(t0) {
  let $3 = import_compiler_runtime79.c(31), {
    text: text2,
    useBriefLayout,
    timestamp
  } = t0, isQueued = useQueuedMessage()?.isQueued ?? !1, pointerColor = import_react65.useContext(MessageActionsSelectedContext) ? "suggestion" : "subtle";
  if (useBriefLayout) {
    let t12;
    if ($3[0] !== timestamp)
      t12 = timestamp ? formatBriefTimestamp(timestamp) : "", $3[0] = timestamp, $3[1] = t12;
    else
      t12 = $3[1];
    let ts = t12, t22 = isQueued ? "subtle" : "briefLabelYou", t32;
    if ($3[2] !== t22)
      t32 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
        color: t22,
        children: "You"
      }, void 0, !1, void 0, this), $3[2] = t22, $3[3] = t32;
    else
      t32 = $3[3];
    let t4;
    if ($3[4] !== ts)
      t4 = ts ? /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          " ",
          ts
        ]
      }, void 0, !0, void 0, this) : null, $3[4] = ts, $3[5] = t4;
    else
      t4 = $3[5];
    let t5;
    if ($3[6] !== t32 || $3[7] !== t4)
      t5 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          t32,
          t4
        ]
      }, void 0, !0, void 0, this), $3[6] = t32, $3[7] = t4, $3[8] = t5;
    else
      t5 = $3[8];
    let t6 = isQueued ? "subtle" : "text", t7;
    if ($3[9] !== t6 || $3[10] !== text2)
      t7 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
        color: t6,
        children: text2
      }, void 0, !1, void 0, this), $3[9] = t6, $3[10] = text2, $3[11] = t7;
    else
      t7 = $3[11];
    let t8;
    if ($3[12] !== t5 || $3[13] !== t7)
      t8 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingLeft: 2,
        children: [
          t5,
          t7
        ]
      }, void 0, !0, void 0, this), $3[12] = t5, $3[13] = t7, $3[14] = t8;
    else
      t8 = $3[14];
    return t8;
  }
  let parts, t1;
  if ($3[15] !== pointerColor || $3[16] !== text2) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let triggers = isUltrathinkEnabled() ? findThinkingTriggerPositions(text2) : [];
      if (triggers.length === 0) {
        let t22;
        if ($3[19] !== pointerColor)
          t22 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
            color: pointerColor,
            children: [
              figures_default.pointer,
              " "
            ]
          }, void 0, !0, void 0, this), $3[19] = pointerColor, $3[20] = t22;
        else
          t22 = $3[20];
        let t32;
        if ($3[21] !== text2)
          t32 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
            color: "text",
            children: text2
          }, void 0, !1, void 0, this), $3[21] = text2, $3[22] = t32;
        else
          t32 = $3[22];
        let t4;
        if ($3[23] !== t22 || $3[24] !== t32)
          t4 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
            children: [
              t22,
              t32
            ]
          }, void 0, !0, void 0, this), $3[23] = t22, $3[24] = t32, $3[25] = t4;
        else
          t4 = $3[25];
        t1 = t4;
        break bb0;
      }
      parts = [];
      let cursor = 0;
      for (let t4 of triggers) {
        if (t4.start > cursor)
          parts.push(/* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
            color: "text",
            children: text2.slice(cursor, t4.start)
          }, `plain-${cursor}`, !1, void 0, this));
        for (let i5 = t4.start;i5 < t4.end; i5++)
          parts.push(/* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
            color: getRainbowColor(i5 - t4.start),
            children: text2[i5]
          }, `rb-${i5}`, !1, void 0, this));
        cursor = t4.end;
      }
      if (cursor < text2.length)
        parts.push(/* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
          color: "text",
          children: text2.slice(cursor)
        }, `plain-${cursor}`, !1, void 0, this));
    }
    $3[15] = pointerColor, $3[16] = text2, $3[17] = parts, $3[18] = t1;
  } else
    parts = $3[17], t1 = $3[18];
  if (t1 !== Symbol.for("react.early_return_sentinel"))
    return t1;
  let t2;
  if ($3[26] !== pointerColor)
    t2 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
      color: pointerColor,
      children: [
        figures_default.pointer,
        " "
      ]
    }, void 0, !0, void 0, this), $3[26] = pointerColor, $3[27] = t2;
  else
    t2 = $3[27];
  let t3;
  if ($3[28] !== parts || $3[29] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime89.jsxDEV(ThemedText, {
      children: [
        t2,
        parts
      ]
    }, void 0, !0, void 0, this), $3[28] = parts, $3[29] = t2, $3[30] = t3;
  else
    t3 = $3[30];
  return t3;
}
var import_compiler_runtime79, import_react65, jsx_dev_runtime89;
var init_HighlightedThinkingText = __esm(() => {
  init_figures();
  init_QueuedMessageContext();
  init_ink2();
  init_thinking();
  init_messageActions();
  import_compiler_runtime79 = __toESM(require_react_compiler_runtime_development(), 1), import_react65 = __toESM(require_react_development(), 1), jsx_dev_runtime89 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
