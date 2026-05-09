// Original: src/commands/fast/fast.tsx
var exports_fast = {};
__export(exports_fast, {
  call: () => call42,
  FastModePicker: () => FastModePicker
});
function applyFastMode(enable2, setAppState) {
  if (clearFastModeCooldown(), updateSettingsForSource("userSettings", {
    fastMode: enable2 ? !0 : void 0
  }), enable2)
    setAppState((prev) => {
      let needsModelSwitch = !isFastModeSupportedByModel(prev.mainLoopModel);
      return {
        ...prev,
        ...needsModelSwitch ? {
          mainLoopModel: getFastModeModel(),
          mainLoopModelForSession: null
        } : {},
        fastMode: !0
      };
    });
  else
    setAppState((prev) => ({
      ...prev,
      fastMode: !1
    }));
}
function FastModePicker(t0) {
  let $3 = import_compiler_runtime240.c(30), {
    onDone,
    unavailableReason
  } = t0, model = useAppState(_temp147), initialFastMode = useAppState(_temp260), setAppState = useSetAppState(), [enableFastMode, setEnableFastMode] = import_react170.useState(initialFastMode ?? !1), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getFastModeRuntimeState(), $3[0] = t1;
  else
    t1 = $3[0];
  let runtimeState2 = t1, isCooldown = runtimeState2.status === "cooldown", isUnavailable = unavailableReason !== null, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = formatModelPricing(getOpus46CostTier(!0)), $3[1] = t2;
  else
    t2 = $3[1];
  let pricing = t2, t3;
  if ($3[2] !== enableFastMode || $3[3] !== isUnavailable || $3[4] !== model || $3[5] !== onDone || $3[6] !== setAppState)
    t3 = function() {
      if (isUnavailable)
        return;
      if (applyFastMode(enableFastMode, setAppState), logEvent("tengu_fast_mode_toggled", {
        enabled: enableFastMode,
        source: "picker"
      }), enableFastMode) {
        let fastIcon = getFastIconString(enableFastMode), modelUpdated = !isFastModeSupportedByModel(model) ? ` \xB7 model set to ${FAST_MODE_MODEL_DISPLAY}` : "";
        onDone(`${fastIcon} Fast mode ON${modelUpdated} \xB7 ${pricing}`);
      } else
        setAppState(_temp337), onDone("Fast mode OFF");
    }, $3[2] = enableFastMode, $3[3] = isUnavailable, $3[4] = model, $3[5] = onDone, $3[6] = setAppState, $3[7] = t3;
  else
    t3 = $3[7];
  let handleConfirm = t3, t4;
  if ($3[8] !== initialFastMode || $3[9] !== isUnavailable || $3[10] !== onDone || $3[11] !== setAppState)
    t4 = function() {
      if (isUnavailable) {
        if (initialFastMode)
          applyFastMode(!1, setAppState);
        onDone("Fast mode OFF", {
          display: "system"
        });
        return;
      }
      let message = initialFastMode ? `${getFastIconString()} Kept Fast mode ON` : "Kept Fast mode OFF";
      onDone(message, {
        display: "system"
      });
    }, $3[8] = initialFastMode, $3[9] = isUnavailable, $3[10] = onDone, $3[11] = setAppState, $3[12] = t4;
  else
    t4 = $3[12];
  let handleCancel = t4, t5;
  if ($3[13] !== isUnavailable)
    t5 = function() {
      if (isUnavailable)
        return;
      setEnableFastMode(_temp429);
    }, $3[13] = isUnavailable, $3[14] = t5;
  else
    t5 = $3[14];
  let handleToggle = t5, t6;
  if ($3[15] !== handleConfirm || $3[16] !== handleToggle)
    t6 = {
      "confirm:yes": handleConfirm,
      "confirm:nextField": handleToggle,
      "confirm:next": handleToggle,
      "confirm:previous": handleToggle,
      "confirm:cycleMode": handleToggle,
      "confirm:toggle": handleToggle
    }, $3[15] = handleConfirm, $3[16] = handleToggle, $3[17] = t6;
  else
    t6 = $3[17];
  let t7;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t7 = {
      context: "Confirmation"
    }, $3[18] = t7;
  else
    t7 = $3[18];
  useKeybindings(t6, t7);
  let t8;
  if ($3[19] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(FastIcon, {
          cooldown: isCooldown
        }, void 0, !1, void 0, this),
        " Fast mode (research preview)"
      ]
    }, void 0, !0, void 0, this), $3[19] = t8;
  else
    t8 = $3[19];
  let title = t8, t9;
  if ($3[20] !== isUnavailable)
    t9 = (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : isUnavailable ? /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
      children: "Esc to cancel"
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
      children: "Tab to toggle \xB7 Enter to confirm \xB7 Esc to cancel"
    }, void 0, !1, void 0, this), $3[20] = isUnavailable, $3[21] = t9;
  else
    t9 = $3[21];
  let t10;
  if ($3[22] !== enableFastMode || $3[23] !== unavailableReason)
    t10 = unavailableReason ? /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedBox_default, {
      marginLeft: 2,
      children: /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
        color: "error",
        children: unavailableReason
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(jsx_dev_runtime303.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 0,
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            gap: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
                bold: !0,
                children: "Fast mode"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
                color: enableFastMode ? "fastMode" : void 0,
                bold: enableFastMode,
                children: enableFastMode ? "ON " : "OFF"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
                dimColor: !0,
                children: pricing
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        isCooldown && runtimeState2.status === "cooldown" && /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedBox_default, {
          marginLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
            color: "warning",
            children: [
              runtimeState2.reason === "overloaded" ? "Fast mode overloaded and is temporarily unavailable" : "You've hit your fast limit",
              " \xB7 resets in ",
              formatDuration(runtimeState2.resetAt - Date.now(), {
                hideTrailingZeros: !0
              })
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[22] = enableFastMode, $3[23] = unavailableReason, $3[24] = t10;
  else
    t10 = $3[24];
  let t11;
  if ($3[25] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Learn more:",
        " ",
        /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/fast-mode",
          children: "https://code.claude.com/docs/en/fast-mode"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[25] = t11;
  else
    t11 = $3[25];
  let t12;
  if ($3[26] !== handleCancel || $3[27] !== t10 || $3[28] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(Dialog, {
      title,
      subtitle: `High-speed mode for ${FAST_MODE_MODEL_DISPLAY}. Billed as extra usage at a premium rate. Separate rate limits apply.`,
      onCancel: handleCancel,
      color: "fastMode",
      inputGuide: t9,
      children: [
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[26] = handleCancel, $3[27] = t10, $3[28] = t9, $3[29] = t12;
  else
    t12 = $3[29];
  return t12;
}
function _temp429(prev_0) {
  return !prev_0;
}
function _temp337(prev) {
  return {
    ...prev,
    fastMode: !1
  };
}
function _temp260(s_0) {
  return s_0.fastMode;
}
function _temp147(s2) {
  return s2.mainLoopModel;
}
async function handleFastModeShortcut(enable2, getAppState, setAppState) {
  let unavailableReason = getFastModeUnavailableReason();
  if (unavailableReason)
    return `Fast mode unavailable: ${unavailableReason}`;
  let {
    mainLoopModel
  } = getAppState();
  if (applyFastMode(enable2, setAppState), logEvent("tengu_fast_mode_toggled", {
    enabled: enable2,
    source: "shortcut"
  }), enable2) {
    let fastIcon = getFastIconString(!0), modelUpdated = !isFastModeSupportedByModel(mainLoopModel) ? ` \xB7 model set to ${FAST_MODE_MODEL_DISPLAY}` : "", pricing = formatModelPricing(getOpus46CostTier(!0));
    return `${fastIcon} Fast mode ON${modelUpdated} \xB7 ${pricing}`;
  } else
    return "Fast mode OFF";
}
async function call42(onDone, context7, args) {
  if (!isFastModeEnabled())
    return null;
  await prefetchFastModeStatus();
  let arg = args?.trim().toLowerCase();
  if (arg === "on" || arg === "off") {
    let result = await handleFastModeShortcut(arg === "on", context7.getAppState, context7.setAppState);
    return onDone(result), null;
  }
  let unavailableReason = getFastModeUnavailableReason();
  return logEvent("tengu_fast_mode_picker_shown", {
    unavailable_reason: unavailableReason ?? ""
  }), /* @__PURE__ */ jsx_dev_runtime303.jsxDEV(FastModePicker, {
    onDone,
    unavailableReason
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime240, import_react170, jsx_dev_runtime303;
var init_fast = __esm(() => {
  init_Dialog();
  init_FastIcon();
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_fastMode();
  init_format();
  init_modelCost();
  init_settings2();
  import_compiler_runtime240 = __toESM(require_react_compiler_runtime_development(), 1), import_react170 = __toESM(require_react_development(), 1), jsx_dev_runtime303 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
