// function: getSkillListingAttachments
async function getSkillListingAttachments(toolUseContext) {
  if (!toolUseContext.options.tools.some((t2) => toolMatchesName(t2, SKILL_TOOL_NAME)))
    return [];
  let cwd2 = getProjectRoot(), localCommands = await getSkillToolCommands(cwd2), mcpSkills = getMcpSkillCommands(toolUseContext.getAppState().mcp.commands), allCommands = mcpSkills.length > 0 ? uniqBy_default([...localCommands, ...mcpSkills], "name") : localCommands, agentKey = toolUseContext.agentId ?? "", sent = sentSkillNames.get(agentKey);
  if (!sent)
    sent = /* @__PURE__ */ new Set, sentSkillNames.set(agentKey, sent);
  if (suppressNext) {
    suppressNext = !1;
    for (let cmd of allCommands)
      sent.add(cmd.name);
    return [];
  }
  let newSkills = allCommands.filter((cmd) => !sent.has(cmd.name));
  if (newSkills.length === 0)
    return [];
  let isInitial = sent.size === 0;
  for (let cmd of newSkills)
    sent.add(cmd.name);
  logForDebugging(`Sending ${newSkills.length} skills via attachment (${isInitial ? "initial" : "dynamic"}, ${sent.size} total sent)`);
  let contextWindowTokens = getContextWindowForModel(toolUseContext.options.mainLoopModel, getSdkBetas());
  return [
    {
      type: "skill_listing",
      content: formatCommandsWithinBudget(newSkills, contextWindowTokens),
      skillCount: newSkills.length,
      isInitial
    }
  ];
}
