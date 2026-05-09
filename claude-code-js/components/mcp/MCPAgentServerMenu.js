// Original: src/components/mcp/MCPAgentServerMenu.tsx
function MCPAgentServerMenu({
  agentServer,
  onCancel,
  onComplete
}) {
  let [theme] = useTheme(), [isAuthenticating, setIsAuthenticating] = import_react122.useState(!1), [error44, setError] = import_react122.useState(null), [authorizationUrl, setAuthorizationUrl] = import_react122.useState(null), authAbortControllerRef = import_react122.useRef(null);
  import_react122.useEffect(() => () => authAbortControllerRef.current?.abort(), []);
  let handleEscCancel = import_react122.useCallback(() => {
    if (isAuthenticating)
      authAbortControllerRef.current?.abort(), authAbortControllerRef.current = null, setIsAuthenticating(!1), setAuthorizationUrl(null);
  }, [isAuthenticating]);
  useKeybinding("confirm:no", handleEscCancel, {
    context: "Confirmation",
    isActive: isAuthenticating
  });
  let handleAuthenticate = import_react122.useCallback(async () => {
    if (!agentServer.needsAuth || !agentServer.url)
      return;
    setIsAuthenticating(!0), setError(null);
    let controller = new AbortController;
    authAbortControllerRef.current = controller;
    try {
      let tempConfig = {
        type: agentServer.transport,
        url: agentServer.url
      };
      await performMCPOAuthFlow(agentServer.name, tempConfig, setAuthorizationUrl, controller.signal), onComplete?.(`Authentication successful for ${agentServer.name}. The server will connect when the agent runs.`);
    } catch (err2) {
      if (err2 instanceof Error && !(err2 instanceof AuthenticationCancelledError))
        setError(err2.message);
    } finally {
      setIsAuthenticating(!1), authAbortControllerRef.current = null;
    }
  }, [agentServer, onComplete]), capitalizedServerName = capitalize(String(agentServer.name));
  if (isAuthenticating)
    return /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
          color: "claude",
          children: [
            "Authenticating with ",
            agentServer.name,
            "\u2026"
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
              children: " A browser window will open for authentication"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        authorizationUrl && /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "If your browser doesn't open automatically, copy this URL manually:"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(Link, {
              url: authorizationUrl
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
          marginLeft: 3,
          children: /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Return here after authenticating in your browser.",
              " ",
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "go back"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let menuOptions = [];
  if (agentServer.needsAuth)
    menuOptions.push({
      label: agentServer.isAuthenticated ? "Re-authenticate" : "Authenticate",
      value: "auth"
    });
  return menuOptions.push({
    label: "Back",
    value: "back"
  }), /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(Dialog, {
    title: `${capitalizedServerName} MCP Server`,
    subtitle: "agent-only",
    onCancel,
    inputGuide: (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(KeyboardShortcutHint, {
          shortcut: "\u2191\u2193",
          action: "navigate"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "confirm"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this),
    children: [
      /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 0,
        children: [
          /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                bold: !0,
                children: "Type: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                dimColor: !0,
                children: agentServer.transport
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          agentServer.url && /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                bold: !0,
                children: "URL: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                dimColor: !0,
                children: agentServer.url
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          agentServer.command && /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                bold: !0,
                children: "Command: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                dimColor: !0,
                children: agentServer.command
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                bold: !0,
                children: "Used by: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                dimColor: !0,
                children: agentServer.sourceAgents.join(", ")
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                bold: !0,
                children: "Status: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                children: [
                  color("inactive", theme)(figures_default.radioOff),
                  " not connected (agent-only)"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          agentServer.needsAuth && /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                bold: !0,
                children: "Auth: "
              }, void 0, !1, void 0, this),
              agentServer.isAuthenticated ? /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                children: [
                  color("success", theme)(figures_default.tick),
                  " authenticated"
                ]
              }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
                children: [
                  color("warning", theme)(figures_default.triangleUpOutline),
                  " may need authentication"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "This server connects only when running the agent."
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      error44 && /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedText, {
          color: "error",
          children: [
            "Error: ",
            error44
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime223.jsxDEV(Select, {
          options: menuOptions,
          onChange: async (value) => {
            switch (value) {
              case "auth":
                await handleAuthenticate();
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
  }, void 0, !0, void 0, this);
}
var import_react122, jsx_dev_runtime223;
var init_MCPAgentServerMenu = __esm(() => {
  init_figures();
  init_ink2();
  init_useKeybinding();
  init_auth17();
  init_ConfigurableShortcutHint();
  init_CustomSelect();
  init_Byline();
  init_Dialog();
  init_KeyboardShortcutHint();
  init_Spinner2();
  import_react122 = __toESM(require_react_development(), 1), jsx_dev_runtime223 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
