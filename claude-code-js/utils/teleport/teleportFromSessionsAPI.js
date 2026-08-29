// function: teleportFromSessionsAPI
async function teleportFromSessionsAPI(sessionId, orgUUID, accessToken, onProgress, sessionData) {
  let startTime = Date.now();
  try {
    logForDebugging(`[teleport] Starting fetch for session: ${sessionId}`), onProgress?.("fetching_logs");
    let logsStartTime = Date.now(), logs2 = await getTeleportEvents(sessionId, accessToken, orgUUID);
    if (logs2 === null)
      logForDebugging("[teleport] v2 endpoint returned null, trying session-ingress"), logs2 = await getSessionLogsViaOAuth(sessionId, accessToken, orgUUID);
    if (logForDebugging(`[teleport] Session logs fetched in ${Date.now() - logsStartTime}ms`), logs2 === null)
      throw Error("Failed to fetch session logs");
    let filterStartTime = Date.now(), messages = logs2.filter((entry) => isTranscriptMessage(entry) && !entry.isSidechain);
    logForDebugging(`[teleport] Filtered ${logs2.length} entries to ${messages.length} messages in ${Date.now() - filterStartTime}ms`), onProgress?.("fetching_branch");
    let branch = sessionData ? getBranchFromSession(sessionData) : void 0;
    if (branch)
      logForDebugging(`[teleport] Found branch: ${branch}`);
    return logForDebugging(`[teleport] Total teleportFromSessionsAPI time: ${Date.now() - startTime}ms`), {
      log: messages,
      branch
    };
  } catch (error44) {
    let err2 = toError(error44);
    if (axios_default.isAxiosError(error44) && error44.response?.status === 404)
      throw logEvent("tengu_teleport_error_session_not_found_404", {
        sessionId
      }), new TeleportOperationError(`${sessionId} not found.`, `${sessionId} not found.
${source_default.dim("Run /status in Claude Code to check your account.")}`);
    throw logError2(err2), Error(`Failed to fetch session from Sessions API: ${err2.message}`);
  }
}
