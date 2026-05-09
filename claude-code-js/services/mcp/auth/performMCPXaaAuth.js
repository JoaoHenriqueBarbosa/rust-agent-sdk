// function: performMCPXaaAuth
async function performMCPXaaAuth(serverName, serverConfig, onAuthorizationUrl, abortSignal, skipBrowserOpen) {
  if (!serverConfig.oauth?.xaa)
    throw Error("XAA: oauth.xaa must be set");
  let idp = getXaaIdpSettings();
  if (!idp)
    throw Error("XAA: no IdP connection configured. Run 'claude mcp xaa setup --issuer <url> --client-id <id> --client-secret' to configure.");
  let clientId = serverConfig.oauth?.clientId;
  if (!clientId)
    throw Error(`XAA: server '${serverName}' needs an AS client_id. Re-add with --client-id.`);
  let clientSecret = getMcpClientConfig(serverName, serverConfig)?.clientSecret;
  if (!clientSecret) {
    let wantedKey = getServerKey(serverName, serverConfig), haveKeys = Object.keys(getSecureStorage().read()?.mcpOAuthClientConfig ?? {}), headersForLogging = Object.fromEntries(Object.entries(serverConfig.headers ?? {}).map(([k3, v2]) => k3.toLowerCase() === "authorization" ? [k3, "[REDACTED]"] : [k3, v2]));
    throw logMCPDebug(serverName, `XAA: secret lookup miss. wanted=${wantedKey} have=[${haveKeys.join(", ")}] configHeaders=${jsonStringify(headersForLogging)}`), Error(`XAA: AS client secret not found for '${serverName}'. Re-add with --client-secret.`);
  }
  logMCPDebug(serverName, "XAA: starting cross-app access flow");
  let idpClientSecret = getIdpClientSecret(idp.issuer), idTokenCacheHit = getCachedIdpIdToken(idp.issuer) !== void 0, failureStage = "idp_login";
  try {
    let idToken;
    try {
      idToken = await acquireIdpIdToken({
        idpIssuer: idp.issuer,
        idpClientId: idp.clientId,
        idpClientSecret,
        callbackPort: idp.callbackPort,
        onAuthorizationUrl,
        skipBrowserOpen,
        abortSignal
      });
    } catch (e) {
      if (abortSignal?.aborted)
        throw new AuthenticationCancelledError;
      throw e;
    }
    failureStage = "discovery";
    let oidc = await discoverOidc(idp.issuer);
    failureStage = "token_exchange";
    let tokens;
    try {
      tokens = await performCrossAppAccess(serverConfig.url, {
        clientId,
        clientSecret,
        idpClientId: idp.clientId,
        idpClientSecret,
        idpIdToken: idToken,
        idpTokenEndpoint: oidc.token_endpoint
      }, serverName, abortSignal);
    } catch (e) {
      if (abortSignal?.aborted)
        throw new AuthenticationCancelledError;
      let msg = errorMessage(e);
      if (e instanceof XaaTokenExchangeError) {
        if (e.shouldClearIdToken)
          clearIdpIdToken(idp.issuer), logMCPDebug(serverName, "XAA: cleared cached id_token after token-exchange failure");
      } else if (msg.includes("PRM discovery failed") || msg.includes("AS metadata discovery failed") || msg.includes("no authorization server supports jwt-bearer"))
        failureStage = "discovery";
      else if (msg.includes("jwt-bearer"))
        failureStage = "jwt_bearer";
      throw e;
    }
    let storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(serverName, serverConfig), prev = existingData.mcpOAuth?.[serverKey];
    storage.update({
      ...existingData,
      mcpOAuth: {
        ...existingData.mcpOAuth,
        [serverKey]: {
          ...prev,
          serverName,
          serverUrl: serverConfig.url,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? prev?.refreshToken,
          expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
          scope: tokens.scope,
          clientId,
          clientSecret,
          discoveryState: {
            authorizationServerUrl: tokens.authorizationServerUrl
          }
        }
      }
    }), logMCPDebug(serverName, "XAA: tokens saved"), logEvent("tengu_mcp_oauth_flow_success", {
      authMethod: "xaa",
      idTokenCacheHit
    });
  } catch (e) {
    if (e instanceof AuthenticationCancelledError)
      throw e;
    throw logEvent("tengu_mcp_oauth_flow_failure", {
      authMethod: "xaa",
      xaaFailureStage: failureStage,
      idTokenCacheHit
    }), e;
  }
}
