// function: createAsyncAgentAttachmentsIfNeeded
async function createAsyncAgentAttachmentsIfNeeded(context6) {
  let appState = context6.getAppState();
  return Object.values(appState.tasks).filter((task) => task.type === "local_agent").flatMap((agent) => {
    if (agent.retrieved || agent.status === "pending" || agent.agentId === context6.agentId)
      return [];
    return [
      createAttachmentMessage({
        type: "task_status",
        taskId: agent.agentId,
        taskType: "local_agent",
        description: agent.description,
        status: agent.status,
        deltaSummary: agent.status === "running" ? agent.progress?.summary ?? null : agent.error ?? null,
        outputFilePath: getTaskOutputPath(agent.agentId)
      })
    ];
  });
}
