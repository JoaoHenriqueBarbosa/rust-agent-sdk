// Original: src/components/LogoV2/CondensedLogo.tsx
function CondensedLogo() {
  let $3 = import_compiler_runtime201.c(29), {
    columns
  } = useTerminalSize(), agent = useAppState(_temp119), effortValue = useAppState(_temp243), model = useMainLoopModel(), modelDisplayName = renderModelSetting(model), {
    version: version5,
    cwd: cwd2,
    billingType,
    agentName: agentNameFromSettings
  } = getLogoDisplayData(), agentName = agent ?? agentNameFromSettings, showGuestPassesUpsell = useShowGuestPassesUpsell(), showOverageCreditUpsell = useShowOverageCreditUpsell(), t0, t1;
  if ($3[0] !== showGuestPassesUpsell)
    t0 = () => {
      if (showGuestPassesUpsell)
        incrementGuestPassesSeenCount();
    }, t1 = [showGuestPassesUpsell], $3[0] = showGuestPassesUpsell, $3[1] = t0, $3[2] = t1;
  else
    t0 = $3[1], t1 = $3[2];
  import_react144.useEffect(t0, t1);
  let t2, t3;
  if ($3[3] !== showGuestPassesUpsell || $3[4] !== showOverageCreditUpsell)
    t2 = () => {
      if (showOverageCreditUpsell && !showGuestPassesUpsell)
        incrementOverageCreditUpsellSeenCount();
    }, t3 = [showOverageCreditUpsell, showGuestPassesUpsell], $3[3] = showGuestPassesUpsell, $3[4] = showOverageCreditUpsell, $3[5] = t2, $3[6] = t3;
  else
    t2 = $3[5], t3 = $3[6];
  import_react144.useEffect(t2, t3);
  let textWidth = Math.max(columns - 15, 20), truncatedVersion = truncate(version5, Math.max(textWidth - 13, 6)), effortSuffix = getEffortSuffix(model, effortValue), {
    shouldSplit,
    truncatedModel,
    truncatedBilling
  } = formatModelAndBilling(modelDisplayName + effortSuffix, billingType, textWidth), cwdAvailableWidth = agentName ? textWidth - 1 - stringWidth(agentName) - 3 : textWidth, truncatedCwd = truncatePath(cwd2, Math.max(cwdAvailableWidth, 10)), t4;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t4 = isFullscreenEnvEnabled() ? /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(AnimatedClawd, {}, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(Clawd, {}, void 0, !1, void 0, this), $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
      bold: !0,
      children: "Claude Code"
    }, void 0, !1, void 0, this), $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== truncatedVersion)
    t6 = /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
      children: [
        t5,
        " ",
        /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "v",
            truncatedVersion,
            " (dev)"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[9] = truncatedVersion, $3[10] = t6;
  else
    t6 = $3[10];
  let t7;
  if ($3[11] !== shouldSplit || $3[12] !== truncatedBilling || $3[13] !== truncatedModel)
    t7 = shouldSplit ? /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(jsx_dev_runtime253.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
          dimColor: !0,
          children: truncatedModel
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
          dimColor: !0,
          children: truncatedBilling
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        truncatedModel,
        " \xB7 ",
        truncatedBilling
      ]
    }, void 0, !0, void 0, this), $3[11] = shouldSplit, $3[12] = truncatedBilling, $3[13] = truncatedModel, $3[14] = t7;
  else
    t7 = $3[14];
  let t8 = agentName ? `@${agentName} \xB7 ${truncatedCwd}` : truncatedCwd, t9;
  if ($3[15] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t8
    }, void 0, !1, void 0, this), $3[15] = t8, $3[16] = t9;
  else
    t9 = $3[16];
  let t10;
  if ($3[17] !== showGuestPassesUpsell)
    t10 = showGuestPassesUpsell && /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(GuestPassesUpsell, {}, void 0, !1, void 0, this), $3[17] = showGuestPassesUpsell, $3[18] = t10;
  else
    t10 = $3[18];
  let t11;
  if ($3[19] !== showGuestPassesUpsell || $3[20] !== showOverageCreditUpsell || $3[21] !== textWidth)
    t11 = !showGuestPassesUpsell && showOverageCreditUpsell && /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(OverageCreditUpsell, {
      maxWidth: textWidth,
      twoLine: !0
    }, void 0, !1, void 0, this), $3[19] = showGuestPassesUpsell, $3[20] = showOverageCreditUpsell, $3[21] = textWidth, $3[22] = t11;
  else
    t11 = $3[22];
  let t12;
  if ($3[23] !== t10 || $3[24] !== t11 || $3[25] !== t6 || $3[26] !== t7 || $3[27] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(OffscreenFreeze, {
      children: /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        children: [
          t4,
          /* @__PURE__ */ jsx_dev_runtime253.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              t6,
              t7,
              t9,
              t10,
              t11
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[23] = t10, $3[24] = t11, $3[25] = t6, $3[26] = t7, $3[27] = t9, $3[28] = t12;
  else
    t12 = $3[28];
  return t12;
}
function _temp243(s_0) {
  return s_0.effortValue;
}
function _temp119(s2) {
  return s2.agent;
}
var import_compiler_runtime201, import_react144, jsx_dev_runtime253;
var init_CondensedLogo = __esm(() => {
  init_useMainLoopModel();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_AppState();
  init_effort();
  init_format();
  init_fullscreen();
  init_logoV2Utils();
  init_model();
  init_OffscreenFreeze();
  init_AnimatedClawd();
  init_Clawd();
  init_GuestPassesUpsell();
  init_OverageCreditUpsell();
  import_compiler_runtime201 = __toESM(require_react_compiler_runtime_development(), 1), import_react144 = __toESM(require_react_development(), 1), jsx_dev_runtime253 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
