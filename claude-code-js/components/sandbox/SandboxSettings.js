// Original: src/components/sandbox/SandboxSettings.tsx
function SandboxSettings(t0) {
  let $3 = import_compiler_runtime270.c(34), {
    onComplete,
    depCheck
  } = t0, [theme2] = useTheme(), currentEnabled = SandboxManager2.isSandboxingEnabled(), currentAutoAllow = SandboxManager2.isAutoAllowBashIfSandboxedEnabled(), hasWarnings = depCheck.warnings.length > 0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = getSettings_DEPRECATED(), $3[0] = t1;
  else
    t1 = $3[0];
  let allowAllUnixSockets = t1.sandbox?.network?.allowAllUnixSockets, showSocketWarning = hasWarnings && !allowAllUnixSockets, currentMode = (() => {
    if (!currentEnabled)
      return "disabled";
    if (currentAutoAllow)
      return "auto-allow";
    return "regular";
  })(), t2;
  if ($3[1] !== theme2)
    t2 = color("success", theme2)("(current)"), $3[1] = theme2, $3[2] = t2;
  else
    t2 = $3[2];
  let currentIndicator = t2, t3 = currentMode === "auto-allow" ? `Sandbox BashTool, with auto-allow ${currentIndicator}` : "Sandbox BashTool, with auto-allow", t4;
  if ($3[3] !== t3)
    t4 = {
      label: t3,
      value: "auto-allow"
    }, $3[3] = t3, $3[4] = t4;
  else
    t4 = $3[4];
  let t5 = currentMode === "regular" ? `Sandbox BashTool, with regular permissions ${currentIndicator}` : "Sandbox BashTool, with regular permissions", t6;
  if ($3[5] !== t5)
    t6 = {
      label: t5,
      value: "regular"
    }, $3[5] = t5, $3[6] = t6;
  else
    t6 = $3[6];
  let t7 = currentMode === "disabled" ? `No Sandbox ${currentIndicator}` : "No Sandbox", t8;
  if ($3[7] !== t7)
    t8 = {
      label: t7,
      value: "disabled"
    }, $3[7] = t7, $3[8] = t8;
  else
    t8 = $3[8];
  let t9;
  if ($3[9] !== t4 || $3[10] !== t6 || $3[11] !== t8)
    t9 = [t4, t6, t8], $3[9] = t4, $3[10] = t6, $3[11] = t8, $3[12] = t9;
  else
    t9 = $3[12];
  let options2 = t9, t10;
  if ($3[13] !== onComplete)
    t10 = async function(value) {
      let mode = value;
      bb33:
        switch (mode) {
          case "auto-allow": {
            await SandboxManager2.setSandboxSettings({
              enabled: !0,
              autoAllowBashIfSandboxed: !0
            }), onComplete("\u2713 Sandbox enabled with auto-allow for bash commands");
            break bb33;
          }
          case "regular": {
            await SandboxManager2.setSandboxSettings({
              enabled: !0,
              autoAllowBashIfSandboxed: !1
            }), onComplete("\u2713 Sandbox enabled with regular bash permissions");
            break bb33;
          }
          case "disabled":
            await SandboxManager2.setSandboxSettings({
              enabled: !1,
              autoAllowBashIfSandboxed: !1
            }), onComplete("\u25CB Sandbox disabled");
        }
    }, $3[13] = onComplete, $3[14] = t10;
  else
    t10 = $3[14];
  let handleSelect = t10, t11;
  if ($3[15] !== onComplete)
    t11 = {
      "confirm:no": () => onComplete(void 0, {
        display: "skip"
      })
    }, $3[15] = onComplete, $3[16] = t11;
  else
    t11 = $3[16];
  let t12;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t12 = {
      context: "Settings"
    }, $3[17] = t12;
  else
    t12 = $3[17];
  useKeybindings(t11, t12);
  let t13;
  if ($3[18] !== handleSelect || $3[19] !== onComplete || $3[20] !== options2 || $3[21] !== showSocketWarning)
    t13 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Tab, {
      title: "Mode",
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(SandboxModeTab, {
        showSocketWarning,
        options: options2,
        onSelect: handleSelect,
        onComplete
      }, void 0, !1, void 0, this)
    }, "mode", !1, void 0, this), $3[18] = handleSelect, $3[19] = onComplete, $3[20] = options2, $3[21] = showSocketWarning, $3[22] = t13;
  else
    t13 = $3[22];
  let modeTab = t13, t14;
  if ($3[23] !== onComplete)
    t14 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Tab, {
      title: "Overrides",
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(SandboxOverridesTab, {
        onComplete
      }, void 0, !1, void 0, this)
    }, "overrides", !1, void 0, this), $3[23] = onComplete, $3[24] = t14;
  else
    t14 = $3[24];
  let overridesTab = t14, t15;
  if ($3[25] === Symbol.for("react.memo_cache_sentinel"))
    t15 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Tab, {
      title: "Config",
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(SandboxConfigTab, {}, void 0, !1, void 0, this)
    }, "config", !1, void 0, this), $3[25] = t15;
  else
    t15 = $3[25];
  let configTab = t15, hasErrors = depCheck.errors.length > 0, t16;
  if ($3[26] !== depCheck || $3[27] !== hasErrors || $3[28] !== hasWarnings || $3[29] !== modeTab || $3[30] !== overridesTab)
    t16 = hasErrors ? [/* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Tab, {
      title: "Dependencies",
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(SandboxDependenciesTab, {
        depCheck
      }, void 0, !1, void 0, this)
    }, "dependencies", !1, void 0, this)] : [modeTab, ...hasWarnings ? [/* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Tab, {
      title: "Dependencies",
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(SandboxDependenciesTab, {
        depCheck
      }, void 0, !1, void 0, this)
    }, "dependencies", !1, void 0, this)] : [], overridesTab, configTab], $3[26] = depCheck, $3[27] = hasErrors, $3[28] = hasWarnings, $3[29] = modeTab, $3[30] = overridesTab, $3[31] = t16;
  else
    t16 = $3[31];
  let tabs = t16, t17;
  if ($3[32] !== tabs)
    t17 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Pane, {
      color: "permission",
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Tabs, {
        title: "Sandbox:",
        color: "permission",
        defaultTab: "Mode",
        children: tabs
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[32] = tabs, $3[33] = t17;
  else
    t17 = $3[33];
  return t17;
}
function SandboxModeTab(t0) {
  let $3 = import_compiler_runtime270.c(16), {
    showSocketWarning,
    options: options2,
    onSelect,
    onComplete
  } = t0, {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), t1;
  if ($3[0] !== showSocketWarning)
    t1 = showSocketWarning && /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedText, {
        color: "warning",
        children: "Cannot block unix domain sockets (see Dependencies tab)"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = showSocketWarning, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedText, {
        bold: !0,
        children: "Configure Mode:"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = t2;
  else
    t2 = $3[2];
  let t3;
  if ($3[3] !== onComplete)
    t3 = () => onComplete(void 0, {
      display: "skip"
    }), $3[3] = onComplete, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== focusHeader || $3[6] !== headerFocused || $3[7] !== onSelect || $3[8] !== options2 || $3[9] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Select, {
      options: options2,
      onChange: onSelect,
      onCancel: t3,
      onUpFromFirstItem: focusHeader,
      isDisabled: headerFocused
    }, void 0, !1, void 0, this), $3[5] = focusHeader, $3[6] = headerFocused, $3[7] = onSelect, $3[8] = options2, $3[9] = t3, $3[10] = t4;
  else
    t4 = $3[10];
  let t5;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: "Auto-allow mode:"
        }, void 0, !1, void 0, this),
        " ",
        "Commands will try to run in the sandbox automatically, and attempts to run outside of the sandbox fallback to regular permissions. Explicit ask/deny rules are always respected."
      ]
    }, void 0, !0, void 0, this), $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      gap: 1,
      children: [
        t5,
        /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Learn more:",
            " ",
            /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(Link, {
              url: "https://code.claude.com/docs/en/sandboxing",
              children: "code.claude.com/docs/en/sandboxing"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[12] = t6;
  else
    t6 = $3[12];
  let t7;
  if ($3[13] !== t1 || $3[14] !== t4)
    t7 = /* @__PURE__ */ jsx_dev_runtime343.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      children: [
        t1,
        t2,
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[13] = t1, $3[14] = t4, $3[15] = t7;
  else
    t7 = $3[15];
  return t7;
}
var import_compiler_runtime270, jsx_dev_runtime343;
var init_SandboxSettings = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_sandbox_adapter();
  init_settings2();
  init_select();
  init_Pane();
  init_Tabs();
  init_SandboxConfigTab();
  init_SandboxDependenciesTab();
  init_SandboxOverridesTab();
  import_compiler_runtime270 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime343 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
