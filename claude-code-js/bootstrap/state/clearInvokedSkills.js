// function: clearInvokedSkills
function clearInvokedSkills(preservedAgentIds) {
  if (!preservedAgentIds || preservedAgentIds.size === 0) {
    STATE.invokedSkills.clear();
    return;
  }
  for (let [key, skill] of STATE.invokedSkills)
    if (skill.agentId === null || !preservedAgentIds.has(skill.agentId))
      STATE.invokedSkills.delete(key);
}
