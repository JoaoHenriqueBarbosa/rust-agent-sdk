// Original: src/components/HelpV2/HelpV2.tsx
function HelpV2(t0) {
  let $3 = import_compiler_runtime165.c(44), {
    onClose,
    commands: commands7
  } = t0, {
    rows,
    columns
  } = useTerminalSize(), maxHeight = Math.floor(rows / 2), insideModal = useIsInsideModal(), t1;
  if ($3[0] !== onClose)
    t1 = () => onClose("Help dialog dismissed", {
      display: "system"
    }), $3[0] = onClose, $3[1] = t1;
  else
    t1 = $3[1];
  let close = t1, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      context: "Help"
    }, $3[2] = t2;
  else
    t2 = $3[2];
  useKeybinding("help:dismiss", close, t2);
  let exitState = useExitOnCtrlCDWithKeybindings(close), dismissShortcut = useShortcutDisplay("help:dismiss", "Help", "esc"), antOnlyCommands, builtinCommands, t3;
  if ($3[3] !== commands7) {
    let builtinNames = builtInCommandNames();
    builtinCommands = commands7.filter((cmd) => builtinNames.has(cmd.name) && !cmd.isHidden);
    let t42;
    if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
      t42 = [], $3[7] = t42;
    else
      t42 = $3[7];
    antOnlyCommands = t42, t3 = commands7.filter((cmd_2) => !builtinNames.has(cmd_2.name) && !cmd_2.isHidden), $3[3] = commands7, $3[4] = antOnlyCommands, $3[5] = builtinCommands, $3[6] = t3;
  } else
    antOnlyCommands = $3[4], builtinCommands = $3[5], t3 = $3[6];
  let customCommands = t3, t4;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Tab, {
      title: "general",
      children: /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(General, {}, void 0, !1, void 0, this)
    }, "general", !1, void 0, this), $3[8] = t4;
  else
    t4 = $3[8];
  let tabs;
  if ($3[9] !== antOnlyCommands || $3[10] !== builtinCommands || $3[11] !== close || $3[12] !== columns || $3[13] !== customCommands || $3[14] !== maxHeight) {
    tabs = [t4];
    let t52;
    if ($3[16] !== builtinCommands || $3[17] !== close || $3[18] !== columns || $3[19] !== maxHeight)
      t52 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Tab, {
        title: "commands",
        children: /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Commands, {
          commands: builtinCommands,
          maxHeight,
          columns,
          title: "Browse default commands:",
          onCancel: close
        }, void 0, !1, void 0, this)
      }, "commands", !1, void 0, this), $3[16] = builtinCommands, $3[17] = close, $3[18] = columns, $3[19] = maxHeight, $3[20] = t52;
    else
      t52 = $3[20];
    tabs.push(t52);
    let t62;
    if ($3[21] !== close || $3[22] !== columns || $3[23] !== customCommands || $3[24] !== maxHeight)
      t62 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Tab, {
        title: "custom-commands",
        children: /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Commands, {
          commands: customCommands,
          maxHeight,
          columns,
          title: "Browse custom commands:",
          emptyMessage: "No custom commands found",
          onCancel: close
        }, void 0, !1, void 0, this)
      }, "custom", !1, void 0, this), $3[21] = close, $3[22] = columns, $3[23] = customCommands, $3[24] = maxHeight, $3[25] = t62;
    else
      t62 = $3[25];
    tabs.push(t62), $3[9] = antOnlyCommands, $3[10] = builtinCommands, $3[11] = close, $3[12] = columns, $3[13] = customCommands, $3[14] = maxHeight, $3[15] = tabs;
  } else
    tabs = $3[15];
  let t5 = insideModal ? void 0 : maxHeight, t6;
  if ($3[31] !== tabs)
    t6 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Tabs, {
      title: "Claude Code v2.1.90",
      color: "professionalBlue",
      defaultTab: "general",
      children: tabs
    }, void 0, !1, void 0, this), $3[31] = tabs, $3[32] = t6;
  else
    t6 = $3[32];
  let t7;
  if ($3[33] === Symbol.for("react.memo_cache_sentinel"))
    t7 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(ThemedText, {
        children: [
          "For more help:",
          " ",
          /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Link, {
            url: "https://code.claude.com/docs/en/overview"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[33] = t7;
  else
    t7 = $3[33];
  let t8;
  if ($3[34] !== dismissShortcut || $3[35] !== exitState.keyName || $3[36] !== exitState.pending)
    t8 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(ThemedText, {
        dimColor: !0,
        children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(jsx_dev_runtime206.Fragment, {
          children: [
            "Press ",
            exitState.keyName,
            " again to exit"
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(ThemedText, {
          italic: !0,
          children: [
            dismissShortcut,
            " to cancel"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[34] = dismissShortcut, $3[35] = exitState.keyName, $3[36] = exitState.pending, $3[37] = t8;
  else
    t8 = $3[37];
  let t9;
  if ($3[38] !== t6 || $3[39] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(Pane, {
      color: "professionalBlue",
      children: [
        t6,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[38] = t6, $3[39] = t8, $3[40] = t9;
  else
    t9 = $3[40];
  let t10;
  if ($3[41] !== t5 || $3[42] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime206.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      height: t5,
      children: t9
    }, void 0, !1, void 0, this), $3[41] = t5, $3[42] = t9, $3[43] = t10;
  else
    t10 = $3[43];
  return t10;
}
var import_compiler_runtime165, jsx_dev_runtime206;
var init_HelpV2 = __esm(() => {
  init_useExitOnCtrlCDWithKeybindings();
  init_useShortcutDisplay();
  init_commands5();
  init_modalContext();
  init_useTerminalSize();
  init_ink2();
  init_useKeybinding();
  init_Pane();
  init_Tabs();
  init_Commands();
  init_General();
  import_compiler_runtime165 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime206 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
