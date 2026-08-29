// Original: src/services/mcp/xaa.ts
function makeXaaFetch(abortSignal) {
  return (url3, init2) => {
    let timeout = AbortSignal.timeout(XAA_REQUEST_TIMEOUT_MS), signal = abortSignal ? AbortSignal.any([timeout, abortSignal]) : timeout;
    return fetch(url3, { ...init2, signal });
  };
}
function normalizeUrl(url3) {
  try {
    return new URL(url3).href.replace(/\/$/, "");
  } catch {
    return url3.replace(/\/$/, "");
  }
}
function redactTokens(raw) {
  return (typeof raw === "string" ? raw : jsonStringify(raw)).replace(SENSITIVE_TOKEN_RE, (_, k3) => `"${k3}":"[REDACTED]"`);
}
async function discoverProtectedResource(serverUrl, opts) {
  let prm;
  try {
    prm = await discoverOAuthProtectedResourceMetadata(serverUrl, void 0, opts?.fetchFn ?? defaultFetch);
  } catch (e) {
    throw Error(`XAA: PRM discovery failed: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!prm.resource || !prm.authorization_servers?.[0])
    throw Error("XAA: PRM discovery failed: PRM missing resource or authorization_servers");
  if (normalizeUrl(prm.resource) !== normalizeUrl(serverUrl))
    throw Error(`XAA: PRM discovery failed: PRM resource mismatch: expected ${serverUrl}, got ${prm.resource}`);
  return {
    resource: prm.resource,
    authorization_servers: prm.authorization_servers
  };
}
async function discoverAuthorizationServer(asUrl, opts) {
  let meta = await discoverAuthorizationServerMetadata(asUrl, {
    fetchFn: opts?.fetchFn ?? defaultFetch
  });
  if (!meta?.issuer || !meta.token_endpoint)
    throw Error(`XAA: AS metadata discovery failed: no valid metadata at ${asUrl}`);
  if (normalizeUrl(meta.issuer) !== normalizeUrl(asUrl))
    throw Error(`XAA: AS metadata discovery failed: issuer mismatch: expected ${asUrl}, got ${meta.issuer}`);
  if (new URL(meta.token_endpoint).protocol !== "https:")
    throw Error(`XAA: refusing non-HTTPS token endpoint: ${meta.token_endpoint}`);
  return {
    issuer: meta.issuer,
    token_endpoint: meta.token_endpoint,
    grant_types_supported: meta.grant_types_supported,
    token_endpoint_auth_methods_supported: meta.token_endpoint_auth_methods_supported
  };
}
async function requestJwtAuthorizationGrant(opts) {
  let fetchFn = opts.fetchFn ?? defaultFetch, params = new URLSearchParams({
    grant_type: TOKEN_EXCHANGE_GRANT,
    requested_token_type: ID_JAG_TOKEN_TYPE,
    audience: opts.audience,
    resource: opts.resource,
    subject_token: opts.idToken,
    subject_token_type: ID_TOKEN_TYPE,
    client_id: opts.clientId
  });
  if (opts.clientSecret)
    params.set("client_secret", opts.clientSecret);
  if (opts.scope)
    params.set("scope", opts.scope);
  let res = await fetchFn(opts.tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  if (!res.ok) {
    let body = redactTokens(await res.text()).slice(0, 200), shouldClear = res.status < 500;
    throw new XaaTokenExchangeError(`XAA: token exchange failed: HTTP ${res.status}: ${body}`, shouldClear);
  }
  let rawExchange;
  try {
    rawExchange = await res.json();
  } catch {
    throw new XaaTokenExchangeError(`XAA: token exchange returned non-JSON (captive portal?) at ${opts.tokenEndpoint}`, !1);
  }
  let exchangeParsed = TokenExchangeResponseSchema().safeParse(rawExchange);
  if (!exchangeParsed.success)
    throw new XaaTokenExchangeError(`XAA: token exchange response did not match expected shape: ${redactTokens(rawExchange)}`, !0);
  let result = exchangeParsed.data;
  if (!result.access_token)
    throw new XaaTokenExchangeError(`XAA: token exchange response missing access_token: ${redactTokens(result)}`, !0);
  if (result.issued_token_type !== ID_JAG_TOKEN_TYPE)
    throw new XaaTokenExchangeError(`XAA: token exchange returned unexpected issued_token_type: ${result.issued_token_type}`, !0);
  return {
    jwtAuthGrant: result.access_token,
    expiresIn: result.expires_in,
    scope: result.scope
  };
}
async function exchangeJwtAuthGrant(opts) {
  let fetchFn = opts.fetchFn ?? defaultFetch, authMethod = opts.authMethod ?? "client_secret_basic", params = new URLSearchParams({
    grant_type: JWT_BEARER_GRANT,
    assertion: opts.assertion
  });
  if (opts.scope)
    params.set("scope", opts.scope);
  let headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  if (authMethod === "client_secret_basic") {
    let basicAuth = Buffer.from(`${encodeURIComponent(opts.clientId)}:${encodeURIComponent(opts.clientSecret)}`).toString("base64");
    headers.Authorization = `Basic ${basicAuth}`;
  } else
    params.set("client_id", opts.clientId), params.set("client_secret", opts.clientSecret);
  let res = await fetchFn(opts.tokenEndpoint, {
    method: "POST",
    headers,
    body: params
  });
  if (!res.ok) {
    let body = redactTokens(await res.text()).slice(0, 200);
    throw Error(`XAA: jwt-bearer grant failed: HTTP ${res.status}: ${body}`);
  }
  let rawTokens;
  try {
    rawTokens = await res.json();
  } catch {
    throw Error(`XAA: jwt-bearer grant returned non-JSON (captive portal?) at ${opts.tokenEndpoint}`);
  }
  let tokensParsed = JwtBearerResponseSchema().safeParse(rawTokens);
  if (!tokensParsed.success)
    throw Error(`XAA: jwt-bearer response did not match expected shape: ${redactTokens(rawTokens)}`);
  return tokensParsed.data;
}
async function performCrossAppAccess(serverUrl, config10, serverName = "xaa", abortSignal) {
  let fetchFn = makeXaaFetch(abortSignal);
  logMCPDebug(serverName, `XAA: discovering PRM for ${serverUrl}`);
  let prm = await discoverProtectedResource(serverUrl, { fetchFn });
  logMCPDebug(serverName, `XAA: discovered resource=${prm.resource} ASes=[${prm.authorization_servers.join(", ")}]`);
  let asMeta, asErrors = [];
  for (let asUrl of prm.authorization_servers) {
    let candidate;
    try {
      candidate = await discoverAuthorizationServer(asUrl, { fetchFn });
    } catch (e) {
      if (abortSignal?.aborted)
        throw e;
      asErrors.push(`${asUrl}: ${e instanceof Error ? e.message : String(e)}`);
      continue;
    }
    if (candidate.grant_types_supported && !candidate.grant_types_supported.includes(JWT_BEARER_GRANT)) {
      asErrors.push(`${asUrl}: does not advertise jwt-bearer grant (supported: ${candidate.grant_types_supported.join(", ")})`);
      continue;
    }
    asMeta = candidate;
    break;
  }
  if (!asMeta)
    throw Error(`XAA: no authorization server supports jwt-bearer. Tried: ${asErrors.join("; ")}`);
  let authMethods = asMeta.token_endpoint_auth_methods_supported, authMethod = authMethods && !authMethods.includes("client_secret_basic") && authMethods.includes("client_secret_post") ? "client_secret_post" : "client_secret_basic";
  logMCPDebug(serverName, `XAA: AS issuer=${asMeta.issuer} token_endpoint=${asMeta.token_endpoint} auth_method=${authMethod}`), logMCPDebug(serverName, "XAA: exchanging id_token for ID-JAG at IdP");
  let jag = await requestJwtAuthorizationGrant({
    tokenEndpoint: config10.idpTokenEndpoint,
    audience: asMeta.issuer,
    resource: prm.resource,
    idToken: config10.idpIdToken,
    clientId: config10.idpClientId,
    clientSecret: config10.idpClientSecret,
    fetchFn
  });
  logMCPDebug(serverName, "XAA: ID-JAG obtained"), logMCPDebug(serverName, "XAA: exchanging ID-JAG for access_token at AS");
  let tokens = await exchangeJwtAuthGrant({
    tokenEndpoint: asMeta.token_endpoint,
    assertion: jag.jwtAuthGrant,
    clientId: config10.clientId,
    clientSecret: config10.clientSecret,
    authMethod,
    fetchFn
  });
  return logMCPDebug(serverName, "XAA: access_token obtained"), { ...tokens, authorizationServerUrl: asMeta.issuer };
}
var XAA_REQUEST_TIMEOUT_MS = 30000, TOKEN_EXCHANGE_GRANT = "urn:ietf:params:oauth:grant-type:token-exchange", JWT_BEARER_GRANT = "urn:ietf:params:oauth:grant-type:jwt-bearer", ID_JAG_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:id-jag", ID_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:id_token", defaultFetch, XaaTokenExchangeError, SENSITIVE_TOKEN_RE, TokenExchangeResponseSchema, JwtBearerResponseSchema;
var init_xaa = __esm(() => {
  init_auth16();
  init_v4();
  init_log3();
  init_slowOperations();
  defaultFetch = makeXaaFetch();
  XaaTokenExchangeError = class XaaTokenExchangeError extends Error {
    shouldClearIdToken;
    constructor(message, shouldClearIdToken) {
      super(message);
      this.name = "XaaTokenExchangeError", this.shouldClearIdToken = shouldClearIdToken;
    }
  };
  SENSITIVE_TOKEN_RE = /"(access_token|refresh_token|id_token|assertion|subject_token|client_secret)"\s*:\s*"[^"]*"/g;
  TokenExchangeResponseSchema = lazySchema(() => exports_external.object({
    access_token: exports_external.string().optional(),
    issued_token_type: exports_external.string().optional(),
    expires_in: exports_external.coerce.number().optional(),
    scope: exports_external.string().optional()
  })), JwtBearerResponseSchema = lazySchema(() => exports_external.object({
    access_token: exports_external.string().min(1),
    token_type: exports_external.string().default("Bearer"),
    expires_in: exports_external.coerce.number().optional(),
    scope: exports_external.string().optional(),
    refresh_token: exports_external.string().optional()
  }));
});
