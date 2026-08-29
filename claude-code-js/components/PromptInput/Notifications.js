// Original: src/components/PromptInput/Notifications.tsx
function Notifications(t0) {
  let $3 = import_compiler_runtime319.c(34), {
    apiKeyStatus,
    autoUpdaterResult,
    debug,
    isAutoUpdating,
    verbose,
    messages,
    onAutoUpdaterResult,
    onChangeIsUpdating,
    ideSelection,
    mcpClients,
    isInputWrapped: t1,
    isNarrow: t2
  } = t0, isInputWrapped = t1 === void 0 ? !1 : t1, isNarrow = t2 === void 0 ? !1 : t2, t3;
  if ($3[0] !== messages) {
    let messagesForTokenCount = getMessagesAfterCompactBoundary(messages);
    t3 = tokenCountFromLastAPIResponse(messagesForTokenCount), $3[0] = messages, $3[1] = t3;
  } else
    t3 = $3[1];
  let tokenUsage = t3, mainLoopModel = useMainLoopModel(), t4;
  if ($3[2] !== mainLoopModel || $3[3] !== tokenUsage)
    t4 = calculateTokenWarningState(tokenUsage, mainLoopModel), $3[2] = mainLoopModel, $3[3] = tokenUsage, $3[4] = t4;
  else
    t4 = $3[4];
  let isShowingCompactMessage = t4.isAboveWarningThreshold, {
    status: ideStatus
  } = useIdeConnectionStatus(mcpClients), notifications = useAppState(_temp193), {
    addNotification,
    removeNotification
  } = useNotifications(), claudeAiLimits = useClaudeAiLimits(), t5, t6;
  if ($3[5] !== addNotification)
    t5 = () => {
      return setEnvHookNotifier((text2, isError3) => {
        addNotification({
          key: "env-hook",
          text: text2,
          color: isError3 ? "error" : void 0,
          priority: isError3 ? "medium" : "low",
          timeoutMs: isError3 ? 8000 : 5000
        });
      }), _temp279;
    }, t6 = [addNotification], $3[5] = addNotification, $3[6] = t5, $3[7] = t6;
  else
    t5 = $3[6], t6 = $3[7];
  import_react233.useEffect(t5, t6);
  let shouldShowAutoUpdater = !(ideStatus === "connected" && (ideSelection?.filePath || ideSelection?.text && ideSelection.lineCount > 0)) || isAutoUpdating || autoUpdaterResult?.status !== "success", isInOverageMode = claudeAiLimits.isUsingOverage, t7;
  if ($3[8] === Symbol.for("react.memo_cache_sentinel"))
    t7 = getSubscriptionType(), $3[8] = t7;
  else
    t7 = $3[8];
  let subscriptionType = t7, isTeamOrEnterprise = subscriptionType === "team" || subscriptionType === "enterprise", t8;
  if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
    t8 = getExternalEditor(), $3[9] = t8;
  else
    t8 = $3[9];
  let editor = t8, shouldShowExternalEditorHint = isInputWrapped && !isShowingCompactMessage && apiKeyStatus !== "invalid" && apiKeyStatus !== "missing" && editor !== void 0, t10, t9;
  if ($3[10] !== addNotification || $3[11] !== removeNotification || $3[12] !== shouldShowExternalEditorHint)
    t9 = () => {
      if (shouldShowExternalEditorHint && editor)
        logEvent("tengu_external_editor_hint_shown", {}), addNotification({
          key: "external-editor-hint",
          jsx: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
            dimColor: !0,
            children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ConfigurableShortcutHint, {
              action: "chat:externalEditor",
              context: "Chat",
              fallback: "ctrl+g",
              description: `edit in ${toIDEDisplayName(editor)}`
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          priority: "immediate",
          timeoutMs: 5000
        });
      else
        removeNotification("external-editor-hint");
    }, t10 = [shouldShowExternalEditorHint, editor, addNotification, removeNotification], $3[10] = addNotification, $3[11] = removeNotification, $3[12] = shouldShowExternalEditorHint, $3[13] = t10, $3[14] = t9;
  else
    t10 = $3[13], t9 = $3[14];
  import_react233.useEffect(t9, t10);
  let t11 = isNarrow ? "flex-start" : "flex-end", t12 = isInOverageMode ?? !1, t13;
  if ($3[15] !== apiKeyStatus || $3[16] !== autoUpdaterResult || $3[17] !== debug || $3[18] !== ideSelection || $3[19] !== isAutoUpdating || $3[20] !== isShowingCompactMessage || $3[21] !== mainLoopModel || $3[22] !== mcpClients || $3[23] !== notifications || $3[24] !== onAutoUpdaterResult || $3[25] !== onChangeIsUpdating || $3[26] !== shouldShowAutoUpdater || $3[27] !== t12 || $3[28] !== tokenUsage || $3[29] !== verbose)
    t13 = /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(NotificationContent, {
      ideSelection,
      mcpClients,
      notifications,
      isInOverageMode: t12,
      isTeamOrEnterprise,
      apiKeyStatus,
      debug,
      verbose,
      tokenUsage,
      mainLoopModel,
      shouldShowAutoUpdater,
      autoUpdaterResult,
      isAutoUpdating,
      isShowingCompactMessage,
      onAutoUpdaterResult,
      onChangeIsUpdating
    }, void 0, !1, void 0, this), $3[15] = apiKeyStatus, $3[16] = autoUpdaterResult, $3[17] = debug, $3[18] = ideSelection, $3[19] = isAutoUpdating, $3[20] = isShowingCompactMessage, $3[21] = mainLoopModel, $3[22] = mcpClients, $3[23] = notifications, $3[24] = onAutoUpdaterResult, $3[25] = onChangeIsUpdating, $3[26] = shouldShowAutoUpdater, $3[27] = t12, $3[28] = tokenUsage, $3[29] = verbose, $3[30] = t13;
  else
    t13 = $3[30];
  let t14;
  if ($3[31] !== t11 || $3[32] !== t13)
    t14 = /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(SentryErrorBoundary, {
      children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        alignItems: t11,
        flexShrink: 0,
        overflowX: "hidden",
        children: t13
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[31] = t11, $3[32] = t13, $3[33] = t14;
  else
    t14 = $3[33];
  return t14;
}
function _temp279() {
  return setEnvHookNotifier(null);
}
function _temp193(s2) {
  return s2.notifications;
}
function NotificationContent({
  ideSelection,
  mcpClients,
  notifications,
  isInOverageMode,
  isTeamOrEnterprise,
  apiKeyStatus,
  debug,
  verbose,
  tokenUsage,
  mainLoopModel,
  shouldShowAutoUpdater,
  autoUpdaterResult,
  isAutoUpdating,
  isShowingCompactMessage,
  onAutoUpdaterResult,
  onChangeIsUpdating
}) {
  let [apiKeyHelperSlow, setApiKeyHelperSlow] = import_react233.useState(null);
  import_react233.useEffect(() => {
    if (!getConfiguredApiKeyHelper())
      return;
    let interval = setInterval((setSlow) => {
      let ms = getApiKeyHelperElapsedMs(), next2 = ms >= 1e4 ? formatDuration(ms) : null;
      setSlow((prev) => next2 === prev ? prev : next2);
    }, 1000, setApiKeyHelperSlow);
    return () => clearInterval(interval);
  }, []);
  let voiceState = useVoiceState((s2) => s2.voiceState), voiceEnabled = useVoiceEnabled(), voiceError = useVoiceState((s_0) => s_0.voiceError), isBriefOnly = useAppState((s_1) => s_1.isBriefOnly);
  if (voiceEnabled && (voiceState === "recording" || voiceState === "processing"))
    return /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(VoiceIndicator, {
      voiceState
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(jsx_dev_runtime411.Fragment, {
    children: [
      /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(IdeStatusIndicator, {
        ideSelection,
        mcpClients
      }, void 0, !1, void 0, this),
      notifications.current && ("jsx" in notifications.current ? /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
        wrap: "truncate",
        children: notifications.current.jsx
      }, notifications.current.key, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
        color: notifications.current.color,
        dimColor: !notifications.current.color,
        wrap: "truncate",
        children: notifications.current.text
      }, void 0, !1, void 0, this)),
      isInOverageMode && !isTeamOrEnterprise && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
          dimColor: !0,
          wrap: "truncate",
          children: "Now using extra usage"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      apiKeyHelperSlow && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
            color: "warning",
            wrap: "truncate",
            children: [
              "apiKeyHelper is taking a while",
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
            dimColor: !0,
            wrap: "truncate",
            children: [
              "(",
              apiKeyHelperSlow,
              ")"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      (apiKeyStatus === "invalid" || apiKeyStatus === "missing") && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
          color: "error",
          wrap: "truncate",
          children: isEnvTruthy(process.env.CLAUDE_CODE_REMOTE) ? "Authentication error \xB7 Try again" : "Not logged in \xB7 Run /login"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      debug && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
          color: "warning",
          wrap: "truncate",
          children: "Debug mode"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      apiKeyStatus !== "invalid" && apiKeyStatus !== "missing" && verbose && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
          dimColor: !0,
          wrap: "truncate",
          children: [
            tokenUsage,
            " tokens"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      !isBriefOnly && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(TokenWarning, {
        tokenUsage,
        model: mainLoopModel
      }, void 0, !1, void 0, this),
      shouldShowAutoUpdater && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(AutoUpdaterWrapper, {
        verbose,
        onAutoUpdaterResult,
        autoUpdaterResult,
        isUpdating: isAutoUpdating,
        onChangeIsUpdating,
        showSuccessMessage: !isShowingCompactMessage
      }, void 0, !1, void 0, this),
      voiceEnabled && voiceError && /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedBox_default, {
        children: /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(ThemedText, {
          color: "error",
          wrap: "truncate",
          children: voiceError
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(MemoryUsageIndicator, {}, void 0, !1, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime411.jsxDEV(SandboxPromptFooterHint, {}, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_compiler_runtime319, import_react233, jsx_dev_runtime411, VoiceIndicator = () => null, FOOTER_TEMPORARY_STATUS_TIMEOUT = 5000;
var init_Notifications = __esm(() => {
  init_notifications();
  init_AppState();
  init_voice();
  init_useIdeConnectionStatus();
  init_useMainLoopModel();
  init_useVoiceEnabled();
  init_ink2();
  init_claudeAiLimitsHook();
  init_autoCompact();
  init_auth14();
  init_editor();
  init_envUtils();
  init_format();
  init_fileChangedWatcher();
  init_ide();
  init_messages3();
  init_tokens();
  init_AutoUpdaterWrapper();
  init_ConfigurableShortcutHint();
  init_IdeStatusIndicator();
  init_MemoryUsageIndicator();
  init_SentryErrorBoundary();
  init_TokenWarning();
  init_SandboxPromptFooterHint();
  import_compiler_runtime319 = __toESM(require_react_compiler_runtime_development(), 1), import_react233 = __toESM(require_react_development(), 1), jsx_dev_runtime411 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
