// function: MCPServerDesktopImportDialog
function MCPServerDesktopImportDialog(t0) {
  let $3 = import_compiler_runtime379.c(36), {
    servers,
    scope,
    onDone
  } = t0, t1;
  if ($3[0] !== servers)
    t1 = Object.keys(servers), $3[0] = servers, $3[1] = t1;
  else
    t1 = $3[1];
  let serverNames = t1, t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {}, $3[2] = t2;
  else
    t2 = $3[2];
  let [existingServers, setExistingServers] = import_react317.useState(t2), t3, t4;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = () => {
      getAllMcpConfigs().then((t52) => {
        let {
          servers: servers_0
        } = t52;
        return setExistingServers(servers_0);
      });
    }, t4 = [], $3[3] = t3, $3[4] = t4;
  else
    t3 = $3[3], t4 = $3[4];
  import_react317.useEffect(t3, t4);
  let t5;
  if ($3[5] !== existingServers || $3[6] !== serverNames)
    t5 = serverNames.filter((name3) => existingServers[name3] !== void 0), $3[5] = existingServers, $3[6] = serverNames, $3[7] = t5;
  else
    t5 = $3[7];
  let collisions = t5, onSubmit = async function(selectedServers) {
    let importedCount = 0;
    for (let serverName of selectedServers) {
      let serverConfig = servers[serverName];
      if (serverConfig) {
        let finalName = serverName;
        if (existingServers[finalName] !== void 0) {
          let counter = 1;
          while (existingServers[`${serverName}_${counter}`] !== void 0)
            counter++;
          finalName = `${serverName}_${counter}`;
        }
        await addMcpConfig(finalName, serverConfig, scope), importedCount++;
      }
    }
    done(importedCount);
  }, [theme2] = useTheme(), t6;
  if ($3[8] !== onDone || $3[9] !== scope || $3[10] !== theme2)
    t6 = (importedCount_0) => {
      if (importedCount_0 > 0)
        writeToStdout(`
${color("success", theme2)(`Successfully imported ${importedCount_0} MCP ${plural(importedCount_0, "server")} to ${scope} config.`)}
`);
      else
        writeToStdout(`
No servers were imported.`);
      onDone(), gracefulShutdown();
    }, $3[8] = onDone, $3[9] = scope, $3[10] = theme2, $3[11] = t6;
  else
    t6 = $3[11];
  let done = t6, t7;
  if ($3[12] !== done)
    t7 = () => {
      done(0);
    }, $3[12] = done, $3[13] = t7;
  else
    t7 = $3[13];
  let handleEscCancel = t7, t8 = serverNames.length, t9;
  if ($3[14] !== serverNames.length)
    t9 = plural(serverNames.length, "server"), $3[14] = serverNames.length, $3[15] = t9;
  else
    t9 = $3[15];
  let t10 = `Found ${t8} MCP ${t9} in Claude Desktop.`, t11;
  if ($3[16] !== collisions.length)
    t11 = collisions.length > 0 && /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(ThemedText, {
      color: "warning",
      children: "Note: Some servers already exist with the same name. If selected, they will be imported with a numbered suffix."
    }, void 0, !1, void 0, this), $3[16] = collisions.length, $3[17] = t11;
  else
    t11 = $3[17];
  let t12;
  if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(ThemedText, {
      children: "Please select the servers you want to import:"
    }, void 0, !1, void 0, this), $3[18] = t12;
  else
    t12 = $3[18];
  let t13, t14;
  if ($3[19] !== collisions || $3[20] !== serverNames)
    t13 = serverNames.map((server) => ({
      label: `${server}${collisions.includes(server) ? " (already exists)" : ""}`,
      value: server
    })), t14 = serverNames.filter((name_0) => !collisions.includes(name_0)), $3[19] = collisions, $3[20] = serverNames, $3[21] = t13, $3[22] = t14;
  else
    t13 = $3[21], t14 = $3[22];
  let t15;
  if ($3[23] !== handleEscCancel || $3[24] !== onSubmit || $3[25] !== t13 || $3[26] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(SelectMulti, {
      options: t13,
      defaultValue: t14,
      onSubmit,
      onCancel: handleEscCancel,
      hideIndexes: !0
    }, void 0, !1, void 0, this), $3[23] = handleEscCancel, $3[24] = onSubmit, $3[25] = t13, $3[26] = t14, $3[27] = t15;
  else
    t15 = $3[27];
  let t16;
  if ($3[28] !== handleEscCancel || $3[29] !== t10 || $3[30] !== t11 || $3[31] !== t15)
    t16 = /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(Dialog, {
      title: "Import MCP Servers from Claude Desktop",
      subtitle: t10,
      color: "success",
      onCancel: handleEscCancel,
      hideInputGuide: !0,
      children: [
        t11,
        t12,
        t15
      ]
    }, void 0, !0, void 0, this), $3[28] = handleEscCancel, $3[29] = t10, $3[30] = t11, $3[31] = t15, $3[32] = t16;
  else
    t16 = $3[32];
  let t17;
  if ($3[33] === Symbol.for("react.memo_cache_sentinel"))
    t17 = /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(ThemedBox_default, {
      paddingX: 1,
      children: /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Space",
              action: "select"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Enter",
              action: "confirm"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "cancel"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[33] = t17;
  else
    t17 = $3[33];
  let t18;
  if ($3[34] !== t16)
    t18 = /* @__PURE__ */ jsx_dev_runtime481.jsxDEV(jsx_dev_runtime481.Fragment, {
      children: [
        t16,
        t17
      ]
    }, void 0, !0, void 0, this), $3[34] = t16, $3[35] = t18;
  else
    t18 = $3[35];
  return t18;
}
