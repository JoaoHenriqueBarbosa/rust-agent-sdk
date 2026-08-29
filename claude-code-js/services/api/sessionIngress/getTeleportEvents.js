// function: getTeleportEvents
async function getTeleportEvents(sessionId, accessToken, orgUUID) {
  let baseUrl = `${getOauthConfig().BASE_API_URL}/v1/code/sessions/${sessionId}/teleport-events`, headers = {
    ...getOAuthHeaders(accessToken),
    "x-organization-uuid": orgUUID
  };
  logForDebugging(`[teleport] Fetching events from: ${baseUrl}`);
  let all4 = [], cursor, pages = 0, maxPages = 100;
  while (pages < maxPages) {
    let params = { limit: 1000 };
    if (cursor !== void 0)
      params.cursor = cursor;
    let response7;
    try {
      response7 = await axios_default.get(baseUrl, {
        headers,
        params,
        timeout: 20000,
        validateStatus: (status) => status < 500
      });
    } catch (e) {
      return logError2(Error(`Teleport events fetch failed: ${e.message}`)), logForDiagnosticsNoPII("error", "teleport_events_fetch_fail"), null;
    }
    if (response7.status === 404)
      return logForDebugging(`[teleport] Session ${sessionId} not found (page ${pages})`), logForDiagnosticsNoPII("warn", "teleport_events_not_found"), pages === 0 ? null : all4;
    if (response7.status === 401)
      throw logForDiagnosticsNoPII("error", "teleport_events_bad_token"), Error("Your session has expired. Please run /login to sign in again.");
    if (response7.status !== 200)
      return logError2(Error(`Teleport events returned ${response7.status}: ${jsonStringify(response7.data)}`)), logForDiagnosticsNoPII("error", "teleport_events_bad_status"), null;
    let { data, next_cursor } = response7.data;
    if (!Array.isArray(data))
      return logError2(Error(`Teleport events invalid response shape: ${jsonStringify(response7.data)}`)), logForDiagnosticsNoPII("error", "teleport_events_invalid_shape"), null;
    for (let ev of data)
      if (ev.payload !== null)
        all4.push(ev.payload);
    if (pages++, next_cursor == null)
      break;
    cursor = next_cursor;
  }
  if (pages >= maxPages)
    logError2(Error(`Teleport events hit page cap (${maxPages}) for ${sessionId}`)), logForDiagnosticsNoPII("warn", "teleport_events_page_cap");
  return logForDebugging(`[teleport] Fetched ${all4.length} events over ${pages} page(s) for ${sessionId}`), all4;
}
