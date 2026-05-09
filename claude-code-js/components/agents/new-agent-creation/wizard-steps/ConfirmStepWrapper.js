// Original: src/components/agents/new-agent-creation/wizard-steps/ConfirmStepWrapper.tsx
function ConfirmStepWrapper({
  tools,
  existingAgents,
  onComplete
}) {
  let {
    wizardData
  } = useWizard(), [saveError, setSaveError] = import_react180.useState(null), setAppState = useSetAppState(), saveAgent = import_react180.useCallback(async (openInEditor) => {
    if (!wizardData?.finalAgent)
      return;
    try {
      if (await saveAgentToFile(wizardData.location, wizardData.finalAgent.agentType, wizardData.finalAgent.whenToUse, wizardData.finalAgent.tools, wizardData.finalAgent.getSystemPrompt(), !0, wizardData.finalAgent.color, wizardData.finalAgent.model, wizardData.finalAgent.memory), setAppState((state3) => {
        if (!wizardData.finalAgent)
          return state3;
        let allAgents = state3.agentDefinitions.allAgents.concat(wizardData.finalAgent);
        return {
          ...state3,
          agentDefinitions: {
            ...state3.agentDefinitions,
            activeAgents: getActiveAgentsFromList(allAgents),
            allAgents
          }
        };
      }), openInEditor) {
        let filePath = getNewAgentFilePath({
          source: wizardData.location,
          agentType: wizardData.finalAgent.agentType
        });
        await editFileInEditor(filePath);
      }
      logEvent("tengu_agent_created", {
        agent_type: wizardData.finalAgent.agentType,
        generation_method: wizardData.wasGenerated ? "generated" : "manual",
        source: wizardData.location,
        tool_count: wizardData.finalAgent.tools?.length ?? "all",
        has_custom_model: !!wizardData.finalAgent.model,
        has_custom_color: !!wizardData.finalAgent.color,
        has_memory: !!wizardData.finalAgent.memory,
        memory_scope: wizardData.finalAgent.memory ?? "none",
        ...openInEditor ? {
          opened_in_editor: !0
        } : {}
      });
      let message = openInEditor ? `Created agent: ${source_default.bold(wizardData.finalAgent.agentType)} and opened in editor. If you made edits, restart to load the latest version.` : `Created agent: ${source_default.bold(wizardData.finalAgent.agentType)}`;
      onComplete(message);
    } catch (err2) {
      setSaveError(err2 instanceof Error ? err2.message : "Failed to save agent");
    }
  }, [wizardData, onComplete, setAppState]), handleSave = import_react180.useCallback(() => saveAgent(!1), [saveAgent]), handleSaveAndEdit = import_react180.useCallback(() => saveAgent(!0), [saveAgent]);
  return /* @__PURE__ */ jsx_dev_runtime326.jsxDEV(ConfirmStep, {
    tools,
    existingAgents,
    onSave: handleSave,
    onSaveAndEdit: handleSaveAndEdit,
    error: saveError
  }, void 0, !1, void 0, this);
}
var import_react180, jsx_dev_runtime326;
var init_ConfirmStepWrapper = __esm(() => {
  init_source();
  init_AppState();
  init_loadAgentsDir();
  init_promptEditor();
  init_wizard();
  init_agentFileUtils();
  init_ConfirmStep();
  import_react180 = __toESM(require_react_development(), 1), jsx_dev_runtime326 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
