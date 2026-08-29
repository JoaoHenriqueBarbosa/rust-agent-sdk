// Original: src/components/shell/ShellProgressMessage.tsx
function ShellProgressMessage(t0) {
  let $3 = import_compiler_runtime106.c(30), {
    output,
    fullOutput,
    elapsedTimeSeconds,
    totalLines,
    totalBytes,
    timeoutMs,
    verbose
  } = t0, t1;
  if ($3[0] !== fullOutput)
    t1 = stripAnsi(fullOutput.trim()), $3[0] = fullOutput, $3[1] = t1;
  else
    t1 = $3[1];
  let strippedFullOutput = t1, lines2, t2;
  if ($3[2] !== output || $3[3] !== strippedFullOutput || $3[4] !== verbose)
    lines2 = stripAnsi(output.trim()).split(`
`).filter(_temp41), t2 = verbose ? strippedFullOutput : lines2.slice(-5).join(`
`), $3[2] = output, $3[3] = strippedFullOutput, $3[4] = verbose, $3[5] = lines2, $3[6] = t2;
  else
    lines2 = $3[5], t2 = $3[6];
  let displayLines = t2;
  if (!lines2.length) {
    let t32;
    if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Running\u2026 "
      }, void 0, !1, void 0, this), $3[7] = t32;
    else
      t32 = $3[7];
    let t42;
    if ($3[8] !== elapsedTimeSeconds || $3[9] !== timeoutMs)
      t42 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(OffscreenFreeze, {
          children: [
            t32,
            /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ShellTimeDisplay, {
              elapsedTimeSeconds,
              timeoutMs
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[8] = elapsedTimeSeconds, $3[9] = timeoutMs, $3[10] = t42;
    else
      t42 = $3[10];
    return t42;
  }
  let extraLines = totalLines ? Math.max(0, totalLines - 5) : 0, lineStatus = "";
  if (!verbose && totalBytes && totalLines)
    lineStatus = `~${totalLines} lines`;
  else if (!verbose && extraLines > 0)
    lineStatus = `+${extraLines} lines`;
  let t3 = verbose ? void 0 : Math.min(5, lines2.length), t4;
  if ($3[11] !== displayLines)
    t4 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedText, {
      dimColor: !0,
      children: displayLines
    }, void 0, !1, void 0, this), $3[11] = displayLines, $3[12] = t4;
  else
    t4 = $3[12];
  let t5;
  if ($3[13] !== t3 || $3[14] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedBox_default, {
      height: t3,
      flexDirection: "column",
      overflow: "hidden",
      children: t4
    }, void 0, !1, void 0, this), $3[13] = t3, $3[14] = t4, $3[15] = t5;
  else
    t5 = $3[15];
  let t6;
  if ($3[16] !== lineStatus)
    t6 = lineStatus ? /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedText, {
      dimColor: !0,
      children: lineStatus
    }, void 0, !1, void 0, this) : null, $3[16] = lineStatus, $3[17] = t6;
  else
    t6 = $3[17];
  let t7;
  if ($3[18] !== elapsedTimeSeconds || $3[19] !== timeoutMs)
    t7 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ShellTimeDisplay, {
      elapsedTimeSeconds,
      timeoutMs
    }, void 0, !1, void 0, this), $3[18] = elapsedTimeSeconds, $3[19] = timeoutMs, $3[20] = t7;
  else
    t7 = $3[20];
  let t8;
  if ($3[21] !== totalBytes)
    t8 = totalBytes ? /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedText, {
      dimColor: !0,
      children: formatFileSize(totalBytes)
    }, void 0, !1, void 0, this) : null, $3[21] = totalBytes, $3[22] = t8;
  else
    t8 = $3[22];
  let t9;
  if ($3[23] !== t6 || $3[24] !== t7 || $3[25] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      children: [
        t6,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[23] = t6, $3[24] = t7, $3[25] = t8, $3[26] = t9;
  else
    t9 = $3[26];
  let t10;
  if ($3[27] !== t5 || $3[28] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(OffscreenFreeze, {
        children: /* @__PURE__ */ jsx_dev_runtime121.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            t5,
            t9
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[27] = t5, $3[28] = t9, $3[29] = t10;
  else
    t10 = $3[29];
  return t10;
}
function _temp41(line) {
  return line;
}
var import_compiler_runtime106, jsx_dev_runtime121;
var init_ShellProgressMessage = __esm(() => {
  init_strip_ansi();
  init_ink2();
  init_format();
  init_MessageResponse();
  init_OffscreenFreeze();
  init_ShellTimeDisplay();
  import_compiler_runtime106 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime121 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
