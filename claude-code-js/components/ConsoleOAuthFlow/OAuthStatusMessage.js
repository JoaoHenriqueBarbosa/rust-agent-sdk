// function: OAuthStatusMessage
function OAuthStatusMessage(t0) {
  let $3 = import_compiler_runtime62.c(51), {
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
  } = t0;
  switch (oauthStatus.state) {
    case "idle": {
      let t1 = startingMessage ? startingMessage : "Claude Code can be used with your Claude subscription or billed based on API usage through your Console account.", t2;
      if ($3[0] !== t1)
        t2 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          bold: !0,
          children: t1
        }, void 0, !1, void 0, this), $3[0] = t1, $3[1] = t2;
      else
        t2 = $3[1];
      let t3;
      if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
        t3 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          children: "Select login method:"
        }, void 0, !1, void 0, this), $3[2] = t3;
      else
        t3 = $3[2];
      let t4;
      if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
        t4 = {
          label: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            children: [
              "Claude account with subscription \xB7",
              " ",
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Pro, Max, Team, or Enterprise"
              }, void 0, !1, void 0, this),
              `
`
            ]
          }, void 0, !0, void 0, this),
          value: "claudeai"
        }, $3[3] = t4;
      else
        t4 = $3[3];
      let t5;
      if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
        t5 = {
          label: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            children: [
              "Anthropic Console account \xB7",
              " ",
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "API usage billing"
              }, void 0, !1, void 0, this),
              `
`
            ]
          }, void 0, !0, void 0, this),
          value: "console"
        }, $3[4] = t5;
      else
        t5 = $3[4];
      let t6;
      if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
        t6 = [t4, t5, {
          label: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            children: [
              "3rd-party platform \xB7",
              " ",
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Amazon Bedrock, Microsoft Foundry, or Vertex AI"
              }, void 0, !1, void 0, this),
              `
`
            ]
          }, void 0, !0, void 0, this),
          value: "platform"
        }], $3[5] = t6;
      else
        t6 = $3[5];
      let t7;
      if ($3[6] !== setLoginWithClaudeAi || $3[7] !== setOAuthStatus)
        t7 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Select, {
            options: t6,
            onChange: (value_0) => {
              if (value_0 === "platform")
                logEvent("tengu_oauth_platform_selected", {}), setOAuthStatus({
                  state: "platform_setup"
                });
              else if (setOAuthStatus({
                state: "ready_to_start"
              }), value_0 === "claudeai")
                logEvent("tengu_oauth_claudeai_selected", {}), setLoginWithClaudeAi(!0);
              else
                logEvent("tengu_oauth_console_selected", {}), setLoginWithClaudeAi(!1);
            }
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[6] = setLoginWithClaudeAi, $3[7] = setOAuthStatus, $3[8] = t7;
      else
        t7 = $3[8];
      let t8;
      if ($3[9] !== t2 || $3[10] !== t7)
        t8 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          marginTop: 1,
          children: [
            t2,
            t3,
            t7
          ]
        }, void 0, !0, void 0, this), $3[9] = t2, $3[10] = t7, $3[11] = t8;
      else
        t8 = $3[11];
      return t8;
    }
    case "platform_setup": {
      let t1;
      if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          bold: !0,
          children: "Using 3rd-party platforms"
        }, void 0, !1, void 0, this), $3[12] = t1;
      else
        t1 = $3[12];
      let t2, t3;
      if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          children: "Claude Code supports Amazon Bedrock, Microsoft Foundry, and Vertex AI. Set the required environment variables, then restart Claude Code."
        }, void 0, !1, void 0, this), t3 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          children: "If you are part of an enterprise organization, contact your administrator for setup instructions."
        }, void 0, !1, void 0, this), $3[13] = t2, $3[14] = t3;
      else
        t2 = $3[13], t3 = $3[14];
      let t4;
      if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
        t4 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          bold: !0,
          children: "Documentation:"
        }, void 0, !1, void 0, this), $3[15] = t4;
      else
        t4 = $3[15];
      let t5;
      if ($3[16] === Symbol.for("react.memo_cache_sentinel"))
        t5 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          children: [
            "\xB7 Amazon Bedrock:",
            " ",
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Link, {
              url: "https://code.claude.com/docs/en/amazon-bedrock",
              children: "https://code.claude.com/docs/en/amazon-bedrock"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[16] = t5;
      else
        t5 = $3[16];
      let t6;
      if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
        t6 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          children: [
            "\xB7 Microsoft Foundry:",
            " ",
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Link, {
              url: "https://code.claude.com/docs/en/microsoft-foundry",
              children: "https://code.claude.com/docs/en/microsoft-foundry"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[17] = t6;
      else
        t6 = $3[17];
      let t7;
      if ($3[18] === Symbol.for("react.memo_cache_sentinel"))
        t7 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            t4,
            t5,
            t6,
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
              children: [
                "\xB7 Vertex AI:",
                " ",
                /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Link, {
                  url: "https://code.claude.com/docs/en/google-vertex-ai",
                  children: "https://code.claude.com/docs/en/google-vertex-ai"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[18] = t7;
      else
        t7 = $3[18];
      let t8;
      if ($3[19] === Symbol.for("react.memo_cache_sentinel"))
        t8 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          marginTop: 1,
          children: [
            t1,
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              gap: 1,
              children: [
                t2,
                t3,
                t7,
                /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
                  marginTop: 1,
                  children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      "Press ",
                      /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                        bold: !0,
                        children: "Enter"
                      }, void 0, !1, void 0, this),
                      " to go back to login options."
                    ]
                  }, void 0, !0, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[19] = t8;
      else
        t8 = $3[19];
      return t8;
    }
    case "waiting_for_login": {
      let t1;
      if ($3[20] !== forcedMethodMessage)
        t1 = forcedMethodMessage && /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            dimColor: !0,
            children: forcedMethodMessage
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[20] = forcedMethodMessage, $3[21] = t1;
      else
        t1 = $3[21];
      let t2;
      if ($3[22] !== showPastePrompt)
        t2 = !showPastePrompt && /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
              children: "Opening browser to sign in\u2026"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[22] = showPastePrompt, $3[23] = t2;
      else
        t2 = $3[23];
      let t3;
      if ($3[24] !== cursorOffset || $3[25] !== handleSubmitCode || $3[26] !== oauthStatus.url || $3[27] !== pastedCode || $3[28] !== setCursorOffset || $3[29] !== setPastedCode || $3[30] !== showPastePrompt || $3[31] !== textInputColumns)
        t3 = showPastePrompt && /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
              children: PASTE_HERE_MSG
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(TextInput, {
              value: pastedCode,
              onChange: setPastedCode,
              onSubmit: (value) => handleSubmitCode(value, oauthStatus.url),
              cursorOffset,
              onChangeCursorOffset: setCursorOffset,
              columns: textInputColumns,
              mask: "*"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[24] = cursorOffset, $3[25] = handleSubmitCode, $3[26] = oauthStatus.url, $3[27] = pastedCode, $3[28] = setCursorOffset, $3[29] = setPastedCode, $3[30] = showPastePrompt, $3[31] = textInputColumns, $3[32] = t3;
      else
        t3 = $3[32];
      let t4;
      if ($3[33] !== t1 || $3[34] !== t2 || $3[35] !== t3)
        t4 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            t1,
            t2,
            t3
          ]
        }, void 0, !0, void 0, this), $3[33] = t1, $3[34] = t2, $3[35] = t3, $3[36] = t4;
      else
        t4 = $3[36];
      return t4;
    }
    case "creating_api_key": {
      let t1;
      if ($3[37] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                children: "Creating API key for Claude Code\u2026"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[37] = t1;
      else
        t1 = $3[37];
      return t1;
    }
    case "about_to_retry": {
      let t1;
      if ($3[38] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            color: "permission",
            children: "Retrying\u2026"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[38] = t1;
      else
        t1 = $3[38];
      return t1;
    }
    case "success": {
      let t1;
      if ($3[39] !== mode || $3[40] !== oauthStatus.token)
        t1 = mode === "setup-token" && oauthStatus.token ? null : /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(jsx_dev_runtime71.Fragment, {
          children: [
            getOauthAccountInfo()?.emailAddress ? /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "Logged in as",
                " ",
                /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                  children: getOauthAccountInfo()?.emailAddress
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this) : null,
            /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
              color: "success",
              children: [
                "Login successful. Press ",
                /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Enter"
                }, void 0, !1, void 0, this),
                " to continue\u2026"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this), $3[39] = mode, $3[40] = oauthStatus.token, $3[41] = t1;
      else
        t1 = $3[41];
      let t2;
      if ($3[42] !== t1)
        t2 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: t1
        }, void 0, !1, void 0, this), $3[42] = t1, $3[43] = t2;
      else
        t2 = $3[43];
      return t2;
    }
    case "error": {
      let t1;
      if ($3[44] !== oauthStatus.message)
        t1 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
          color: "error",
          children: [
            "OAuth error: ",
            oauthStatus.message
          ]
        }, void 0, !0, void 0, this), $3[44] = oauthStatus.message, $3[45] = t1;
      else
        t1 = $3[45];
      let t2;
      if ($3[46] !== oauthStatus.toRetry)
        t2 = oauthStatus.toRetry && /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
            color: "permission",
            children: [
              "Press ",
              /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedText, {
                bold: !0,
                children: "Enter"
              }, void 0, !1, void 0, this),
              " to retry."
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[46] = oauthStatus.toRetry, $3[47] = t2;
      else
        t2 = $3[47];
      let t3;
      if ($3[48] !== t1 || $3[49] !== t2)
        t3 = /* @__PURE__ */ jsx_dev_runtime71.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          gap: 1,
          children: [
            t1,
            t2
          ]
        }, void 0, !0, void 0, this), $3[48] = t1, $3[49] = t2, $3[50] = t3;
      else
        t3 = $3[50];
      return t3;
    }
    default:
      return null;
  }
}
