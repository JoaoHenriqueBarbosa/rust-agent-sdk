// function: getInvokedSkillsForAgent
function getInvokedSkillsForAgent(agentId) {
  let normalizedId = agentId ?? null, filtered = /* @__PURE__ */ new Map;
  for (let [key, skill] of STATE.invokedSkills)
    if (skill.agentId === normalizedId)
      filtered.set(key, skill);
  return filtered;
}
