// function: addInvokedSkill
function addInvokedSkill(skillName, skillPath, content, agentId = null) {
  let key = `${agentId ?? ""}:${skillName}`;
  STATE.invokedSkills.set(key, {
    skillName,
    skillPath,
    content,
    invokedAt: Date.now(),
    agentId
  });
}
