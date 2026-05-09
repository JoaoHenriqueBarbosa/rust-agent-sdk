// function: getRelevantMemoryAttachments
async function getRelevantMemoryAttachments(input, agents, readFileState, recentTools, signal, alreadySurfaced) {
  let memoryDirs = extractAgentMentions(input).flatMap((mention) => {
    let agentType = mention.replace("agent-", ""), agentDef = agents.find((def2) => def2.agentType === agentType);
    return agentDef?.memory ? [getAgentMemoryDir(agentType, agentDef.memory)] : [];
  }), dirs = memoryDirs.length > 0 ? memoryDirs : [getAutoMemPath()], selected = (await Promise.all(dirs.map((dir) => findRelevantMemories(input, dir, signal, recentTools, alreadySurfaced).catch(() => [])))).flat().filter((m4) => !readFileState.has(m4.path) && !alreadySurfaced.has(m4.path)).slice(0, 5), memories = await readMemoriesForSurfacing(selected, signal);
  if (memories.length === 0)
    return [];
  return [{ type: "relevant_memories", memories }];
}
