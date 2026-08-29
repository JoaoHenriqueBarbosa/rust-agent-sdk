// function: IDEScreen
function IDEScreen(t0) {
  let $3 = import_compiler_runtime167.c(39), {
    availableIDEs,
    unavailableIDEs,
    selectedIDE,
    onClose,
    onSelect
  } = t0, t1;
  if ($3[0] !== selectedIDE?.port)
    t1 = selectedIDE?.port?.toString() ?? "None", $3[0] = selectedIDE?.port, $3[1] = t1;
  else
    t1 = $3[1];
  let [selectedValue, setSelectedValue] = import_react115.useState(t1), [showAutoConnectDialog, setShowAutoConnectDialog] = import_react115.useState(!1), [showDisableAutoConnectDialog, setShowDisableAutoConnectDialog] = import_react115.useState(!1), t2;
  if ($3[2] !== availableIDEs || $3[3] !== onSelect)
    t2 = (value) => {
      if (value !== "None" && shouldShowAutoConnectDialog())
        setShowAutoConnectDialog(!0);
      else if (value === "None" && shouldShowDisableAutoConnectDialog())
        setShowDisableAutoConnectDialog(!0);
      else
        onSelect(availableIDEs.find((ide) => ide.port === parseInt(value)));
    }, $3[2] = availableIDEs, $3[3] = onSelect, $3[4] = t2;
  else
    t2 = $3[4];
  let handleSelectIDE = t2, t3;
  if ($3[5] !== availableIDEs)
    t3 = availableIDEs.reduce(_temp97, {}), $3[5] = availableIDEs, $3[6] = t3;
  else
    t3 = $3[6];
  let ideCounts = t3, t4;
  if ($3[7] !== availableIDEs || $3[8] !== ideCounts) {
    let t52;
    if ($3[10] !== ideCounts)
      t52 = (ide_1) => {
        let showWorkspace = (ideCounts[ide_1.name] || 0) > 1 && ide_1.workspaceFolders.length > 0;
        return {
          label: ide_1.name,
          value: ide_1.port.toString(),
          description: showWorkspace ? formatWorkspaceFolders(ide_1.workspaceFolders) : void 0
        };
      }, $3[10] = ideCounts, $3[11] = t52;
    else
      t52 = $3[11];
    t4 = availableIDEs.map(t52).concat([{
      label: "None",
      value: "None",
      description: void 0
    }]), $3[7] = availableIDEs, $3[8] = ideCounts, $3[9] = t4;
  } else
    t4 = $3[9];
  let options2 = t4;
  if (showAutoConnectDialog) {
    let t52;
    if ($3[12] !== handleSelectIDE || $3[13] !== selectedValue)
      t52 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(IdeAutoConnectDialog, {
        onComplete: () => handleSelectIDE(selectedValue)
      }, void 0, !1, void 0, this), $3[12] = handleSelectIDE, $3[13] = selectedValue, $3[14] = t52;
    else
      t52 = $3[14];
    return t52;
  }
  if (showDisableAutoConnectDialog) {
    let t52;
    if ($3[15] !== onSelect)
      t52 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(IdeDisableAutoConnectDialog, {
        onComplete: () => {
          onSelect(void 0);
        }
      }, void 0, !1, void 0, this), $3[15] = onSelect, $3[16] = t52;
    else
      t52 = $3[16];
    return t52;
  }
  let t5;
  if ($3[17] !== availableIDEs.length)
    t5 = availableIDEs.length === 0 && /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedText, {
      dimColor: !0,
      children: isSupportedJetBrainsTerminal() ? `No available IDEs detected. Please install the plugin and restart your IDE:
https://docs.claude.com/s/claude-code-jetbrains` : "No available IDEs detected. Make sure your IDE has the Claude Code extension or plugin installed and is running."
    }, void 0, !1, void 0, this), $3[17] = availableIDEs.length, $3[18] = t5;
  else
    t5 = $3[18];
  let t6;
  if ($3[19] !== availableIDEs.length || $3[20] !== handleSelectIDE || $3[21] !== options2 || $3[22] !== selectedValue)
    t6 = availableIDEs.length !== 0 && /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(Select, {
      defaultValue: selectedValue,
      defaultFocusValue: selectedValue,
      options: options2,
      onChange: (value_0) => {
        setSelectedValue(value_0), handleSelectIDE(value_0);
      }
    }, void 0, !1, void 0, this), $3[19] = availableIDEs.length, $3[20] = handleSelectIDE, $3[21] = options2, $3[22] = selectedValue, $3[23] = t6;
  else
    t6 = $3[23];
  let t7;
  if ($3[24] !== availableIDEs)
    t7 = availableIDEs.length !== 0 && availableIDEs.some(_temp231) && /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedText, {
        color: "warning",
        children: "Note: Only one Claude Code instance can be connected to VS Code at a time."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[24] = availableIDEs, $3[25] = t7;
  else
    t7 = $3[25];
  let t8;
  if ($3[26] !== availableIDEs.length)
    t8 = availableIDEs.length !== 0 && !isSupportedTerminal() && /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Tip: You can enable auto-connect to IDE in /config or with the --ide flag"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[26] = availableIDEs.length, $3[27] = t8;
  else
    t8 = $3[27];
  let t9;
  if ($3[28] !== unavailableIDEs)
    t9 = unavailableIDEs.length > 0 && /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Found ",
            unavailableIDEs.length,
            " other running IDE(s). However, their workspace/project directories do not match the current cwd."
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          flexDirection: "column",
          children: unavailableIDEs.map(_temp323)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[28] = unavailableIDEs, $3[29] = t9;
  else
    t9 = $3[29];
  let t10;
  if ($3[30] !== t5 || $3[31] !== t6 || $3[32] !== t7 || $3[33] !== t8 || $3[34] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t5,
        t6,
        t7,
        t8,
        t9
      ]
    }, void 0, !0, void 0, this), $3[30] = t5, $3[31] = t6, $3[32] = t7, $3[33] = t8, $3[34] = t9, $3[35] = t10;
  else
    t10 = $3[35];
  let t11;
  if ($3[36] !== onClose || $3[37] !== t10)
    t11 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(Dialog, {
      title: "Select IDE",
      subtitle: "Connect to an IDE for integrated development features.",
      onCancel: onClose,
      color: "ide",
      children: t10
    }, void 0, !1, void 0, this), $3[36] = onClose, $3[37] = t10, $3[38] = t11;
  else
    t11 = $3[38];
  return t11;
}
