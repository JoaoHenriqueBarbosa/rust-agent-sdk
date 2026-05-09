// Original: src/components/CompactSummary.tsx
function CompactSummary(t0) {
  let $3 = import_compiler_runtime39.c(24), {
    message,
    screen
  } = t0, isTranscriptMode = screen === "transcript", t1;
  if ($3[0] !== message)
    t1 = getUserMessageText(message) || "", $3[0] = message, $3[1] = t1;
  else
    t1 = $3[1];
  let textContent = t1, metadata = message.summarizeMetadata;
  if (metadata) {
    let t22;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t22 = /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
        minWidth: 2,
        children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
          color: "text",
          children: BLACK_CIRCLE
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[2] = t22;
    else
      t22 = $3[2];
    let t32;
    if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
        bold: !0,
        children: "Summarized conversation"
      }, void 0, !1, void 0, this), $3[3] = t32;
    else
      t32 = $3[3];
    let t42;
    if ($3[4] !== isTranscriptMode || $3[5] !== metadata)
      t42 = !isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Summarized ",
                metadata.messagesSummarized,
                " messages",
                " ",
                metadata.direction === "up_to" ? "up to this point" : "from this point"
              ]
            }, void 0, !0, void 0, this),
            metadata.userContext && /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Context: ",
                "\u201C",
                metadata.userContext,
                "\u201D"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
              dimColor: !0,
              children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ConfigurableShortcutHint, {
                action: "app:toggleTranscript",
                context: "Global",
                fallback: "ctrl+o",
                description: "expand history",
                parens: !0
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[4] = isTranscriptMode, $3[5] = metadata, $3[6] = t42;
    else
      t42 = $3[6];
    let t52;
    if ($3[7] !== isTranscriptMode || $3[8] !== textContent)
      t52 = isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
          children: textContent
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[7] = isTranscriptMode, $3[8] = textContent, $3[9] = t52;
    else
      t52 = $3[9];
    let t62;
    if ($3[10] !== t42 || $3[11] !== t52)
      t62 = /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            t22,
            /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              children: [
                t32,
                t42,
                t52
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[10] = t42, $3[11] = t52, $3[12] = t62;
    else
      t62 = $3[12];
    return t62;
  }
  let t2;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
      minWidth: 2,
      children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
        color: "text",
        children: BLACK_CIRCLE
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = t2;
  else
    t2 = $3[13];
  let t3;
  if ($3[14] !== isTranscriptMode)
    t3 = !isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " ",
        /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ConfigurableShortcutHint, {
          action: "app:toggleTranscript",
          context: "Global",
          fallback: "ctrl+o",
          description: "expand",
          parens: !0
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[14] = isTranscriptMode, $3[15] = t3;
  else
    t3 = $3[15];
  let t4;
  if ($3[16] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: [
        t2,
        /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
            bold: !0,
            children: [
              "Compact summary",
              t3
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[16] = t3, $3[17] = t4;
  else
    t4 = $3[17];
  let t5;
  if ($3[18] !== isTranscriptMode || $3[19] !== textContent)
    t5 = isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedText, {
        children: textContent
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[18] = isTranscriptMode, $3[19] = textContent, $3[20] = t5;
  else
    t5 = $3[20];
  let t6;
  if ($3[21] !== t4 || $3[22] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime45.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[21] = t4, $3[22] = t5, $3[23] = t6;
  else
    t6 = $3[23];
  return t6;
}
var import_compiler_runtime39, jsx_dev_runtime45;
var init_CompactSummary = __esm(() => {
  init_figures2();
  init_ink2();
  init_messages3();
  init_ConfigurableShortcutHint();
  init_MessageResponse();
  import_compiler_runtime39 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime45 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
