// Original: src/components/FallbackToolUseErrorMessage.tsx
function FallbackToolUseErrorMessage(t0) {
  let $3 = import_compiler_runtime35.c(25), {
    result,
    verbose
  } = t0, transcriptShortcut = useShortcutDisplay("app:toggleTranscript", "Global", "ctrl+o"), T0, T1, T2, plusLines, t1, t2, t3;
  if ($3[0] !== result || $3[1] !== verbose) {
    let error44;
    if (typeof result !== "string")
      error44 = "Tool execution failed";
    else {
      let extractedError = extractTag(result, "tool_use_error") ?? result, trimmed = removeSandboxViolationTags(extractedError).replace(/<\/?error>/g, "").trim();
      if (!verbose && trimmed.includes("InputValidationError: "))
        error44 = "Invalid tool parameters";
      else if (trimmed.startsWith("Error: ") || trimmed.startsWith("Cancelled: "))
        error44 = trimmed;
      else
        error44 = `Error: ${trimmed}`;
    }
    plusLines = countCharInString(error44, `
`) + 1 - MAX_RENDERED_LINES, T2 = MessageResponse, T1 = ThemedBox_default, t3 = "column", T0 = ThemedText, t1 = "error", t2 = stripUnderlineAnsi(verbose ? error44 : error44.split(`
`).slice(0, MAX_RENDERED_LINES).join(`
`)), $3[0] = result, $3[1] = verbose, $3[2] = T0, $3[3] = T1, $3[4] = T2, $3[5] = plusLines, $3[6] = t1, $3[7] = t2, $3[8] = t3;
  } else
    T0 = $3[2], T1 = $3[3], T2 = $3[4], plusLines = $3[5], t1 = $3[6], t2 = $3[7], t3 = $3[8];
  let t4;
  if ($3[9] !== T0 || $3[10] !== t1 || $3[11] !== t2)
    t4 = /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(T0, {
      color: t1,
      children: t2
    }, void 0, !1, void 0, this), $3[9] = T0, $3[10] = t1, $3[11] = t2, $3[12] = t4;
  else
    t4 = $3[12];
  let t5;
  if ($3[13] !== plusLines || $3[14] !== transcriptShortcut || $3[15] !== verbose)
    t5 = !verbose && plusLines > 0 && /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(ThemedBox_default, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "\u2026 +",
            plusLines,
            " ",
            plusLines === 1 ? "line" : "lines",
            " ("
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(ThemedText, {
          dimColor: !0,
          bold: !0,
          children: transcriptShortcut
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(ThemedText, {
          children: " "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "to see all)"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[13] = plusLines, $3[14] = transcriptShortcut, $3[15] = verbose, $3[16] = t5;
  else
    t5 = $3[16];
  let t6;
  if ($3[17] !== T1 || $3[18] !== t3 || $3[19] !== t4 || $3[20] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(T1, {
      flexDirection: t3,
      children: [
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[17] = T1, $3[18] = t3, $3[19] = t4, $3[20] = t5, $3[21] = t6;
  else
    t6 = $3[21];
  let t7;
  if ($3[22] !== T2 || $3[23] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime40.jsxDEV(T2, {
      children: t6
    }, void 0, !1, void 0, this), $3[22] = T2, $3[23] = t6, $3[24] = t7;
  else
    t7 = $3[24];
  return t7;
}
var import_compiler_runtime35, jsx_dev_runtime40, MAX_RENDERED_LINES = 10;
var init_FallbackToolUseErrorMessage = __esm(() => {
  init_OutputLine();
  init_messages3();
  init_ink2();
  init_useShortcutDisplay();
  init_MessageResponse();
  import_compiler_runtime35 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime40 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
