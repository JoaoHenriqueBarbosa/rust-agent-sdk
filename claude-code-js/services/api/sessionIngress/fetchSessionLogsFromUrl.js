// function: fetchSessionLogsFromUrl
async function fetchSessionLogsFromUrl(sessionId, url3, headers) {
  try {
    let response7 = await axios_default.get(url3, {
      headers,
      timeout: 20000,
      validateStatus: (status) => status < 500,
      params: isEnvTruthy(process.env.CLAUDE_AFTER_LAST_COMPACT) ? { after_last_compact: !0 } : void 0
    });
    if (response7.status === 200) {
      let data = response7.data;
      if (!data || typeof data !== "object" || !Array.isArray(data.loglines))
        return logError2(Error(`Invalid session logs response format: ${jsonStringify(data)}`)), logForDiagnosticsNoPII("error", "session_get_fail_invalid_response"), null;
      let logs2 = data.loglines;
      return logForDebugging(`Fetched ${logs2.length} session logs for session ${sessionId}`), logs2;
    }
    if (response7.status === 404)
      return logForDebugging(`No existing logs for session ${sessionId}`), logForDiagnosticsNoPII("warn", "session_get_no_logs_for_session"), [];
    if (response7.status === 401)
      throw logForDebugging("Auth token expired or invalid"), logForDiagnosticsNoPII("error", "session_get_fail_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
    return logForDebugging(`Failed to fetch session logs: ${response7.status} ${response7.statusText}`), logForDiagnosticsNoPII("error", "session_get_fail_status", {
      status: response7.status
    }), null;
  } catch (error44) {
    let axiosError = error44;
    return logError2(Error(`Error fetching session logs: ${axiosError.message}`)), logForDiagnosticsNoPII("error", "session_get_fail_status", {
      status: axiosError.status
    }), null;
  }
}
