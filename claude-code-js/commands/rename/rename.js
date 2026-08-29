// Original: src/commands/rename/rename.ts
var exports_rename = {};
__export(exports_rename, {
  call: () => call29
});
async function call29(onDone, context7, args) {
  if (isTeammate())
    return onDone("Cannot rename: This session is a swarm teammate. Teammate names are set by the team leader.", { display: "system" }), null;
  let newName;
  if (!args || args.trim() === "") {
    let generated = await generateSessionName(getMessagesAfterCompactBoundary(context7.messages), context7.abortController.signal);
    if (!generated)
      return onDone("Could not generate a name: no conversation context yet. Usage: /rename <name>", { display: "system" }), null;
    newName = generated;
  } else
    newName = args.trim();
  let sessionId = getSessionId(), fullPath = getTranscriptPath();
  return await saveCustomTitle(sessionId, newName, fullPath), await saveAgentName(sessionId, newName, fullPath), context7.setAppState((prev) => ({
    ...prev,
    standaloneAgentContext: {
      ...prev.standaloneAgentContext,
      name: newName
    }
  })), onDone(`Session renamed to: ${newName}`, { display: "system" }), null;
}
var init_rename = __esm(() => {
  init_state();
  init_messages3();
  init_sessionStorage();
  init_teammate();
  init_generateSessionName();
});
