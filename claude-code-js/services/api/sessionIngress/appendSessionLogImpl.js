// function: appendSessionLogImpl
async function appendSessionLogImpl(sessionId, entry, url3, headers) {
  for (let attempt = 1;attempt <= MAX_RETRIES; attempt++) {
    try {
      let lastUuid = lastUuidMap.get(sessionId), requestHeaders = { ...headers };
      if (lastUuid)
        requestHeaders["Last-Uuid"] = lastUuid;
      let response7 = await axios_default.put(url3, entry, {
        headers: requestHeaders,
        validateStatus: (status) => status < 500
      });
      if (response7.status === 200 || response7.status === 201)
        return lastUuidMap.set(sessionId, entry.uuid), logForDebugging(`Successfully persisted session log entry for session ${sessionId}`), !0;
      if (response7.status === 409) {
        let serverLastUuid = response7.headers["x-last-uuid"];
        if (serverLastUuid === entry.uuid)
          return lastUuidMap.set(sessionId, entry.uuid), logForDebugging(`Session entry ${entry.uuid} already present on server, recovering from stale state`), logForDiagnosticsNoPII("info", "session_persist_recovered_from_409"), !0;
        if (serverLastUuid)
          lastUuidMap.set(sessionId, serverLastUuid), logForDebugging(`Session 409: adopting server lastUuid=${serverLastUuid} from header, retrying entry ${entry.uuid}`);
        else {
          let logs2 = await fetchSessionLogsFromUrl(sessionId, url3, headers), adoptedUuid = findLastUuid(logs2);
          if (adoptedUuid)
            lastUuidMap.set(sessionId, adoptedUuid), logForDebugging(`Session 409: re-fetched ${logs2.length} entries, adopting lastUuid=${adoptedUuid}, retrying entry ${entry.uuid}`);
          else {
            let errorMessage2 = response7.data.error?.message || "Concurrent modification detected";
            return logError2(Error(`Session persistence conflict: UUID mismatch for session ${sessionId}, entry ${entry.uuid}. ${errorMessage2}`)), logForDiagnosticsNoPII("error", "session_persist_fail_concurrent_modification"), !1;
          }
        }
        logForDiagnosticsNoPII("info", "session_persist_409_adopt_server_uuid");
        continue;
      }
      if (response7.status === 401)
        return logForDebugging("Session token expired or invalid"), logForDiagnosticsNoPII("error", "session_persist_fail_bad_token"), !1;
      logForDebugging(`Failed to persist session log: ${response7.status} ${response7.statusText}`), logForDiagnosticsNoPII("error", "session_persist_fail_status", {
        status: response7.status,
        attempt
      });
    } catch (error44) {
      let axiosError = error44;
      logError2(Error(`Error persisting session log: ${axiosError.message}`)), logForDiagnosticsNoPII("error", "session_persist_fail_status", {
        status: axiosError.status,
        attempt
      });
    }
    if (attempt === MAX_RETRIES)
      return logForDebugging(`Remote persistence failed after ${MAX_RETRIES} attempts`), logForDiagnosticsNoPII("error", "session_persist_error_retries_exhausted", { attempt }), !1;
    let delayMs = Math.min(BASE_DELAY_MS2 * Math.pow(2, attempt - 1), 8000);
    logForDebugging(`Remote persistence attempt ${attempt}/${MAX_RETRIES} failed, retrying in ${delayMs}ms\u2026`), await sleep3(delayMs);
  }
  return !1;
}
