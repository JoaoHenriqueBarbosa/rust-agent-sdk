// Original: src/components/agents/new-agent-creation/wizard-steps/GenerateStep.tsx
function GenerateStep() {
  let {
    updateWizardData,
    goBack,
    goToStep,
    wizardData
  } = useWizard(), [prompt, setPrompt] = import_react182.useState(wizardData.generationPrompt || ""), [isGenerating, setIsGenerating] = import_react182.useState(!1), [error44, setError] = import_react182.useState(null), [cursorOffset, setCursorOffset] = import_react182.useState(prompt.length), model = useMainLoopModel(), abortControllerRef = import_react182.useRef(null), handleCancelGeneration = import_react182.useCallback(() => {
    if (abortControllerRef.current)
      abortControllerRef.current.abort(), abortControllerRef.current = null, setIsGenerating(!1), setError("Generation cancelled");
  }, []);
  useKeybinding("confirm:no", handleCancelGeneration, {
    context: "Settings",
    isActive: isGenerating
  });
  let handleExternalEditor = import_react182.useCallback(async () => {
    let result = await editPromptInEditor(prompt);
    if (result.content !== null)
      setPrompt(result.content), setCursorOffset(result.content.length);
  }, [prompt]);
  useKeybinding("chat:externalEditor", handleExternalEditor, {
    context: "Chat",
    isActive: !isGenerating
  });
  let handleGoBack = import_react182.useCallback(() => {
    updateWizardData({
      generationPrompt: "",
      agentType: "",
      systemPrompt: "",
      whenToUse: "",
      generatedAgent: void 0,
      wasGenerated: !1
    }), setPrompt(""), setError(null), goBack();
  }, [updateWizardData, goBack]);
  useKeybinding("confirm:no", handleGoBack, {
    context: "Settings",
    isActive: !isGenerating
  });
  let handleGenerate = async () => {
    let trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      setError("Please describe what the agent should do");
      return;
    }
    setError(null), setIsGenerating(!0), updateWizardData({
      generationPrompt: trimmedPrompt,
      isGenerating: !0
    });
    let controller = createAbortController();
    abortControllerRef.current = controller;
    try {
      let generated = await generateAgent(trimmedPrompt, model, [], controller.signal);
      updateWizardData({
        agentType: generated.identifier,
        whenToUse: generated.whenToUse,
        systemPrompt: generated.systemPrompt,
        generatedAgent: generated,
        isGenerating: !1,
        wasGenerated: !0
      }), goToStep(6);
    } catch (err2) {
      if (err2 instanceof APIUserAbortError)
        ;
      else if (err2 instanceof Error && !err2.message.includes("No assistant message found"))
        setError(err2.message || "Failed to generate agent");
      updateWizardData({
        isGenerating: !1
      });
    } finally {
      setIsGenerating(!1), abortControllerRef.current = null;
    }
  }, subtitle = "Describe what this agent should do and when it should be used (be comprehensive for best results)";
  if (isGenerating)
    return /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(WizardDialogLayout, {
      subtitle,
      footerText: /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ConfigurableShortcutHint, {
        action: "confirm:no",
        context: "Settings",
        fallback: "Esc",
        description: "cancel"
      }, void 0, !1, void 0, this),
      children: /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        alignItems: "center",
        children: [
          /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ThemedText, {
            color: "suggestion",
            children: " Generating agent from description..."
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(WizardDialogLayout, {
    subtitle,
    footerText: /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:yes",
          context: "Confirmation",
          fallback: "Enter",
          description: "submit"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ConfigurableShortcutHint, {
          action: "chat:externalEditor",
          context: "Chat",
          fallback: "ctrl+g",
          description: "open in editor"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Settings",
          fallback: "Esc",
          description: "go back"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this),
    children: /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        error44 && /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ThemedBox_default, {
          marginBottom: 1,
          children: /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(ThemedText, {
            color: "error",
            children: error44
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime328.jsxDEV(TextInput, {
          value: prompt,
          onChange: setPrompt,
          onSubmit: handleGenerate,
          placeholder: "e.g., Help me write unit tests for my code...",
          columns: 80,
          cursorOffset,
          onChangeCursorOffset: setCursorOffset,
          focus: !0,
          showCursor: !0
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
var import_react182, jsx_dev_runtime328;
var init_GenerateStep = __esm(() => {
  init_sdk();
  init_useMainLoopModel();
  init_ink2();
  init_useKeybinding();
  init_abortController();
  init_promptEditor();
  init_ConfigurableShortcutHint();
  init_Byline();
  init_Spinner2();
  init_TextInput();
  init_wizard();
  init_WizardDialogLayout();
  init_generateAgent();
  import_react182 = __toESM(require_react_development(), 1), jsx_dev_runtime328 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
