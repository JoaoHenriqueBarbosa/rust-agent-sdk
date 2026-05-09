// Original: src/services/api/client.ts
import { randomUUID as randomUUID4 } from "crypto";
function createStderrLogger() {
  return {
    error: (msg, ...args) => console.error("[Anthropic SDK ERROR]", msg, ...args),
    warn: (msg, ...args) => console.error("[Anthropic SDK WARN]", msg, ...args),
    info: (msg, ...args) => console.error("[Anthropic SDK INFO]", msg, ...args),
    debug: (msg, ...args) => console.error("[Anthropic SDK DEBUG]", msg, ...args)
  };
}
async function getAnthropicClient({
  apiKey,
  maxRetries,
  model,
  fetchOverride,
  source
}) {
  let containerId = process.env.CLAUDE_CODE_CONTAINER_ID, remoteSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID, clientApp = process.env.CLAUDE_AGENT_SDK_CLIENT_APP, customHeaders = getCustomHeaders(), defaultHeaders = {
    "x-app": "cli",
    "User-Agent": getUserAgent(),
    "X-Claude-Code-Session-Id": getSessionId(),
    ...customHeaders,
    ...containerId ? { "x-claude-remote-container-id": containerId } : {},
    ...remoteSessionId ? { "x-claude-remote-session-id": remoteSessionId } : {},
    ...clientApp ? { "x-client-app": clientApp } : {}
  };
  if (logForDebugging(`[API:request] Creating client, ANTHROPIC_CUSTOM_HEADERS present: ${!!process.env.ANTHROPIC_CUSTOM_HEADERS}, has Authorization header: ${!!customHeaders.Authorization}`), isEnvTruthy(process.env.CLAUDE_CODE_ADDITIONAL_PROTECTION))
    defaultHeaders["x-anthropic-additional-protection"] = "true";
  if (logForDebugging("[API:auth] OAuth token check starting"), await checkAndRefreshOAuthTokenIfNeeded(), logForDebugging("[API:auth] OAuth token check complete"), !isClaudeAISubscriber())
    await configureApiKeyHeaders(defaultHeaders, getIsNonInteractiveSession());
  let resolvedFetch = buildFetch(fetchOverride, source), ARGS = {
    defaultHeaders,
    maxRetries,
    timeout: parseInt(process.env.API_TIMEOUT_MS || String(600000), 10),
    dangerouslyAllowBrowser: !0,
    fetchOptions: getProxyFetchOptions({
      forAnthropicAPI: !0
    }),
    ...resolvedFetch && {
      fetch: resolvedFetch
    }
  };
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_BEDROCK)) {
    let { AnthropicBedrock: AnthropicBedrock2 } = await Promise.resolve().then(() => (init_bedrock_sdk(), exports_bedrock_sdk)), awsRegion = model === getSmallFastModel() && process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION ? process.env.ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION : getAWSRegion(), bedrockArgs = {
      ...ARGS,
      awsRegion,
      ...isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH) && {
        skipAuth: !0
      },
      ...isDebugToStdErr() && { logger: createStderrLogger() }
    };
    if (process.env.AWS_BEARER_TOKEN_BEDROCK)
      bedrockArgs.skipAuth = !0, bedrockArgs.defaultHeaders = {
        ...bedrockArgs.defaultHeaders,
        Authorization: `Bearer ${process.env.AWS_BEARER_TOKEN_BEDROCK}`
      };
    else if (!isEnvTruthy(process.env.CLAUDE_CODE_SKIP_BEDROCK_AUTH)) {
      let cachedCredentials = await refreshAndGetAwsCredentials();
      if (cachedCredentials)
        bedrockArgs.awsAccessKey = cachedCredentials.accessKeyId, bedrockArgs.awsSecretKey = cachedCredentials.secretAccessKey, bedrockArgs.awsSessionToken = cachedCredentials.sessionToken;
    }
    return new AnthropicBedrock2(bedrockArgs);
  }
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_FOUNDRY)) {
    let { AnthropicFoundry: AnthropicFoundry2 } = await Promise.resolve().then(() => (init_foundry_sdk(), exports_foundry_sdk)), azureADTokenProvider;
    if (!process.env.ANTHROPIC_FOUNDRY_API_KEY)
      if (isEnvTruthy(process.env.CLAUDE_CODE_SKIP_FOUNDRY_AUTH))
        azureADTokenProvider = () => Promise.resolve("");
      else {
        let {
          DefaultAzureCredential: AzureCredential,
          getBearerTokenProvider: getBearerTokenProvider2
        } = await Promise.resolve().then(() => (init_esm8(), exports_esm));
        azureADTokenProvider = getBearerTokenProvider2(new AzureCredential, "https://cognitiveservices.azure.com/.default");
      }
    let foundryArgs = {
      ...ARGS,
      ...azureADTokenProvider && { azureADTokenProvider },
      ...isDebugToStdErr() && { logger: createStderrLogger() }
    };
    return new AnthropicFoundry2(foundryArgs);
  }
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_VERTEX)) {
    if (!isEnvTruthy(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH))
      await refreshGcpCredentialsIfNeeded();
    let [{ AnthropicVertex: AnthropicVertex2 }, { GoogleAuth: GoogleAuth2 }] = await Promise.all([
      Promise.resolve().then(() => (init_vertex_sdk(), exports_vertex_sdk)),
      Promise.resolve().then(() => __toESM(require_src6(), 1))
    ]), hasProjectEnvVar = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project, hasKeyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials, googleAuth = isEnvTruthy(process.env.CLAUDE_CODE_SKIP_VERTEX_AUTH) ? {
      getClient: () => ({
        getRequestHeaders: () => ({})
      })
    } : new GoogleAuth2({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      ...hasProjectEnvVar || hasKeyFile ? {} : {
        projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID
      }
    }), vertexArgs = {
      ...ARGS,
      region: getVertexRegionForModel(model),
      googleAuth,
      ...isDebugToStdErr() && { logger: createStderrLogger() }
    };
    return new AnthropicVertex2(vertexArgs);
  }
  let clientConfig = {
    apiKey: isClaudeAISubscriber() ? null : apiKey || getAnthropicApiKey(),
    authToken: isClaudeAISubscriber() ? getClaudeAIOAuthTokens()?.accessToken : void 0,
    ...{},
    ...ARGS,
    ...isDebugToStdErr() && { logger: createStderrLogger() }
  };
  return new Anthropic(clientConfig);
}
async function configureApiKeyHeaders(headers, isNonInteractiveSession) {
  let token = process.env.ANTHROPIC_AUTH_TOKEN || await getApiKeyFromApiKeyHelper(isNonInteractiveSession);
  if (token)
    headers.Authorization = `Bearer ${token}`;
}
function getCustomHeaders() {
  let customHeaders = {}, customHeadersEnv = process.env.ANTHROPIC_CUSTOM_HEADERS;
  if (!customHeadersEnv)
    return customHeaders;
  let headerStrings = customHeadersEnv.split(/\n|\r\n/);
  for (let headerString of headerStrings) {
    if (!headerString.trim())
      continue;
    let colonIdx = headerString.indexOf(":");
    if (colonIdx === -1)
      continue;
    let name3 = headerString.slice(0, colonIdx).trim(), value = headerString.slice(colonIdx + 1).trim();
    if (name3)
      customHeaders[name3] = value;
  }
  return customHeaders;
}
function buildFetch(fetchOverride, source) {
  let inner = fetchOverride ?? globalThis.fetch, injectClientRequestId = getAPIProvider() === "firstParty" && isFirstPartyAnthropicBaseUrl();
  return (input, init) => {
    let headers = new Headers(init?.headers);
    if (injectClientRequestId && !headers.has(CLIENT_REQUEST_ID_HEADER))
      headers.set(CLIENT_REQUEST_ID_HEADER, randomUUID4());
    try {
      let url3 = input instanceof Request ? input.url : String(input), id = headers.get(CLIENT_REQUEST_ID_HEADER);
      logForDebugging(`[API REQUEST] ${new URL(url3).pathname}${id ? ` ${CLIENT_REQUEST_ID_HEADER}=${id}` : ""} source=${source ?? "unknown"}`);
    } catch {}
    return inner(input, { ...init, headers });
  };
}
var CLIENT_REQUEST_ID_HEADER = "x-client-request-id";
var init_client17 = __esm(() => {
  init_sdk();
  init_auth14();
  init_http6();
  init_model();
  init_providers();
  init_proxy();
  init_state();
  init_oauth();
  init_debug();
  init_envUtils();
});
