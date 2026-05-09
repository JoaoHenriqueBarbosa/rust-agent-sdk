// function: ConsoleOAuthFlow
function ConsoleOAuthFlow({
  onDone,
  startingMessage,
  mode = "login",
  forceLoginMethod: forceLoginMethodProp
}) {
  let settings = getSettings_DEPRECATED() || {}, forceLoginMethod = forceLoginMethodProp ?? settings.forceLoginMethod, orgUUID = settings.forceLoginOrgUUID, forcedMethodMessage = forceLoginMethod === "claudeai" ? "Login method pre-selected: Subscription Plan (Claude Pro/Max)" : forceLoginMethod === "console" ? "Login method pre-selected: API Usage Billing (Anthropic Console)" : null, terminal = useTerminalNotification(), [oauthStatus, setOAuthStatus] = import_react59.useState(() => {
    if (mode === "setup-token")
      return {
        state: "ready_to_start"
      };
    if (forceLoginMethod === "claudeai" || forceLoginMethod === "console")
      return {
        state: "ready_to_start"
      };
    return {
      state: "idle"
    };
  }), [pastedCode, setPastedCode] = import_react59.useState(""), [cursorOffset, setCursorOffset] = import_react59.useState(0), [oauthService] = import_react59.useState(() => new OAuthService), [loginWithClaudeAi, setLoginWithClaudeAi] = import_react59.useState(() => {
    return mode === "setup-token" || forceLoginMethod === "claudeai";
  }), [showPastePrompt, setShowPastePrompt] = import_react59.useState(!1), [urlCopied, setUrlCopied] = import_react59.useState(!1), textInputColumns = useTerminalSize().columns - PASTE_HERE_MSG.length - 1;
  import_react59.useEffect(() => {
    if (forceLoginMethod === "claudeai")
      logEvent("tengu_oauth_claudeai_forced", {});
    else if (forceLoginMethod === "console")
      logEvent("tengu_oauth_console_forced", {});
  }, [forceLoginMethod]), import_react59.useEffect(() => {
    if (oauthStatus.state === "about_to_retry") {
      let timer = setTimeout(setOAuthStatus, 1000, oauthStatus.nextState);
      return () => clearTimeout(timer);
    }
  }, [oauthStatus]), useKeybinding("confirm:yes", () => {
    logEvent("tengu_oauth_success", {
      loginWithClaudeAi
    }), onDone();
  }, {
    context: "Confirmation",
    isActive: oauthStatus.state === "success" && mode !== "setup-token"
  }), useKeybinding("confirm:yes", () => {
    setOAuthStatus({
      state: "idle"
    });
  }, {
    context: "Confirmation",
    isActive: oauthStatus.state === "platform_setup"
  }), useKeybinding("confirm:yes", () => {
    if (oauthStatus.state === "error" && oauthStatus.toRetry)
      setPastedCode(""), setOAuthStatus({
        state: "about_to_retry",
        nextState: oauthStatus.toRetry
      });
  }, {
    context: "Confirmation",
    isActive: oauthStatus.state === "error" && !!oauthStatus.toRetry
  }), import_react59.useEffect(() => {
    if (pastedCode === "c" && oauthStatus.state === "waiting_for_login" && showPastePrompt && !urlCopied)
      setClipboard(oauthStatus.url).then((raw) => {
        if (raw)
          process.stdout.write(raw);
        setUrlCopied(!0), setTimeout(setUrlCopied, 2000, !1);
      }), setPastedCode("");
  }, [pastedCode, oauthStatus, showPastePrompt, urlCopied]);
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
  let startOAuth = import_react59.useCallback(async () => {
    try {
      logEvent("tengu_oauth_flow_start", {
        loginWithClaudeAi
      });
      let result = await oauthService.startOAuthFlow(async (url_0) => {
        setOAuthStatus({
          state: "waiting_for_login",
          url: url_0
        }), setTimeout(setShowPastePrompt, 3000, !0);
      }, {
        loginWithClaudeAi,
        inferenceOnly: mode === "setup-token",
        expiresIn: mode === "setup-token" ? 31536000 : void 0,
        orgUUID
      }).catch((err_1) => {
        let isTokenExchangeError = err_1.message.includes("Token exchange failed"), sslHint_0 = getSSLErrorHint(err_1);
        throw setOAuthStatus({
          state: "error",
          message: sslHint_0 ?? (isTokenExchangeError ? "Failed to exchange authorization code for access token. Please try again." : err_1.message),
          toRetry: mode === "setup-token" ? {
            state: "ready_to_start"
          } : {
            state: "idle"
          }
        }), logEvent("tengu_oauth_token_exchange_error", {
          error: err_1.message,
          ssl_error: sslHint_0 !== null
        }), err_1;
      });
      if (mode === "setup-token")
        setOAuthStatus({
          state: "success",
          token: result.accessToken
        });
      else {
        await installOAuthTokens(result);
        let orgResult = await validateForceLoginOrg();
        if (!orgResult.valid)
          throw Error(orgResult.message);
        setOAuthStatus({
          state: "success"
        }), sendNotification({
          message: "Claude Code login successful",
          notificationType: "auth_success"
        }, terminal);
      }
    } catch (err_0) {
      let errorMessage2 = err_0.message, sslHint = getSSLErrorHint(err_0);
      setOAuthStatus({
        state: "error",
        message: sslHint ?? errorMessage2,
        toRetry: {
          state: mode === "setup-token" ? "ready_to_start" : "idle"
        }
      }), logEvent("tengu_oauth_error", {
        error: errorMessage2,
        ssl_error: sslHint !== null
      });
    }
  }, [oauthService, setShowPastePrompt, loginWithClaudeAi, mode, orgUUID]), pendingOAuthStartRef = import_react59.useRef(!1);
  return import_react59.useEffect(() => {
    if (oauthStatus.state === "ready_to_start" && !pendingOAuthStartRef.current)
      pendingOAuthStartRef.current = !0, process.nextTick((startOAuth_0, pendingOAuthStartRef_0) => {
        startOAuth_0(), pendingOAuthStartRef_0.current = !1;
      }, startOAuth, pendingOAuthStartRef);
  }, [oauthStatus.state, startOAuth]), import_react59.useEffect(() => {
    if (mode === "setup-token" && oauthStatus.state === "success") {
      let timer_0 = setTimeout((loginWithClaudeAi_0, onDone_0) => {
        logEvent("tengu_oauth_success", {
          loginWithClaudeAi: loginWithClaudeAi_0
        }), onDone_0();
      }, 500, loginWithClaudeAi, onDone);
      return () => clearTimeout(timer_0);
    }
  }, [mode, oauthStatus, loginWithClaudeAi, onDone]), import_react59.useEffect(() => {
    return () => {
      oauthService.cleanup();
    };
  }, [oauthService]), /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    gap: 1,
    children: [
      oauthStatus.state === "waiting_for_login" && showPastePrompt && /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        paddingBottom: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
            paddingX: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "Browser didn't open? Use the url below to sign in",
                  " "
                ]
              }, void 0, !0, void 0, this),
              urlCopied ? /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                color: "success",
                children: "(Copied!)"
              }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(KeyboardShortcutHint, {
                  shortcut: "c",
                  action: "copy",
                  parens: !0
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Link, {
            url: oauthStatus.url,
            children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
              dimColor: !0,
              children: oauthStatus.url
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, "urlToCopy", !0, void 0, this),
      mode === "setup-token" && oauthStatus.state === "success" && oauthStatus.token && /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        paddingTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            color: "success",
            children: "\u2713 Long-lived authentication token created successfully!"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            gap: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                children: "Your OAuth token (valid for 1 year):"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                color: "warning",
                children: oauthStatus.token
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Store this token securely. You won't be able to see it again."
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Use this token by setting: export CLAUDE_CODE_OAUTH_TOKEN=<token>"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, "tokenOutput", !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
        paddingLeft: 1,
        flexDirection: "column",
        gap: 1,
        children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(OAuthStatusMessage, {
          oauthStatus,
          mode,
          startingMessage,
          forcedMethodMessage,
          showPastePrompt,
          pastedCode,
          setPastedCode,
          cursorOffset,
          setCursorOffset,
          textInputColumns,
          handleSubmitCode,
          setOAuthStatus,
          setLoginWithClaudeAi
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
