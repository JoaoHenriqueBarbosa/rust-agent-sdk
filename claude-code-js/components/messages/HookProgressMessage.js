// Original: src/components/messages/HookProgressMessage.tsx
function HookProgressMessage(t0) {
  let $3 = import_compiler_runtime67.c(22), {
    hookEvent,
    lookups,
    toolUseID,
    isTranscriptMode
  } = t0, t1;
  if ($3[0] !== hookEvent || $3[1] !== lookups.inProgressHookCounts || $3[2] !== toolUseID)
    t1 = lookups.inProgressHookCounts.get(toolUseID)?.get(hookEvent) ?? 0, $3[0] = hookEvent, $3[1] = lookups.inProgressHookCounts, $3[2] = toolUseID, $3[3] = t1;
  else
    t1 = $3[3];
  let inProgressHookCount = t1, resolvedHookCount = lookups.resolvedHookCounts.get(toolUseID)?.get(hookEvent) ?? 0;
  if (inProgressHookCount === 0)
    return null;
  if (hookEvent === "PreToolUse" || hookEvent === "PostToolUse") {
    if (isTranscriptMode) {
      let t22;
      if ($3[4] !== inProgressHookCount)
        t22 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            inProgressHookCount,
            " "
          ]
        }, void 0, !0, void 0, this), $3[4] = inProgressHookCount, $3[5] = t22;
      else
        t22 = $3[5];
      let t32;
      if ($3[6] !== hookEvent)
        t32 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedText, {
          dimColor: !0,
          bold: !0,
          children: hookEvent
        }, void 0, !1, void 0, this), $3[6] = hookEvent, $3[7] = t32;
      else
        t32 = $3[7];
      let t42 = inProgressHookCount === 1 ? " hook" : " hooks", t52;
      if ($3[8] !== t42)
        t52 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            t42,
            " ran"
          ]
        }, void 0, !0, void 0, this), $3[8] = t42, $3[9] = t52;
      else
        t52 = $3[9];
      let t62;
      if ($3[10] !== t22 || $3[11] !== t32 || $3[12] !== t52)
        t62 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              t22,
              t32,
              t52
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[10] = t22, $3[11] = t32, $3[12] = t52, $3[13] = t62;
      else
        t62 = $3[13];
      return t62;
    }
    return null;
  }
  if (resolvedHookCount === inProgressHookCount)
    return null;
  let t2;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Running "
    }, void 0, !1, void 0, this), $3[14] = t2;
  else
    t2 = $3[14];
  let t3;
  if ($3[15] !== hookEvent)
    t3 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedText, {
      dimColor: !0,
      bold: !0,
      children: hookEvent
    }, void 0, !1, void 0, this), $3[15] = hookEvent, $3[16] = t3;
  else
    t3 = $3[16];
  let t4 = inProgressHookCount === 1 ? " hook\u2026" : " hooks\u2026", t5;
  if ($3[17] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t4
    }, void 0, !1, void 0, this), $3[17] = t4, $3[18] = t5;
  else
    t5 = $3[18];
  let t6;
  if ($3[19] !== t3 || $3[20] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime77.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          t2,
          t3,
          t5
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[19] = t3, $3[20] = t5, $3[21] = t6;
  else
    t6 = $3[21];
  return t6;
}
var import_compiler_runtime67, jsx_dev_runtime77;
var init_HookProgressMessage = __esm(() => {
  init_ink2();
  init_MessageResponse();
  import_compiler_runtime67 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime77 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
