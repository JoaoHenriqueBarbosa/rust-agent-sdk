// function: appendSessionLog
async function appendSessionLog(sessionId, entry, url3) {
  let sessionToken = getSessionIngressAuthToken();
  if (!sessionToken)
    return logForDebugging("No session token available for session persistence"), logForDiagnosticsNoPII("error", "session_persist_fail_jwt_no_token"), !1;
  let headers = {
    Authorization: `Bearer ${sessionToken}`,
    "Content-Type": "application/json"
  };
  return getOrCreateSequentialAppend(sessionId)(entry, url3, headers);
}
