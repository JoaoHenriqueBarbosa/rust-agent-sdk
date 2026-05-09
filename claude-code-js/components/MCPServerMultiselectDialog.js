// Original: src/components/MCPServerMultiselectDialog.tsx
function MCPServerMultiselectDialog(t0) {
  let $3 = import_compiler_runtime363.c(21), {
    serverNames,
    onDone
  } = t0, t1;
  if ($3[0] !== onDone || $3[1] !== serverNames)
    t1 = function(selectedServers) {
      let currentSettings = getSettings_DEPRECATED() || {}, enabledServers = currentSettings.enabledMcpjsonServers || [], disabledServers = currentSettings.disabledMcpjsonServers || [], [approvedServers, rejectedServers] = partition_default(serverNames, (server) => selectedServers.includes(server));
      if (logEvent("tengu_mcp_multidialog_choice", {
        approved: approvedServers.length,
        rejected: rejectedServers.length
      }), approvedServers.length > 0) {
        let newEnabledServers = [.../* @__PURE__ */ new Set([...enabledServers, ...approvedServers])];
        updateSettingsForSource("localSettings", {
          enabledMcpjsonServers: newEnabledServers
        });
      }
      if (rejectedServers.length > 0) {
        let newDisabledServers = [.../* @__PURE__ */ new Set([...disabledServers, ...rejectedServers])];
        updateSettingsForSource("localSettings", {
          disabledMcpjsonServers: newDisabledServers
        });
      }
      onDone();
    }, $3[0] = onDone, $3[1] = serverNames, $3[2] = t1;
  else
    t1 = $3[2];
  let onSubmit = t1, t2;
  if ($3[3] !== onDone || $3[4] !== serverNames)
    t2 = () => {
      let disabledServers_0 = (getSettings_DEPRECATED() || {}).disabledMcpjsonServers || [], newDisabledServers_0 = [.../* @__PURE__ */ new Set([...disabledServers_0, ...serverNames])];
      updateSettingsForSource("localSettings", {
        disabledMcpjsonServers: newDisabledServers_0
      }), onDone();
    }, $3[3] = onDone, $3[4] = serverNames, $3[5] = t2;
  else
    t2 = $3[5];
  let handleEscRejectAll = t2, t3 = `${serverNames.length} new MCP servers found in .mcp.json`, t4;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(MCPServerDialogCopy, {}, void 0, !1, void 0, this), $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== serverNames)
    t5 = serverNames.map(_temp301), $3[7] = serverNames, $3[8] = t5;
  else
    t5 = $3[8];
  let t6;
  if ($3[9] !== handleEscRejectAll || $3[10] !== onSubmit || $3[11] !== serverNames || $3[12] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(SelectMulti, {
      options: t5,
      defaultValue: serverNames,
      onSubmit,
      onCancel: handleEscRejectAll,
      hideIndexes: !0
    }, void 0, !1, void 0, this), $3[9] = handleEscRejectAll, $3[10] = onSubmit, $3[11] = serverNames, $3[12] = t5, $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== handleEscRejectAll || $3[15] !== t3 || $3[16] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(Dialog, {
      title: t3,
      subtitle: "Select any you wish to enable.",
      color: "warning",
      onCancel: handleEscRejectAll,
      hideInputGuide: !0,
      children: [
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[14] = handleEscRejectAll, $3[15] = t3, $3[16] = t6, $3[17] = t7;
  else
    t7 = $3[17];
  let t8;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(ThemedBox_default, {
      paddingX: 1,
      children: /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Space",
              action: "select"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Enter",
              action: "confirm"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "reject all"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[18] = t8;
  else
    t8 = $3[18];
  let t9;
  if ($3[19] !== t7)
    t9 = /* @__PURE__ */ jsx_dev_runtime462.jsxDEV(jsx_dev_runtime462.Fragment, {
      children: [
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[19] = t7, $3[20] = t9;
  else
    t9 = $3[20];
  return t9;
}
function _temp301(server_0) {
  return {
    label: server_0,
    value: server_0
  };
}
var import_compiler_runtime363, jsx_dev_runtime462;
var init_MCPServerMultiselectDialog = __esm(() => {
  init_partition();
  init_ink2();
  init_settings2();
  init_ConfigurableShortcutHint();
  init_SelectMulti();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_MCPServerDialogCopy();
  import_compiler_runtime363 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime462 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
