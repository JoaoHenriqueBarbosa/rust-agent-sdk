// function: TurnDurationMessage
function TurnDurationMessage(t0) {
  let $3 = import_compiler_runtime95.c(17), {
    message,
    addMargin
  } = t0, bg = useSelectedMessageBg(), [verb] = import_react72.useState(_temp44), store = useAppStateStore(), t1;
  if ($3[0] !== store)
    t1 = () => {
      let tasks = store.getState().tasks, running = Object.values(tasks ?? {}).filter(isBackgroundTask);
      return running.length > 0 ? getPillLabel(running) : null;
    }, $3[0] = store, $3[1] = t1;
  else
    t1 = $3[1];
  let [backgroundTaskSummary] = import_react72.useState(t1), t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = getGlobalConfig().showTurnDuration ?? !0, $3[2] = t2;
  else
    t2 = $3[2];
  let showTurnDuration = t2, t3;
  if ($3[3] !== message.durationMs)
    t3 = formatDuration(message.durationMs), $3[3] = message.durationMs, $3[4] = t3;
  else
    t3 = $3[4];
  let duration3 = t3, hasBudget = message.budgetLimit !== void 0, t4;
  bb0: {
    if (!hasBudget) {
      t4 = "";
      break bb0;
    }
    let { budgetTokens: tokens, budgetLimit: limit } = message, t52;
    if ($3[5] !== limit || $3[6] !== tokens)
      t52 = tokens >= limit ? `${formatNumber(tokens)} used (${formatNumber(limit)} min ${figures_default.tick})` : `${formatNumber(tokens)} / ${formatNumber(limit)} (${Math.round(tokens / limit * 100)}%)`, $3[5] = limit, $3[6] = tokens, $3[7] = t52;
    else
      t52 = $3[7];
    let usage = t52, nudges = message.budgetNudges > 0 ? ` \xB7 ${message.budgetNudges} ${message.budgetNudges === 1 ? "nudge" : "nudges"}` : "";
    t4 = `${showTurnDuration ? " \xB7 " : ""}${usage}${nudges}`;
  }
  let budgetSuffix = t4;
  if (!showTurnDuration && !hasBudget)
    return null;
  let t5 = addMargin ? 1 : 0, t6;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      minWidth: 2,
      children: /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
        dimColor: !0,
        children: TEARDROP_ASTERISK
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = t6;
  else
    t6 = $3[8];
  let t7 = showTurnDuration && `${verb} for ${duration3}`, t8 = backgroundTaskSummary && ` \xB7 ${backgroundTaskSummary} still running`, t9;
  if ($3[9] !== budgetSuffix || $3[10] !== t7 || $3[11] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        t7,
        budgetSuffix,
        t8
      ]
    }, void 0, !0, void 0, this), $3[9] = budgetSuffix, $3[10] = t7, $3[11] = t8, $3[12] = t9;
  else
    t9 = $3[12];
  let t10;
  if ($3[13] !== bg || $3[14] !== t5 || $3[15] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: t5,
      backgroundColor: bg,
      width: "100%",
      children: [
        t6,
        t9
      ]
    }, void 0, !0, void 0, this), $3[13] = bg, $3[14] = t5, $3[15] = t9, $3[16] = t10;
  else
    t10 = $3[16];
  return t10;
}
