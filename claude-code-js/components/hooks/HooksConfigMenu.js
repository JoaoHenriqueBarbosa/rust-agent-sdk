// Original: src/components/hooks/HooksConfigMenu.tsx
function HooksConfigMenu(t0) {
  let $3 = import_compiler_runtime246.c(100), {
    toolNames,
    onExit: onExit2
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      mode: "select-event"
    }, $3[0] = t1;
  else
    t1 = $3[0];
  let [modeState, setModeState] = import_react173.useState(t1), [disabledByPolicy, setDisabledByPolicy] = import_react173.useState(_temp153), [restrictedByPolicy, setRestrictedByPolicy] = import_react173.useState(_temp264), t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = (source) => {
      if (source === "policySettings") {
        let hooksDisabled_0 = getSettings_DEPRECATED()?.disableAllHooks === !0;
        setDisabledByPolicy(hooksDisabled_0 && getSettingsForSource("policySettings")?.disableAllHooks === !0), setRestrictedByPolicy(getSettingsForSource("policySettings")?.allowManagedHooksOnly === !0);
      }
    }, $3[1] = t2;
  else
    t2 = $3[1];
  useSettingsChange(t2);
  let mode = modeState.mode, selectedEvent = "event" in modeState ? modeState.event : "PreToolUse", selectedMatcher = "matcher" in modeState ? modeState.matcher : null, mcp2 = useAppState(_temp339), appStateStore = useAppStateStore(), t3;
  if ($3[2] !== mcp2.tools || $3[3] !== toolNames)
    t3 = [...toolNames, ...mcp2.tools.map(_temp430)], $3[2] = mcp2.tools, $3[3] = toolNames, $3[4] = t3;
  else
    t3 = $3[4];
  let combinedToolNames = t3, t4;
  if ($3[5] !== appStateStore || $3[6] !== combinedToolNames)
    t4 = groupHooksByEventAndMatcher(appStateStore.getState(), combinedToolNames), $3[5] = appStateStore, $3[6] = combinedToolNames, $3[7] = t4;
  else
    t4 = $3[7];
  let hooksByEventAndMatcher = t4, t5;
  if ($3[8] !== hooksByEventAndMatcher || $3[9] !== selectedEvent)
    t5 = getSortedMatchersForEvent(hooksByEventAndMatcher, selectedEvent), $3[8] = hooksByEventAndMatcher, $3[9] = selectedEvent, $3[10] = t5;
  else
    t5 = $3[10];
  let sortedMatchersForSelectedEvent = t5, t6;
  if ($3[11] !== hooksByEventAndMatcher || $3[12] !== selectedEvent || $3[13] !== selectedMatcher)
    t6 = getHooksForMatcher(hooksByEventAndMatcher, selectedEvent, selectedMatcher), $3[11] = hooksByEventAndMatcher, $3[12] = selectedEvent, $3[13] = selectedMatcher, $3[14] = t6;
  else
    t6 = $3[14];
  let hooksForSelectedMatcher = t6, t7;
  if ($3[15] !== onExit2)
    t7 = () => {
      onExit2("Hooks dialog dismissed", {
        display: "system"
      });
    }, $3[15] = onExit2, $3[16] = t7;
  else
    t7 = $3[16];
  let handleExit = t7, t8 = mode === "select-event", t9;
  if ($3[17] !== t8)
    t9 = {
      context: "Confirmation",
      isActive: t8
    }, $3[17] = t8, $3[18] = t9;
  else
    t9 = $3[18];
  useKeybinding("confirm:no", handleExit, t9);
  let t10;
  if ($3[19] === Symbol.for("react.memo_cache_sentinel"))
    t10 = () => {
      setModeState({
        mode: "select-event"
      });
    }, $3[19] = t10;
  else
    t10 = $3[19];
  let t11 = mode === "select-matcher", t12;
  if ($3[20] !== t11)
    t12 = {
      context: "Confirmation",
      isActive: t11
    }, $3[20] = t11, $3[21] = t12;
  else
    t12 = $3[21];
  useKeybinding("confirm:no", t10, t12);
  let t13;
  if ($3[22] !== combinedToolNames || $3[23] !== modeState)
    t13 = () => {
      if ("event" in modeState)
        if (getMatcherMetadata(modeState.event, combinedToolNames) !== void 0)
          setModeState({
            mode: "select-matcher",
            event: modeState.event
          });
        else
          setModeState({
            mode: "select-event"
          });
    }, $3[22] = combinedToolNames, $3[23] = modeState, $3[24] = t13;
  else
    t13 = $3[24];
  let t14 = mode === "select-hook", t15;
  if ($3[25] !== t14)
    t15 = {
      context: "Confirmation",
      isActive: t14
    }, $3[25] = t14, $3[26] = t15;
  else
    t15 = $3[26];
  useKeybinding("confirm:no", t13, t15);
  let t16;
  if ($3[27] !== modeState)
    t16 = () => {
      if (modeState.mode === "view-hook") {
        let {
          event,
          hook
        } = modeState;
        setModeState({
          mode: "select-hook",
          event,
          matcher: hook.matcher || ""
        });
      }
    }, $3[27] = modeState, $3[28] = t16;
  else
    t16 = $3[28];
  let t17 = mode === "view-hook", t18;
  if ($3[29] !== t17)
    t18 = {
      context: "Confirmation",
      isActive: t17
    }, $3[29] = t17, $3[30] = t18;
  else
    t18 = $3[30];
  useKeybinding("confirm:no", t16, t18);
  let t19;
  if ($3[31] !== combinedToolNames)
    t19 = getHookEventMetadata(combinedToolNames), $3[31] = combinedToolNames, $3[32] = t19;
  else
    t19 = $3[32];
  let hookEventMetadata = t19, hooksDisabled_1 = getSettings_DEPRECATED()?.disableAllHooks === !0, t20;
  if ($3[33] !== hooksByEventAndMatcher) {
    let byEvent = {}, total = 0;
    for (let [event_0, matchers] of Object.entries(hooksByEventAndMatcher)) {
      let eventCount = Object.values(matchers).reduce(_temp520, 0);
      byEvent[event_0] = eventCount, total = total + eventCount;
    }
    t20 = {
      hooksByEvent: byEvent,
      totalHooksCount: total
    }, $3[33] = hooksByEventAndMatcher, $3[34] = t20;
  } else
    t20 = $3[34];
  let {
    hooksByEvent,
    totalHooksCount
  } = t20;
  if (hooksDisabled_1) {
    let t21;
    if ($3[35] === Symbol.for("react.memo_cache_sentinel"))
      t21 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        bold: !0,
        children: "disabled"
      }, void 0, !1, void 0, this), $3[35] = t21;
    else
      t21 = $3[35];
    let t22 = disabledByPolicy && " by a managed settings file", t23;
    if ($3[36] !== totalHooksCount)
      t23 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        bold: !0,
        children: totalHooksCount
      }, void 0, !1, void 0, this), $3[36] = totalHooksCount, $3[37] = t23;
    else
      t23 = $3[37];
    let t24;
    if ($3[38] !== totalHooksCount)
      t24 = plural(totalHooksCount, "hook"), $3[38] = totalHooksCount, $3[39] = t24;
    else
      t24 = $3[39];
    let t25;
    if ($3[40] !== totalHooksCount)
      t25 = plural(totalHooksCount, "is", "are"), $3[40] = totalHooksCount, $3[41] = t25;
    else
      t25 = $3[41];
    let t26;
    if ($3[42] !== t22 || $3[43] !== t23 || $3[44] !== t24 || $3[45] !== t25)
      t26 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        children: [
          "All hooks are currently ",
          t21,
          t22,
          ". You have",
          " ",
          t23,
          " configured",
          " ",
          t24,
          " that",
          " ",
          t25,
          " not running."
        ]
      }, void 0, !0, void 0, this), $3[42] = t22, $3[43] = t23, $3[44] = t24, $3[45] = t25, $3[46] = t26;
    else
      t26 = $3[46];
    let t27, t28, t29, t30;
    if ($3[47] === Symbol.for("react.memo_cache_sentinel"))
      t27 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "When hooks are disabled:"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), t28 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\xB7 No hook commands will execute"
      }, void 0, !1, void 0, this), t29 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\xB7 StatusLine will not be displayed"
      }, void 0, !1, void 0, this), t30 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\xB7 Tool operations will proceed without hook validation"
      }, void 0, !1, void 0, this), $3[47] = t27, $3[48] = t28, $3[49] = t29, $3[50] = t30;
    else
      t27 = $3[47], t28 = $3[48], t29 = $3[49], t30 = $3[50];
    let t31;
    if ($3[51] !== t26)
      t31 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          t26,
          t27,
          t28,
          t29,
          t30
        ]
      }, void 0, !0, void 0, this), $3[51] = t26, $3[52] = t31;
    else
      t31 = $3[52];
    let t32;
    if ($3[53] !== disabledByPolicy)
      t32 = !disabledByPolicy && /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
        dimColor: !0,
        children: 'To re-enable hooks, remove "disableAllHooks" from settings.json or ask Claude.'
      }, void 0, !1, void 0, this), $3[53] = disabledByPolicy, $3[54] = t32;
    else
      t32 = $3[54];
    let t33;
    if ($3[55] !== t31 || $3[56] !== t32)
      t33 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          t31,
          t32
        ]
      }, void 0, !0, void 0, this), $3[55] = t31, $3[56] = t32, $3[57] = t33;
    else
      t33 = $3[57];
    let t34;
    if ($3[58] !== handleExit || $3[59] !== t33)
      t34 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(Dialog, {
        title: "Hook Configuration - Disabled",
        onCancel: handleExit,
        inputGuide: _temp617,
        children: t33
      }, void 0, !1, void 0, this), $3[58] = handleExit, $3[59] = t33, $3[60] = t34;
    else
      t34 = $3[60];
    return t34;
  }
  switch (modeState.mode) {
    case "select-event": {
      let t21;
      if ($3[61] !== combinedToolNames)
        t21 = (event_2) => {
          if (getMatcherMetadata(event_2, combinedToolNames) !== void 0)
            setModeState({
              mode: "select-matcher",
              event: event_2
            });
          else
            setModeState({
              mode: "select-hook",
              event: event_2,
              matcher: ""
            });
        }, $3[61] = combinedToolNames, $3[62] = t21;
      else
        t21 = $3[62];
      let t22;
      if ($3[63] !== handleExit || $3[64] !== hookEventMetadata || $3[65] !== hooksByEvent || $3[66] !== restrictedByPolicy || $3[67] !== t21 || $3[68] !== totalHooksCount)
        t22 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(SelectEventMode, {
          hookEventMetadata,
          hooksByEvent,
          totalHooksCount,
          restrictedByPolicy,
          onSelectEvent: t21,
          onCancel: handleExit
        }, void 0, !1, void 0, this), $3[63] = handleExit, $3[64] = hookEventMetadata, $3[65] = hooksByEvent, $3[66] = restrictedByPolicy, $3[67] = t21, $3[68] = totalHooksCount, $3[69] = t22;
      else
        t22 = $3[69];
      return t22;
    }
    case "select-matcher": {
      let t21 = hookEventMetadata[modeState.event], t22;
      if ($3[70] !== modeState.event)
        t22 = (matcher) => {
          setModeState({
            mode: "select-hook",
            event: modeState.event,
            matcher
          });
        }, $3[70] = modeState.event, $3[71] = t22;
      else
        t22 = $3[71];
      let t23;
      if ($3[72] === Symbol.for("react.memo_cache_sentinel"))
        t23 = () => {
          setModeState({
            mode: "select-event"
          });
        }, $3[72] = t23;
      else
        t23 = $3[72];
      let t24;
      if ($3[73] !== hooksByEventAndMatcher || $3[74] !== modeState.event || $3[75] !== sortedMatchersForSelectedEvent || $3[76] !== t21.description || $3[77] !== t22)
        t24 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(SelectMatcherMode, {
          selectedEvent: modeState.event,
          matchersForSelectedEvent: sortedMatchersForSelectedEvent,
          hooksByEventAndMatcher,
          eventDescription: t21.description,
          onSelect: t22,
          onCancel: t23
        }, void 0, !1, void 0, this), $3[73] = hooksByEventAndMatcher, $3[74] = modeState.event, $3[75] = sortedMatchersForSelectedEvent, $3[76] = t21.description, $3[77] = t22, $3[78] = t24;
      else
        t24 = $3[78];
      return t24;
    }
    case "select-hook": {
      let t21 = hookEventMetadata[modeState.event], t22;
      if ($3[79] !== modeState.event)
        t22 = (hook_1) => {
          setModeState({
            mode: "view-hook",
            event: modeState.event,
            hook: hook_1
          });
        }, $3[79] = modeState.event, $3[80] = t22;
      else
        t22 = $3[80];
      let t23;
      if ($3[81] !== combinedToolNames || $3[82] !== modeState.event)
        t23 = () => {
          if (getMatcherMetadata(modeState.event, combinedToolNames) !== void 0)
            setModeState({
              mode: "select-matcher",
              event: modeState.event
            });
          else
            setModeState({
              mode: "select-event"
            });
        }, $3[81] = combinedToolNames, $3[82] = modeState.event, $3[83] = t23;
      else
        t23 = $3[83];
      let t24;
      if ($3[84] !== hooksForSelectedMatcher || $3[85] !== modeState.event || $3[86] !== modeState.matcher || $3[87] !== t21 || $3[88] !== t22 || $3[89] !== t23)
        t24 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(SelectHookMode, {
          selectedEvent: modeState.event,
          selectedMatcher: modeState.matcher,
          hooksForSelectedMatcher,
          hookEventMetadata: t21,
          onSelect: t22,
          onCancel: t23
        }, void 0, !1, void 0, this), $3[84] = hooksForSelectedMatcher, $3[85] = modeState.event, $3[86] = modeState.matcher, $3[87] = t21, $3[88] = t22, $3[89] = t23, $3[90] = t24;
      else
        t24 = $3[90];
      return t24;
    }
    case "view-hook": {
      let t21 = modeState.hook, t22;
      if ($3[91] !== combinedToolNames || $3[92] !== modeState.event)
        t22 = getMatcherMetadata(modeState.event, combinedToolNames), $3[91] = combinedToolNames, $3[92] = modeState.event, $3[93] = t22;
      else
        t22 = $3[93];
      let t23 = t22 !== void 0, t24;
      if ($3[94] !== modeState)
        t24 = () => {
          let {
            event: event_1,
            hook: hook_0
          } = modeState;
          setModeState({
            mode: "select-hook",
            event: event_1,
            matcher: hook_0.matcher || ""
          });
        }, $3[94] = modeState, $3[95] = t24;
      else
        t24 = $3[95];
      let t25;
      if ($3[96] !== modeState.hook || $3[97] !== t23 || $3[98] !== t24)
        t25 = /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ViewHookMode, {
          selectedHook: t21,
          eventSupportsMatcher: t23,
          onCancel: t24
        }, void 0, !1, void 0, this), $3[96] = modeState.hook, $3[97] = t23, $3[98] = t24, $3[99] = t25;
      else
        t25 = $3[99];
      return t25;
    }
  }
}
function _temp617() {
  return /* @__PURE__ */ jsx_dev_runtime312.jsxDEV(ThemedText, {
    children: "Esc to close"
  }, void 0, !1, void 0, this);
}
function _temp520(sum, hooks) {
  return sum + hooks.length;
}
function _temp430(tool) {
  return tool.name;
}
function _temp339(s2) {
  return s2.mcp;
}
function _temp264() {
  return getSettingsForSource("policySettings")?.allowManagedHooksOnly === !0;
}
function _temp153() {
  return getSettings_DEPRECATED()?.disableAllHooks === !0 && getSettingsForSource("policySettings")?.disableAllHooks === !0;
}
var import_compiler_runtime246, import_react173, jsx_dev_runtime312;
var init_HooksConfigMenu = __esm(() => {
  init_AppState();
  init_useSettingsChange();
  init_ink2();
  init_useKeybinding();
  init_hooksConfigManager();
  init_settings2();
  init_Dialog();
  init_SelectEventMode();
  init_SelectHookMode();
  init_SelectMatcherMode();
  init_ViewHookMode();
  import_compiler_runtime246 = __toESM(require_react_compiler_runtime_development(), 1), import_react173 = __toESM(require_react_development(), 1), jsx_dev_runtime312 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
