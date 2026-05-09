// function: MCPRemoteServerMenu
function MCPRemoteServerMenu({
  server,
  serverToolsCount,
  onViewTools,
  onCancel,
  onComplete,
  borderless = !1
}) {
  let [theme] = useTheme(), exitState = useExitOnCtrlCDWithKeybindings(), {
    columns: terminalColumns
  } = useTerminalSize(), [isAuthenticating, setIsAuthenticating] = import_react127.default.useState(!1), [error44, setError] = import_react127.default.useState(null), mcp = useAppState((s2) => s2.mcp), setAppState = useSetAppState(), [authorizationUrl, setAuthorizationUrl] = import_react127.default.useState(null), [isReconnecting, setIsReconnecting] = import_react127.useState(!1), authAbortControllerRef = import_react127.useRef(null), [isClaudeAIAuthenticating, setIsClaudeAIAuthenticating] = import_react127.useState(!1), [claudeAIAuthUrl, setClaudeAIAuthUrl] = import_react127.useState(null), [isClaudeAIClearingAuth, setIsClaudeAIClearingAuth] = import_react127.useState(!1), [claudeAIClearAuthUrl, setClaudeAIClearAuthUrl] = import_react127.useState(null), [claudeAIClearAuthBrowserOpened, setClaudeAIClearAuthBrowserOpened] = import_react127.useState(!1), [urlCopied, setUrlCopied] = import_react127.useState(!1), copyTimeoutRef = import_react127.useRef(void 0), unmountedRef = import_react127.useRef(!1), [callbackUrlInput, setCallbackUrlInput] = import_react127.useState(""), [callbackUrlCursorOffset, setCallbackUrlCursorOffset] = import_react127.useState(0), [manualCallbackSubmit, setManualCallbackSubmit] = import_react127.useState(null);
  import_react127.useEffect(() => () => {
    if (unmountedRef.current = !0, authAbortControllerRef.current?.abort(), copyTimeoutRef.current !== void 0)
      clearTimeout(copyTimeoutRef.current);
  }, []);
  let isEffectivelyAuthenticated = server.isAuthenticated || server.client.type === "connected" && serverToolsCount > 0, reconnectMcpServer = useMcpReconnect(), handleClaudeAIAuthComplete = import_react127.default.useCallback(async () => {
    setIsClaudeAIAuthenticating(!1), setClaudeAIAuthUrl(null), setIsReconnecting(!0);
    try {
      let result = await reconnectMcpServer(server.name), success2 = result.client.type === "connected";
      if (logEvent("tengu_claudeai_mcp_auth_completed", {
        success: success2
      }), success2)
        onComplete?.(`Authentication successful. Connected to ${server.name}.`);
      else if (result.client.type === "needs-auth")
        onComplete?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
      else
        onComplete?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.");
    } catch (err2) {
      logEvent("tengu_claudeai_mcp_auth_completed", {
        success: !1
      }), onComplete?.(handleReconnectError(err2, server.name));
    } finally {
      setIsReconnecting(!1);
    }
  }, [reconnectMcpServer, server.name, onComplete]), handleClaudeAIClearAuthComplete = import_react127.default.useCallback(async () => {
    await clearServerCache(server.name, {
      ...server.config,
      scope: server.scope
    }), setAppState((prev) => {
      let newClients = prev.mcp.clients.map((c3) => c3.name === server.name ? {
        ...c3,
        type: "needs-auth"
      } : c3), newTools = excludeToolsByServer(prev.mcp.tools, server.name), newCommands = excludeCommandsByServer(prev.mcp.commands, server.name), newResources = excludeResourcesByServer(prev.mcp.resources, server.name);
      return {
        ...prev,
        mcp: {
          ...prev.mcp,
          clients: newClients,
          tools: newTools,
          commands: newCommands,
          resources: newResources
        }
      };
    }), logEvent("tengu_claudeai_mcp_clear_auth_completed", {}), onComplete?.(`Disconnected from ${server.name}.`), setIsClaudeAIClearingAuth(!1), setClaudeAIClearAuthUrl(null), setClaudeAIClearAuthBrowserOpened(!1);
  }, [server.name, server.config, server.scope, setAppState, onComplete]);
  useKeybinding("confirm:no", () => {
    authAbortControllerRef.current?.abort(), authAbortControllerRef.current = null, setIsAuthenticating(!1), setAuthorizationUrl(null);
  }, {
    context: "Confirmation",
    isActive: isAuthenticating
  }), useKeybinding("confirm:no", () => {
    setIsClaudeAIAuthenticating(!1), setClaudeAIAuthUrl(null);
  }, {
    context: "Confirmation",
    isActive: isClaudeAIAuthenticating
  }), useKeybinding("confirm:no", () => {
    setIsClaudeAIClearingAuth(!1), setClaudeAIClearAuthUrl(null), setClaudeAIClearAuthBrowserOpened(!1);
  }, {
    context: "Confirmation",
    isActive: isClaudeAIClearingAuth
  }), use_input_default((input, key3) => {
    if (key3.return && isClaudeAIAuthenticating)
      handleClaudeAIAuthComplete();
    if (key3.return && isClaudeAIClearingAuth)
      if (claudeAIClearAuthBrowserOpened)
        handleClaudeAIClearAuthComplete();
      else {
        let connectorsUrl = `${getOauthConfig().CLAUDE_AI_ORIGIN}/settings/connectors`;
        setClaudeAIClearAuthUrl(connectorsUrl), setClaudeAIClearAuthBrowserOpened(!0), openBrowser(connectorsUrl);
      }
    if (input === "c" && !urlCopied) {
      let urlToCopy = authorizationUrl || claudeAIAuthUrl || claudeAIClearAuthUrl;
      if (urlToCopy)
        setClipboard(urlToCopy).then((raw) => {
          if (unmountedRef.current)
            return;
          if (raw)
            process.stdout.write(raw);
          if (setUrlCopied(!0), copyTimeoutRef.current !== void 0)
            clearTimeout(copyTimeoutRef.current);
          copyTimeoutRef.current = setTimeout(setUrlCopied, 2000, !1);
        });
    }
  });
  let capitalizedServerName = capitalize(String(server.name)), serverCommandsCount = filterMcpPromptsByServer(mcp.commands, server.name).length, toggleMcpServer = useMcpToggleEnabled(), handleClaudeAIAuth = import_react127.default.useCallback(async () => {
    let claudeAiBaseUrl = getOauthConfig().CLAUDE_AI_ORIGIN, orgUuid = getOauthAccountInfo()?.organizationUuid, authUrl;
    if (orgUuid && server.config.type === "claudeai-proxy" && server.config.id) {
      let serverId = server.config.id.startsWith("mcprs") ? "mcpsrv" + server.config.id.slice(5) : server.config.id, productSurface = encodeURIComponent(process.env.CLAUDE_CODE_ENTRYPOINT || "cli");
      authUrl = `${claudeAiBaseUrl}/api/organizations/${orgUuid}/mcp/start-auth/${serverId}?product_surface=${productSurface}`;
    } else
      authUrl = `${claudeAiBaseUrl}/settings/connectors`;
    setClaudeAIAuthUrl(authUrl), setIsClaudeAIAuthenticating(!0), logEvent("tengu_claudeai_mcp_auth_started", {}), await openBrowser(authUrl);
  }, [server.config]), handleClaudeAIClearAuth = import_react127.default.useCallback(() => {
    setIsClaudeAIClearingAuth(!0), logEvent("tengu_claudeai_mcp_clear_auth_started", {});
  }, []), handleToggleEnabled = import_react127.default.useCallback(async () => {
    let wasEnabled = server.client.type !== "disabled";
    try {
      if (await toggleMcpServer(server.name), server.config.type === "claudeai-proxy")
        logEvent("tengu_claudeai_mcp_toggle", {
          new_state: wasEnabled ? "disabled" : "enabled"
        });
      onCancel();
    } catch (err_0) {
      onComplete?.(`Failed to ${wasEnabled ? "disable" : "enable"} MCP server '${server.name}': ${errorMessage(err_0)}`);
    }
  }, [server.client.type, server.config.type, server.name, toggleMcpServer, onCancel, onComplete]), handleAuthenticate = import_react127.default.useCallback(async () => {
    if (server.config.type === "claudeai-proxy")
      return;
    setIsAuthenticating(!0), setError(null);
    let controller = new AbortController;
    authAbortControllerRef.current = controller;
    try {
      if (server.isAuthenticated && server.config)
        await revokeServerTokens(server.name, server.config, {
          preserveStepUpState: !0
        });
      if (server.config) {
        await performMCPOAuthFlow(server.name, server.config, setAuthorizationUrl, controller.signal, {
          onWaitingForCallback: (submit) => {
            setManualCallbackSubmit(() => submit);
          }
        }), logEvent("tengu_mcp_auth_config_authenticate", {
          wasAuthenticated: server.isAuthenticated
        });
        let result_0 = await reconnectMcpServer(server.name);
        if (result_0.client.type === "connected") {
          let message = isEffectivelyAuthenticated ? `Authentication successful. Reconnected to ${server.name}.` : `Authentication successful. Connected to ${server.name}.`;
          onComplete?.(message);
        } else if (result_0.client.type === "needs-auth")
          onComplete?.("Authentication successful, but server still requires authentication. You may need to manually restart Claude Code.");
        else
          logMCPDebug(server.name, "Reconnection failed after authentication"), onComplete?.("Authentication successful, but server reconnection failed. You may need to manually restart Claude Code for the changes to take effect.");
      }
    } catch (err_1) {
      if (err_1 instanceof Error && !(err_1 instanceof AuthenticationCancelledError))
        setError(err_1.message);
    } finally {
      setIsAuthenticating(!1), authAbortControllerRef.current = null, setManualCallbackSubmit(null), setCallbackUrlInput("");
    }
  }, [server.isAuthenticated, server.config, server.name, onComplete, reconnectMcpServer, isEffectivelyAuthenticated]), handleClearAuth = async () => {
    if (server.config.type === "claudeai-proxy")
      return;
    if (server.config)
      await revokeServerTokens(server.name, server.config), logEvent("tengu_mcp_auth_config_clear", {}), await clearServerCache(server.name, {
        ...server.config,
        scope: server.scope
      }), setAppState((prev_0) => {
        let newClients_0 = prev_0.mcp.clients.map((c_0) => c_0.name === server.name ? {
          ...c_0,
          type: "failed"
        } : c_0), newTools_0 = excludeToolsByServer(prev_0.mcp.tools, server.name), newCommands_0 = excludeCommandsByServer(prev_0.mcp.commands, server.name), newResources_0 = excludeResourcesByServer(prev_0.mcp.resources, server.name);
        return {
          ...prev_0,
          mcp: {
            ...prev_0.mcp,
            clients: newClients_0,
            tools: newTools_0,
            commands: newCommands_0,
            resources: newResources_0
          }
        };
      }), onComplete?.(`Authentication cleared for ${server.name}.`);
  };
  if (isAuthenticating) {
    let authCopy = server.config.type !== "claudeai-proxy" && server.config.oauth?.xaa ? " Authenticating via your identity provider" : " A browser window will open for authentication";
    return /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
          color: "claude",
          children: [
            "Authenticating with ",
            server.name,
            "\u2026"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              children: authCopy
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        authorizationUrl && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    "If your browser doesn't open automatically, copy this URL manually",
                    " "
                  ]
                }, void 0, !0, void 0, this),
                urlCopied ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  color: "success",
                  children: "(Copied!)"
                }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(KeyboardShortcutHint, {
                    shortcut: "c",
                    action: "copy",
                    parens: !0
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Link, {
              url: authorizationUrl
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        isAuthenticating && authorizationUrl && manualCallbackSubmit && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "If the redirect page shows a connection error, paste the URL from your browser's address bar:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    "URL ",
                    ">",
                    " "
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(TextInput, {
                  value: callbackUrlInput,
                  onChange: setCallbackUrlInput,
                  onSubmit: (value) => {
                    manualCallbackSubmit(value.trim()), setCallbackUrlInput("");
                  },
                  cursorOffset: callbackUrlCursorOffset,
                  onChangeCursorOffset: setCallbackUrlCursorOffset,
                  columns: terminalColumns - 8
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Return here after authenticating in your browser. Press Esc to go back."
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  }
  if (isClaudeAIAuthenticating)
    return /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
          color: "claude",
          children: [
            "Authenticating with ",
            server.name,
            "\u2026"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              children: " A browser window will open for authentication"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        claudeAIAuthUrl && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: [
                    "If your browser doesn't open automatically, copy this URL manually",
                    " "
                  ]
                }, void 0, !0, void 0, this),
                urlCopied ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  color: "success",
                  children: "(Copied!)"
                }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(KeyboardShortcutHint, {
                    shortcut: "c",
                    action: "copy",
                    parens: !0
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Link, {
              url: claudeAIAuthUrl
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              color: "permission",
              children: [
                "Press ",
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Enter"
                }, void 0, !1, void 0, this),
                " after authenticating in your browser."
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              dimColor: !0,
              italic: !0,
              children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "back"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (isClaudeAIClearingAuth)
    return /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
          color: "claude",
          children: [
            "Clear authentication for ",
            server.name
          ]
        }, void 0, !0, void 0, this),
        claudeAIClearAuthBrowserOpened ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(jsx_dev_runtime228.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              children: 'Find the MCP server in the browser and click "Disconnect".'
            }, void 0, !1, void 0, this),
            claudeAIClearAuthUrl && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              children: [
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        "If your browser didn't open automatically, copy this URL manually",
                        " "
                      ]
                    }, void 0, !0, void 0, this),
                    urlCopied ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                      color: "success",
                      children: "(Copied!)"
                    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(KeyboardShortcutHint, {
                        shortcut: "c",
                        action: "copy",
                        parens: !0
                      }, void 0, !1, void 0, this)
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Link, {
                  url: claudeAIClearAuthUrl
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
              marginLeft: 3,
              flexDirection: "column",
              children: [
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  color: "permission",
                  children: [
                    "Press ",
                    /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                      bold: !0,
                      children: "Enter"
                    }, void 0, !1, void 0, this),
                    " when done."
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  italic: !0,
                  children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ConfigurableShortcutHint, {
                    action: "confirm:no",
                    context: "Confirmation",
                    fallback: "Esc",
                    description: "back"
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(jsx_dev_runtime228.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              children: 'This will open claude.ai in the browser. Find the MCP server in the list and click "Disconnect".'
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
              marginLeft: 3,
              flexDirection: "column",
              children: [
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  color: "permission",
                  children: [
                    "Press ",
                    /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                      bold: !0,
                      children: "Enter"
                    }, void 0, !1, void 0, this),
                    " to open the browser."
                  ]
                }, void 0, !0, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                  dimColor: !0,
                  italic: !0,
                  children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ConfigurableShortcutHint, {
                    action: "confirm:no",
                    context: "Confirmation",
                    fallback: "Esc",
                    description: "back"
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (isReconnecting)
    return /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
          color: "text",
          children: [
            "Connecting to ",
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              bold: !0,
              children: server.name
            }, void 0, !1, void 0, this),
            "\u2026"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              children: " Establishing connection to MCP server"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "This may take a few moments."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let menuOptions = [];
  if (server.client.type === "disabled")
    menuOptions.push({
      label: "Enable",
      value: "toggle-enabled"
    });
  if (server.client.type === "connected" && serverToolsCount > 0)
    menuOptions.push({
      label: "View tools",
      value: "tools"
    });
  if (server.config.type === "claudeai-proxy") {
    if (server.client.type === "connected")
      menuOptions.push({
        label: "Clear authentication",
        value: "claudeai-clear-auth"
      });
    else if (server.client.type !== "disabled")
      menuOptions.push({
        label: "Authenticate",
        value: "claudeai-auth"
      });
  } else {
    if (isEffectivelyAuthenticated)
      menuOptions.push({
        label: "Re-authenticate",
        value: "reauth"
      }), menuOptions.push({
        label: "Clear authentication",
        value: "clear-auth"
      });
    if (!isEffectivelyAuthenticated)
      menuOptions.push({
        label: "Authenticate",
        value: "auth"
      });
  }
  if (server.client.type !== "disabled") {
    if (server.client.type !== "needs-auth")
      menuOptions.push({
        label: "Reconnect",
        value: "reconnectMcpServer"
      });
    menuOptions.push({
      label: "Disable",
      value: "toggle-enabled"
    });
  }
  if (menuOptions.length === 0)
    menuOptions.push({
      label: "Back",
      value: "back"
    });
  return /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 1,
        borderStyle: borderless ? void 0 : "round",
        children: [
          /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
            marginBottom: 1,
            children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                capitalizedServerName,
                " MCP Server"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            gap: 0,
            children: [
              /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Status: "
                  }, void 0, !1, void 0, this),
                  server.client.type === "disabled" ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    children: [
                      color("inactive", theme)(figures_default.radioOff),
                      " disabled"
                    ]
                  }, void 0, !0, void 0, this) : server.client.type === "connected" ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    children: [
                      color("success", theme)(figures_default.tick),
                      " connected"
                    ]
                  }, void 0, !0, void 0, this) : server.client.type === "pending" ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(jsx_dev_runtime228.Fragment, {
                    children: [
                      /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                        dimColor: !0,
                        children: figures_default.radioOff
                      }, void 0, !1, void 0, this),
                      /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                        children: " connecting\u2026"
                      }, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this) : server.client.type === "needs-auth" ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    children: [
                      color("warning", theme)(figures_default.triangleUpOutline),
                      " needs authentication"
                    ]
                  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    children: [
                      color("error", theme)(figures_default.cross),
                      " failed"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              server.transport !== "claudeai-proxy" && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Auth: "
                  }, void 0, !1, void 0, this),
                  isEffectivelyAuthenticated ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    children: [
                      color("success", theme)(figures_default.tick),
                      " authenticated"
                    ]
                  }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    children: [
                      color("error", theme)(figures_default.cross),
                      " not authenticated"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "URL: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: server.config.url
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Config location: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: describeMcpConfigFilePath(server.scope)
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              server.client.type === "connected" && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(CapabilitiesSection, {
                serverToolsCount,
                serverPromptsCount: serverCommandsCount,
                serverResourcesCount: mcp.resources[server.name]?.length || 0
              }, void 0, !1, void 0, this),
              server.client.type === "connected" && serverToolsCount > 0 && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
                    bold: !0,
                    children: "Tools: "
                  }, void 0, !1, void 0, this),
                  /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
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
          error44 && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
              color: "error",
              children: [
                "Error: ",
                error44
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          menuOptions.length > 0 && /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Select, {
              options: menuOptions,
              onChange: async (value_0) => {
                switch (value_0) {
                  case "tools":
                    onViewTools();
                    break;
                  case "auth":
                  case "reauth":
                    await handleAuthenticate();
                    break;
                  case "clear-auth":
                    await handleClearAuth();
                    break;
                  case "claudeai-auth":
                    await handleClaudeAIAuth();
                    break;
                  case "claudeai-clear-auth":
                    handleClaudeAIClearAuth();
                    break;
                  case "reconnectMcpServer":
                    setIsReconnecting(!0);
                    try {
                      let result_1 = await reconnectMcpServer(server.name);
                      if (server.config.type === "claudeai-proxy")
                        logEvent("tengu_claudeai_mcp_reconnect", {
                          success: result_1.client.type === "connected"
                        });
                      let {
                        message: message_0
                      } = handleReconnectResult(result_1, server.name);
                      onComplete?.(message_0);
                    } catch (err_2) {
                      if (server.config.type === "claudeai-proxy")
                        logEvent("tengu_claudeai_mcp_reconnect", {
                          success: !1
                        });
                      onComplete?.(handleReconnectError(err_2, server.name));
                    } finally {
                      setIsReconnecting(!1);
                    }
                    break;
                  case "toggle-enabled":
                    await handleToggleEnabled();
                    break;
                  case "back":
                    onCancel();
                    break;
                }
              },
              onCancel
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ThemedText, {
          dimColor: !0,
          italic: !0,
          children: exitState.pending ? /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(jsx_dev_runtime228.Fragment, {
            children: [
              "Press ",
              exitState.keyName,
              " again to exit"
            ]
          }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2191\u2193",
                action: "navigate"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "select"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime228.jsxDEV(ConfigurableShortcutHint, {
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
