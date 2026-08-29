// Original: src/components/messages/AssistantTextMessage.tsx
function InvalidApiKeyMessage() {
  let $3 = import_compiler_runtime65.c(2), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = isMacOsKeychainLocked(), $3[0] = t0;
  else
    t0 = $3[0];
  let isKeychainLocked = t0, t1;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: INVALID_API_KEY_ERROR_MESSAGE
          }, void 0, !1, void 0, this),
          isKeychainLocked && /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "\xB7 Run in another terminal: security unlock-keychain"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[1] = t1;
  else
    t1 = $3[1];
  return t1;
}
function AssistantTextMessage(t0) {
  let $3 = import_compiler_runtime65.c(34), {
    param: t1,
    addMargin,
    shouldShowDot,
    verbose,
    onOpenRateLimitOptions
  } = t0, {
    text: text2
  } = t1, isSelected = import_react63.useContext(MessageActionsSelectedContext);
  if (isEmptyMessageText(text2))
    return null;
  if (isRateLimitErrorMessage(text2)) {
    let t2;
    if ($3[0] !== onOpenRateLimitOptions || $3[1] !== text2)
      t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(RateLimitMessage, {
        text: text2,
        onOpenRateLimitOptions
      }, void 0, !1, void 0, this), $3[0] = onOpenRateLimitOptions, $3[1] = text2, $3[2] = t2;
    else
      t2 = $3[2];
    return t2;
  }
  switch (text2) {
    case NO_RESPONSE_REQUESTED:
      return null;
    case PROMPT_TOO_LONG_ERROR_MESSAGE: {
      let t2;
      if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
        t2 = getUpgradeMessage("warning"), $3[3] = t2;
      else
        t2 = $3[3];
      let upgradeHint = t2, t3;
      if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
        t3 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: [
              "Context limit reached \xB7 /compact or /clear to continue",
              upgradeHint ? ` \xB7 ${upgradeHint}` : ""
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[4] = t3;
      else
        t3 = $3[4];
      return t3;
    }
    case CREDIT_BALANCE_TOO_LOW_ERROR_MESSAGE: {
      let t2;
      if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: "Credit balance too low \xB7 Add funds: https://platform.claude.com/settings/billing"
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[5] = t2;
      else
        t2 = $3[5];
      return t2;
    }
    case INVALID_API_KEY_ERROR_MESSAGE: {
      let t2;
      if ($3[6] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(InvalidApiKeyMessage, {}, void 0, !1, void 0, this), $3[6] = t2;
      else
        t2 = $3[6];
      return t2;
    }
    case INVALID_API_KEY_ERROR_MESSAGE_EXTERNAL: {
      let t2;
      if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: INVALID_API_KEY_ERROR_MESSAGE_EXTERNAL
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[7] = t2;
      else
        t2 = $3[7];
      return t2;
    }
    case ORG_DISABLED_ERROR_MESSAGE_ENV_KEY:
    case ORG_DISABLED_ERROR_MESSAGE_ENV_KEY_WITH_OAUTH: {
      let t2;
      if ($3[8] !== text2)
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: text2
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[8] = text2, $3[9] = t2;
      else
        t2 = $3[9];
      return t2;
    }
    case TOKEN_REVOKED_ERROR_MESSAGE: {
      let t2;
      if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: TOKEN_REVOKED_ERROR_MESSAGE
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[10] = t2;
      else
        t2 = $3[10];
      return t2;
    }
    case API_TIMEOUT_ERROR_MESSAGE: {
      let t2;
      if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: [
              API_TIMEOUT_ERROR_MESSAGE,
              process.env.API_TIMEOUT_MS && /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(jsx_dev_runtime75.Fragment, {
                children: [
                  " ",
                  "(API_TIMEOUT_MS=",
                  process.env.API_TIMEOUT_MS,
                  "ms, try increasing it)"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[11] = t2;
      else
        t2 = $3[11];
      return t2;
    }
    case CUSTOM_OFF_SWITCH_MESSAGE: {
      let t2;
      if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
          color: "error",
          children: "We are experiencing high demand for Opus 4."
        }, void 0, !1, void 0, this), $3[12] = t2;
      else
        t2 = $3[12];
      let t3;
      if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
        t3 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            gap: 1,
            children: [
              t2,
              /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
                children: [
                  "To continue immediately, use /model to switch to",
                  " ",
                  renderModelName(getDefaultSonnetModel()),
                  " and continue coding."
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this), $3[13] = t3;
      else
        t3 = $3[13];
      return t3;
    }
    case ERROR_MESSAGE_USER_ABORT: {
      let t2;
      if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
        t2 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(InterruptedByUser, {}, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[14] = t2;
      else
        t2 = $3[14];
      return t2;
    }
    default: {
      if (startsWithApiErrorPrefix(text2)) {
        let truncated = !verbose && text2.length > MAX_API_ERROR_CHARS, t22 = text2 === API_ERROR_MESSAGE_PREFIX ? `${API_ERROR_MESSAGE_PREFIX}: Please wait a moment and try again.` : truncated ? text2.slice(0, MAX_API_ERROR_CHARS) + "\u2026" : text2, t32;
        if ($3[15] !== t22)
          t32 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: "error",
            children: t22
          }, void 0, !1, void 0, this), $3[15] = t22, $3[16] = t32;
        else
          t32 = $3[16];
        let t42;
        if ($3[17] !== truncated)
          t42 = truncated && /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this), $3[17] = truncated, $3[18] = t42;
        else
          t42 = $3[18];
        let t52;
        if ($3[19] !== t32 || $3[20] !== t42)
          t52 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(MessageResponse, {
            children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              children: [
                t32,
                t42
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this), $3[19] = t32, $3[20] = t42, $3[21] = t52;
        else
          t52 = $3[21];
        return t52;
      }
      let t2 = addMargin ? 1 : 0, t3 = isSelected ? "messageActionsBackground" : void 0, t4;
      if ($3[22] !== isSelected || $3[23] !== shouldShowDot)
        t4 = shouldShowDot && /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(NoSelect, {
          fromLeftEdge: !0,
          minWidth: 2,
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedText, {
            color: isSelected ? "suggestion" : "text",
            children: BLACK_CIRCLE
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[22] = isSelected, $3[23] = shouldShowDot, $3[24] = t4;
      else
        t4 = $3[24];
      let t5;
      if ($3[25] !== text2)
        t5 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(Markdown, {
            children: text2
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this), $3[25] = text2, $3[26] = t5;
      else
        t5 = $3[26];
      let t6;
      if ($3[27] !== t4 || $3[28] !== t5)
        t6 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            t4,
            t5
          ]
        }, void 0, !0, void 0, this), $3[27] = t4, $3[28] = t5, $3[29] = t6;
      else
        t6 = $3[29];
      let t7;
      if ($3[30] !== t2 || $3[31] !== t3 || $3[32] !== t6)
        t7 = /* @__PURE__ */ jsx_dev_runtime75.jsxDEV(ThemedBox_default, {
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: t2,
          width: "100%",
          backgroundColor: t3,
          children: t6
        }, void 0, !1, void 0, this), $3[30] = t2, $3[31] = t3, $3[32] = t6, $3[33] = t7;
      else
        t7 = $3[33];
      return t7;
    }
  }
}
var import_compiler_runtime65, import_react63, jsx_dev_runtime75, MAX_API_ERROR_CHARS = 1000;
var init_AssistantTextMessage = __esm(() => {
  init_compact();
  init_rateLimitMessages();
  init_figures2();
  init_ink2();
  init_errors11();
  init_messages3();
  init_contextWindowUpgradeCheck();
  init_model();
  init_macOsKeychainStorage();
  init_CtrlOToExpand();
  init_InterruptedByUser();
  init_Markdown();
  init_MessageResponse();
  init_messageActions();
  init_RateLimitMessage();
  import_compiler_runtime65 = __toESM(require_react_compiler_runtime_development(), 1), import_react63 = __toESM(require_react_development(), 1), jsx_dev_runtime75 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
