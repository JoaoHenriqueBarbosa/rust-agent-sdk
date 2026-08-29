// function: createSkillAttachmentIfNeeded
function createSkillAttachmentIfNeeded(agentId) {
  let invokedSkills = getInvokedSkillsForAgent(agentId);
  if (invokedSkills.size === 0)
    return null;
  let usedTokens = 0, skills = Array.from(invokedSkills.values()).sort((a2, b) => b.invokedAt - a2.invokedAt).map((skill) => ({
    name: skill.skillName,
    path: skill.skillPath,
    content: truncateToTokens(skill.content, POST_COMPACT_MAX_TOKENS_PER_SKILL)
  })).filter((skill) => {
    let tokens = roughTokenCountEstimation(skill.content);
    if (usedTokens + tokens > POST_COMPACT_SKILLS_TOKEN_BUDGET)
      return !1;
    return usedTokens += tokens, !0;
  });
  if (skills.length === 0)
    return null;
  return createAttachmentMessage({
    type: "invoked_skills",
    skills
  });
}
