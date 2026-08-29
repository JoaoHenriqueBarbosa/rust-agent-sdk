// function: clearInvokedSkillsForAgent
function clearInvokedSkillsForAgent(agentId) {
  for (let [key, skill] of STATE.invokedSkills)
    if (skill.agentId === agentId)
      STATE.invokedSkills.delete(key);
}
