// Original: src/components/mcp/MCPStdioServerMenu.tsx
function MCPStdioServerMenu({
  server,
  serverToolsCount,
  onViewTools,
  onCancel,
  onComplete,
  borderless = !1
}) {
  let [theme] = useTheme(), exitState = useExitOnCtrlCDWithKeybindings(), mcp = useAppState((s2) => s2.mcp), reconnectMcpServer = useMcpReconnect(), toggleMcpServer = useMcpToggleEnabled(), [isReconnecting, setIsReconnecting] = import_react128.useState(!1), handleToggleEnabled = import_react128.default.useCallback(async () => {
    let wasEnabled = server.client.type !== "disabled";
    try {
      await toggleMcpServer(server.name), onCancel();
    } catch (err2) {
      onComplete(`Failed to ${wasEnabled ? "disable" : "enable"} MCP server '${server.name}': ${errorMessage(err2)}`);
    }
  }, [server.client.type, server.name, toggleMcpServer, onCancel, onComplete]), capitalizedServerName = capitalize(String(server.name)), serverCommandsCount = filterMcpPromptsByServer(mcp.commands, server.name).length, menuOptions = [];
  if (server.client.type !== "disabled" && serverToolsCount > 0)
    menuOptions.push({
      label: "View tools",
      value: "tools"
    });
  if (server.client.type !== "disabled")
    menuOptions.push({
      label: "Reconnect",
      value: "reconnectMcpServer"
    });
  if (menuOptions.push({
    label: server.client.type !== "disabled" ? "Disable" : "Enable",
    value: "toggle-enabled"
  }), menuOptions.length === 0)
    menuOptions.push({
      label: "Back",
      value: "back"
    });
  if (isReconnecting)
    return /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
          color: "text",
          children: [
            "Reconnecting to ",
            /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
              bold: !0,
              children: server.name
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
              children: " Restarting MCP server process"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "This may take a few moments."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: borderless ? void 0 : "round",
        children: [
          /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
            marginBottom: 1,
            children: /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                capitalizedServerName,
                " MCP Server"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            gap: 0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Status: "
                  }, void 0, !1, void 0, this),
                  server.client.type === "disabled" ? /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    children: [
                      color("inactive", theme)(figures_default.radioOff),
                      " disabled"
                    ]
                  }, void 0, !0, void 0, this) : server.client.type === "connected" ? /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    children: [
                      color("success", theme)(figures_default.tick),
                      " connected"
                    ]
                  }, void 0, !0, void 0, this) : server.client.type === "pending" ? /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(jsx_dev_runtime229.Fragment, {
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                        dimColor: !0,
                        children: figures_default.radioOff
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                        children: " connecting\u2026"
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    children: [
                      color("error", theme)(figures_default.cross),
                      " failed"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Command: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: server.config.command
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              server.config.args && server.config.args.length > 0 && /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Args: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: server.config.args.join(" ")
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Config location: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: describeMcpConfigFilePath(getMcpConfigByName(server.name)?.scope ?? "dynamic")
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              server.client.type === "connected" && /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(CapabilitiesSection, {
                serverToolsCount,
                serverPromptsCount: serverCommandsCount,
                serverResourcesCount: mcp.resources[server.name]?.length || 0
              }, void 0, !1, void 0, this),
              server.client.type === "connected" && serverToolsCount > 0 && /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Tools: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      serverToolsCount,
                      " tools"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          menuOptions.length > 0 && /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(Select, {
              options: menuOptions,
              onChange: async (value) => {
                if (value === "tools")
                  onViewTools();
                else if (value === "reconnectMcpServer") {
                  setIsReconnecting(!0);
                  try {
                    let result = await reconnectMcpServer(server.name), {
                      message
                    } = handleReconnectResult(result, server.name);
                    onComplete?.(message);
                  } catch (err_0) {
                    onComplete?.(handleReconnectError(err_0, server.name));
                  } finally {
                    setIsReconnecting(!1);
                  }
                } else if (value === "toggle-enabled")
                  await handleToggleEnabled();
                else if (value === "back")
                  onCancel();
              },
              onCancel
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(jsx_dev_runtime229.Fragment, {
            children: [
              "Press ",
              exitState.keyName,
              " again to exit"
            ]
          }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2191\u2193",
                action: "navigate"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "select"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime229.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "back"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_react128, jsx_dev_runtime229;
var init_MCPStdioServerMenu = __esm(() => {
  init_figures();
  init_useExitOnCtrlCDWithKeybindings();
  init_ink2();
  init_config8();
  init_MCPConnectionManager();
  init_utils7();
  init_AppState();
  init_errors();
  init_ConfigurableShortcutHint();
  init_CustomSelect();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Spinner2();
  init_CapabilitiesSection();
  import_react128 = __toESM(require_react_development(), 1), jsx_dev_runtime229 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
