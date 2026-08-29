// Original: src/components/MCPServerApprovalDialog.tsx
function MCPServerApprovalDialog(t0) {
  let $3 = import_compiler_runtime362.c(13), {
    serverName,
    onDone
  } = t0, t1;
  if ($3[0] !== onDone || $3[1] !== serverName)
    t1 = function(value) {
      logEvent("tengu_mcp_dialog_choice", {
        choice: value
      });
      bb2:
        switch (value) {
          case "yes":
          case "yes_all": {
            let enabledServers = (getSettings_DEPRECATED() || {}).enabledMcpjsonServers || [];
            if (!enabledServers.includes(serverName))
              updateSettingsForSource("localSettings", {
                enabledMcpjsonServers: [...enabledServers, serverName]
              });
            if (value === "yes_all")
              updateSettingsForSource("localSettings", {
                enableAllProjectMcpServers: !0
              });
            onDone();
            break bb2;
          }
          case "no": {
            let disabledServers = (getSettings_DEPRECATED() || {}).disabledMcpjsonServers || [];
            if (!disabledServers.includes(serverName))
              updateSettingsForSource("localSettings", {
                disabledMcpjsonServers: [...disabledServers, serverName]
              });
            onDone();
          }
        }
    }, $3[0] = onDone, $3[1] = serverName, $3[2] = t1;
  else
    t1 = $3[2];
  let onChange = t1, t2 = `New MCP server found in .mcp.json: ${serverName}`, t3;
  if ($3[3] !== onChange)
    t3 = () => onChange("no"), $3[3] = onChange, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime461.jsxDEV(MCPServerDialogCopy, {}, void 0, !1, void 0, this), $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
    t5 = [{
      label: "Use this and all future MCP servers in this project",
      value: "yes_all"
    }, {
      label: "Use this MCP server",
      value: "yes"
    }, {
      label: "Continue without using this MCP server",
      value: "no"
    }], $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] !== onChange)
    t6 = /* @__PURE__ */ jsx_dev_runtime461.jsxDEV(Select, {
      options: t5,
      onChange: (value_0) => onChange(value_0),
      onCancel: () => onChange("no")
    }, void 0, !1, void 0, this), $3[7] = onChange, $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== t2 || $3[10] !== t3 || $3[11] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime461.jsxDEV(Dialog, {
      title: t2,
      color: "warning",
      onCancel: t3,
      children: [
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[9] = t2, $3[10] = t3, $3[11] = t6, $3[12] = t7;
  else
    t7 = $3[12];
  return t7;
}
var import_compiler_runtime362, jsx_dev_runtime461;
var init_MCPServerApprovalDialog = __esm(() => {
  init_settings2();
  init_CustomSelect();
  init_Dialog();
  init_MCPServerDialogCopy();
  import_compiler_runtime362 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime461 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
