// function: autoNameSessionFromPlan
function autoNameSessionFromPlan(plan2, setAppState, isClearContext) {
  if (isSessionPersistenceDisabled() || getSettings_DEPRECATED()?.cleanupPeriodDays === 0)
    return;
  if (!isClearContext && getCurrentSessionTitle(getSessionId()))
    return;
  generateSessionName([createUserMessage({
    content: plan2.slice(0, 1000)
  })], new AbortController().signal).then(async (name3) => {
    if (!name3 || getCurrentSessionTitle(getSessionId()))
      return;
    let sessionId = getSessionId(), fullPath = getTranscriptPath();
    await saveCustomTitle(sessionId, name3, fullPath, "auto"), await saveAgentName(sessionId, name3, fullPath, "auto"), setAppState((prev) => {
      if (prev.standaloneAgentContext?.name === name3)
        return prev;
      return {
        ...prev,
        standaloneAgentContext: {
          ...prev.standaloneAgentContext,
          name: name3
        }
      };
    });
  }).catch(logError2);
}
