// Original: src/components/LogoV2/OverageCreditUpsell.tsx
function isEligibleForOverageCreditGrant() {
  let info = getCachedOverageCreditGrant();
  if (!info || !info.available || info.granted)
    return !1;
  return formatGrantAmount(info) !== null;
}
function shouldShowOverageCreditUpsell() {
  if (!isEligibleForOverageCreditGrant())
    return !1;
  let config10 = getGlobalConfig();
  if (config10.hasVisitedExtraUsage)
    return !1;
  if ((config10.overageCreditUpsellSeenCount ?? 0) >= MAX_IMPRESSIONS)
    return !1;
  return !0;
}
function maybeRefreshOverageCreditCache() {
  if (getCachedOverageCreditGrant() !== null)
    return;
  refreshOverageCreditGrantCache();
}
function useShowOverageCreditUpsell() {
  let [show] = import_react105.useState(_temp71);
  return show;
}
function _temp71() {
  return maybeRefreshOverageCreditCache(), shouldShowOverageCreditUpsell();
}
function incrementOverageCreditUpsellSeenCount() {
  let newCount = 0;
  saveGlobalConfig((prev) => {
    return newCount = (prev.overageCreditUpsellSeenCount ?? 0) + 1, {
      ...prev,
      overageCreditUpsellSeenCount: newCount
    };
  }), logEvent("tengu_overage_credit_upsell_shown", {
    seen_count: newCount
  });
}
function getUsageText(amount) {
  return `${amount} in extra usage for third-party apps \xB7 /extra-usage`;
}
function getFeedTitle(amount) {
  return `${amount} in extra usage`;
}
function OverageCreditUpsell(t0) {
  let $3 = import_compiler_runtime143.c(8), {
    maxWidth,
    twoLine
  } = t0, t1, t2;
  if ($3[0] !== maxWidth || $3[1] !== twoLine) {
    t2 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let info = getCachedOverageCreditGrant();
      if (!info) {
        t2 = null;
        break bb0;
      }
      let amount = formatGrantAmount(info);
      if (!amount) {
        t2 = null;
        break bb0;
      }
      if (twoLine) {
        let title = getFeedTitle(amount), t3;
        if ($3[4] !== maxWidth)
          t3 = maxWidth ? truncate(FEED_SUBTITLE, maxWidth) : FEED_SUBTITLE, $3[4] = maxWidth, $3[5] = t3;
        else
          t3 = $3[5];
        let t4;
        if ($3[6] !== t3)
          t4 = /* @__PURE__ */ jsx_dev_runtime180.jsxDEV(ThemedText, {
            dimColor: !0,
            children: t3
          }, void 0, !1, void 0, this), $3[6] = t3, $3[7] = t4;
        else
          t4 = $3[7];
        t2 = /* @__PURE__ */ jsx_dev_runtime180.jsxDEV(jsx_dev_runtime180.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime180.jsxDEV(ThemedText, {
              color: "claude",
              children: maxWidth ? truncate(title, maxWidth) : title
            }, void 0, !1, void 0, this),
            t4
          ]
        }, void 0, !0, void 0, this);
        break bb0;
      }
      let text2 = getUsageText(amount), display = maxWidth ? truncate(text2, maxWidth) : text2, highlightLen = Math.min(getFeedTitle(amount).length, display.length);
      t1 = /* @__PURE__ */ jsx_dev_runtime180.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          /* @__PURE__ */ jsx_dev_runtime180.jsxDEV(ThemedText, {
            color: "claude",
            children: display.slice(0, highlightLen)
          }, void 0, !1, void 0, this),
          display.slice(highlightLen)
        ]
      }, void 0, !0, void 0, this);
    }
    $3[0] = maxWidth, $3[1] = twoLine, $3[2] = t1, $3[3] = t2;
  } else
    t1 = $3[2], t2 = $3[3];
  if (t2 !== Symbol.for("react.early_return_sentinel"))
    return t2;
  return t1;
}
function createOverageCreditFeed() {
  let info = getCachedOverageCreditGrant(), amount = info ? formatGrantAmount(info) : null, title = amount ? getFeedTitle(amount) : "extra usage credit";
  return {
    title,
    lines: [],
    customContent: {
      content: /* @__PURE__ */ jsx_dev_runtime180.jsxDEV(ThemedText, {
        dimColor: !0,
        children: FEED_SUBTITLE
      }, void 0, !1, void 0, this),
      width: Math.max(title.length, FEED_SUBTITLE.length)
    }
  };
}
var import_compiler_runtime143, import_react105, jsx_dev_runtime180, MAX_IMPRESSIONS = 3, FEED_SUBTITLE = "On us. Works on third-party apps \xB7 /extra-usage";
var init_OverageCreditUpsell = __esm(() => {
  init_ink2();
  init_overageCreditGrant();
  init_config4();
  init_format();
  import_compiler_runtime143 = __toESM(require_react_compiler_runtime_development(), 1), import_react105 = __toESM(require_react_development(), 1), jsx_dev_runtime180 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
