// Original: src/components/ModelPicker.tsx
function ModelPicker(t0) {
  let $3 = import_compiler_runtime136.c(82), {
    initial,
    sessionModel,
    onSelect,
    onCancel,
    isStandaloneCommand,
    showFastModeNotice,
    headerText,
    skipSettingsWrite
  } = t0, setAppState = useSetAppState(), exitState = useExitOnCtrlCDWithKeybindings(), initialValue = initial === null ? NO_PREFERENCE : initial, [focusedValue, setFocusedValue] = import_react99.useState(initialValue), isFastMode = useAppState(_temp69), [hasToggledEffort, setHasToggledEffort] = import_react99.useState(!1), effortValue = useAppState(_temp218), t1;
  if ($3[0] !== effortValue)
    t1 = effortValue !== void 0 ? convertEffortValueToLevel(effortValue) : void 0, $3[0] = effortValue, $3[1] = t1;
  else
    t1 = $3[1];
  let [effort, setEffort] = import_react99.useState(t1), t2 = isFastMode ?? !1, t3;
  if ($3[2] !== t2)
    t3 = getModelOptions(t2), $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  let modelOptions = t3, t4;
  bb0: {
    if (initial !== null && !modelOptions.some((opt) => opt.value === initial)) {
      let t52;
      if ($3[4] !== initial)
        t52 = modelDisplayString(initial), $3[4] = initial, $3[5] = t52;
      else
        t52 = $3[5];
      let t62;
      if ($3[6] !== initial || $3[7] !== t52)
        t62 = {
          value: initial,
          label: t52,
          description: "Current model"
        }, $3[6] = initial, $3[7] = t52, $3[8] = t62;
      else
        t62 = $3[8];
      let t72;
      if ($3[9] !== modelOptions || $3[10] !== t62)
        t72 = [...modelOptions, t62], $3[9] = modelOptions, $3[10] = t62, $3[11] = t72;
      else
        t72 = $3[11];
      t4 = t72;
      break bb0;
    }
    t4 = modelOptions;
  }
  let optionsWithInitial = t4, t5;
  if ($3[12] !== optionsWithInitial)
    t5 = optionsWithInitial.map(_temp314), $3[12] = optionsWithInitial, $3[13] = t5;
  else
    t5 = $3[13];
  let selectOptions = t5, t6;
  if ($3[14] !== initialValue || $3[15] !== selectOptions)
    t6 = selectOptions.some((_) => _.value === initialValue) ? initialValue : selectOptions[0]?.value ?? void 0, $3[14] = initialValue, $3[15] = selectOptions, $3[16] = t6;
  else
    t6 = $3[16];
  let initialFocusValue = t6, visibleCount = Math.min(10, selectOptions.length), hiddenCount = Math.max(0, selectOptions.length - visibleCount), t7;
  if ($3[17] !== focusedValue || $3[18] !== selectOptions)
    t7 = selectOptions.find((opt_1) => opt_1.value === focusedValue)?.label, $3[17] = focusedValue, $3[18] = selectOptions, $3[19] = t7;
  else
    t7 = $3[19];
  let focusedModelName = t7, focusedSupportsEffort, t8;
  if ($3[20] !== focusedValue) {
    let focusedModel = resolveOptionModel(focusedValue);
    focusedSupportsEffort = focusedModel ? modelSupportsEffort(focusedModel) : !1, t8 = focusedModel ? modelSupportsMaxEffort(focusedModel) : !1, $3[20] = focusedValue, $3[21] = focusedSupportsEffort, $3[22] = t8;
  } else
    focusedSupportsEffort = $3[21], t8 = $3[22];
  let focusedSupportsMax = t8, t9;
  if ($3[23] !== focusedValue)
    t9 = getDefaultEffortLevelForOption(focusedValue), $3[23] = focusedValue, $3[24] = t9;
  else
    t9 = $3[24];
  let focusedDefaultEffort = t9, displayEffort = effort === "max" && !focusedSupportsMax ? "high" : effort, t10;
  if ($3[25] !== effortValue || $3[26] !== hasToggledEffort)
    t10 = (value) => {
      if (setFocusedValue(value), !hasToggledEffort && effortValue === void 0)
        setEffort(getDefaultEffortLevelForOption(value));
    }, $3[25] = effortValue, $3[26] = hasToggledEffort, $3[27] = t10;
  else
    t10 = $3[27];
  let handleFocus = t10, t11;
  if ($3[28] !== focusedDefaultEffort || $3[29] !== focusedSupportsEffort || $3[30] !== focusedSupportsMax)
    t11 = (direction) => {
      if (!focusedSupportsEffort)
        return;
      setEffort((prev) => cycleEffortLevel(prev ?? focusedDefaultEffort, direction, focusedSupportsMax)), setHasToggledEffort(!0);
    }, $3[28] = focusedDefaultEffort, $3[29] = focusedSupportsEffort, $3[30] = focusedSupportsMax, $3[31] = t11;
  else
    t11 = $3[31];
  let handleCycleEffort = t11, t12;
  if ($3[32] !== handleCycleEffort)
    t12 = {
      "modelPicker:decreaseEffort": () => handleCycleEffort("left"),
      "modelPicker:increaseEffort": () => handleCycleEffort("right")
    }, $3[32] = handleCycleEffort, $3[33] = t12;
  else
    t12 = $3[33];
  let t13;
  if ($3[34] === Symbol.for("react.memo_cache_sentinel"))
    t13 = {
      context: "ModelPicker"
    }, $3[34] = t13;
  else
    t13 = $3[34];
  useKeybindings(t12, t13);
  let t14;
  if ($3[35] !== effort || $3[36] !== hasToggledEffort || $3[37] !== onSelect || $3[38] !== setAppState || $3[39] !== skipSettingsWrite)
    t14 = function(value_0) {
      if (logEvent("tengu_model_command_menu_effort", {
        effort
      }), !skipSettingsWrite) {
        let effortLevel = resolvePickerEffortPersistence(effort, getDefaultEffortLevelForOption(value_0), getSettingsForSource("userSettings")?.effortLevel, hasToggledEffort), persistable = toPersistableEffort(effortLevel);
        if (persistable !== void 0)
          updateSettingsForSource("userSettings", {
            effortLevel: persistable
          });
        setAppState((prev_0) => ({
          ...prev_0,
          effortValue: effortLevel
        }));
      }
      let selectedModel = resolveOptionModel(value_0), selectedEffort = hasToggledEffort && selectedModel && modelSupportsEffort(selectedModel) ? effort : void 0;
      if (value_0 === NO_PREFERENCE) {
        onSelect(null, selectedEffort);
        return;
      }
      onSelect(value_0, selectedEffort);
    }, $3[35] = effort, $3[36] = hasToggledEffort, $3[37] = onSelect, $3[38] = setAppState, $3[39] = skipSettingsWrite, $3[40] = t14;
  else
    t14 = $3[40];
  let handleSelect = t14, t15;
  if ($3[41] === Symbol.for("react.memo_cache_sentinel"))
    t15 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
      color: "remember",
      bold: !0,
      children: "Select model"
    }, void 0, !1, void 0, this), $3[41] = t15;
  else
    t15 = $3[41];
  let t16 = headerText ?? "Switch between Claude models. Applies to this session and future Claude Code sessions. For other/previous model names, specify with --model.", t17;
  if ($3[42] !== t16)
    t17 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t16
    }, void 0, !1, void 0, this), $3[42] = t16, $3[43] = t17;
  else
    t17 = $3[43];
  let t18;
  if ($3[44] !== sessionModel)
    t18 = sessionModel && /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Currently using ",
        modelDisplayString(sessionModel),
        " for this session (set by plan mode). Selecting a model will undo this."
      ]
    }, void 0, !0, void 0, this), $3[44] = sessionModel, $3[45] = t18;
  else
    t18 = $3[45];
  let t19;
  if ($3[46] !== t17 || $3[47] !== t18)
    t19 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      flexDirection: "column",
      children: [
        t15,
        t17,
        t18
      ]
    }, void 0, !0, void 0, this), $3[46] = t17, $3[47] = t18, $3[48] = t19;
  else
    t19 = $3[48];
  let t20 = onCancel ?? _temp413, t21;
  if ($3[49] !== handleFocus || $3[50] !== handleSelect || $3[51] !== initialFocusValue || $3[52] !== initialValue || $3[53] !== selectOptions || $3[54] !== t20 || $3[55] !== visibleCount)
    t21 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(Select, {
        defaultValue: initialValue,
        defaultFocusValue: initialFocusValue,
        options: selectOptions,
        onChange: handleSelect,
        onFocus: handleFocus,
        onCancel: t20,
        visibleOptionCount: visibleCount
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[49] = handleFocus, $3[50] = handleSelect, $3[51] = initialFocusValue, $3[52] = initialValue, $3[53] = selectOptions, $3[54] = t20, $3[55] = visibleCount, $3[56] = t21;
  else
    t21 = $3[56];
  let t22;
  if ($3[57] !== hiddenCount)
    t22 = hiddenCount > 0 && /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      paddingLeft: 3,
      children: /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "and ",
          hiddenCount,
          " more\u2026"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[57] = hiddenCount, $3[58] = t22;
  else
    t22 = $3[58];
  let t23;
  if ($3[59] !== t21 || $3[60] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        t21,
        t22
      ]
    }, void 0, !0, void 0, this), $3[59] = t21, $3[60] = t22, $3[61] = t23;
  else
    t23 = $3[61];
  let t24;
  if ($3[62] !== displayEffort || $3[63] !== focusedDefaultEffort || $3[64] !== focusedModelName || $3[65] !== focusedSupportsEffort)
    t24 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      flexDirection: "column",
      children: focusedSupportsEffort ? /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(EffortLevelIndicator, {
            effort: displayEffort
          }, void 0, !1, void 0, this),
          " ",
          capitalize_default(displayEffort),
          " effort",
          displayEffort === focusedDefaultEffort ? " (default)" : "",
          " ",
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
            color: "subtle",
            children: "\u2190 \u2192 to adjust"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
        color: "subtle",
        children: [
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(EffortLevelIndicator, {
            effort: void 0
          }, void 0, !1, void 0, this),
          " Effort not supported",
          focusedModelName ? ` for ${focusedModelName}` : ""
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[62] = displayEffort, $3[63] = focusedDefaultEffort, $3[64] = focusedModelName, $3[65] = focusedSupportsEffort, $3[66] = t24;
  else
    t24 = $3[66];
  let t25;
  if ($3[67] !== showFastModeNotice)
    t25 = isFastModeEnabled() ? showFastModeNotice ? /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Fast mode is ",
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
            bold: !0,
            children: "ON"
          }, void 0, !1, void 0, this),
          " and available with",
          " ",
          FAST_MODE_MODEL_DISPLAY,
          " only (/fast). Switching to other models turn off fast mode."
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this) : isFastModeAvailable() && !isFastModeCooldown() ? /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Use ",
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
            bold: !0,
            children: "/fast"
          }, void 0, !1, void 0, this),
          " to turn on Fast mode (",
          FAST_MODE_MODEL_DISPLAY,
          " only)."
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this) : null : null, $3[67] = showFastModeNotice, $3[68] = t25;
  else
    t25 = $3[68];
  let t26;
  if ($3[69] !== t19 || $3[70] !== t23 || $3[71] !== t24 || $3[72] !== t25)
    t26 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t19,
        t23,
        t24,
        t25
      ]
    }, void 0, !0, void 0, this), $3[69] = t19, $3[70] = t23, $3[71] = t24, $3[72] = t25, $3[73] = t26;
  else
    t26 = $3[73];
  let t27;
  if ($3[74] !== exitState || $3[75] !== isStandaloneCommand)
    t27 = isStandaloneCommand && /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
      dimColor: !0,
      italic: !0,
      children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(jsx_dev_runtime173.Fragment, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(Byline, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Enter",
            action: "confirm"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ConfigurableShortcutHint, {
            action: "select:cancel",
            context: "Select",
            fallback: "Esc",
            description: "exit"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[74] = exitState, $3[75] = isStandaloneCommand, $3[76] = t27;
  else
    t27 = $3[76];
  let t28;
  if ($3[77] !== t26 || $3[78] !== t27)
    t28 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t26,
        t27
      ]
    }, void 0, !0, void 0, this), $3[77] = t26, $3[78] = t27, $3[79] = t28;
  else
    t28 = $3[79];
  let content = t28;
  if (!isStandaloneCommand)
    return content;
  let t29;
  if ($3[80] !== content)
    t29 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(Pane, {
      color: "permission",
      children: content
    }, void 0, !1, void 0, this), $3[80] = content, $3[81] = t29;
  else
    t29 = $3[81];
  return t29;
}
function _temp413() {}
function _temp314(opt_0) {
  return {
    ...opt_0,
    value: opt_0.value === null ? NO_PREFERENCE : opt_0.value
  };
}
function _temp218(s_0) {
  return s_0.effortValue;
}
function _temp69(s2) {
  return isFastModeEnabled() ? s2.fastMode : !1;
}
function resolveOptionModel(value) {
  if (!value)
    return;
  return value === NO_PREFERENCE ? getDefaultMainLoopModel() : parseUserSpecifiedModel(value);
}
function EffortLevelIndicator(t0) {
  let $3 = import_compiler_runtime136.c(5), {
    effort
  } = t0, t1 = effort ? "claude" : "subtle", t2 = effort ?? "low", t3;
  if ($3[0] !== t2)
    t3 = effortLevelToSymbol(t2), $3[0] = t2, $3[1] = t3;
  else
    t3 = $3[1];
  let t4;
  if ($3[2] !== t1 || $3[3] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime173.jsxDEV(ThemedText, {
      color: t1,
      children: t3
    }, void 0, !1, void 0, this), $3[2] = t1, $3[3] = t3, $3[4] = t4;
  else
    t4 = $3[4];
  return t4;
}
function cycleEffortLevel(current, direction, includeMax) {
  let levels = includeMax ? ["low", "medium", "high", "max"] : ["low", "medium", "high"], idx = levels.indexOf(current), currentIndex = idx !== -1 ? idx : levels.indexOf("high");
  if (direction === "right")
    return levels[(currentIndex + 1) % levels.length];
  else
    return levels[(currentIndex - 1 + levels.length) % levels.length];
}
function getDefaultEffortLevelForOption(value) {
  let resolved = resolveOptionModel(value) ?? getDefaultMainLoopModel(), defaultValue = getDefaultEffortForModel(resolved);
  return defaultValue !== void 0 ? convertEffortValueToLevel(defaultValue) : "high";
}
var import_compiler_runtime136, import_react99, jsx_dev_runtime173, NO_PREFERENCE = "__NO_PREFERENCE__";
var init_ModelPicker = __esm(() => {
  init_capitalize();
  init_useExitOnCtrlCDWithKeybindings();
  init_fastMode();
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_effort();
  init_model();
  init_modelOptions();
  init_settings2();
  init_ConfigurableShortcutHint();
  init_CustomSelect();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Pane();
  init_EffortIndicator();
  import_compiler_runtime136 = __toESM(require_react_compiler_runtime_development(), 1), import_react99 = __toESM(require_react_development(), 1), jsx_dev_runtime173 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
