// Original: src/components/messages/AssistantToolUseMessage.tsx
function AssistantToolUseMessage(t0) {
  let $3 = import_compiler_runtime68.c(81), {
    param,
    addMargin,
    tools,
    commands: commands7,
    verbose,
    inProgressToolUseIDs,
    progressMessagesForMessage,
    shouldAnimate,
    shouldShowDot,
    inProgressToolCallCount,
    lookups,
    isTranscriptMode
  } = t0, terminalSize = useTerminalSize(), [theme] = useTheme(), bg = useSelectedMessageBg(), pendingWorkerRequest = useAppStateMaybeOutsideOfProvider(_temp17), isClassifierCheckingRaw = useIsClassifierChecking(param.id), permissionMode = useAppStateMaybeOutsideOfProvider(_temp27), hasStrippedRules = useAppStateMaybeOutsideOfProvider(_temp35), isAutoClassifier = permissionMode === "auto" || permissionMode === "plan" && hasStrippedRules, isClassifierChecking2 = !1, t1;
  if ($3[0] !== param.input || $3[1] !== param.name || $3[2] !== tools) {
    bb0: {
      if (!tools) {
        t1 = null;
        break bb0;
      }
      let tool = findToolByName(tools, param.name);
      if (!tool) {
        t1 = null;
        break bb0;
      }
      let input = tool.inputSchema.safeParse(param.input), data = input.success ? input.data : void 0;
      t1 = {
        tool,
        input,
        userFacingToolName: tool.userFacingName(data),
        userFacingToolNameBackgroundColor: tool.userFacingNameBackgroundColor?.(data),
        isTransparentWrapper: tool.isTransparentWrapper?.() ?? !1
      };
    }
    $3[0] = param.input, $3[1] = param.name, $3[2] = tools, $3[3] = t1;
  } else
    t1 = $3[3];
  let parsed = t1;
  if (!parsed)
    return logError2(Error(tools ? `Tool ${param.name} not found` : `Tools array is undefined for tool ${param.name}`)), null;
  let {
    tool: tool_0,
    input: input_0,
    userFacingToolName,
    userFacingToolNameBackgroundColor,
    isTransparentWrapper
  } = parsed, t2;
  if ($3[4] !== lookups.resolvedToolUseIDs || $3[5] !== param.id)
    t2 = lookups.resolvedToolUseIDs.has(param.id), $3[4] = lookups.resolvedToolUseIDs, $3[5] = param.id, $3[6] = t2;
  else
    t2 = $3[6];
  let isResolved = t2, t3;
  if ($3[7] !== inProgressToolUseIDs || $3[8] !== isResolved || $3[9] !== param.id)
    t3 = !inProgressToolUseIDs.has(param.id) && !isResolved, $3[7] = inProgressToolUseIDs, $3[8] = isResolved, $3[9] = param.id, $3[10] = t3;
  else
    t3 = $3[10];
  let isQueued = t3, isWaitingForPermission = pendingWorkerRequest?.toolUseId === param.id;
  if (isTransparentWrapper) {
    if (isQueued || isResolved)
      return null;
    let t42;
    if ($3[11] !== inProgressToolCallCount || $3[12] !== isTranscriptMode || $3[13] !== lookups || $3[14] !== param.id || $3[15] !== progressMessagesForMessage || $3[16] !== terminalSize || $3[17] !== tool_0 || $3[18] !== tools || $3[19] !== verbose)
      t42 = renderToolUseProgressMessage2(tool_0, tools, lookups, param.id, progressMessagesForMessage, {
        verbose,
        inProgressToolCallCount,
        isTranscriptMode
      }, terminalSize), $3[11] = inProgressToolCallCount, $3[12] = isTranscriptMode, $3[13] = lookups, $3[14] = param.id, $3[15] = progressMessagesForMessage, $3[16] = terminalSize, $3[17] = tool_0, $3[18] = tools, $3[19] = verbose, $3[20] = t42;
    else
      t42 = $3[20];
    let t52;
    if ($3[21] !== bg || $3[22] !== t42)
      t52 = /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        width: "100%",
        backgroundColor: bg,
        children: t42
      }, void 0, !1, void 0, this), $3[21] = bg, $3[22] = t42, $3[23] = t52;
    else
      t52 = $3[23];
    return t52;
  }
  if (userFacingToolName === "")
    return null;
  let t4;
  if ($3[24] !== commands7 || $3[25] !== input_0.data || $3[26] !== input_0.success || $3[27] !== theme || $3[28] !== tool_0 || $3[29] !== verbose)
    t4 = input_0.success ? renderToolUseMessage4(tool_0, input_0.data, {
      theme,
      verbose,
      commands: commands7
    }) : null, $3[24] = commands7, $3[25] = input_0.data, $3[26] = input_0.success, $3[27] = theme, $3[28] = tool_0, $3[29] = verbose, $3[30] = t4;
  else
    t4 = $3[30];
  let renderedToolUseMessage = t4;
  if (renderedToolUseMessage === null)
    return null;
  let t5 = addMargin ? 1 : 0, t6 = stringWidth(userFacingToolName) + (shouldShowDot ? 2 : 0), t7;
  if ($3[31] !== isQueued || $3[32] !== isResolved || $3[33] !== lookups.erroredToolUseIDs || $3[34] !== param.id || $3[35] !== shouldAnimate || $3[36] !== shouldShowDot)
    t7 = shouldShowDot && (isQueued ? /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
      minWidth: 2,
      children: /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedText, {
        dimColor: isQueued,
        children: BLACK_CIRCLE
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ToolUseLoader, {
      shouldAnimate,
      isUnresolved: !isResolved,
      isError: lookups.erroredToolUseIDs.has(param.id)
    }, void 0, !1, void 0, this)), $3[31] = isQueued, $3[32] = isResolved, $3[33] = lookups.erroredToolUseIDs, $3[34] = param.id, $3[35] = shouldAnimate, $3[36] = shouldShowDot, $3[37] = t7;
  else
    t7 = $3[37];
  let t8 = userFacingToolNameBackgroundColor ? "inverseText" : void 0, t9;
  if ($3[38] !== t8 || $3[39] !== userFacingToolName || $3[40] !== userFacingToolNameBackgroundColor)
    t9 = /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      children: /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedText, {
        bold: !0,
        wrap: "truncate-end",
        backgroundColor: userFacingToolNameBackgroundColor,
        color: t8,
        children: userFacingToolName
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[38] = t8, $3[39] = userFacingToolName, $3[40] = userFacingToolNameBackgroundColor, $3[41] = t9;
  else
    t9 = $3[41];
  let t10;
  if ($3[42] !== renderedToolUseMessage)
    t10 = renderedToolUseMessage !== "" && /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
      flexWrap: "nowrap",
      children: /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedText, {
        children: [
          "(",
          renderedToolUseMessage,
          ")"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[42] = renderedToolUseMessage, $3[43] = t10;
  else
    t10 = $3[43];
  let t11;
  if ($3[44] !== input_0.data || $3[45] !== input_0.success || $3[46] !== tool_0)
    t11 = input_0.success && tool_0.renderToolUseTag && tool_0.renderToolUseTag(input_0.data), $3[44] = input_0.data, $3[45] = input_0.success, $3[46] = tool_0, $3[47] = t11;
  else
    t11 = $3[47];
  let t12;
  if ($3[48] !== t10 || $3[49] !== t11 || $3[50] !== t6 || $3[51] !== t7 || $3[52] !== t9)
    t12 = /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      flexWrap: "nowrap",
      minWidth: t6,
      children: [
        t7,
        t9,
        t10,
        t11
      ]
    }, void 0, !0, void 0, this), $3[48] = t10, $3[49] = t11, $3[50] = t6, $3[51] = t7, $3[52] = t9, $3[53] = t12;
  else
    t12 = $3[53];
  let t13;
  if ($3[54] !== inProgressToolCallCount || $3[55] !== isAutoClassifier || $3[56] !== !1 || $3[57] !== isQueued || $3[58] !== isResolved || $3[59] !== isTranscriptMode || $3[60] !== isWaitingForPermission || $3[61] !== lookups || $3[62] !== param.id || $3[63] !== progressMessagesForMessage || $3[64] !== terminalSize || $3[65] !== tool_0 || $3[66] !== tools || $3[67] !== verbose)
    t13 = !isResolved && !isQueued && (isWaitingForPermission ? /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Waiting for permission\u2026"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : renderToolUseProgressMessage2(tool_0, tools, lookups, param.id, progressMessagesForMessage, {
      verbose,
      inProgressToolCallCount,
      isTranscriptMode
    }, terminalSize)), $3[54] = inProgressToolCallCount, $3[55] = isAutoClassifier, $3[56] = !1, $3[57] = isQueued, $3[58] = isResolved, $3[59] = isTranscriptMode, $3[60] = isWaitingForPermission, $3[61] = lookups, $3[62] = param.id, $3[63] = progressMessagesForMessage, $3[64] = terminalSize, $3[65] = tool_0, $3[66] = tools, $3[67] = verbose, $3[68] = t13;
  else
    t13 = $3[68];
  let t14;
  if ($3[69] !== isQueued || $3[70] !== isResolved || $3[71] !== tool_0)
    t14 = !isResolved && isQueued && renderToolUseQueuedMessage(tool_0), $3[69] = isQueued, $3[70] = isResolved, $3[71] = tool_0, $3[72] = t14;
  else
    t14 = $3[72];
  let t15;
  if ($3[73] !== t12 || $3[74] !== t13 || $3[75] !== t14)
    t15 = /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t12,
        t13,
        t14
      ]
    }, void 0, !0, void 0, this), $3[73] = t12, $3[74] = t13, $3[75] = t14, $3[76] = t15;
  else
    t15 = $3[76];
  let t16;
  if ($3[77] !== bg || $3[78] !== t15 || $3[79] !== t5)
    t16 = /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: t5,
      width: "100%",
      backgroundColor: bg,
      children: t15
    }, void 0, !1, void 0, this), $3[77] = bg, $3[78] = t15, $3[79] = t5, $3[80] = t16;
  else
    t16 = $3[80];
  return t16;
}
function _temp35(state_1) {
  return !!state_1.toolPermissionContext.strippedDangerousRules;
}
function _temp27(state_0) {
  return state_0.toolPermissionContext.mode;
}
function _temp17(state3) {
  return state3.pendingWorkerRequest;
}
function renderToolUseMessage4(tool, input, {
  theme,
  verbose,
  commands: commands7
}) {
  try {
    let parsed = tool.inputSchema.safeParse(input);
    if (!parsed.success)
      return "";
    return tool.renderToolUseMessage(parsed.data, {
      theme,
      verbose,
      commands: commands7
    });
  } catch (error44) {
    return logError2(Error(`Error rendering tool use message for ${tool.name}: ${error44}`)), "";
  }
}
function renderToolUseProgressMessage2(tool, tools, lookups, toolUseID, progressMessagesForMessage, {
  verbose,
  inProgressToolCallCount,
  isTranscriptMode
}, terminalSize) {
  let toolProgressMessages = progressMessagesForMessage.filter((msg) => msg.data.type !== "hook_progress");
  try {
    let toolMessages = tool.renderToolUseProgressMessage?.(toolProgressMessages, {
      tools,
      verbose,
      terminalSize,
      inProgressToolCallCount: inProgressToolCallCount ?? 1,
      isTranscriptMode
    }) ?? null;
    return /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(jsx_dev_runtime78.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(SentryErrorBoundary, {
          children: /* @__PURE__ */ jsx_dev_runtime78.jsxDEV(HookProgressMessage, {
            hookEvent: "PreToolUse",
            lookups,
            toolUseID,
            verbose,
            isTranscriptMode
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        toolMessages
      ]
    }, void 0, !0, void 0, this);
  } catch (error44) {
    return logError2(Error(`Error rendering tool use progress message for ${tool.name}: ${error44}`)), null;
  }
}
function renderToolUseQueuedMessage(tool) {
  try {
    return tool.renderToolUseQueuedMessage?.();
  } catch (error44) {
    return logError2(Error(`Error rendering tool use queued message for ${tool.name}: ${error44}`)), null;
  }
}
var import_compiler_runtime68, jsx_dev_runtime78;
var init_AssistantToolUseMessage = __esm(() => {
  init_useTerminalSize();
  init_figures2();
  init_stringWidth();
  init_ink2();
  init_AppState();
  init_Tool();
  init_classifierApprovalsHook();
  init_log3();
  init_MessageResponse();
  init_messageActions();
  init_SentryErrorBoundary();
  init_ToolUseLoader();
  init_HookProgressMessage();
  import_compiler_runtime68 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime78 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
