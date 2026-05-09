// Original: src/components/EffortCallout.tsx
function EffortCallout(t0) {
  let $3 = import_compiler_runtime341.c(18), {
    model,
    onDone
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getOpusDefaultEffortConfig(), $3[0] = t1;
  else
    t1 = $3[0];
  let defaultEffortConfig = t1, onDoneRef = import_react281.useRef(onDone), t2;
  if ($3[1] !== onDone)
    t2 = () => {
      onDoneRef.current = onDone;
    }, $3[1] = onDone, $3[2] = t2;
  else
    t2 = $3[2];
  import_react281.useEffect(t2);
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = () => {
      onDoneRef.current("dismiss");
    }, $3[3] = t3;
  else
    t3 = $3[3];
  let handleCancel = t3, t4;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t4 = [], $3[4] = t4;
  else
    t4 = $3[4];
  import_react281.useEffect(_temp203, t4);
  let t5, t6;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = () => {
      let timeoutId = setTimeout(handleCancel, AUTO_DISMISS_MS);
      return () => clearTimeout(timeoutId);
    }, t6 = [handleCancel], $3[5] = t5, $3[6] = t6;
  else
    t5 = $3[5], t6 = $3[6];
  import_react281.useEffect(t5, t6);
  let t7;
  if ($3[7] !== model) {
    let defaultEffort = getDefaultEffortForModel(model);
    t7 = defaultEffort ? convertEffortValueToLevel(defaultEffort) : "high", $3[7] = model, $3[8] = t7;
  } else
    t7 = $3[8];
  let defaultLevel = t7, t8;
  if ($3[9] !== defaultLevel)
    t8 = (value) => {
      updateSettingsForSource("userSettings", {
        effortLevel: toPersistableEffort(value === defaultLevel ? void 0 : value)
      }), onDoneRef.current(value);
    }, $3[9] = defaultLevel, $3[10] = t8;
  else
    t8 = $3[10];
  let handleSelect = t8, t9;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t9 = [{
      label: /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortOptionLabel, {
        level: "medium",
        text: "Medium (recommended)"
      }, void 0, !1, void 0, this),
      value: "medium"
    }, {
      label: /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortOptionLabel, {
        level: "high",
        text: "High"
      }, void 0, !1, void 0, this),
      value: "high"
    }, {
      label: /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortOptionLabel, {
        level: "low",
        text: "Low"
      }, void 0, !1, void 0, this),
      value: "low"
    }], $3[11] = t9;
  else
    t9 = $3[11];
  let options2 = t9, t10;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(ThemedText, {
        children: defaultEffortConfig.dialogDescription
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[12] = t10;
  else
    t10 = $3[12];
  let t11;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortIndicatorSymbol, {
      level: "low"
    }, void 0, !1, void 0, this), $3[13] = t11;
  else
    t11 = $3[13];
  let t12;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortIndicatorSymbol, {
      level: "medium"
    }, void 0, !1, void 0, this), $3[14] = t12;
  else
    t12 = $3[14];
  let t13;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          t11,
          " low ",
          "\xB7",
          " ",
          t12,
          " medium ",
          "\xB7",
          " ",
          /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortIndicatorSymbol, {
            level: "high"
          }, void 0, !1, void 0, this),
          " high"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[15] = t13;
  else
    t13 = $3[15];
  let t14;
  if ($3[16] !== handleSelect)
    t14 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(PermissionDialog, {
      title: defaultEffortConfig.dialogTitle,
      children: /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1,
        children: [
          t10,
          t13,
          /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(Select, {
            options: options2,
            onChange: handleSelect,
            onCancel: handleCancel
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[16] = handleSelect, $3[17] = t14;
  else
    t14 = $3[17];
  return t14;
}
function _temp203() {
  markV2Dismissed();
}
function EffortIndicatorSymbol(t0) {
  let $3 = import_compiler_runtime341.c(4), {
    level
  } = t0, t1;
  if ($3[0] !== level)
    t1 = effortLevelToSymbol(level), $3[0] = level, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(ThemedText, {
      color: "suggestion",
      children: t1
    }, void 0, !1, void 0, this), $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  return t2;
}
function EffortOptionLabel(t0) {
  let $3 = import_compiler_runtime341.c(5), {
    level,
    text: text2
  } = t0, t1;
  if ($3[0] !== level)
    t1 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(EffortIndicatorSymbol, {
      level
    }, void 0, !1, void 0, this), $3[0] = level, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== t1 || $3[3] !== text2)
    t2 = /* @__PURE__ */ jsx_dev_runtime439.jsxDEV(jsx_dev_runtime439.Fragment, {
      children: [
        t1,
        " ",
        text2
      ]
    }, void 0, !0, void 0, this), $3[2] = t1, $3[3] = text2, $3[4] = t2;
  else
    t2 = $3[4];
  return t2;
}
function shouldShowEffortCallout(model) {
  if (!parseUserSpecifiedModel(model).toLowerCase().includes("opus-4-6"))
    return !1;
  let config11 = getGlobalConfig();
  if (config11.effortCalloutV2Dismissed)
    return !1;
  if (config11.numStartups <= 1)
    return markV2Dismissed(), !1;
  if (isProSubscriber()) {
    if (config11.effortCalloutDismissed)
      return markV2Dismissed(), !1;
    return getOpusDefaultEffortConfig().enabled;
  }
  if (isMaxSubscriber() || isTeamSubscriber())
    return getOpusDefaultEffortConfig().enabled;
  return markV2Dismissed(), !1;
}
function markV2Dismissed() {
  saveGlobalConfig((current) => {
    if (current.effortCalloutV2Dismissed)
      return current;
    return {
      ...current,
      effortCalloutV2Dismissed: !0
    };
  });
}
var import_compiler_runtime341, import_react281, jsx_dev_runtime439, AUTO_DISMISS_MS = 30000;
var init_EffortCallout = __esm(() => {
  init_ink2();
  init_auth14();
  init_config4();
  init_effort();
  init_model();
  init_settings2();
  init_select();
  init_EffortIndicator();
  init_PermissionDialog();
  import_compiler_runtime341 = __toESM(require_react_compiler_runtime_development(), 1), import_react281 = __toESM(require_react_development(), 1), jsx_dev_runtime439 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
