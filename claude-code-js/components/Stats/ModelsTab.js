// function: ModelsTab
function ModelsTab(t0) {
  let $3 = import_compiler_runtime278.c(15), {
    stats,
    dateRange,
    isLoading
  } = t0, {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), [scrollOffset, setScrollOffset] = import_react192.useState(0), {
    columns: terminalWidth
  } = useTerminalSize(), modelEntries = Object.entries(stats.modelUsage).sort(_temp719), t1 = !headerFocused, t2;
  if ($3[0] !== t1)
    t2 = {
      isActive: t1
    }, $3[0] = t1, $3[1] = t2;
  else
    t2 = $3[1];
  if (use_input_default((_input, key3) => {
    if (key3.downArrow && scrollOffset < modelEntries.length - 4)
      setScrollOffset((prev) => Math.min(prev + 2, modelEntries.length - 4));
    if (key3.upArrow)
      if (scrollOffset > 0)
        setScrollOffset(_temp816);
      else
        focusHeader();
  }, t2), modelEntries.length === 0) {
    let t32;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t32 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
          color: "subtle",
          children: "No model usage data available"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[2] = t32;
    else
      t32 = $3[2];
    return t32;
  }
  let totalTokens = modelEntries.reduce(_temp914, 0), chartOutput = generateTokenChart(stats.dailyModelTokens, modelEntries.map(_temp06), terminalWidth), visibleModels = modelEntries.slice(scrollOffset, scrollOffset + 4), midpoint = Math.ceil(visibleModels.length / 2), leftModels = visibleModels.slice(0, midpoint), rightModels = visibleModels.slice(midpoint), canScrollUp = scrollOffset > 0, canScrollDown = scrollOffset < modelEntries.length - 4, showScrollHint = modelEntries.length > 4, t3;
  if ($3[3] !== dateRange || $3[4] !== isLoading)
    t3 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(DateRangeSelector, {
      dateRange,
      isLoading
    }, void 0, !1, void 0, this), $3[3] = dateRange, $3[4] = isLoading, $3[5] = t3;
  else
    t3 = $3[5];
  let T0 = ThemedBox_default, t5 = "column", t6 = 36, t8 = rightModels.map((t7) => {
    let [model_1, usage_1] = t7;
    return /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ModelEntry, {
      model: model_1,
      usage: usage_1,
      totalTokens
    }, model_1, !1, void 0, this);
  }), t9;
  if ($3[6] !== T0 || $3[7] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(T0, {
      flexDirection: t5,
      width: t6,
      children: t8
    }, void 0, !1, void 0, this), $3[6] = T0, $3[7] = t8, $3[8] = t9;
  else
    t9 = $3[8];
  let t10;
  if ($3[9] !== canScrollDown || $3[10] !== canScrollUp || $3[11] !== modelEntries || $3[12] !== scrollOffset || $3[13] !== showScrollHint)
    t10 = showScrollHint && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
        color: "subtle",
        children: [
          canScrollUp ? figures_default.arrowUp : " ",
          " ",
          canScrollDown ? figures_default.arrowDown : " ",
          " ",
          scrollOffset + 1,
          "-",
          Math.min(scrollOffset + 4, modelEntries.length),
          " of",
          " ",
          modelEntries.length,
          " models (\u2191\u2193 to scroll)"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[9] = canScrollDown, $3[10] = canScrollUp, $3[11] = modelEntries, $3[12] = scrollOffset, $3[13] = showScrollHint, $3[14] = t10;
  else
    t10 = $3[14];
  return /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    children: [
      chartOutput && /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
            bold: !0,
            children: "Tokens per Day"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(Ansi, {
            children: chartOutput.chart
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedText, {
            color: "subtle",
            children: chartOutput.xAxisLabels
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            children: chartOutput.legend.map(_temp125)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      t3,
      /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 4,
        children: [
          /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            width: 36,
            children: leftModels.map((t4) => {
              let [model_0, usage_0] = t4;
              return /* @__PURE__ */ jsx_dev_runtime359.jsxDEV(ModelEntry, {
                model: model_0,
                usage: usage_0,
                totalTokens
              }, model_0, !1, void 0, this);
            })
          }, void 0, !1, void 0, this),
          t9
        ]
      }, void 0, !0, void 0, this),
      t10
    ]
  }, void 0, !0, void 0, this);
}
