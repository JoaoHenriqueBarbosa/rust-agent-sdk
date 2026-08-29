// function: MCPListPanel
function MCPListPanel(t0) {
  let $3 = import_compiler_runtime179.c(78), {
    servers,
    agentServers: t1,
    onSelectServer,
    onSelectAgentServer,
    onComplete
  } = t0, t2;
  if ($3[0] !== t1)
    t2 = t1 === void 0 ? [] : t1, $3[0] = t1, $3[1] = t2;
  else
    t2 = $3[1];
  let agentServers = t2, [theme] = useTheme(), [selectedIndex, setSelectedIndex] = import_react123.useState(0), t3;
  if ($3[2] !== servers) {
    let regularServers = servers.filter(_temp101);
    t3 = groupServersByScope(regularServers), $3[2] = servers, $3[3] = t3;
  } else
    t3 = $3[3];
  let serversByScope = t3, t4;
  if ($3[4] !== servers)
    t4 = servers.filter(_temp235).sort(_temp324), $3[4] = servers, $3[5] = t4;
  else
    t4 = $3[5];
  let claudeAiServers = t4, t5;
  if ($3[6] !== serversByScope)
    t5 = (serversByScope.get("dynamic") ?? []).sort(_temp421), $3[6] = serversByScope, $3[7] = t5;
  else
    t5 = $3[7];
  let dynamicServers = t5, t6;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t6 = getScopeHeading("dynamic"), $3[8] = t6;
  else
    t6 = $3[8];
  let dynamicHeading = t6, items;
  if ($3[9] !== agentServers || $3[10] !== claudeAiServers || $3[11] !== dynamicServers || $3[12] !== serversByScope) {
    items = [];
    for (let scope of SCOPE_ORDER) {
      let scopeServers = serversByScope.get(scope) ?? [];
      for (let server of scopeServers)
        items.push({
          type: "server",
          server
        });
    }
    for (let server_0 of claudeAiServers)
      items.push({
        type: "server",
        server: server_0
      });
    for (let agentServer of agentServers)
      items.push({
        type: "agent-server",
        agentServer
      });
    for (let server_1 of dynamicServers)
      items.push({
        type: "server",
        server: server_1
      });
    $3[9] = agentServers, $3[10] = claudeAiServers, $3[11] = dynamicServers, $3[12] = serversByScope, $3[13] = items;
  } else
    items = $3[13];
  let selectableItems = items, t7;
  if ($3[14] !== onComplete)
    t7 = () => {
      onComplete("MCP dialog dismissed", {
        display: "system"
      });
    }, $3[14] = onComplete, $3[15] = t7;
  else
    t7 = $3[15];
  let handleCancel = t7, t8;
  if ($3[16] !== onSelectAgentServer || $3[17] !== onSelectServer || $3[18] !== selectableItems || $3[19] !== selectedIndex)
    t8 = () => {
      let item = selectableItems[selectedIndex];
      if (!item)
        return;
      if (item.type === "server")
        onSelectServer(item.server);
      else if (item.type === "agent-server" && onSelectAgentServer)
        onSelectAgentServer(item.agentServer);
    }, $3[16] = onSelectAgentServer, $3[17] = onSelectServer, $3[18] = selectableItems, $3[19] = selectedIndex, $3[20] = t8;
  else
    t8 = $3[20];
  let handleSelect = t8, t10, t9;
  if ($3[21] !== selectableItems)
    t9 = () => setSelectedIndex((prev) => prev === 0 ? selectableItems.length - 1 : prev - 1), t10 = () => setSelectedIndex((prev_0) => prev_0 === selectableItems.length - 1 ? 0 : prev_0 + 1), $3[21] = selectableItems, $3[22] = t10, $3[23] = t9;
  else
    t10 = $3[22], t9 = $3[23];
  let t11;
  if ($3[24] !== handleCancel || $3[25] !== handleSelect || $3[26] !== t10 || $3[27] !== t9)
    t11 = {
      "confirm:previous": t9,
      "confirm:next": t10,
      "confirm:yes": handleSelect,
      "confirm:no": handleCancel
    }, $3[24] = handleCancel, $3[25] = handleSelect, $3[26] = t10, $3[27] = t9, $3[28] = t11;
  else
    t11 = $3[28];
  let t12;
  if ($3[29] === Symbol.for("react.memo_cache_sentinel"))
    t12 = {
      context: "Confirmation"
    }, $3[29] = t12;
  else
    t12 = $3[29];
  useKeybindings(t11, t12);
  let t13;
  if ($3[30] !== selectableItems)
    t13 = (server_2) => selectableItems.findIndex((item_0) => item_0.type === "server" && item_0.server === server_2), $3[30] = selectableItems, $3[31] = t13;
  else
    t13 = $3[31];
  let getServerIndex = t13, t14;
  if ($3[32] !== selectableItems)
    t14 = (agentServer_0) => selectableItems.findIndex((item_1) => item_1.type === "agent-server" && item_1.agentServer === agentServer_0), $3[32] = selectableItems, $3[33] = t14;
  else
    t14 = $3[33];
  let getAgentServerIndex = t14, t15;
  if ($3[34] === Symbol.for("react.memo_cache_sentinel"))
    t15 = isDebugMode(), $3[34] = t15;
  else
    t15 = $3[34];
  let debugMode = t15, t16;
  if ($3[35] !== servers)
    t16 = servers.some(_temp516), $3[35] = servers, $3[36] = t16;
  else
    t16 = $3[36];
  let hasFailedClients = t16;
  if (servers.length === 0 && agentServers.length === 0)
    return null;
  let t17;
  if ($3[37] !== getServerIndex || $3[38] !== selectedIndex || $3[39] !== theme)
    t17 = (server_3) => {
      let index = getServerIndex(server_3), isSelected = selectedIndex === index, statusIcon, statusText;
      if (server_3.client.type === "disabled")
        statusIcon = color("inactive", theme)(figures_default.radioOff), statusText = "disabled";
      else if (server_3.client.type === "connected")
        statusIcon = color("success", theme)(figures_default.tick), statusText = "connected";
      else if (server_3.client.type === "pending") {
        statusIcon = color("inactive", theme)(figures_default.radioOff);
        let {
          reconnectAttempt,
          maxReconnectAttempts
        } = server_3.client;
        if (reconnectAttempt && maxReconnectAttempts)
          statusText = `reconnecting (${reconnectAttempt}/${maxReconnectAttempts})\u2026`;
        else
          statusText = "connecting\u2026";
      } else if (server_3.client.type === "needs-auth")
        statusIcon = color("warning", theme)(figures_default.triangleUpOutline), statusText = "needs authentication";
      else
        statusIcon = color("error", theme)(figures_default.cross), statusText = "failed";
      return /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            color: isSelected ? "suggestion" : void 0,
            children: isSelected ? `${figures_default.pointer} ` : "  "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            color: isSelected ? "suggestion" : void 0,
            children: server_3.name
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            dimColor: !isSelected,
            children: [
              " \xB7 ",
              statusIcon,
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            dimColor: !isSelected,
            children: statusText
          }, void 0, !1, void 0, this)
        ]
      }, `${server_3.name}-${index}`, !0, void 0, this);
    }, $3[37] = getServerIndex, $3[38] = selectedIndex, $3[39] = theme, $3[40] = t17;
  else
    t17 = $3[40];
  let renderServerItem = t17, t18;
  if ($3[41] !== getAgentServerIndex || $3[42] !== selectedIndex || $3[43] !== theme)
    t18 = (agentServer_1) => {
      let index_0 = getAgentServerIndex(agentServer_1), isSelected_0 = selectedIndex === index_0, statusIcon_0 = agentServer_1.needsAuth ? color("warning", theme)(figures_default.triangleUpOutline) : color("inactive", theme)(figures_default.radioOff), statusText_0 = agentServer_1.needsAuth ? "may need auth" : "agent-only";
      return /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            color: isSelected_0 ? "suggestion" : void 0,
            children: isSelected_0 ? `${figures_default.pointer} ` : "  "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            color: isSelected_0 ? "suggestion" : void 0,
            children: agentServer_1.name
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            dimColor: !isSelected_0,
            children: [
              " \xB7 ",
              statusIcon_0,
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            dimColor: !isSelected_0,
            children: statusText_0
          }, void 0, !1, void 0, this)
        ]
      }, `agent-${agentServer_1.name}-${index_0}`, !0, void 0, this);
    }, $3[41] = getAgentServerIndex, $3[42] = selectedIndex, $3[43] = theme, $3[44] = t18;
  else
    t18 = $3[44];
  let renderAgentServerItem = t18, totalServers = servers.length + agentServers.length, t19;
  if ($3[45] === Symbol.for("react.memo_cache_sentinel"))
    t19 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(McpParsingWarnings, {}, void 0, !1, void 0, this), $3[45] = t19;
  else
    t19 = $3[45];
  let t20;
  if ($3[46] !== totalServers)
    t20 = plural(totalServers, "server"), $3[46] = totalServers, $3[47] = t20;
  else
    t20 = $3[47];
  let t21 = `${totalServers} ${t20}`, t22;
  if ($3[48] !== renderServerItem || $3[49] !== serversByScope)
    t22 = SCOPE_ORDER.map((scope_0) => {
      let scopeServers_0 = serversByScope.get(scope_0);
      if (!scopeServers_0 || scopeServers_0.length === 0)
        return null;
      let heading2 = getScopeHeading(scope_0);
      return /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
            paddingLeft: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
                bold: !0,
                children: heading2.label
              }, void 0, !1, void 0, this),
              heading2.path && /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " (",
                  heading2.path,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          scopeServers_0.map((server_4) => renderServerItem(server_4))
        ]
      }, scope_0, !0, void 0, this);
    }), $3[48] = renderServerItem, $3[49] = serversByScope, $3[50] = t22;
  else
    t22 = $3[50];
  let t23;
  if ($3[51] !== claudeAiServers || $3[52] !== renderServerItem)
    t23 = claudeAiServers.length > 0 && /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
          paddingLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            bold: !0,
            children: "claude.ai"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        claudeAiServers.map((server_5) => renderServerItem(server_5))
      ]
    }, void 0, !0, void 0, this), $3[51] = claudeAiServers, $3[52] = renderServerItem, $3[53] = t23;
  else
    t23 = $3[53];
  let t24;
  if ($3[54] !== agentServers || $3[55] !== renderAgentServerItem)
    t24 = agentServers.length > 0 && /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
          paddingLeft: 2,
          children: /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
            bold: !0,
            children: "Agent MCPs"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        [...new Set(agentServers.flatMap(_temp613))].map((agentName) => /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
              paddingLeft: 2,
              children: /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "@",
                  agentName
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this),
            agentServers.filter((s_3) => s_3.sourceAgents.includes(agentName)).map((agentServer_2) => renderAgentServerItem(agentServer_2))
          ]
        }, agentName, !0, void 0, this))
      ]
    }, void 0, !0, void 0, this), $3[54] = agentServers, $3[55] = renderAgentServerItem, $3[56] = t24;
  else
    t24 = $3[56];
  let t25;
  if ($3[57] !== dynamicServers || $3[58] !== renderServerItem)
    t25 = dynamicServers.length > 0 && /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
          paddingLeft: 2,
          children: [
            /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
              bold: !0,
              children: dynamicHeading.label
            }, void 0, !1, void 0, this),
            dynamicHeading.path && /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                " (",
                dynamicHeading.path,
                ")"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        dynamicServers.map((server_6) => renderServerItem(server_6))
      ]
    }, void 0, !0, void 0, this), $3[57] = dynamicServers, $3[58] = renderServerItem, $3[59] = t25;
  else
    t25 = $3[59];
  let t26;
  if ($3[60] !== hasFailedClients)
    t26 = hasFailedClients && /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
      dimColor: !0,
      children: debugMode ? "\u203B Error logs shown inline with --debug" : "\u203B Run claude --debug to see error logs"
    }, void 0, !1, void 0, this), $3[60] = hasFailedClients, $3[61] = t26;
  else
    t26 = $3[61];
  let t27;
  if ($3[62] === Symbol.for("react.memo_cache_sentinel"))
    t27 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/mcp",
          children: "https://code.claude.com/docs/en/mcp"
        }, void 0, !1, void 0, this),
        " ",
        "for help"
      ]
    }, void 0, !0, void 0, this), $3[62] = t27;
  else
    t27 = $3[62];
  let t28;
  if ($3[63] !== t26)
    t28 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t26,
        t27
      ]
    }, void 0, !0, void 0, this), $3[63] = t26, $3[64] = t28;
  else
    t28 = $3[64];
  let t29;
  if ($3[65] !== t22 || $3[66] !== t23 || $3[67] !== t24 || $3[68] !== t25 || $3[69] !== t28)
    t29 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t22,
        t23,
        t24,
        t25,
        t28
      ]
    }, void 0, !0, void 0, this), $3[65] = t22, $3[66] = t23, $3[67] = t24, $3[68] = t25, $3[69] = t28, $3[70] = t29;
  else
    t29 = $3[70];
  let t30;
  if ($3[71] !== handleCancel || $3[72] !== t21 || $3[73] !== t29)
    t30 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(Dialog, {
      title: "Manage MCP servers",
      subtitle: t21,
      onCancel: handleCancel,
      hideInputGuide: !0,
      children: t29
    }, void 0, !1, void 0, this), $3[71] = handleCancel, $3[72] = t21, $3[73] = t29, $3[74] = t30;
  else
    t30 = $3[74];
  let t31;
  if ($3[75] === Symbol.for("react.memo_cache_sentinel"))
    t31 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      paddingX: 1,
      children: /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(Byline, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(KeyboardShortcutHint, {
              shortcut: "\u2191\u2193",
              action: "navigate"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(KeyboardShortcutHint, {
              shortcut: "Enter",
              action: "confirm"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ConfigurableShortcutHint, {
              action: "confirm:no",
              context: "Confirmation",
              fallback: "Esc",
              description: "cancel"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[75] = t31;
  else
    t31 = $3[75];
  let t32;
  if ($3[76] !== t30)
    t32 = /* @__PURE__ */ jsx_dev_runtime224.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t19,
        t30,
        t31
      ]
    }, void 0, !0, void 0, this), $3[76] = t30, $3[77] = t32;
  else
    t32 = $3[77];
  return t32;
}
