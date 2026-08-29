// function: StatsContent
function StatsContent(t0) {
  let $3 = import_compiler_runtime278.c(34), {
    allTimePromise,
    onClose
  } = t0, allTimeResult = import_react192.use(allTimePromise), [dateRange, setDateRange] = import_react192.useState("all"), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {}, $3[0] = t1;
  else
    t1 = $3[0];
  let [statsCache, setStatsCache] = import_react192.useState(t1), [isLoadingFiltered, setIsLoadingFiltered] = import_react192.useState(!1), [activeTab, setActiveTab] = import_react192.useState("Overview"), [copyStatus, setCopyStatus] = import_react192.useState(null), t2, t3;
  if ($3[1] !== dateRange || $3[2] !== statsCache)
    t2 = () => {
      if (dateRange === "all")
        return;
      if (statsCache[dateRange])
        return;
      let cancelled = !1;
      return setIsLoadingFiltered(!0), aggregateClaudeCodeStatsForRange(dateRange).then((data) => {
        if (!cancelled)
          setStatsCache((prev) => ({
            ...prev,
            [dateRange]: data
          })), setIsLoadingFiltered(!1);
      }).catch(() => {
        if (!cancelled)
          setIsLoadingFiltered(!1);
      }), () => {
        cancelled = !0;
      };
    }, t3 = [dateRange, statsCache], $3[1] = dateRange, $3[2] = statsCache, $3[3] = t2, $3[4] = t3;
  else
    t2 = $3[3], t3 = $3[4];
  import_react192.useEffect(t2, t3);
  let displayStats = dateRange === "all" ? allTimeResult.type === "success" ? allTimeResult.data : null : statsCache[dateRange] ?? (allTimeResult.type === "success" ? allTimeResult.data : null), allTimeStats = allTimeResult.type === "success" ? allTimeResult.data : null, t4;
  if ($3[5] !== onClose)
    t4 = () => {
      onClose("Stats dialog dismissed", {
        display: "system"
      });
    }, $3[5] = onClose, $3[6] = t4;
  else
    t4 = $3[6];
  let handleClose = t4, t5;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      context: "Confirmation"
    }, $3[7] = t5;
  else
    t5 = $3[7];
  useKeybinding("confirm:no", handleClose, t5);
  let t6;
  if ($3[8] !== activeTab || $3[9] !== dateRange || $3[10] !== displayStats || $3[11] !== onClose)
    t6 = (input, key3) => {
      if (key3.ctrl && (input === "c" || input === "d"))
        onClose("Stats dialog dismissed", {
          display: "system"
        });
      if (key3.tab)
        setActiveTab(_temp170);
      if (input === "r" && !key3.ctrl && !key3.meta)
        setDateRange(getNextDateRange(dateRange));
      if (key3.ctrl && input === "s" && displayStats)
        handleScreenshot(displayStats, activeTab, setCopyStatus);
    }, $3[8] = activeTab, $3[9] = dateRange, $3[10] = displayStats, $3[11] = onClose, $3[12] = t6;
  else
    t6 = $3[12];
  if (use_input_default(t6), allTimeResult.type === "error") {
    let t72;
    if ($3[13] !== allTimeResult.message)
      t72 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          color: "error",
          children: [
            "Failed to load stats: ",
            allTimeResult.message
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this), $3[13] = allTimeResult.message, $3[14] = t72;
    else
      t72 = $3[14];
    return t72;
  }
  if (allTimeResult.type === "empty") {
    let t72;
    if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
      t72 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          color: "warning",
          children: "No stats available yet. Start using Claude Code!"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[15] = t72;
    else
      t72 = $3[15];
    return t72;
  }
  if (!displayStats || !allTimeStats) {
    let t72;
    if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
      t72 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
            children: " Loading stats\u2026"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[16] = t72;
    else
      t72 = $3[16];
    return t72;
  }
  let t7;
  if ($3[17] !== allTimeStats || $3[18] !== dateRange || $3[19] !== displayStats || $3[20] !== isLoadingFiltered)
    t7 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Tab, {
      title: "Overview",
      children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(OverviewTab, {
        stats: displayStats,
        allTimeStats,
        dateRange,
        isLoading: isLoadingFiltered
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[17] = allTimeStats, $3[18] = dateRange, $3[19] = displayStats, $3[20] = isLoadingFiltered, $3[21] = t7;
  else
    t7 = $3[21];
  let t8;
  if ($3[22] !== dateRange || $3[23] !== displayStats || $3[24] !== isLoadingFiltered)
    t8 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Tab, {
      title: "Models",
      children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ModelsTab, {
        stats: displayStats,
        dateRange,
        isLoading: isLoadingFiltered
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[22] = dateRange, $3[23] = displayStats, $3[24] = isLoadingFiltered, $3[25] = t8;
  else
    t8 = $3[25];
  let t9;
  if ($3[26] !== t7 || $3[27] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 1,
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Tabs, {
        title: "",
        color: "claude",
        defaultTab: "Overview",
        children: [
          t7,
          t8
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[26] = t7, $3[27] = t8, $3[28] = t9;
  else
    t9 = $3[28];
  let t10 = copyStatus ? ` \xB7 ${copyStatus}` : "", t11;
  if ($3[29] !== t10)
    t11 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      paddingLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Esc to cancel \xB7 r to cycle dates \xB7 ctrl+s to copy",
          t10
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[29] = t10, $3[30] = t11;
  else
    t11 = $3[30];
  let t12;
  if ($3[31] !== t11 || $3[32] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Pane, {
      color: "claude",
      children: [
        t9,
        t11
      ]
    }, void 0, !0, void 0, this), $3[31] = t11, $3[32] = t9, $3[33] = t12;
  else
    t12 = $3[33];
  return t12;
}
