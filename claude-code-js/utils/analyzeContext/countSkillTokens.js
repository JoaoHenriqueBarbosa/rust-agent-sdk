// function: countSkillTokens
async function countSkillTokens(tools, getToolPermissionContext, agentInfo) {
  try {
    let skills = await getLimitedSkillToolCommands(getCwd()), slashCommandTool = findSkillTool(tools);
    if (!slashCommandTool)
      return {
        skillTokens: 0,
        skillInfo: { totalSkills: 0, includedSkills: 0, skillFrontmatter: [] }
      };
    let skillTokens = await countToolDefinitionTokens([slashCommandTool], getToolPermissionContext, agentInfo), skillFrontmatter = skills.map((skill) => ({
      name: getCommandName(skill),
      source: skill.type === "prompt" ? skill.source : "plugin",
      tokens: estimateSkillFrontmatterTokens(skill)
    }));
    return {
      skillTokens,
      skillInfo: {
        totalSkills: skills.length,
        includedSkills: skills.length,
        skillFrontmatter
      }
    };
  } catch (error44) {
    return logError2(toError(error44)), {
      skillTokens: 0,
      skillInfo: { totalSkills: 0, includedSkills: 0, skillFrontmatter: [] }
    };
  }
}
