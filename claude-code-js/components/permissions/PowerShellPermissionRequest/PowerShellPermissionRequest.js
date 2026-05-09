// Original: src/components/permissions/PowerShellPermissionRequest/PowerShellPermissionRequest.tsx
function PowerShellPermissionRequest(props) {
  let {
    toolUseConfirm,
    toolUseContext,
    onDone,
    onReject,
    workerBadge
  } = props, {
    command: command19,
    description
  } = PowerShellTool.inputSchema.parse(toolUseConfirm.input), [theme2] = useTheme(), explainerState = usePermissionExplainerUI({
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
  }), destructiveWarning = null, [showPermissionDebug, setShowPermissionDebug] = import_react219.useState(!1), [editablePrefix, setEditablePrefix] = import_react219.useState(command19.includes(`
`) ? void 0 : command19), hasUserEditedPrefix = import_react219.useRef(!1);
  import_react219.useEffect(() => {
    let cancelled = !1;
    return getCompoundCommandPrefixesStatic2(command19, (element) => isAllowlistedCommand(element, element.text)).then((prefixes) => {
      if (cancelled || hasUserEditedPrefix.current)
        return;
      if (prefixes.length > 0)
        setEditablePrefix(`${prefixes[0]}:*`);
    }).catch(() => {}), () => {
      cancelled = !0;
    };
  }, [command19]);
  let onEditablePrefixChange = import_react219.useCallback((value) => {
    hasUserEditedPrefix.current = !0, setEditablePrefix(value);
  }, []), unaryEvent = import_react219.useMemo(() => ({
    completion_type: "tool_use_single",
    language_name: "none"
  }), []);
  usePermissionRequestLogging(toolUseConfirm, unaryEvent);
  let options2 = import_react219.useMemo(() => powershellToolUseOptions({
    suggestions: toolUseConfirm.permissionResult.behavior === "ask" ? toolUseConfirm.permissionResult.suggestions : void 0,
    onRejectFeedbackChange: setRejectFeedback,
    onAcceptFeedbackChange: setAcceptFeedback,
    yesInputMode,
    noInputMode,
    editablePrefix,
    onEditablePrefixChange
  }), [toolUseConfirm, yesInputMode, noInputMode, editablePrefix, onEditablePrefixChange]), handleToggleDebug = import_react219.useCallback(() => {
    setShowPermissionDebug((prev) => !prev);
  }, []);
  useKeybinding("permission:toggleDebug", handleToggleDebug, {
    context: "Confirmation"
  });
  function onSelect(value) {
    logEvent("tengu_permission_request_option_selected", {
      option_index: {
        yes: 1,
        "yes-apply-suggestions": 2,
        "yes-prefix-edited": 2,
        no: 3
      }[value],
      explainer_visible: explainerState.visible
    });
    let toolNameForAnalytics = sanitizeToolNameForAnalytics(toolUseConfirm.tool.name);
    if (value === "yes-prefix-edited") {
      let trimmedPrefix = (editablePrefix ?? "").trim();
      if (logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept"), !trimmedPrefix)
        toolUseConfirm.onAllow(toolUseConfirm.input, []);
      else {
        let prefixUpdates = [{
          type: "addRules",
          rules: [{
            toolName: PowerShellTool.name,
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
    switch (value) {
      case "yes": {
        let trimmedFeedback = acceptFeedback.trim();
        logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept"), logEvent("tengu_accept_submitted", {
          toolName: toolNameForAnalytics,
          isMcp: toolUseConfirm.tool.isMcp ?? !1,
          has_instructions: !!trimmedFeedback,
          instructions_length: trimmedFeedback.length,
          entered_feedback_mode: yesFeedbackModeEntered
        }), toolUseConfirm.onAllow(toolUseConfirm.input, [], trimmedFeedback || void 0), onDone();
        break;
      }
      case "yes-apply-suggestions": {
        logUnaryPermissionEvent("tool_use_single", toolUseConfirm, "accept");
        let permissionUpdates = "suggestions" in toolUseConfirm.permissionResult ? toolUseConfirm.permissionResult.suggestions || [] : [];
        toolUseConfirm.onAllow(toolUseConfirm.input, permissionUpdates), onDone();
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
  return /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(PermissionDialog, {
    workerBadge,
    title: "PowerShell command",
    children: [
      /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 2,
        paddingY: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedText, {
            dimColor: explainerState.visible,
            children: PowerShellTool.renderToolUseMessage({
              command: command19,
              description
            }, {
              theme: theme2,
              verbose: !0
            })
          }, void 0, !1, void 0, this),
          !explainerState.visible && /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedText, {
            dimColor: !0,
            children: toolUseConfirm.description
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(PermissionExplainerContent, {
            visible: explainerState.visible,
            promise: explainerState.promise
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      showPermissionDebug ? /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(jsx_dev_runtime397.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(PermissionDecisionDebugInfo, {
            permissionResult: toolUseConfirm.permissionResult,
            toolName: "PowerShell"
          }, void 0, !1, void 0, this),
          toolUseContext.options.debug && /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedBox_default, {
            justifyContent: "flex-end",
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Ctrl-D to hide debug info"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(jsx_dev_runtime397.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(PermissionRuleExplanation, {
                permissionResult: toolUseConfirm.permissionResult,
                toolType: "command"
              }, void 0, !1, void 0, this),
              null,
              /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedText, {
                children: "Do you want to proceed?"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(Select, {
                options: options2,
                inlineDescriptions: !0,
                onChange: onSelect,
                onCancel: () => handleReject2(),
                onFocus: handleFocus,
                onInputModeToggle: handleInputModeToggle
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedBox_default, {
            justifyContent: "space-between",
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "Esc to cancel",
                  (focusedOption === "yes" && !yesInputMode || focusedOption === "no" && !noInputMode) && " \xB7 Tab to amend",
                  explainerState.enabled && ` \xB7 ctrl+e to ${explainerState.visible ? "hide" : "explain"}`
                ]
              }, void 0, !0, void 0, this),
              toolUseContext.options.debug && /* @__PURE__ */ jsx_dev_runtime397.jsxDEV(ThemedText, {
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
var import_react219, jsx_dev_runtime397;
var init_PowerShellPermissionRequest = __esm(() => {
  init_ink2();
  init_useKeybinding();
  init_metadata();
  init_PowerShellTool();
  init_readOnlyValidation2();
  init_staticPrefix();
  init_select();
  init_hooks6();
  init_PermissionDecisionDebugInfo();
  init_PermissionDialog();
  init_PermissionExplanation();
  init_PermissionRuleExplanation();
  init_useShellPermissionFeedback();
  init_utils18();
  init_powershellToolUseOptions();
  import_react219 = __toESM(require_react_development(), 1), jsx_dev_runtime397 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
