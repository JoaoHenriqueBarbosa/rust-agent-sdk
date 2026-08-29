// Original: src/components/TeleportResumeWrapper.tsx
var exports_TeleportResumeWrapper = {};
__export(exports_TeleportResumeWrapper, {
  TeleportResumeWrapper: () => TeleportResumeWrapper
});
function TeleportResumeWrapper(t0) {
  let $3 = import_compiler_runtime375.c(25), {
    onComplete,
    onCancel,
    onError,
    isEmbedded: t1,
    source
  } = t0, isEmbedded = t1 === void 0 ? !1 : t1, {
    resumeSession,
    isResuming,
    error: error44,
    selectedSession
  } = useTeleportResume(source), t2, t3;
  if ($3[0] !== source)
    t2 = () => {
      logEvent("tengu_teleport_started", {
        source
      });
    }, t3 = [source], $3[0] = source, $3[1] = t2, $3[2] = t3;
  else
    t2 = $3[1], t3 = $3[2];
  import_react313.useEffect(t2, t3);
  let t4;
  if ($3[3] !== error44 || $3[4] !== onComplete || $3[5] !== onError || $3[6] !== resumeSession)
    t4 = async (session2) => {
      let result = await resumeSession(session2);
      if (result)
        onComplete(result);
      else if (error44) {
        if (onError)
          onError(error44.message, error44.formattedMessage);
      }
    }, $3[3] = error44, $3[4] = onComplete, $3[5] = onError, $3[6] = resumeSession, $3[7] = t4;
  else
    t4 = $3[7];
  let handleSelect = t4, t5;
  if ($3[8] !== onCancel)
    t5 = () => {
      logEvent("tengu_teleport_cancelled", {}), onCancel();
    }, $3[8] = onCancel, $3[9] = t5;
  else
    t5 = $3[9];
  let handleCancel = t5, t6 = !!error44 && !onError, t7;
  if ($3[10] !== t6)
    t7 = {
      context: "Global",
      isActive: t6
    }, $3[10] = t6, $3[11] = t7;
  else
    t7 = $3[11];
  if (useKeybinding("app:interrupt", handleCancel, t7), isResuming && selectedSession) {
    let t82;
    if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
      t82 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedText, {
            bold: !0,
            children: "Resuming session\u2026"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[12] = t82;
    else
      t82 = $3[12];
    let t9;
    if ($3[13] !== selectedSession.title)
      t9 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        padding: 1,
        children: [
          t82,
          /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              'Loading "',
              selectedSession.title,
              '"\u2026'
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[13] = selectedSession.title, $3[14] = t9;
    else
      t9 = $3[14];
    return t9;
  }
  if (error44 && !onError) {
    let t82;
    if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
      t82 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedText, {
        bold: !0,
        color: "error",
        children: "Failed to resume session"
      }, void 0, !1, void 0, this), $3[15] = t82;
    else
      t82 = $3[15];
    let t9;
    if ($3[16] !== error44.message)
      t9 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedText, {
        dimColor: !0,
        children: error44.message
      }, void 0, !1, void 0, this), $3[16] = error44.message, $3[17] = t9;
    else
      t9 = $3[17];
    let t10;
    if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
      t10 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Press ",
            /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedText, {
              bold: !0,
              children: "Esc"
            }, void 0, !1, void 0, this),
            " to cancel"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[18] = t10;
    else
      t10 = $3[18];
    let t11;
    if ($3[19] !== t9)
      t11 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        padding: 1,
        children: [
          t82,
          t9,
          t10
        ]
      }, void 0, !0, void 0, this), $3[19] = t9, $3[20] = t11;
    else
      t11 = $3[20];
    return t11;
  }
  let t8;
  if ($3[21] !== handleCancel || $3[22] !== handleSelect || $3[23] !== isEmbedded)
    t8 = /* @__PURE__ */ jsx_dev_runtime476.jsxDEV(ResumeTask, {
      onSelect: handleSelect,
      onCancel: handleCancel,
      isEmbedded
    }, void 0, !1, void 0, this), $3[21] = handleCancel, $3[22] = handleSelect, $3[23] = isEmbedded, $3[24] = t8;
  else
    t8 = $3[24];
  return t8;
}
var import_compiler_runtime375, import_react313, jsx_dev_runtime476;
var init_TeleportResumeWrapper = __esm(() => {
  init_useTeleportResume();
  init_ink2();
  init_useKeybinding();
  init_ResumeTask();
  init_Spinner2();
  import_compiler_runtime375 = __toESM(require_react_compiler_runtime_development(), 1), import_react313 = __toESM(require_react_development(), 1), jsx_dev_runtime476 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
