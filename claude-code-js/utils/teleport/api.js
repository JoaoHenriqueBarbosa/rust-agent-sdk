// Original: src/utils/teleport/api.ts
import { randomUUID as randomUUID8 } from "crypto";
function isTransientNetworkError(error44) {
  if (!axios_default.isAxiosError(error44))
    return !1;
  if (!error44.response)
    return !0;
  if (error44.response.status >= 500)
    return !0;
  return !1;
}
async function axiosGetWithRetry(url3, config10) {
  let lastError;
  for (let attempt = 0;attempt <= MAX_TELEPORT_RETRIES; attempt++)
    try {
      return await axios_default.get(url3, config10);
    } catch (error44) {
      if (lastError = error44, !isTransientNetworkError(error44))
        throw error44;
      if (attempt >= MAX_TELEPORT_RETRIES)
        throw logForDebugging(`Teleport request failed after ${attempt + 1} attempts: ${errorMessage(error44)}`), error44;
      let delay4 = TELEPORT_RETRY_DELAYS[attempt] ?? 2000;
      logForDebugging(`Teleport request failed (attempt ${attempt + 1}/${MAX_TELEPORT_RETRIES + 1}), retrying in ${delay4}ms: ${errorMessage(error44)}`), await sleep3(delay4);
    }
  throw lastError;
}
async function prepareApiRequest() {
  let accessToken = getClaudeAIOAuthTokens()?.accessToken;
  if (accessToken === void 0)
    throw Error("Claude Code web sessions require authentication with a Claude.ai account. API key authentication is not sufficient. Please run /login to authenticate, or check your authentication status with /status.");
  let orgUUID = await getOrganizationUUID();
  if (!orgUUID)
    throw Error("Unable to get organization UUID");
  return { accessToken, orgUUID };
}
async function fetchCodeSessionsFromSessionsAPI() {
  let { accessToken, orgUUID } = await prepareApiRequest(), url3 = `${getOauthConfig().BASE_API_URL}/v1/sessions`;
  try {
    let headers = {
      ...getOAuthHeaders(accessToken),
      "anthropic-beta": "ccr-byoc-2025-07-29",
      "x-organization-uuid": orgUUID
    }, response7 = await axiosGetWithRetry(url3, {
      headers
    });
    if (response7.status !== 200)
      throw Error(`Failed to fetch code sessions: ${response7.statusText}`);
    return response7.data.data.map((session) => {
      let gitSource = session.session_context.sources.find((source) => source.type === "git_repository"), repo = null;
      if (gitSource?.url) {
        let repoPath = parseGitHubRepository(gitSource.url);
        if (repoPath) {
          let [owner, name3] = repoPath.split("/");
          if (owner && name3)
            repo = {
              name: name3,
              owner: {
                login: owner
              },
              default_branch: gitSource.revision || void 0
            };
        }
      }
      return {
        id: session.id,
        title: session.title || "Untitled",
        description: "",
        status: session.session_status,
        repo,
        turns: [],
        created_at: session.created_at,
        updated_at: session.updated_at
      };
    });
  } catch (error44) {
    let err2 = toError(error44);
    throw logError2(err2), error44;
  }
}
function getOAuthHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "anthropic-version": "2023-06-01"
  };
}
async function fetchSession(sessionId) {
  let { accessToken, orgUUID } = await prepareApiRequest(), url3 = `${getOauthConfig().BASE_API_URL}/v1/sessions/${sessionId}`, headers = {
    ...getOAuthHeaders(accessToken),
    "anthropic-beta": "ccr-byoc-2025-07-29",
    "x-organization-uuid": orgUUID
  }, response7 = await axios_default.get(url3, {
    headers,
    timeout: 15000,
    validateStatus: (status) => status < 500
  });
  if (response7.status !== 200) {
    let apiMessage = response7.data?.error?.message;
    if (response7.status === 404)
      throw Error(`Session not found: ${sessionId}`);
    if (response7.status === 401)
      throw Error("Session expired. Please run /login to sign in again.");
    throw Error(apiMessage || `Failed to fetch session: ${response7.status} ${response7.statusText}`);
  }
  return response7.data;
}
function getBranchFromSession(session) {
  return session.session_context.outcomes?.find((outcome) => outcome.type === "git_repository")?.git_info?.branches[0];
}
async function sendEventToRemoteSession(sessionId, messageContent, opts) {
  try {
    let { accessToken, orgUUID } = await prepareApiRequest(), url3 = `${getOauthConfig().BASE_API_URL}/v1/sessions/${sessionId}/events`, headers = {
      ...getOAuthHeaders(accessToken),
      "anthropic-beta": "ccr-byoc-2025-07-29",
      "x-organization-uuid": orgUUID
    }, requestBody = {
      events: [{
        uuid: opts?.uuid ?? randomUUID8(),
        session_id: sessionId,
        type: "user",
        parent_tool_use_id: null,
        message: {
          role: "user",
          content: messageContent
        }
      }]
    };
    logForDebugging(`[sendEventToRemoteSession] Sending event to session ${sessionId}`);
    let response7 = await axios_default.post(url3, requestBody, {
      headers,
      validateStatus: (status) => status < 500,
      timeout: 30000
    });
    if (response7.status === 200 || response7.status === 201)
      return logForDebugging(`[sendEventToRemoteSession] Successfully sent event to session ${sessionId}`), !0;
    return logForDebugging(`[sendEventToRemoteSession] Failed with status ${response7.status}: ${jsonStringify(response7.data)}`), !1;
  } catch (error44) {
    return logForDebugging(`[sendEventToRemoteSession] Error: ${errorMessage(error44)}`), !1;
  }
}
async function updateSessionTitle(sessionId, title) {
  try {
    let { accessToken, orgUUID } = await prepareApiRequest(), url3 = `${getOauthConfig().BASE_API_URL}/v1/sessions/${sessionId}`, headers = {
      ...getOAuthHeaders(accessToken),
      "anthropic-beta": "ccr-byoc-2025-07-29",
      "x-organization-uuid": orgUUID
    };
    logForDebugging(`[updateSessionTitle] Updating title for session ${sessionId}: "${title}"`);
    let response7 = await axios_default.patch(url3, { title }, {
      headers,
      validateStatus: (status) => status < 500
    });
    if (response7.status === 200)
      return logForDebugging(`[updateSessionTitle] Successfully updated title for session ${sessionId}`), !0;
    return logForDebugging(`[updateSessionTitle] Failed with status ${response7.status}: ${jsonStringify(response7.data)}`), !1;
  } catch (error44) {
    return logForDebugging(`[updateSessionTitle] Error: ${errorMessage(error44)}`), !1;
  }
}
var TELEPORT_RETRY_DELAYS, MAX_TELEPORT_RETRIES, CodeSessionSchema;
var init_api2 = __esm(() => {
  init_axios2();
  init_oauth();
  init_client8();
  init_v4();
  init_auth14();
  init_debug();
  init_detectRepository();
  init_errors();
  init_log3();
  init_slowOperations();
  TELEPORT_RETRY_DELAYS = [2000, 4000, 8000, 16000], MAX_TELEPORT_RETRIES = TELEPORT_RETRY_DELAYS.length;
  CodeSessionSchema = lazySchema(() => v4_default.object({
    id: v4_default.string(),
    title: v4_default.string(),
    description: v4_default.string(),
    status: v4_default.enum([
      "idle",
      "working",
      "waiting",
      "completed",
      "archived",
      "cancelled",
      "rejected"
    ]),
    repo: v4_default.object({
      name: v4_default.string(),
      owner: v4_default.object({
        login: v4_default.string()
      }),
      default_branch: v4_default.string().optional()
    }).nullable(),
    turns: v4_default.array(v4_default.string()),
    created_at: v4_default.string(),
    updated_at: v4_default.string()
  }));
});
