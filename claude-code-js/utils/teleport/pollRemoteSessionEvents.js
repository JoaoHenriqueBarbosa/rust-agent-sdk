// function: pollRemoteSessionEvents
async function pollRemoteSessionEvents(sessionId, afterId = null, opts) {
  let accessToken = getClaudeAIOAuthTokens()?.accessToken;
  if (!accessToken)
    throw Error("No access token for polling");
  let orgUUID = await getOrganizationUUID();
  if (!orgUUID)
    throw Error("No org UUID for polling");
  let headers = {
    ...getOAuthHeaders(accessToken),
    "anthropic-beta": "ccr-byoc-2025-07-29",
    "x-organization-uuid": orgUUID
  }, eventsUrl = `${getOauthConfig().BASE_API_URL}/v1/sessions/${sessionId}/events`, MAX_EVENT_PAGES = 50, sdkMessages = [], cursor = afterId;
  for (let page = 0;page < MAX_EVENT_PAGES; page++) {
    let eventsResponse = await axios_default.get(eventsUrl, {
      headers,
      params: cursor ? {
        after_id: cursor
      } : void 0,
      timeout: 30000
    });
    if (eventsResponse.status !== 200)
      throw Error(`Failed to fetch session events: ${eventsResponse.statusText}`);
    let eventsData = eventsResponse.data;
    if (!eventsData?.data || !Array.isArray(eventsData.data))
      throw Error("Invalid events response");
    for (let event of eventsData.data)
      if (event && typeof event === "object" && "type" in event) {
        if (event.type === "env_manager_log" || event.type === "control_response")
          continue;
        if ("session_id" in event)
          sdkMessages.push(event);
      }
    if (!eventsData.last_id)
      break;
    if (cursor = eventsData.last_id, !eventsData.has_more)
      break;
  }
  if (opts?.skipMetadata)
    return {
      newEvents: sdkMessages,
      lastEventId: cursor
    };
  let branch, sessionStatus;
  try {
    let sessionData = await fetchSession(sessionId);
    branch = getBranchFromSession(sessionData), sessionStatus = sessionData.session_status;
  } catch (e) {
    logForDebugging(`teleport: failed to fetch session ${sessionId} metadata: ${e}`, {
      level: "debug"
    });
  }
  return {
    newEvents: sdkMessages,
    lastEventId: cursor,
    branch,
    sessionStatus
  };
}
