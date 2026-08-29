// Original: src/services/mcp/xaaIdpLogin.ts
import { randomBytes as randomBytes5 } from "crypto";
import { createServer as createServer4 } from "http";
import { parse as parse13 } from "url";
function isXaaEnabled() {
  return isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_XAA);
}
function getXaaIdpSettings() {
  return getInitialSettings().xaaIdp;
}
function issuerKey(issuer) {
  try {
    let u5 = new URL(issuer);
    return u5.pathname = u5.pathname.replace(/\/+$/, ""), u5.host = u5.host.toLowerCase(), u5.toString();
  } catch {
    return issuer.replace(/\/+$/, "");
  }
}
function getCachedIdpIdToken(idpIssuer) {
  let entry = getSecureStorage().read()?.mcpXaaIdp?.[issuerKey(idpIssuer)];
  if (!entry)
    return;
  if (entry.expiresAt - Date.now() <= ID_TOKEN_EXPIRY_BUFFER_S * 1000)
    return;
  return entry.idToken;
}
function saveIdpIdToken(idpIssuer, idToken, expiresAt) {
  let storage = getSecureStorage(), existing = storage.read() || {};
  storage.update({
    ...existing,
    mcpXaaIdp: {
      ...existing.mcpXaaIdp,
      [issuerKey(idpIssuer)]: { idToken, expiresAt }
    }
  });
}
function saveIdpIdTokenFromJwt(idpIssuer, idToken) {
  let expFromJwt = jwtExp(idToken), expiresAt = expFromJwt ? expFromJwt * 1000 : Date.now() + 3600000;
  return saveIdpIdToken(idpIssuer, idToken, expiresAt), expiresAt;
}
function clearIdpIdToken(idpIssuer) {
  let storage = getSecureStorage(), existing = storage.read(), key2 = issuerKey(idpIssuer);
  if (!existing?.mcpXaaIdp?.[key2])
    return;
  delete existing.mcpXaaIdp[key2], storage.update(existing);
}
function saveIdpClientSecret(idpIssuer, clientSecret) {
  let storage = getSecureStorage(), existing = storage.read() || {};
  return storage.update({
    ...existing,
    mcpXaaIdpConfig: {
      ...existing.mcpXaaIdpConfig,
      [issuerKey(idpIssuer)]: { clientSecret }
    }
  });
}
function getIdpClientSecret(idpIssuer) {
  return getSecureStorage().read()?.mcpXaaIdpConfig?.[issuerKey(idpIssuer)]?.clientSecret;
}
function clearIdpClientSecret(idpIssuer) {
  let storage = getSecureStorage(), existing = storage.read(), key2 = issuerKey(idpIssuer);
  if (!existing?.mcpXaaIdpConfig?.[key2])
    return;
  delete existing.mcpXaaIdpConfig[key2], storage.update(existing);
}
async function discoverOidc(idpIssuer) {
  let base2 = idpIssuer.endsWith("/") ? idpIssuer : idpIssuer + "/", url3 = new URL(".well-known/openid-configuration", base2), res = await fetch(url3, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(IDP_REQUEST_TIMEOUT_MS)
  });
  if (!res.ok)
    throw Error(`XAA IdP: OIDC discovery failed: HTTP ${res.status} at ${url3}`);
  let body;
  try {
    body = await res.json();
  } catch {
    throw Error(`XAA IdP: OIDC discovery returned non-JSON at ${url3} (captive portal or proxy?)`);
  }
  let parsed = OpenIdProviderDiscoveryMetadataSchema.safeParse(body);
  if (!parsed.success)
    throw Error(`XAA IdP: invalid OIDC metadata: ${parsed.error.message}`);
  if (new URL(parsed.data.token_endpoint).protocol !== "https:")
    throw Error(`XAA IdP: refusing non-HTTPS token endpoint: ${parsed.data.token_endpoint}`);
  return parsed.data;
}
function jwtExp(jwt3) {
  let parts = jwt3.split(".");
  if (parts.length !== 3)
    return;
  try {
    let payload = jsonParse(Buffer.from(parts[1], "base64url").toString("utf-8"));
    return typeof payload.exp === "number" ? payload.exp : void 0;
  } catch {
    return;
  }
}
function waitForCallback(port, expectedState, abortSignal, onListening) {
  let server = null, timeoutId = null, abortHandler = null, cleanup = () => {
    if (server?.removeAllListeners(), server?.on("error", () => {}), server?.close(), server = null, timeoutId)
      clearTimeout(timeoutId), timeoutId = null;
    if (abortSignal && abortHandler)
      abortSignal.removeEventListener("abort", abortHandler), abortHandler = null;
  };
  return new Promise((resolve24, reject2) => {
    let resolved = !1, resolveOnce = (v2) => {
      if (resolved)
        return;
      resolved = !0, cleanup(), resolve24(v2);
    }, rejectOnce = (e) => {
      if (resolved)
        return;
      resolved = !0, cleanup(), reject2(e);
    };
    if (abortSignal) {
      if (abortHandler = () => rejectOnce(Error("XAA IdP: login cancelled")), abortSignal.aborted) {
        abortHandler();
        return;
      }
      abortSignal.addEventListener("abort", abortHandler, { once: !0 });
    }
    server = createServer4((req, res) => {
      let parsed = parse13(req.url || "", !0);
      if (parsed.pathname !== "/callback") {
        res.writeHead(404), res.end();
        return;
      }
      let code = parsed.query.code, state3 = parsed.query.state, err2 = parsed.query.error;
      if (err2) {
        let desc = parsed.query.error_description, safeErr = import_xss.default(err2), safeDesc = desc ? import_xss.default(desc) : "";
        res.writeHead(400, { "Content-Type": "text/html" }), res.end(`<html><body><h3>IdP login failed</h3><p>${safeErr}</p><p>${safeDesc}</p></body></html>`), rejectOnce(Error(`XAA IdP: ${err2}${desc ? ` \u2014 ${desc}` : ""}`));
        return;
      }
      if (state3 !== expectedState) {
        res.writeHead(400, { "Content-Type": "text/html" }), res.end("<html><body><h3>State mismatch</h3></body></html>"), rejectOnce(Error("XAA IdP: state mismatch (possible CSRF)"));
        return;
      }
      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" }), res.end("<html><body><h3>Missing code</h3></body></html>"), rejectOnce(Error("XAA IdP: callback missing code"));
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" }), res.end("<html><body><h3>IdP login complete \u2014 you can close this window.</h3></body></html>"), resolveOnce(code);
    }), server.on("error", (err2) => {
      if (err2.code === "EADDRINUSE") {
        let findCmd = getPlatform() === "windows" ? `netstat -ano | findstr :${port}` : `lsof -ti:${port} -sTCP:LISTEN`;
        rejectOnce(Error(`XAA IdP: callback port ${port} is already in use. Run \`${findCmd}\` to find the holder.`));
      } else
        rejectOnce(Error(`XAA IdP: callback server failed: ${err2.message}`));
    }), server.listen(port, "127.0.0.1", () => {
      try {
        onListening();
      } catch (e) {
        rejectOnce(toError(e));
      }
    }), server.unref(), timeoutId = setTimeout((rej) => rej(Error("XAA IdP: login timed out")), IDP_LOGIN_TIMEOUT_MS, rejectOnce), timeoutId.unref();
  });
}
async function acquireIdpIdToken(opts) {
  let { idpIssuer, idpClientId } = opts, cached2 = getCachedIdpIdToken(idpIssuer);
  if (cached2)
    return logMCPDebug("xaa", `Using cached id_token for ${idpIssuer}`), cached2;
  logMCPDebug("xaa", `No cached id_token for ${idpIssuer}; starting OIDC login`);
  let metadata = await discoverOidc(idpIssuer), port = opts.callbackPort ?? await findAvailablePort(), redirectUri = buildRedirectUri(port), state3 = randomBytes5(32).toString("base64url"), clientInformation = {
    client_id: idpClientId,
    ...opts.idpClientSecret ? { client_secret: opts.idpClientSecret } : {}
  }, { authorizationUrl, codeVerifier } = await startAuthorization(idpIssuer, {
    metadata,
    clientInformation,
    redirectUrl: redirectUri,
    scope: "openid",
    state: state3
  }), authorizationCode = await waitForCallback(port, state3, opts.abortSignal, () => {
    if (opts.onAuthorizationUrl)
      opts.onAuthorizationUrl(authorizationUrl.toString());
    if (!opts.skipBrowserOpen)
      logMCPDebug("xaa", "Opening browser to IdP authorization endpoint"), openBrowser(authorizationUrl.toString());
  }), tokens = await exchangeAuthorization(idpIssuer, {
    metadata,
    clientInformation,
    authorizationCode,
    codeVerifier,
    redirectUri,
    fetchFn: (url3, init2) => fetch(url3, {
      ...init2,
      signal: AbortSignal.timeout(IDP_REQUEST_TIMEOUT_MS)
    })
  });
  if (!tokens.id_token)
    throw Error("XAA IdP: token response missing id_token (check scope=openid)");
  let expFromJwt = jwtExp(tokens.id_token), expiresAt = expFromJwt ? expFromJwt * 1000 : Date.now() + (tokens.expires_in ?? 3600) * 1000;
  return saveIdpIdToken(idpIssuer, tokens.id_token, expiresAt), logMCPDebug("xaa", `Cached id_token for ${idpIssuer} (expires ${new Date(expiresAt).toISOString()})`), tokens.id_token;
}
var import_xss, IDP_LOGIN_TIMEOUT_MS = 300000, IDP_REQUEST_TIMEOUT_MS = 30000, ID_TOKEN_EXPIRY_BUFFER_S = 60;
var init_xaaIdpLogin = __esm(() => {
  init_auth16();
  init_auth15();
  init_browser();
  init_envUtils();
  init_errors();
  init_log3();
  init_platform();
  init_secureStorage();
  init_settings2();
  init_slowOperations();
  init_oauthPort();
  import_xss = __toESM(require_lib8(), 1);
});
