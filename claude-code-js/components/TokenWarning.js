// Original: src/components/TokenWarning.tsx
function TokenWarning(t0) {
  let $3 = import_compiler_runtime317.c(13), {
    tokenUsage,
    model
  } = t0, t1;
  if ($3[0] !== model || $3[1] !== tokenUsage)
    t1 = calculateTokenWarningState(tokenUsage, model), $3[0] = model, $3[1] = tokenUsage, $3[2] = t1;
  else
    t1 = $3[2];
  let {
    percentLeft,
    isAboveWarningThreshold,
    isAboveErrorThreshold
  } = t1, suppressWarning = useCompactWarningSuppression();
  if (!isAboveWarningThreshold || suppressWarning)
    return null;
  let t2;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t2 = isAutoCompactEnabled(), $3[3] = t2;
  else
    t2 = $3[3];
  let showAutoCompactWarning = t2, t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = getUpgradeMessage("warning"), $3[4] = t3;
  else
    t3 = $3[4];
  let upgradeMessage = t3, displayPercentLeft = percentLeft, reactiveOnlyMode = !1;
  if (reactiveOnlyMode || !1) {
    let effectiveWindow = getEffectiveContextWindowSize(model), t42;
    if ($3[5] !== effectiveWindow || $3[6] !== tokenUsage)
      t42 = Math.round((effectiveWindow - tokenUsage) / effectiveWindow * 100), $3[5] = effectiveWindow, $3[6] = tokenUsage, $3[7] = t42;
    else
      t42 = $3[7];
    displayPercentLeft = Math.max(0, t42);
  }
  let autocompactLabel = reactiveOnlyMode ? `${100 - displayPercentLeft}% context used` : `${displayPercentLeft}% until auto-compact`, t4;
  if ($3[9] !== autocompactLabel || $3[10] !== isAboveErrorThreshold || $3[11] !== percentLeft)
    t4 = /* @__PURE__ */ jsx_dev_runtime409.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      children: showAutoCompactWarning ? /* @__PURE__ */ jsx_dev_runtime409.jsxDEV(ThemedText, {
        dimColor: !0,
        wrap: "truncate",
        children: upgradeMessage ? `${autocompactLabel} \xB7 ${upgradeMessage}` : autocompactLabel
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime409.jsxDEV(ThemedText, {
        color: isAboveErrorThreshold ? "error" : "warning",
        wrap: "truncate",
        children: upgradeMessage ? `Context low (${percentLeft}% remaining) \xB7 ${upgradeMessage}` : `Context low (${percentLeft}% remaining) \xB7 Run /compact to compact & continue`
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = autocompactLabel, $3[10] = isAboveErrorThreshold, $3[11] = percentLeft, $3[12] = t4;
  else
    t4 = $3[12];
  return t4;
}
var import_compiler_runtime317, import_react231, jsx_dev_runtime409;
var init_TokenWarning = __esm(() => {
  init_ink2();
  init_autoCompact();
  init_compactWarningHook();
  init_contextWindowUpgradeCheck();
  import_compiler_runtime317 = __toESM(require_react_compiler_runtime_development(), 1), import_react231 = __toESM(require_react_development(), 1), jsx_dev_runtime409 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
