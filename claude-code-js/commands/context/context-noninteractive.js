// Original: src/commands/context/context-noninteractive.ts
var exports_context_noninteractive = {};
__export(exports_context_noninteractive, {
  collectContextData: () => collectContextData,
  call: () => call16
});
async function collectContextData(context6) {
  let {
    messages,
    getAppState,
    options: {
      mainLoopModel,
      tools,
      agentDefinitions,
      customSystemPrompt,
      appendSystemPrompt
    }
  } = context6, apiView = getMessagesAfterCompactBoundary(messages), { messages: compactedMessages } = await microcompactMessages(apiView), appState = getAppState();
  return analyzeContextUsage(compactedMessages, mainLoopModel, async () => appState.toolPermissionContext, tools, agentDefinitions, void 0, { options: { customSystemPrompt, appendSystemPrompt } }, void 0, apiView);
}
async function call16(_args, context6) {
  let data = await collectContextData(context6);
  return {
    type: "text",
    value: formatContextAsMarkdownTable(data)
  };
}
function formatContextAsMarkdownTable(data) {
  let {
    categories,
    totalTokens,
    rawMaxTokens,
    percentage,
    model,
    memoryFiles,
    mcpTools,
    agents,
    skills,
    messageBreakdown,
    systemTools,
    systemPromptSections
  } = data, output = `## Context Usage

`;
  output += `**Model:** ${model}  
`, output += `**Tokens:** ${formatTokens(totalTokens)} / ${formatTokens(rawMaxTokens)} (${percentage}%)
`, output += `
`;
  let visibleCategories = categories.filter((cat) => cat.tokens > 0 && cat.name !== "Free space" && cat.name !== "Autocompact buffer");
  if (visibleCategories.length > 0) {
    output += `### Estimated usage by category

`, output += `| Category | Tokens | Percentage |
`, output += `|----------|--------|------------|
`;
    for (let cat of visibleCategories) {
      let percentDisplay = (cat.tokens / rawMaxTokens * 100).toFixed(1);
      output += `| ${cat.name} | ${formatTokens(cat.tokens)} | ${percentDisplay}% |
`;
    }
    let freeSpaceCategory = categories.find((c3) => c3.name === "Free space");
    if (freeSpaceCategory && freeSpaceCategory.tokens > 0) {
      let percentDisplay = (freeSpaceCategory.tokens / rawMaxTokens * 100).toFixed(1);
      output += `| Free space | ${formatTokens(freeSpaceCategory.tokens)} | ${percentDisplay}% |
`;
    }
    let autocompactCategory = categories.find((c3) => c3.name === "Autocompact buffer");
    if (autocompactCategory && autocompactCategory.tokens > 0) {
      let percentDisplay = (autocompactCategory.tokens / rawMaxTokens * 100).toFixed(1);
      output += `| Autocompact buffer | ${formatTokens(autocompactCategory.tokens)} | ${percentDisplay}% |
`;
    }
    output += `
`;
  }
  if (mcpTools.length > 0) {
    output += `### MCP Tools

`, output += `| Tool | Server | Tokens |
`, output += `|------|--------|--------|
`;
    for (let tool of mcpTools)
      output += `| ${tool.name} | ${tool.serverName} | ${formatTokens(tool.tokens)} |
`;
    output += `
`;
  }
  if (systemTools && systemTools.length > 0, systemPromptSections && systemPromptSections.length > 0, agents.length > 0) {
    output += `### Custom Agents

`, output += `| Agent Type | Source | Tokens |
`, output += `|------------|--------|--------|
`;
    for (let agent of agents) {
      let sourceDisplay;
      switch (agent.source) {
        case "projectSettings":
          sourceDisplay = "Project";
          break;
        case "userSettings":
          sourceDisplay = "User";
          break;
        case "localSettings":
          sourceDisplay = "Local";
          break;
        case "flagSettings":
          sourceDisplay = "Flag";
          break;
        case "policySettings":
          sourceDisplay = "Policy";
          break;
        case "plugin":
          sourceDisplay = "Plugin";
          break;
        case "built-in":
          sourceDisplay = "Built-in";
          break;
        default:
          sourceDisplay = String(agent.source);
      }
      output += `| ${agent.agentType} | ${sourceDisplay} | ${formatTokens(agent.tokens)} |
`;
    }
    output += `
`;
  }
  if (memoryFiles.length > 0) {
    output += `### Memory Files

`, output += `| Type | Path | Tokens |
`, output += `|------|------|--------|
`;
    for (let file2 of memoryFiles)
      output += `| ${file2.type} | ${file2.path} | ${formatTokens(file2.tokens)} |
`;
    output += `
`;
  }
  if (skills && skills.tokens > 0 && skills.skillFrontmatter.length > 0) {
    output += `### Skills

`, output += `| Skill | Source | Tokens |
`, output += `|-------|--------|--------|
`;
    for (let skill of skills.skillFrontmatter)
      output += `| ${skill.name} | ${getSourceDisplayName(skill.source)} | ${formatTokens(skill.tokens)} |
`;
    output += `
`;
  }
  return output;
}
var init_context_noninteractive = __esm(() => {
  init_microCompact();
  init_analyzeContext();
  init_format();
  init_messages3();
  init_constants2();
});
