// function: createBaseHookInput
function createBaseHookInput(permissionMode, sessionId, agentInfo) {
  let resolvedSessionId = sessionId ?? getSessionId(), resolvedAgentType = agentInfo?.agentType ?? getMainThreadAgentType();
  return {
    session_id: resolvedSessionId,
    transcript_path: getTranscriptPathForSession(resolvedSessionId),
    cwd: getCwd(),
    permission_mode: permissionMode,
    agent_id: agentInfo?.agentId,
    agent_type: resolvedAgentType
  };
}
