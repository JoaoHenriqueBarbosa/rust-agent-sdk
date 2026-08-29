// function: ExitPlanModePermissionRequest
function ExitPlanModePermissionRequest({
  toolUseConfirm,
  onDone,
  onReject,
  workerBadge,
  setStickyFooter
}) {
  let toolPermissionContext = useAppState((s2) => s2.toolPermissionContext), setAppState = useSetAppState(), store = useAppStateStore(), {
    addNotification
  } = useNotifications(), [planFeedback, setPlanFeedback] = import_react216.useState(""), [pastedContents, setPastedContents] = import_react216.useState({}), nextPasteIdRef = import_react216.useRef(0), showClearContext = useAppState((s2) => s2.settings.showClearContextOnPlanAccept) ?? !1, ultraplanSessionUrl = useAppState((s2) => s2.ultraplanSessionUrl), ultraplanLaunching = useAppState((s2) => s2.ultraplanLaunching), showUltraplan = !1, usage = toolUseConfirm.assistantMessage.message.usage, {
    mode,
    isAutoModeAvailable,
    isBypassPermissionsModeAvailable
  } = toolPermissionContext, options2 = import_react216.useMemo(() => buildPlanApprovalOptions({
    showClearContext,
    showUltraplan: !1,
    usedPercent: showClearContext ? getContextUsedPercent(usage, mode) : null,
    isAutoModeAvailable,
    isBypassPermissionsModeAvailable,
    onFeedbackChange: setPlanFeedback
  }), [showClearContext, !1, usage, mode, isAutoModeAvailable, isBypassPermissionsModeAvailable]);
  function onImagePaste(base64Image, mediaType, filename, dimensions, _sourcePath) {
    let pasteId = nextPasteIdRef.current++, newContent = {
      id: pasteId,
      type: "image",
      content: base64Image,
      mediaType: mediaType || "image/png",
      filename: filename || "Pasted image",
      dimensions
    };
    cacheImagePath(newContent), storeImage(newContent), setPastedContents((prev) => ({
      ...prev,
      [pasteId]: newContent
    }));
  }
  let onRemoveImage = import_react216.useCallback((id) => {
    setPastedContents((prev) => {
      let next2 = {
        ...prev
      };
      return delete next2[id], next2;
    });
  }, []), imageAttachments = Object.values(pastedContents).filter((c3) => c3.type === "image"), hasImages = imageAttachments.length > 0, isV2 = toolUseConfirm.tool.name === EXIT_PLAN_MODE_V2_TOOL_NAME, inputPlan = isV2 ? void 0 : toolUseConfirm.input.plan, planFilePath = isV2 ? getPlanFilePath() : void 0, allowedPrompts = toolUseConfirm.input.allowedPrompts, rawPlan = inputPlan ?? getPlan(), isEmpty = !rawPlan || rawPlan.trim() === "", [planStructureVariant] = import_react216.useState(() => getPewterLedgerVariant() ?? void 0), [currentPlan, setCurrentPlan] = import_react216.useState(() => {
    if (inputPlan)
      return inputPlan;
    return getPlan() ?? "No plan found. Please write your plan to the plan file first.";
  }), [showSaveMessage, setShowSaveMessage] = import_react216.useState(!1), [planEditedLocally, setPlanEditedLocally] = import_react216.useState(!1);
  import_react216.useEffect(() => {
    if (showSaveMessage) {
      let timer = setTimeout(setShowSaveMessage, 5000, !1);
      return () => clearTimeout(timer);
    }
  }, [showSaveMessage]);
  let handleKeyDown = (e) => {
    if (e.ctrl && e.key === "g") {
      e.preventDefault(), logEvent("tengu_plan_external_editor_used", {}), (async () => {
        if (isV2 && planFilePath) {
          let result = await editFileInEditor(planFilePath);
          if (result.error)
            addNotification({
              key: "external-editor-error",
              text: result.error,
              color: "warning",
              priority: "high"
            });
          if (result.content !== null) {
            if (result.content !== currentPlan)
              setPlanEditedLocally(!0);
            setCurrentPlan(result.content), setShowSaveMessage(!0);
          }
        } else {
          let result = await editPromptInEditor(currentPlan);
          if (result.error)
            addNotification({
              key: "external-editor-error",
              text: result.error,
              color: "warning",
              priority: "high"
            });
          if (result.content !== null && result.content !== currentPlan)
            setCurrentPlan(result.content), setShowSaveMessage(!0);
        }
      })();
      return;
    }
    if (e.shift && e.key === "tab") {
      e.preventDefault(), handleResponse(showClearContext ? "yes-accept-edits" : "yes-accept-edits-keep-context");
      return;
    }
  };
  async function handleResponse(value) {
    let trimmedFeedback = planFeedback.trim(), acceptFeedback = trimmedFeedback || void 0;
    if (value === "ultraplan") {
      logEvent("tengu_plan_exit", {
        planLengthChars: currentPlan.length,
        outcome: "ultraplan",
        interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
        planStructureVariant
      }), onDone(), onReject(), toolUseConfirm.onReject("Plan being refined via Ultraplan \u2014 please wait for the result."), launchUltraplan2({
        blurb: "",
        seedPlan: currentPlan,
        getAppState: store.getState,
        setAppState: store.setState,
        signal: new AbortController().signal
      }).then((msg) => enqueuePendingNotification({
        value: msg,
        mode: "task-notification"
      })).catch(logError2);
      return;
    }
    let updatedInput = isV2 && !planEditedLocally ? {} : {
      plan: currentPlan
    }, isKeepContextOption = value === "yes-accept-edits-keep-context" || value === "yes-default-keep-context" || !1;
    if (value !== "no")
      autoNameSessionFromPlan(currentPlan, setAppState, !isKeepContextOption);
    if (value !== "no" && !isKeepContextOption) {
      let mode2 = "default";
      if (value === "yes-bypass-permissions")
        mode2 = "bypassPermissions";
      else if (value === "yes-accept-edits")
        mode2 = "acceptEdits";
      logEvent("tengu_plan_exit", {
        planLengthChars: currentPlan.length,
        outcome: value,
        clearContext: !0,
        interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
        planStructureVariant,
        hasFeedback: !!acceptFeedback
      });
      let verificationInstruction = "", transcriptHint = `

If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: ${getTranscriptPath()}`, teamHint = isAgentSwarmsEnabled() ? `

If this plan can be broken down into multiple independent tasks, consider using the ${TEAM_CREATE_TOOL_NAME} tool to create a team and parallelize the work.` : "", feedbackSuffix = acceptFeedback ? `

User feedback on this plan: ${acceptFeedback}` : "";
      setAppState((prev) => ({
        ...prev,
        initialMessage: {
          message: {
            ...createUserMessage({
              content: `Implement the following plan:

${currentPlan}${verificationInstruction}${transcriptHint}${teamHint}${feedbackSuffix}`
            }),
            planContent: currentPlan
          },
          clearContext: !0,
          mode: mode2,
          allowedPrompts
        }
      })), setHasExitedPlanMode(!0), onDone(), onReject(), toolUseConfirm.onReject();
      return;
    }
    let keepContextMode = {
      "yes-accept-edits-keep-context": toolPermissionContext.isBypassPermissionsModeAvailable ? "bypassPermissions" : "acceptEdits",
      "yes-default-keep-context": "default",
      ...{}
    }[value];
    if (keepContextMode) {
      logEvent("tengu_plan_exit", {
        planLengthChars: currentPlan.length,
        outcome: value,
        clearContext: !1,
        interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
        planStructureVariant,
        hasFeedback: !!acceptFeedback
      }), setHasExitedPlanMode(!0), setNeedsPlanModeExitAttachment(!0), onDone(), toolUseConfirm.onAllow(updatedInput, buildPermissionUpdates(keepContextMode, allowedPrompts), acceptFeedback);
      return;
    }
    let standardMode = {
      "yes-bypass-permissions": "bypassPermissions",
      "yes-accept-edits": "acceptEdits"
    }[value];
    if (standardMode) {
      logEvent("tengu_plan_exit", {
        planLengthChars: currentPlan.length,
        outcome: value,
        interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
        planStructureVariant,
        hasFeedback: !!acceptFeedback
      }), setHasExitedPlanMode(!0), setNeedsPlanModeExitAttachment(!0), onDone(), toolUseConfirm.onAllow(updatedInput, buildPermissionUpdates(standardMode, allowedPrompts), acceptFeedback);
      return;
    }
    if (value === "no") {
      if (!trimmedFeedback && !hasImages)
        return;
      logEvent("tengu_plan_exit", {
        planLengthChars: currentPlan.length,
        outcome: "no",
        interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
        planStructureVariant
      });
      let imageBlocks;
      if (hasImages)
        imageBlocks = await Promise.all(imageAttachments.map(async (img) => {
          let block2 = {
            type: "image",
            source: {
              type: "base64",
              media_type: img.mediaType || "image/png",
              data: img.content
            }
          };
          return (await maybeResizeAndDownsampleImageBlock(block2)).block;
        }));
      onDone(), onReject(), toolUseConfirm.onReject(trimmedFeedback || (hasImages ? "(See attached image)" : void 0), imageBlocks && imageBlocks.length > 0 ? imageBlocks : void 0);
    }
  }
  let editor = getExternalEditor(), editorName = editor ? toIDEDisplayName(editor) : null, handleResponseRef = import_react216.useRef(handleResponse);
  handleResponseRef.current = handleResponse;
  let handleCancelRef = import_react216.useRef(void 0);
  handleCancelRef.current = () => {
    logEvent("tengu_plan_exit", {
      planLengthChars: currentPlan.length,
      outcome: "no",
      interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
      planStructureVariant
    }), onDone(), onReject(), toolUseConfirm.onReject();
  };
  let useStickyFooter = !isEmpty && !!setStickyFooter;
  if (import_react216.useLayoutEffect(() => {
    if (!useStickyFooter)
      return;
    return setStickyFooter(/* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: "planMode",
      borderLeft: !1,
      borderRight: !1,
      borderBottom: !1,
      paddingX: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Would you like to proceed?"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(Select, {
            options: options2,
            onChange: (v2) => void handleResponseRef.current(v2),
            onCancel: () => handleCancelRef.current?.(),
            onImagePaste,
            pastedContents,
            onRemoveImage
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        editorName && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          gap: 1,
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "ctrl-g to edit in "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
              bold: !0,
              dimColor: !0,
              children: editorName
            }, void 0, !1, void 0, this),
            isV2 && planFilePath && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                " \xB7 ",
                getDisplayPath(planFilePath)
              ]
            }, void 0, !0, void 0, this),
            showSaveMessage && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(jsx_dev_runtime388.Fragment, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: " \xB7 "
                }, void 0, !1, void 0, this),
                /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                  color: "success",
                  children: [
                    figures_default.tick,
                    "Plan saved!"
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)), () => setStickyFooter(null);
  }, [useStickyFooter, setStickyFooter, options2, pastedContents, editorName, isV2, planFilePath, showSaveMessage]), isEmpty)
    return /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(PermissionDialog, {
      color: "planMode",
      title: "Exit plan mode?",
      workerBadge,
      children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 1,
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
            children: "Claude wants to exit plan mode"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(Select, {
              options: [{
                label: "Yes",
                value: "yes"
              }, {
                label: "No",
                value: "no"
              }],
              onChange: function(value) {
                if (value === "yes")
                  logEvent("tengu_plan_exit", {
                    planLengthChars: 0,
                    outcome: "yes-default",
                    interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
                    planStructureVariant
                  }), setHasExitedPlanMode(!0), setNeedsPlanModeExitAttachment(!0), onDone(), toolUseConfirm.onAllow({}, [{
                    type: "setMode",
                    mode: "default",
                    destination: "session"
                  }]);
                else
                  logEvent("tengu_plan_exit", {
                    planLengthChars: 0,
                    outcome: "no",
                    interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
                    planStructureVariant
                  }), onDone(), onReject(), toolUseConfirm.onReject();
              },
              onCancel: () => {
                logEvent("tengu_plan_exit", {
                  planLengthChars: 0,
                  outcome: "no",
                  interviewPhaseEnabled: isPlanModeInterviewPhaseEnabled(),
                  planStructureVariant
                }), onDone(), onReject(), toolUseConfirm.onReject();
              }
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleKeyDown,
    children: [
      /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(PermissionDialog, {
        color: "planMode",
        title: "Ready to code?",
        innerPaddingX: 0,
        workerBadge,
        children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
              paddingX: 1,
              flexDirection: "column",
              children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                children: "Here is Claude's plan:"
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
              borderColor: "subtle",
              borderStyle: "dashed",
              flexDirection: "column",
              borderLeft: !1,
              borderRight: !1,
              paddingX: 1,
              marginBottom: 1,
              overflow: "hidden",
              children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(Markdown, {
                children: currentPlan
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              paddingX: 1,
              children: [
                /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(PermissionRuleExplanation, {
                  permissionResult: toolUseConfirm.permissionResult,
                  toolType: "tool"
                }, void 0, !1, void 0, this),
                isClassifierPermissionsEnabled() && allowedPrompts && allowedPrompts.length > 0 && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
                  flexDirection: "column",
                  marginBottom: 1,
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                      bold: !0,
                      children: "Requested permissions:"
                    }, void 0, !1, void 0, this),
                    allowedPrompts.map((p4, i5) => /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: [
                        "  ",
                        "\xB7 ",
                        p4.tool,
                        "(",
                        PROMPT_PREFIX,
                        " ",
                        p4.prompt,
                        ")"
                      ]
                    }, i5, !0, void 0, this))
                  ]
                }, void 0, !0, void 0, this),
                !useStickyFooter && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(jsx_dev_runtime388.Fragment, {
                  children: [
                    /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                      dimColor: !0,
                      children: "Claude has written up a plan and is ready to execute. Would you like to proceed?"
                    }, void 0, !1, void 0, this),
                    /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
                      marginTop: 1,
                      children: /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(Select, {
                        options: options2,
                        onChange: handleResponse,
                        onCancel: () => handleCancelRef.current?.(),
                        onImagePaste,
                        pastedContents,
                        onRemoveImage
                      }, void 0, !1, void 0, this)
                    }, void 0, !1, void 0, this)
                  ]
                }, void 0, !0, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this),
      !useStickyFooter && editorName && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 1,
        paddingX: 1,
        marginTop: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "ctrl-g to edit in "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                bold: !0,
                dimColor: !0,
                children: editorName
              }, void 0, !1, void 0, this),
              isV2 && planFilePath && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " \xB7 ",
                  getDisplayPath(planFilePath)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          showSaveMessage && /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedBox_default, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                dimColor: !0,
                children: " \xB7 "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime388.jsxDEV(ThemedText, {
                color: "success",
                children: [
                  figures_default.tick,
                  "Plan saved!"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
