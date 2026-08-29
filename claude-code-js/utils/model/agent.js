// Original: src/utils/model/agent.ts
function getDefaultSubagentModel() {
  return "inherit";
}
function getAgentModel(agentModel, parentModel, toolSpecifiedModel, permissionMode) {
  if (process.env.CLAUDE_CODE_SUBAGENT_MODEL)
    return parseUserSpecifiedModel(process.env.CLAUDE_CODE_SUBAGENT_MODEL);
  let parentRegionPrefix = getBedrockRegionPrefix(parentModel), applyParentRegionPrefix = (resolvedModel, originalSpec) => {
    if (parentRegionPrefix && getAPIProvider() === "bedrock") {
      if (getBedrockRegionPrefix(originalSpec))
        return resolvedModel;
      return applyBedrockRegionPrefix(resolvedModel, parentRegionPrefix);
    }
    return resolvedModel;
  };
  if (toolSpecifiedModel) {
    if (aliasMatchesParentTier(toolSpecifiedModel, parentModel))
      return parentModel;
    let model2 = parseUserSpecifiedModel(toolSpecifiedModel);
    return applyParentRegionPrefix(model2, toolSpecifiedModel);
  }
  let agentModelWithExp = agentModel ?? getDefaultSubagentModel();
  if (agentModelWithExp === "inherit")
    return getRuntimeMainLoopModel({
      permissionMode: permissionMode ?? "default",
      mainLoopModel: parentModel,
      exceeds200kTokens: !1
    });
  if (aliasMatchesParentTier(agentModelWithExp, parentModel))
    return parentModel;
  let model = parseUserSpecifiedModel(agentModelWithExp);
  return applyParentRegionPrefix(model, agentModelWithExp);
}
function aliasMatchesParentTier(alias, parentModel) {
  let canonical = getCanonicalName(parentModel);
  switch (alias.toLowerCase()) {
    case "opus":
      return canonical.includes("opus");
    case "sonnet":
      return canonical.includes("sonnet");
    case "haiku":
      return canonical.includes("haiku");
    default:
      return !1;
  }
}
function getAgentModelDisplay(model) {
  if (!model)
    return "Inherit from parent (default)";
  if (model === "inherit")
    return "Inherit from parent";
  return capitalize(model);
}
function getAgentModelOptions() {
  return [
    {
      value: "sonnet",
      label: "Sonnet",
      description: "Balanced performance - best for most agents"
    },
    {
      value: "opus",
      label: "Opus",
      description: "Most capable for complex reasoning tasks"
    },
    {
      value: "haiku",
      label: "Haiku",
      description: "Fast and efficient for simple tasks"
    },
    {
      value: "inherit",
      label: "Inherit from parent",
      description: "Use the same model as the main conversation"
    }
  ];
}
var AGENT_MODEL_OPTIONS;
var init_agent = __esm(() => {
  init_aliases();
  init_bedrock();
  init_model();
  init_providers();
  AGENT_MODEL_OPTIONS = [...MODEL_ALIASES, "inherit"];
});
