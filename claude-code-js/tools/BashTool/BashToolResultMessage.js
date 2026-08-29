// Original: src/tools/BashTool/BashToolResultMessage.tsx
function extractSandboxViolations(stderr) {
  if (!stderr.match(/<sandbox_violations>([\s\S]*?)<\/sandbox_violations>/))
    return {
      cleanedStderr: stderr
    };
  return {
    cleanedStderr: removeSandboxViolationTags(stderr).trim()
  };
}
function extractCwdResetWarning(stderr) {
  let match = stderr.match(SHELL_CWD_RESET_PATTERN);
  if (!match)
    return {
      cleanedStderr: stderr,
      cwdResetWarning: null
    };
  let cwdResetWarning = match[1] ?? null;
  return {
    cleanedStderr: stderr.replace(SHELL_CWD_RESET_PATTERN, "").trim(),
    cwdResetWarning
  };
}
function BashToolResultMessage(t0) {
  let $3 = import_compiler_runtime72.c(34), {
    content: t1,
    verbose,
    timeoutMs
  } = t0, {
    stdout: t2,
    stderr: t3,
    isImage,
    returnCodeInterpretation,
    noOutputExpected,
    backgroundTaskId
  } = t1, stdout = t2 === void 0 ? "" : t2, stdErrWithViolations = t3 === void 0 ? "" : t3, T0, cwdResetWarning, stderr, t4, t5, t6, t7;
  if ($3[0] !== isImage || $3[1] !== stdErrWithViolations || $3[2] !== stdout || $3[3] !== verbose) {
    t7 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let {
        cleanedStderr: stderrWithoutViolations
      } = extractSandboxViolations(stdErrWithViolations);
      if ({
        cleanedStderr: stderr,
        cwdResetWarning
      } = extractCwdResetWarning(stderrWithoutViolations), isImage) {
        let t82;
        if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
          t82 = /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(MessageResponse, {
            height: 1,
            children: /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "[Image data detected and sent to Claude]"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this), $3[11] = t82;
        else
          t82 = $3[11];
        t7 = t82;
        break bb0;
      }
      if (T0 = ThemedBox_default, t4 = "column", $3[12] !== stdout || $3[13] !== verbose)
        t5 = stdout !== "" ? /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(OutputLine, {
          content: stdout,
          verbose
        }, void 0, !1, void 0, this) : null, $3[12] = stdout, $3[13] = verbose, $3[14] = t5;
      else
        t5 = $3[14];
      t6 = stderr.trim() !== "" ? /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(OutputLine, {
        content: stderr,
        verbose,
        isError: !0
      }, void 0, !1, void 0, this) : null;
    }
    $3[0] = isImage, $3[1] = stdErrWithViolations, $3[2] = stdout, $3[3] = verbose, $3[4] = T0, $3[5] = cwdResetWarning, $3[6] = stderr, $3[7] = t4, $3[8] = t5, $3[9] = t6, $3[10] = t7;
  } else
    T0 = $3[4], cwdResetWarning = $3[5], stderr = $3[6], t4 = $3[7], t5 = $3[8], t6 = $3[9], t7 = $3[10];
  if (t7 !== Symbol.for("react.early_return_sentinel"))
    return t7;
  let t8;
  if ($3[15] !== cwdResetWarning)
    t8 = cwdResetWarning ? /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(ThemedText, {
        dimColor: !0,
        children: cwdResetWarning
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : null, $3[15] = cwdResetWarning, $3[16] = t8;
  else
    t8 = $3[16];
  let t9;
  if ($3[17] !== backgroundTaskId || $3[18] !== cwdResetWarning || $3[19] !== noOutputExpected || $3[20] !== returnCodeInterpretation || $3[21] !== stderr || $3[22] !== stdout)
    t9 = stdout === "" && stderr.trim() === "" && !cwdResetWarning ? /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(ThemedText, {
        dimColor: !0,
        children: backgroundTaskId ? /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(jsx_dev_runtime82.Fragment, {
          children: [
            "Running in the background",
            " ",
            /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(KeyboardShortcutHint, {
              shortcut: "\u2193",
              action: "manage",
              parens: !0
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this) : returnCodeInterpretation || (noOutputExpected ? "Done" : "(No output)")
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : null, $3[17] = backgroundTaskId, $3[18] = cwdResetWarning, $3[19] = noOutputExpected, $3[20] = returnCodeInterpretation, $3[21] = stderr, $3[22] = stdout, $3[23] = t9;
  else
    t9 = $3[23];
  let t10;
  if ($3[24] !== timeoutMs)
    t10 = timeoutMs && /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(ShellTimeDisplay, {
        timeoutMs
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[24] = timeoutMs, $3[25] = t10;
  else
    t10 = $3[25];
  let t11;
  if ($3[26] !== T0 || $3[27] !== t10 || $3[28] !== t4 || $3[29] !== t5 || $3[30] !== t6 || $3[31] !== t8 || $3[32] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime82.jsxDEV(T0, {
      flexDirection: t4,
      children: [
        t5,
        t6,
        t8,
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[26] = T0, $3[27] = t10, $3[28] = t4, $3[29] = t5, $3[30] = t6, $3[31] = t8, $3[32] = t9, $3[33] = t11;
  else
    t11 = $3[33];
  return t11;
}
var import_compiler_runtime72, jsx_dev_runtime82, SHELL_CWD_RESET_PATTERN;
var init_BashToolResultMessage = __esm(() => {
  init_KeyboardShortcutHint();
  init_MessageResponse();
  init_OutputLine();
  init_ShellTimeDisplay();
  init_ink2();
  import_compiler_runtime72 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime82 = __toESM(require_react_jsx_dev_runtime_development(), 1), SHELL_CWD_RESET_PATTERN = /(?:^|\n)(Shell cwd was reset to .+)$/;
});
