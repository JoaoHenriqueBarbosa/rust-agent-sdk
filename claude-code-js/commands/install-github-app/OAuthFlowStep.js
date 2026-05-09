// Original: src/commands/install-github-app/OAuthFlowStep.tsx
function OAuthFlowStep({
  onSuccess,
  onCancel
}) {
  let [oauthStatus, setOAuthStatus] = import_react120.useState({
    state: "starting"
  }), [oauthService] = import_react120.useState(() => new OAuthService), [pastedCode, setPastedCode] = import_react120.useState(""), [cursorOffset, setCursorOffset] = import_react120.useState(0), [showPastePrompt, setShowPastePrompt] = import_react120.useState(!1), [urlCopied, setUrlCopied] = import_react120.useState(!1), timersRef = import_react120.useRef(/* @__PURE__ */ new Set), urlCopiedTimerRef = import_react120.useRef(void 0), terminalSize = useTerminalSize(), textInputColumns = Math.max(50, terminalSize.columns - PASTE_HERE_MSG2.length - 4);
  function handleKeyDown(e) {
    if (oauthStatus.state !== "error")
      return;
    if (e.preventDefault(), e.key === "return" && oauthStatus.toRetry)
      setPastedCode(""), setCursorOffset(0), setOAuthStatus({
        state: "about_to_retry",
        nextState: oauthStatus.toRetry
      });
    else
      onCancel();
  }
  async function handleSubmitCode(value, url3) {
    try {
      let [authorizationCode, state3] = value.split("#");
      if (!authorizationCode || !state3) {
        setOAuthStatus({
          state: "error",
          message: "Invalid code. Please make sure the full code was copied",
          toRetry: {
            state: "waiting_for_login",
            url: url3
          }
        });
        return;
      }
      logEvent("tengu_oauth_manual_entry", {}), oauthService.handleManualAuthCodeInput({
        authorizationCode,
        state: state3
      });
    } catch (err2) {
      logError2(err2), setOAuthStatus({
        state: "error",
        message: err2.message,
        toRetry: {
          state: "waiting_for_login",
          url: url3
        }
      });
    }
  }
  let startOAuth = import_react120.useCallback(async () => {
    timersRef.current.forEach((timer) => clearTimeout(timer)), timersRef.current.clear();
    try {
      let result = await oauthService.startOAuthFlow(async (url_0) => {
        setOAuthStatus({
          state: "waiting_for_login",
          url: url_0
        });
        let timer_0 = setTimeout(setShowPastePrompt, 3000, !0);
        timersRef.current.add(timer_0);
      }, {
        loginWithClaudeAi: !0,
        inferenceOnly: !0,
        expiresIn: 31536000
      });
      setOAuthStatus({
        state: "processing"
      }), saveOAuthTokensIfNeeded(result);
      let timer1 = setTimeout((setOAuthStatus_0, accessToken, onSuccess_0, timersRef_0) => {
        setOAuthStatus_0({
          state: "success",
          token: accessToken
        });
        let timer2 = setTimeout(onSuccess_0, 1000, accessToken);
        timersRef_0.current.add(timer2);
      }, 100, setOAuthStatus, result.accessToken, onSuccess, timersRef);
      timersRef.current.add(timer1);
    } catch (err_0) {
      let errorMessage3 = err_0.message;
      setOAuthStatus({
        state: "error",
        message: errorMessage3,
        toRetry: {
          state: "starting"
        }
      }), logError2(err_0), logEvent("tengu_oauth_error", {
        error: errorMessage3
      });
    }
  }, [oauthService, onSuccess]);
  import_react120.useEffect(() => {
    if (oauthStatus.state === "starting")
      startOAuth();
  }, [oauthStatus.state, startOAuth]), import_react120.useEffect(() => {
    if (oauthStatus.state === "about_to_retry") {
      let timer_1 = setTimeout((nextState, setShowPastePrompt_0, setOAuthStatus_1) => {
        setShowPastePrompt_0(nextState.state === "waiting_for_login"), setOAuthStatus_1(nextState);
      }, 500, oauthStatus.nextState, setShowPastePrompt, setOAuthStatus);
      timersRef.current.add(timer_1);
    }
  }, [oauthStatus]), import_react120.useEffect(() => {
    if (pastedCode === "c" && oauthStatus.state === "waiting_for_login" && showPastePrompt && !urlCopied)
      setClipboard(oauthStatus.url).then((raw) => {
        if (raw)
          process.stdout.write(raw);
        setUrlCopied(!0), clearTimeout(urlCopiedTimerRef.current), urlCopiedTimerRef.current = setTimeout(setUrlCopied, 2000, !1);
      }), setPastedCode("");
  }, [pastedCode, oauthStatus, showPastePrompt, urlCopied]), import_react120.useEffect(() => {
    let timers = timersRef.current;
    return () => {
      oauthService.cleanup(), timers.forEach((timer_2) => clearTimeout(timer_2)), timers.clear(), clearTimeout(urlCopiedTimerRef.current);
    };
  }, [oauthService]);
  function renderStatusMessage() {
    switch (oauthStatus.state) {
      case "starting":
        return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              children: "Starting authentication\u2026"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this);
      case "waiting_for_login":
        return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            !showPastePrompt && /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
                  children: "Opening browser to sign in with your Claude account\u2026"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            showPastePrompt && /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
                  children: PASTE_HERE_MSG2
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(TextInput, {
                  value: pastedCode,
                  onChange: setPastedCode,
                  onSubmit: (value_0) => handleSubmitCode(value_0, oauthStatus.url),
                  cursorOffset,
                  onChangeCursorOffset: setCursorOffset,
                  columns: textInputColumns
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this);
      case "processing":
        return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              children: "Processing authentication\u2026"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this);
      case "success":
        return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              color: "success",
              children: "\u2713 Authentication token created successfully!"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Using token for GitHub Actions setup\u2026"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this);
      case "error":
        return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              color: "error",
              children: [
                "OAuth error: ",
                oauthStatus.message
              ]
            }, void 0, !0, void 0, this),
            oauthStatus.toRetry ? /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Press Enter to try again, or any other key to cancel"
            }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Press any key to return to API key selection"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this);
      case "about_to_retry":
        return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
            color: "permission",
            children: "Retrying\u2026"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this);
      default:
        return null;
    }
  }
  return /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    gap: 1,
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleKeyDown,
    children: [
      oauthStatus.state === "starting" && /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
            bold: !0,
            children: "Create Authentication Token"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Creating a long-lived token for GitHub Actions"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      oauthStatus.state !== "success" && oauthStatus.state !== "starting" && oauthStatus.state !== "processing" && /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
            bold: !0,
            children: "Create Authentication Token"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Creating a long-lived token for GitHub Actions"
          }, void 0, !1, void 0, this)
        ]
      }, "header", !0, void 0, this),
      oauthStatus.state === "waiting_for_login" && showPastePrompt && /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
            paddingX: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "Browser didn't open? Use the url below to sign in",
                  " "
                ]
              }, void 0, !0, void 0, this),
              urlCopied ? /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
                color: "success",
                children: "(Copied!)"
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
                dimColor: !0,
                children: /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(KeyboardShortcutHint, {
                  shortcut: "c",
                  action: "copy",
                  parens: !0
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(Link, {
            url: oauthStatus.url,
            children: /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedText, {
              dimColor: !0,
              children: oauthStatus.url
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, "urlToCopy", !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime219.jsxDEV(ThemedBox_default, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1,
        children: renderStatusMessage()
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_react120, jsx_dev_runtime219, PASTE_HERE_MSG2 = "Paste code here if prompted > ";
var init_OAuthFlowStep = __esm(() => {
  init_KeyboardShortcutHint();
  init_Spinner2();
  init_TextInput();
  init_useTerminalSize();
  init_osc();
  init_ink2();
  init_oauth2();
  init_auth14();
  init_log3();
  import_react120 = __toESM(require_react_development(), 1), jsx_dev_runtime219 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
