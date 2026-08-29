// function: getSessionLogs
async function getSessionLogs(sessionId, url3) {
  let sessionToken = getSessionIngressAuthToken();
  if (!sessionToken)
    return logForDebugging("No session token available for fetching session logs"), logForDiagnosticsNoPII("error", "session_get_fail_no_token"), null;
  let headers = { Authorization: `Bearer ${sessionToken}` }, logs2 = await fetchSessionLogsFromUrl(sessionId, url3, headers);
  if (logs2 && logs2.length > 0) {
    let lastEntry = logs2.at(-1);
    if (lastEntry && "uuid" in lastEntry && lastEntry.uuid)
      lastUuidMap.set(sessionId, lastEntry.uuid);
  }
  return logs2;
}
