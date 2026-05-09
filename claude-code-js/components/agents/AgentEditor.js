// Original: src/components/agents/AgentEditor.tsx
function AgentEditor({
  agent,
  tools,
  onSaved,
  onBack
}) {
  let setAppState = useSetAppState(), [editMode, setEditMode] = import_react177.useState("menu"), [selectedMenuIndex, setSelectedMenuIndex] = import_react177.useState(0), [error44, setError] = import_react177.useState(null), [selectedColor, setSelectedColor] = import_react177.useState(agent.color), handleOpenInEditor = import_react177.useCallback(async () => {
    let filePath = getActualAgentFilePath(agent), result = await editFileInEditor(filePath);
    if (result.error)
      setError(result.error);
    else
      onSaved(`Opened ${agent.agentType} in editor. If you made edits, restart to load the latest version.`);
  }, [agent, onSaved]), handleSave = import_react177.useCallback(async (changes = {}) => {
    let {
      tools: newTools,
      color: newColor,
      model: newModel
    } = changes, finalColor = newColor ?? selectedColor, hasToolsChanged = newTools !== void 0, hasModelChanged = newModel !== void 0, hasColorChanged = finalColor !== agent.color;
    if (!hasToolsChanged && !hasModelChanged && !hasColorChanged)
      return !1;
    try {
      if (!isCustomAgent(agent) && !isPluginAgent(agent))
        return !1;
      if (await updateAgentFile(agent, agent.whenToUse, newTools ?? agent.tools, agent.getSystemPrompt(), finalColor, newModel ?? agent.model), hasColorChanged && finalColor)
        setAgentColor(agent.agentType, finalColor);
      return setAppState((state3) => {
        let allAgents = state3.agentDefinitions.allAgents.map((a2) => a2.agentType === agent.agentType ? {
          ...a2,
          tools: newTools ?? a2.tools,
          color: finalColor,
          model: newModel ?? a2.model
        } : a2);
        return {
          ...state3,
          agentDefinitions: {
            ...state3.agentDefinitions,
            activeAgents: getActiveAgentsFromList(allAgents),
            allAgents
          }
        };
      }), onSaved(`Updated agent: ${source_default.bold(agent.agentType)}`), !0;
    } catch (err2) {
      return setError(err2 instanceof Error ? err2.message : "Failed to save agent"), !1;
    }
  }, [agent, selectedColor, onSaved, setAppState]), menuItems = import_react177.useMemo(() => [{
    label: "Open in editor",
    action: handleOpenInEditor
  }, {
    label: "Edit tools",
    action: () => setEditMode("edit-tools")
  }, {
    label: "Edit model",
    action: () => setEditMode("edit-model")
  }, {
    label: "Edit color",
    action: () => setEditMode("edit-color")
  }], [handleOpenInEditor]), handleEscape = import_react177.useCallback(() => {
    if (setError(null), editMode === "menu")
      onBack();
    else
      setEditMode("menu");
  }, [editMode, onBack]), handleMenuKeyDown = import_react177.useCallback((e) => {
    if (e.key === "up")
      e.preventDefault(), setSelectedMenuIndex((index) => Math.max(0, index - 1));
    else if (e.key === "down")
      e.preventDefault(), setSelectedMenuIndex((index_0) => Math.min(menuItems.length - 1, index_0 + 1));
    else if (e.key === "return") {
      e.preventDefault();
      let selectedItem = menuItems[selectedMenuIndex];
      if (selectedItem)
        selectedItem.action();
    }
  }, [menuItems, selectedMenuIndex]);
  useKeybinding("confirm:no", handleEscape, {
    context: "Confirmation"
  });
  let renderMenu = () => /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleMenuKeyDown,
    children: [
      /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Source: ",
          getAgentSourceDisplayName(agent.source)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        flexDirection: "column",
        children: menuItems.map((item, index_1) => /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ThemedText, {
          color: index_1 === selectedMenuIndex ? "suggestion" : void 0,
          children: [
            index_1 === selectedMenuIndex ? `${figures_default.pointer} ` : "  ",
            item.label
          ]
        }, item.label, !0, void 0, this))
      }, void 0, !1, void 0, this),
      error44 && /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ThemedBox_default, {
        marginTop: 1,
        children: /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ThemedText, {
          color: "error",
          children: error44
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
  switch (editMode) {
    case "menu":
      return renderMenu();
    case "edit-tools":
      return /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ToolSelector, {
        tools,
        initialTools: agent.tools,
        onComplete: async (finalTools) => {
          setEditMode("menu"), await handleSave({
            tools: finalTools
          });
        }
      }, void 0, !1, void 0, this);
    case "edit-color":
      return /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ColorPicker, {
        agentName: agent.agentType,
        currentColor: selectedColor || agent.color || "automatic",
        onConfirm: async (color3) => {
          setSelectedColor(color3), setEditMode("menu"), await handleSave({
            color: color3
          });
        }
      }, void 0, !1, void 0, this);
    case "edit-model":
      return /* @__PURE__ */ jsx_dev_runtime318.jsxDEV(ModelSelector, {
        initialModel: agent.model,
        onComplete: async (model) => {
          setEditMode("menu"), await handleSave({
            model
          });
        }
      }, void 0, !1, void 0, this);
    default:
      return null;
  }
}
var import_react177, jsx_dev_runtime318;
var init_AgentEditor = __esm(() => {
  init_source();
  init_figures();
  init_AppState();
  init_ink2();
  init_useKeybinding();
  init_agentColorManager();
  init_loadAgentsDir();
  init_promptEditor();
  init_agentFileUtils();
  init_ColorPicker();
  init_ModelSelector();
  init_ToolSelector();
  init_utils17();
  import_react177 = __toESM(require_react_development(), 1), jsx_dev_runtime318 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
