// Original: src/components/messages/SystemAPIErrorMessage.tsx
function SystemAPIErrorMessage(t0) {
  let $3 = import_compiler_runtime94.c(33), {
    message: t1,
    verbose
  } = t0, {
    retryAttempt,
    error: error44,
    retryInMs,
    maxRetries
  } = t1, hidden2 = retryAttempt < 4, [countdownMs, setCountdownMs] = import_react71.useState(0), done = countdownMs >= retryInMs, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => setCountdownMs(_temp20), $3[0] = t2;
  else
    t2 = $3[0];
  if (useInterval(t2, hidden2 || done ? null : 1000), hidden2)
    return null;
  let t3;
  if ($3[1] !== countdownMs || $3[2] !== retryInMs)
    t3 = Math.round((retryInMs - countdownMs) / 1000), $3[1] = countdownMs, $3[2] = retryInMs, $3[3] = t3;
  else
    t3 = $3[3];
  let retryInSecondsLive = Math.max(0, t3), T0, T1, T2, t4, t5, t6, truncated;
  if ($3[4] !== error44 || $3[5] !== verbose) {
    let formatted = formatAPIError(error44);
    truncated = !verbose && formatted.length > MAX_API_ERROR_CHARS2, T2 = MessageResponse, T1 = ThemedBox_default, t6 = "column", T0 = ThemedText, t4 = "error", t5 = truncated ? formatted.slice(0, MAX_API_ERROR_CHARS2) + "\u2026" : formatted, $3[4] = error44, $3[5] = verbose, $3[6] = T0, $3[7] = T1, $3[8] = T2, $3[9] = t4, $3[10] = t5, $3[11] = t6, $3[12] = truncated;
  } else
    T0 = $3[6], T1 = $3[7], T2 = $3[8], t4 = $3[9], t5 = $3[10], t6 = $3[11], truncated = $3[12];
  let t7;
  if ($3[13] !== T0 || $3[14] !== t4 || $3[15] !== t5)
    t7 = /* @__PURE__ */ jsx_dev_runtime105.jsxDEV(T0, {
      color: t4,
      children: t5
    }, void 0, !1, void 0, this), $3[13] = T0, $3[14] = t4, $3[15] = t5, $3[16] = t7;
  else
    t7 = $3[16];
  let t8;
  if ($3[17] !== truncated)
    t8 = truncated && /* @__PURE__ */ jsx_dev_runtime105.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this), $3[17] = truncated, $3[18] = t8;
  else
    t8 = $3[18];
  let t9 = retryInSecondsLive === 1 ? "second" : "seconds", t10;
  if ($3[19] !== maxRetries || $3[20] !== retryAttempt || $3[21] !== retryInSecondsLive || $3[22] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime105.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Retrying in ",
        retryInSecondsLive,
        " ",
        t9,
        "\u2026 (attempt",
        " ",
        retryAttempt,
        "/",
        maxRetries,
        ")",
        process.env.API_TIMEOUT_MS ? ` \xB7 API_TIMEOUT_MS=${process.env.API_TIMEOUT_MS}ms, try increasing it` : ""
      ]
    }, void 0, !0, void 0, this), $3[19] = maxRetries, $3[20] = retryAttempt, $3[21] = retryInSecondsLive, $3[22] = t9, $3[23] = t10;
  else
    t10 = $3[23];
  let t11;
  if ($3[24] !== T1 || $3[25] !== t10 || $3[26] !== t6 || $3[27] !== t7 || $3[28] !== t8)
    t11 = /* @__PURE__ */ jsx_dev_runtime105.jsxDEV(T1, {
      flexDirection: t6,
      children: [
        t7,
        t8,
        t10
      ]
    }, void 0, !0, void 0, this), $3[24] = T1, $3[25] = t10, $3[26] = t6, $3[27] = t7, $3[28] = t8, $3[29] = t11;
  else
    t11 = $3[29];
  let t12;
  if ($3[30] !== T2 || $3[31] !== t11)
    t12 = /* @__PURE__ */ jsx_dev_runtime105.jsxDEV(T2, {
      children: t11
    }, void 0, !1, void 0, this), $3[30] = T2, $3[31] = t11, $3[32] = t12;
  else
    t12 = $3[32];
  return t12;
}
function _temp20(ms) {
  return ms + 1000;
}
var import_compiler_runtime94, import_react71, jsx_dev_runtime105, MAX_API_ERROR_CHARS2 = 1000;
var init_SystemAPIErrorMessage = __esm(() => {
  init_ink2();
  init_errorUtils();
  init_dist4();
  init_CtrlOToExpand();
  init_MessageResponse();
  import_compiler_runtime94 = __toESM(require_react_compiler_runtime_development(), 1), import_react71 = __toESM(require_react_development(), 1), jsx_dev_runtime105 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
