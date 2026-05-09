// Original: src/components/agents/validateAgent.ts
function validateAgentType(agentType) {
  if (!agentType)
    return "Agent type is required";
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(agentType))
    return "Agent type must start and end with alphanumeric characters and contain only letters, numbers, and hyphens";
  if (agentType.length < 3)
    return "Agent type must be at least 3 characters long";
  if (agentType.length > 50)
    return "Agent type must be less than 50 characters";
  return null;
}
function validateAgent(agent, availableTools, existingAgents) {
  let errors8 = [], warnings = [];
  if (!agent.agentType)
    errors8.push("Agent type is required");
  else {
    let typeError = validateAgentType(agent.agentType);
    if (typeError)
      errors8.push(typeError);
    let duplicate = existingAgents.find((a2) => a2.agentType === agent.agentType && a2.source !== agent.source);
    if (duplicate)
      errors8.push(`Agent type "${agent.agentType}" already exists in ${getAgentSourceDisplayName(duplicate.source)}`);
  }
  if (!agent.whenToUse)
    errors8.push("Description (description) is required");
  else if (agent.whenToUse.length < 10)
    warnings.push("Description should be more descriptive (at least 10 characters)");
  else if (agent.whenToUse.length > 5000)
    warnings.push("Description is very long (over 5000 characters)");
  if (agent.tools !== void 0 && !Array.isArray(agent.tools))
    errors8.push("Tools must be an array");
  else {
    if (agent.tools === void 0)
      warnings.push("Agent has access to all tools");
    else if (agent.tools.length === 0)
      warnings.push("No tools selected - agent will have very limited capabilities");
    let resolvedTools = resolveAgentTools(agent, availableTools, !1);
    if (resolvedTools.invalidTools.length > 0)
      errors8.push(`Invalid tools: ${resolvedTools.invalidTools.join(", ")}`);
  }
  let systemPrompt = agent.getSystemPrompt();
  if (!systemPrompt)
    errors8.push("System prompt is required");
  else if (systemPrompt.length < 20)
    errors8.push("System prompt is too short (minimum 20 characters)");
  else if (systemPrompt.length > 1e4)
    warnings.push("System prompt is very long (over 10,000 characters)");
  return {
    isValid: errors8.length === 0,
    errors: errors8,
    warnings
  };
}
var init_validateAgent = __esm(() => {
  init_agentToolUtils();
  init_utils17();
});
