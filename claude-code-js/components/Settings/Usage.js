// Original: src/components/Settings/Usage.tsx
function LimitBar(t0) {
  let $3 = import_compiler_runtime144.c(34), {
    title,
    limit,
    maxWidth,
    showTimeInReset: t1,
    extraSubtext
  } = t0, showTimeInReset = t1 === void 0 ? !0 : t1, {
    utilization,
    resets_at
  } = limit;
  if (utilization === null)
    return null;
  let usedText = `${Math.floor(utilization)}% used`, subtext;
  if (resets_at) {
    let t2;
    if ($3[0] !== resets_at || $3[1] !== showTimeInReset)
      t2 = formatResetText(resets_at, !0, showTimeInReset), $3[0] = resets_at, $3[1] = showTimeInReset, $3[2] = t2;
    else
      t2 = $3[2];
    subtext = `Resets ${t2}`;
  }
  if (extraSubtext)
    if (subtext)
      subtext = `${extraSubtext} \xB7 ${subtext}`;
    else
      subtext = extraSubtext;
  if (maxWidth >= 62) {
    let t2;
    if ($3[3] !== title)
      t2 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        bold: !0,
        children: title
      }, void 0, !1, void 0, this), $3[3] = title, $3[4] = t2;
    else
      t2 = $3[4];
    let t3 = utilization / 100, t4;
    if ($3[5] !== t3)
      t4 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ProgressBar, {
        ratio: t3,
        width: 50,
        fillColor: "rate_limit_fill",
        emptyColor: "rate_limit_empty"
      }, void 0, !1, void 0, this), $3[5] = t3, $3[6] = t4;
    else
      t4 = $3[6];
    let t5;
    if ($3[7] !== usedText)
      t5 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        children: usedText
      }, void 0, !1, void 0, this), $3[7] = usedText, $3[8] = t5;
    else
      t5 = $3[8];
    let t6;
    if ($3[9] !== t4 || $3[10] !== t5)
      t6 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 1,
        children: [
          t4,
          t5
        ]
      }, void 0, !0, void 0, this), $3[9] = t4, $3[10] = t5, $3[11] = t6;
    else
      t6 = $3[11];
    let t7;
    if ($3[12] !== subtext)
      t7 = subtext && /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        dimColor: !0,
        children: subtext
      }, void 0, !1, void 0, this), $3[12] = subtext, $3[13] = t7;
    else
      t7 = $3[13];
    let t8;
    if ($3[14] !== t2 || $3[15] !== t6 || $3[16] !== t7)
      t8 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t2,
          t6,
          t7
        ]
      }, void 0, !0, void 0, this), $3[14] = t2, $3[15] = t6, $3[16] = t7, $3[17] = t8;
    else
      t8 = $3[17];
    return t8;
  } else {
    let t2;
    if ($3[18] !== title)
      t2 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        bold: !0,
        children: title
      }, void 0, !1, void 0, this), $3[18] = title, $3[19] = t2;
    else
      t2 = $3[19];
    let t3;
    if ($3[20] !== subtext)
      t3 = subtext && /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(jsx_dev_runtime181.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "\xB7 ",
              subtext
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[20] = subtext, $3[21] = t3;
    else
      t3 = $3[21];
    let t4;
    if ($3[22] !== t2 || $3[23] !== t3)
      t4 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        children: [
          t2,
          t3
        ]
      }, void 0, !0, void 0, this), $3[22] = t2, $3[23] = t3, $3[24] = t4;
    else
      t4 = $3[24];
    let t5 = utilization / 100, t6;
    if ($3[25] !== maxWidth || $3[26] !== t5)
      t6 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ProgressBar, {
        ratio: t5,
        width: maxWidth,
        fillColor: "rate_limit_fill",
        emptyColor: "rate_limit_empty"
      }, void 0, !1, void 0, this), $3[25] = maxWidth, $3[26] = t5, $3[27] = t6;
    else
      t6 = $3[27];
    let t7;
    if ($3[28] !== usedText)
      t7 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        children: usedText
      }, void 0, !1, void 0, this), $3[28] = usedText, $3[29] = t7;
    else
      t7 = $3[29];
    let t8;
    if ($3[30] !== t4 || $3[31] !== t6 || $3[32] !== t7)
      t8 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t4,
          t6,
          t7
        ]
      }, void 0, !0, void 0, this), $3[30] = t4, $3[31] = t6, $3[32] = t7, $3[33] = t8;
    else
      t8 = $3[33];
    return t8;
  }
}
function Usage() {
  let [utilization, setUtilization] = import_react106.useState(null), [error44, setError] = import_react106.useState(null), [isLoading, setIsLoading] = import_react106.useState(!0), {
    columns
  } = useTerminalSize(), availableWidth = columns - 2, maxWidth = Math.min(availableWidth, 80), loadUtilization = React54.useCallback(async () => {
    setIsLoading(!0), setError(null);
    try {
      let data = await fetchUtilization();
      setUtilization(data);
    } catch (err2) {
      logError2(err2);
      let axiosError = err2, responseBody = axiosError.response?.data ? jsonStringify(axiosError.response.data) : void 0;
      setError(responseBody ? `Failed to load usage data: ${responseBody}` : "Failed to load usage data");
    } finally {
      setIsLoading(!1);
    }
  }, []);
  if (import_react106.useEffect(() => {
    loadUtilization();
  }, [loadUtilization]), useKeybinding("settings:retry", () => {
    loadUtilization();
  }, {
    context: "Settings",
    isActive: !!error44 && !isLoading
  }), error44)
    return /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
          color: "error",
          children: [
            "Error: ",
            error44
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ConfigurableShortcutHint, {
                action: "settings:retry",
                context: "Settings",
                fallback: "r",
                description: "retry"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Settings",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (!utilization)
    return /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Loading usage data\u2026"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ConfigurableShortcutHint, {
            action: "confirm:no",
            context: "Settings",
            fallback: "Esc",
            description: "cancel"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let subscriptionType = getSubscriptionType(), showSonnetBar = subscriptionType === "max" || subscriptionType === "team" || subscriptionType === null, limits = [{
    title: "Current session",
    limit: utilization.five_hour
  }, {
    title: "Current week (all models)",
    limit: utilization.seven_day
  }, ...showSonnetBar ? [{
    title: "Current week (Sonnet only)",
    limit: utilization.seven_day_sonnet
  }] : []];
  return /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    gap: 1,
    width: "100%",
    children: [
      limits.some(({
        limit
      }) => limit) || /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "/usage is only available for subscription plans."
      }, void 0, !1, void 0, this),
      limits.map(({
        title,
        limit: limit_0
      }) => limit_0 && /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(LimitBar, {
        title,
        limit: limit_0,
        maxWidth
      }, title, !1, void 0, this)),
      utilization.extra_usage && /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ExtraUsageSection, {
        extraUsage: utilization.extra_usage,
        maxWidth
      }, void 0, !1, void 0, this),
      isEligibleForOverageCreditGrant() && /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(OverageCreditUpsell, {
        maxWidth
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
        dimColor: !0,
        children: /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Settings",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function ExtraUsageSection(t0) {
  let $3 = import_compiler_runtime144.c(20), {
    extraUsage: extraUsage2,
    maxWidth
  } = t0, subscriptionType = getSubscriptionType();
  if (!(subscriptionType === "pro" || subscriptionType === "max"))
    return !1;
  if (!extraUsage2.is_enabled) {
    if (extraUsage.isEnabled()) {
      let t12;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t12 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
              bold: !0,
              children: EXTRA_USAGE_SECTION_TITLE
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Extra usage not enabled \xB7 /extra-usage to enable"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[0] = t12;
      else
        t12 = $3[0];
      return t12;
    }
    return null;
  }
  if (extraUsage2.monthly_limit === null) {
    let t12;
    if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
            bold: !0,
            children: EXTRA_USAGE_SECTION_TITLE
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Unlimited"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  if (typeof extraUsage2.used_credits !== "number" || typeof extraUsage2.utilization !== "number")
    return null;
  let t1 = extraUsage2.used_credits / 100, t2;
  if ($3[2] !== t1)
    t2 = formatCost(t1, 2), $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  let formattedUsedCredits = t2, t3 = extraUsage2.monthly_limit / 100, t4;
  if ($3[4] !== t3)
    t4 = formatCost(t3, 2), $3[4] = t3, $3[5] = t4;
  else
    t4 = $3[5];
  let formattedMonthlyLimit = t4, T0, t5, t6, t7;
  if ($3[6] !== extraUsage2.utilization) {
    let now2 = /* @__PURE__ */ new Date, oneMonthReset = new Date(now2.getFullYear(), now2.getMonth() + 1, 1);
    T0 = LimitBar, t7 = EXTRA_USAGE_SECTION_TITLE, t5 = extraUsage2.utilization, t6 = oneMonthReset.toISOString(), $3[6] = extraUsage2.utilization, $3[7] = T0, $3[8] = t5, $3[9] = t6, $3[10] = t7;
  } else
    T0 = $3[7], t5 = $3[8], t6 = $3[9], t7 = $3[10];
  let t8;
  if ($3[11] !== t5 || $3[12] !== t6)
    t8 = {
      utilization: t5,
      resets_at: t6
    }, $3[11] = t5, $3[12] = t6, $3[13] = t8;
  else
    t8 = $3[13];
  let t9 = `${formattedUsedCredits} / ${formattedMonthlyLimit} spent`, t10;
  if ($3[14] !== T0 || $3[15] !== maxWidth || $3[16] !== t7 || $3[17] !== t8 || $3[18] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime181.jsxDEV(T0, {
      title: t7,
      limit: t8,
      showTimeInReset: !1,
      extraSubtext: t9,
      maxWidth
    }, void 0, !1, void 0, this), $3[14] = T0, $3[15] = maxWidth, $3[16] = t7, $3[17] = t8, $3[18] = t9, $3[19] = t10;
  else
    t10 = $3[19];
  return t10;
}
var import_compiler_runtime144, React54, import_react106, jsx_dev_runtime181, EXTRA_USAGE_SECTION_TITLE = "Extra usage";
var init_Usage = __esm(() => {
  init_extra_usage2();
  init_cost_tracker();
  init_auth14();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  init_usage();
  init_format();
  init_log3();
  init_slowOperations();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_ProgressBar();
  init_OverageCreditUpsell();
  import_compiler_runtime144 = __toESM(require_react_compiler_runtime_development(), 1), React54 = __toESM(require_react_development(), 1), import_react106 = __toESM(require_react_development(), 1), jsx_dev_runtime181 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
