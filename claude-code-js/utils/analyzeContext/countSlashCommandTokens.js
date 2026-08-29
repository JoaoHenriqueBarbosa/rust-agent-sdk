// function: countSlashCommandTokens
async function countSlashCommandTokens(tools, getToolPermissionContext, agentInfo) {
  let info = await getSkillToolInfo(getCwd()), slashCommandTool = findSkillTool(tools);
  if (!slashCommandTool)
    return {
      slashCommandTokens: 0,
      commandInfo: { totalCommands: 0, includedCommands: 0 }
    };
  return {
    slashCommandTokens: await countToolDefinitionTokens([slashCommandTool], getToolPermissionContext, agentInfo),
    commandInfo: {
      totalCommands: info.totalCommands,
      includedCommands: info.includedCommands
    }
  };
}
