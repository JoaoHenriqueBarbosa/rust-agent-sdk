// Original: src/components/permissions/BashPermissionRequest/BashPermissionRequest.tsx
function BashPermissionRequest(props) {
  let $3 = import_compiler_runtime299.c(21), {
    toolUseConfirm,
    toolUseContext,
    onDone,
    onReject,
    verbose,
    workerBadge
  } = props, command19, description, t0;
  if ($3[0] !== toolUseConfirm.input)
    ({
      command: command19,
      description
    } = BashTool.inputSchema.parse(toolUseConfirm.input)), t0 = parseSedEditCommand(command19), $3[0] = toolUseConfirm.input, $3[1] = command19, $3[2] = description, $3[3] = t0;
  else
    command19 = $3[1], description = $3[2], t0 = $3[3];
  let sedInfo = t0;
  if (sedInfo) {
    let t12;
    if ($3[4] !== onDone || $3[5] !== onReject || $3[6] !== sedInfo || $3[7] !== toolUseConfirm || $3[8] !== toolUseContext || $3[9] !== verbose || $3[10] !== workerBadge)
      t12 = /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(SedEditPermissionRequest, {
        toolUseConfirm,
        toolUseContext,
        onDone,
        onReject,
        verbose,
        workerBadge,
        sedInfo
      }, void 0, !1, void 0, this), $3[4] = onDone, $3[5] = onReject, $3[6] = sedInfo, $3[7] = toolUseConfirm, $3[8] = toolUseContext, $3[9] = verbose, $3[10] = workerBadge, $3[11] = t12;
    else
      t12 = $3[11];
    return t12;
  }
  let t1;
  if ($3[12] !== command19 || $3[13] !== description || $3[14] !== onDone || $3[15] !== onReject || $3[16] !== toolUseConfirm || $3[17] !== toolUseContext || $3[18] !== verbose || $3[19] !== workerBadge)
    t1 = /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(BashPermissionRequestInner, {
      toolUseConfirm,
      toolUseContext,
      onDone,
      onReject,
      verbose,
      workerBadge,
      command: command19,
      description
    }, void 0, !1, void 0, this), $3[12] = command19, $3[13] = description, $3[14] = onDone, $3[15] = onReject, $3[16] = toolUseConfirm, $3[17] = toolUseContext, $3[18] = verbose, $3[19] = workerBadge, $3[20] = t1;
  else
    t1 = $3[20];
  return t1;
}
function BashPermissionRequestInner({
  toolUseConfirm,
  toolUseContext,
  onDone,
  onReject,
  verbose: _verbose,
  workerBadge,
  command: command19,
  description
}) {
  let [theme2] = useTheme(), toolPermissionContext = useAppState((s2) => s2.toolPermissionContext), explainerState = usePermissionExplainerUI({
    toolName: toolUseConfirm.tool.name,
    toolInput: toolUseConfirm.input,
    toolDescription: toolUseConfirm.description,
    messages: toolUseContext.messages
  }), {
    yesInputMode,
    noInputMode,
    yesFeedbackModeEntered,
    noFeedbackModeEntered,
    acceptFeedback,
    rejectFeedback,
    setAcceptFeedback,
    setRejectFeedback,
    focusedOption,
    handleInputModeToggle,
    handleReject: handleReject2,
    handleFocus
  } = useShellPermissionFeedback({
    toolUseConfirm,
    onDone,
    onReject,
    explainerVisible: explainerState.visible
  }), [showPermissionDebug, setShowPermissionDebug] = import_react215.useState(!1), [classifierDescription, setClassifierDescription] = import_react215.useState(description || ""), [initialClassifierDescriptionEmpty, setInitialClassifierDescriptionEmpty] = import_react215.useState(!description?.trim());
  import_react215.useEffect(() => {
    if (!isClassifierPermissionsEnabled())
      return;
    let abortController = new AbortController;
    return generateGenericDescription(command19, description, abortController.signal).then((generic) => {
      if (generic && !abortController.signal.aborted)
        setClassifierDescription(generic), setInitialClassifierDescriptionEmpty(!1);
    }).catch(() => {}), () => abortController.abort();
  }, [command19, description]);
  let isCompound = toolUseConfirm.permissionResult.decisionReason?.type === "subcommandResults", [editablePrefix, setEditablePrefix] = import_react215.useState(() => {
    if (isCompound) {
      let backendBashRules = extractRules("suggestions" in toolUseConfirm.permissionResult ? toolUseConfirm.permissionResult.suggestions : void 0).filter((r4) => r4.toolName === BashTool.name && r4.ruleContent);
      return backendBashRules.length === 1 ? backendBashRules[0].ruleContent : void 0;
    }
    let two = getSimpleCommandPrefix(command19);
    if (two)
      return `${two}:*`;
    let one = getFirstWordPrefix(command19);
    if (one)
      return `${one}:*`;
    return command19;
  }), hasUserEditedPrefix = import_react215.useRef(!1), onEditablePrefixChange = import_react215.useCallback((value) => {
    hasUserEditedPrefix.current = !0, setEditablePrefix(value);
  }, []);
  import_react215.useEffect(() => {
    if (isCompound)
      return;
    let cancelled = !1;
    return getCompoundCommandPrefixesStatic(command19, (subcmd) => BashTool.isReadOnly({
      command: subcmd
    })).then((prefixes) => {
      if (cancelled || hasUserEditedPrefix.current)
        return;
      if (prefixes.length > 0)
        setEditablePrefix(`${prefixes[0]}:*`);
    }).catch(() => {}), () => {
      cancelled = !0;
    };
  }, [command19, isCompound]);
  let [classifierWasChecking] = import_react215.useState(!1), {
    destructiveWarning: destructiveWarning_0,
    sandboxingEnabled: sandboxingEnabled_0,
    isSandboxed: isSandboxed_0
  } = import_react215.useMemo(() => {
    let sandboxingEnabled = SandboxManager2.isSandboxingEnabled(), isSandboxed = sandboxingEnabled && shouldUseSandbox(toolUseConfirm.input);
    return {
      destructiveWarning: null,
      sandboxingEnabled,
      isSandboxed
    };
  }, [command19, toolUseConfirm.input]), unaryEvent = import_react215.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  usePermissionRequestLogging(toolUseConfirm, unaryEvent);
  let existingAllowDescriptions = import_react215.useMemo(() => getBashPromptAllowDescriptions(toolPermissionContext), [toolPermissionContext]), options2 = import_react215.useMemo(() => bashToolUseOptions({
    suggestions: toolUseConfirm.permissionResult.behavior === "ask" ? toolUseConfirm.permissionResult.suggestions : void 0,
    decisionReason: toolUseConfirm.permissionResult.decisionReason,
    onRejectFeedbackChange: setRejectFeedback,
    onAcceptFeedbackChange: setAcceptFeedback,
    onClassifierDescriptionChange: setClassifierDescription,
    classifierDescription,
    initialClassifierDescriptionEmpty,
    existingAllowDescriptions,
    yesInputMode,
    noInputMode,
    editablePrefix,
    onEditablePrefixChange
  }), [toolUseConfirm, classifierDescription, initialClassifierDescriptionEmpty, existingAllowDescriptions, yesInputMode, noInputMode, editablePrefix, onEditablePrefixChange]), handleToggleDebug = import_react215.useCallback(() => {
    setShowPermissionDebug((prev) => !prev);
  }, []);
  useKeybinding("permission:toggleDebug", handleToggleDebug, {
    context: "Confirmation"
  });
  let handleDismissCheckmark = import_react215.useCallback(() => {
    toolUseConfirm.onDismissCheckmark?.();
  }, [toolUseConfirm]);
  useKeybinding("confirm:no", handleDismissCheckmark, {
    context: "Confirmation",
    isActive: !1
  });
  function onSelect(value_0) {
    logEvent("tengu_permission_request_option_selected", {
      option_index: {
        yes: 1,
        "yes-apply-suggestions": 2,
        "yes-prefix-edited": 2,
        no: 3
      }[value_0],
      explainer_visible: explainerState.visible
    });
    let toolNameForAnalytics = sanitizeToolNameForAnalytics(toolUseConfirm.tool.name);
    if (value_0 === "yes-prefix-edited") {
      let trimmedPrefix = (editablePrefix ?? "").trim();
      if (logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept"), !trimmedPrefix)
        toolUseConfirm.onAllow(toolUseConfirm.input, []);
      else {
        let prefixUpdates = [{
          type: "addRules",
          rules: [{
            toolName: BashTool.name,
            ruleContent: trimmedPrefix
          }],
          behavior: "allow",
          destination: "localSettings"
        }];
        toolUseConfirm.onAllow(toolUseConfirm.input, prefixUpdates);
      }
      onDone();
      return;
    }
    switch (value_0) {
      case "yes": {
        let trimmedFeedback_0 = acceptFeedback.trim();
        logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept"), logEvent("tengu_accept_submitted", {
          toolName: toolNameForAnalytics,
          isMcp: toolUseConfirm.tool.isMcp ?? !1,
          has_instructions: !!trimmedFeedback_0,
          instructions_length: trimmedFeedback_0.length,
          entered_feedback_mode: yesFeedbackModeEntered
        }), toolUseConfirm.onAllow(toolUseConfirm.input, [], trimmedFeedback_0 || void 0), onDone();
        break;
      }
      case "yes-apply-suggestions": {
        logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept");
        let permissionUpdates_0 = "suggestions" in toolUseConfirm.permissionResult ? toolUseConfirm.permissionResult.suggestions || [] : [];
        toolUseConfirm.onAllow(toolUseConfirm.input, permissionUpdates_0), onDone();
        break;
      }
      case "no": {
        let trimmedFeedback = rejectFeedback.trim();
        logEvent("tengu_reject_submitted", {
          toolName: toolNameForAnalytics,
          isMcp: toolUseConfirm.tool.isMcp ?? !1,
          has_instructions: !!trimmedFeedback,
          instructions_length: trimmedFeedback.length,
          entered_feedback_mode: noFeedbackModeEntered
        }), handleReject2(trimmedFeedback || void 0);
        break;
      }
    }
  }
  return /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(PermissionDialog, {
    workerBadge,
    title: sandboxingEnabled_0 && !isSandboxed_0 ? "Bash command (unsandboxed)" : "Bash command",
    subtitle: void 0,
    children: [
      /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
            dimColor: explainerState.visible,
            children: BashTool.renderToolUseMessage({
              command: command19,
              description
            }, {
              theme: theme2,
              verbose: !0
            })
          }, void 0, !1, void 0, this),
          !explainerState.visible && /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
            dimColor: !0,
            children: toolUseConfirm.description
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(PermissionExplainerContent, {
            visible: explainerState.visible,
            promise: explainerState.promise
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      showPermissionDebug ? /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(jsx_dev_runtime386.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(PermissionDecisionDebugInfo, {
            permissionResult: toolUseConfirm.permissionResult,
            toolName: "Bash"
          }, void 0, !1, void 0, this),
          toolUseContext.options.debug && /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedBox_default, {
            justifyContent: "flex-end",
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Ctrl-D to hide debug info"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(jsx_dev_runtime386.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(PermissionRuleExplanation, {
                permissionResult: toolUseConfirm.permissionResult,
                toolType: "command"
              }, void 0, !1, void 0, this),
              destructiveWarning_0 && /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedBox_default, {
                marginBottom: 1,
                children: /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
                  color: "warning",
                  dimColor: !1,
                  children: destructiveWarning_0
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
                dimColor: !1,
                children: "Do you want to proceed?"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(Select, {
                options: options2,
                isDisabled: !1,
                inlineDescriptions: !0,
                onChange: onSelect,
                onCancel: () => handleReject2(),
                onFocus: handleFocus,
                onInputModeToggle: handleInputModeToggle
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedBox_default, {
            justifyContent: "space-between",
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "Esc to cancel",
                  (focusedOption === "yes" && !yesInputMode || focusedOption === "no" && !noInputMode) && " \xB7 Tab to amend",
                  explainerState.enabled && ` \xB7 ctrl+e to ${explainerState.visible ? "hide" : "explain"}`
                ]
              }, void 0, !0, void 0, this),
              toolUseContext.options.debug && /* @__PURE__ */ jsx_dev_runtime386.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Ctrl+d to show debug info"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
var import_compiler_runtime299, import_react215, jsx_dev_runtime386;
var init_BashPermissionRequest = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_metadata();
  init_AppState();
  init_BashTool();
  init_bashPermissions();
  init_sedEditParser();
  init_shouldUseSandbox();
  init_prefix2();
  init_PermissionUpdate();
  init_sandbox_adapter();
  init_select();
  init_ShimmerChar();
  init_useShimmerAnimation();
  init_hooks6();
  init_PermissionDecisionDebugInfo();
  init_PermissionDialog();
  init_PermissionExplanation();
  init_PermissionRuleExplanation();
  init_SedEditPermissionRequest();
  init_useShellPermissionFeedback();
  init_utils18();
  init_bashToolUseOptions();
  import_compiler_runtime299 = __toESM(require_react_compiler_runtime_development(), 1), import_react215 = __toESM(require_react_development(), 1), jsx_dev_runtime386 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
