// function: startInProcessTeammate
function startInProcessTeammate(config10) {
  let agentId = config10.identity.agentId;
  runInProcessTeammate(config10).catch((error44) => {
    logForDebugging(`[inProcessRunner] Unhandled error in ${agentId}: ${error44}`);
  });
}
