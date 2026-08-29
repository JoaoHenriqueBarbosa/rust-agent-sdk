// Original: src/components/sandbox/SandboxOverridesTab.tsx
function SandboxOverridesTab(t0) {
  let $3 = import_compiler_runtime269.c(5), {
    onComplete
  } = t0, isEnabled2 = SandboxManager2.isSandboxingEnabled(), isLocked = SandboxManager2.areSandboxSettingsLockedByPolicy(), currentAllowUnsandboxed = SandboxManager2.areUnsandboxedCommandsAllowed();
  if (!isEnabled2) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingY: 1,
        children: /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
          color: "subtle",
          children: "Sandbox is not enabled. Enable sandbox to configure override settings."
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  if (isLocked) {
    let t12;
    if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
        color: "subtle",
        children: "Override settings are managed by a higher-priority configuration and cannot be changed locally."
      }, void 0, !1, void 0, this), $3[1] = t12;
    else
      t12 = $3[1];
    let t2;
    if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
      t2 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingY: 1,
        children: [
          t12,
          /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Current setting:",
                " ",
                currentAllowUnsandboxed ? "Allow unsandboxed fallback" : "Strict sandbox mode"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[2] = t2;
    else
      t2 = $3[2];
    return t2;
  }
  let t1;
  if ($3[3] !== onComplete)
    t1 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(OverridesSelect, {
      onComplete,
      currentMode: currentAllowUnsandboxed ? "open" : "closed"
    }, void 0, !1, void 0, this), $3[3] = onComplete, $3[4] = t1;
  else
    t1 = $3[4];
  return t1;
}
function OverridesSelect(t0) {
  let $3 = import_compiler_runtime269.c(25), {
    onComplete,
    currentMode
  } = t0, [theme2] = useTheme(), {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), t1;
  if ($3[0] !== theme2)
    t1 = color("success", theme2)("(current)"), $3[0] = theme2, $3[1] = t1;
  else
    t1 = $3[1];
  let currentIndicator = t1, t2 = currentMode === "open" ? `Allow unsandboxed fallback ${currentIndicator}` : "Allow unsandboxed fallback", t3;
  if ($3[2] !== t2)
    t3 = {
      label: t2,
      value: "open"
    }, $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  let t4 = currentMode === "closed" ? `Strict sandbox mode ${currentIndicator}` : "Strict sandbox mode", t5;
  if ($3[4] !== t4)
    t5 = {
      label: t4,
      value: "closed"
    }, $3[4] = t4, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== t3 || $3[7] !== t5)
    t6 = [t3, t5], $3[6] = t3, $3[7] = t5, $3[8] = t6;
  else
    t6 = $3[8];
  let options2 = t6, t7;
  if ($3[9] !== onComplete)
    t7 = async function(value) {
      let mode = value;
      await SandboxManager2.setSandboxSettings({
        allowUnsandboxedCommands: mode === "open"
      }), onComplete(mode === "open" ? "\u2713 Unsandboxed fallback allowed - commands can run outside sandbox when necessary" : "\u2713 Strict sandbox mode - all commands must run in sandbox or be excluded via the `excludedCommands` option");
    }, $3[9] = onComplete, $3[10] = t7;
  else
    t7 = $3[10];
  let handleSelect = t7, t8;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
        bold: !0,
        children: "Configure Overrides:"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[11] = t8;
  else
    t8 = $3[11];
  let t9;
  if ($3[12] !== onComplete)
    t9 = () => onComplete(void 0, {
      display: "skip"
    }), $3[12] = onComplete, $3[13] = t9;
  else
    t9 = $3[13];
  let t10;
  if ($3[14] !== focusHeader || $3[15] !== handleSelect || $3[16] !== headerFocused || $3[17] !== options2 || $3[18] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(Select, {
      options: options2,
      onChange: handleSelect,
      onCancel: t9,
      onUpFromFirstItem: focusHeader,
      isDisabled: headerFocused
    }, void 0, !1, void 0, this), $3[14] = focusHeader, $3[15] = handleSelect, $3[16] = headerFocused, $3[17] = options2, $3[18] = t9, $3[19] = t10;
  else
    t10 = $3[19];
  let t11;
  if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: "Allow unsandboxed fallback:"
        }, void 0, !1, void 0, this),
        " ",
        "When a command fails due to sandbox restrictions, Claude can retry with dangerouslyDisableSandbox to run outside the sandbox (falling back to default permissions)."
      ]
    }, void 0, !0, void 0, this), $3[20] = t11;
  else
    t11 = $3[20];
  let t12;
  if ($3[21] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
          bold: !0,
          dimColor: !0,
          children: "Strict sandbox mode:"
        }, void 0, !1, void 0, this),
        " ",
        "All bash commands invoked by the model must run in the sandbox unless they are explicitly listed in excludedCommands."
      ]
    }, void 0, !0, void 0, this), $3[21] = t12;
  else
    t12 = $3[21];
  let t13;
  if ($3[22] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      gap: 1,
      children: [
        t11,
        t12,
        /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Learn more:",
            " ",
            /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(Link, {
              url: "https://code.claude.com/docs/en/sandboxing#configure-sandboxing",
              children: "code.claude.com/docs/en/sandboxing#configure-sandboxing"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[22] = t13;
  else
    t13 = $3[22];
  let t14;
  if ($3[23] !== t10)
    t14 = /* @__PURE__ */ jsx_dev_runtime342.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingY: 1,
      children: [
        t8,
        t10,
        t13
      ]
    }, void 0, !0, void 0, this), $3[23] = t10, $3[24] = t14;
  else
    t14 = $3[24];
  return t14;
}
var import_compiler_runtime269, jsx_dev_runtime342;
var init_SandboxOverridesTab = __esm(() => {
  init_ink2();
  init_sandbox_adapter();
  init_select();
  init_Tabs();
  import_compiler_runtime269 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime342 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
