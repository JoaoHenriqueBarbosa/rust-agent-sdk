// function: performMCPOAuthFlow
async function performMCPOAuthFlow(serverName, serverConfig, onAuthorizationUrl, abortSignal, options2) {
  if (serverConfig.oauth?.xaa) {
    if (!isXaaEnabled())
      throw Error(`XAA is not enabled (set CLAUDE_CODE_ENABLE_XAA=1). Remove 'oauth.xaa' from server '${serverName}' to use the standard consent flow.`);
    logEvent("tengu_mcp_oauth_flow_start", {
      isOAuthFlow: !0,
      authMethod: "xaa",
      transportType: serverConfig.type,
      ...getLoggingSafeMcpBaseUrl(serverConfig) ? {
        mcpServerBaseUrl: getLoggingSafeMcpBaseUrl(serverConfig)
      } : {}
    }), await performMCPXaaAuth(serverName, serverConfig, onAuthorizationUrl, abortSignal, options2?.skipBrowserOpen);
    return;
  }
  let storage = getSecureStorage(), serverKey = getServerKey(serverName, serverConfig), cachedEntry = storage.read()?.mcpOAuth?.[serverKey], cachedStepUpScope = cachedEntry?.stepUpScope, cachedResourceMetadataUrl = cachedEntry?.discoveryState?.resourceMetadataUrl;
  clearServerTokensFromLocalStorage(serverName, serverConfig);
  let resourceMetadataUrl;
  if (cachedResourceMetadataUrl)
    try {
      resourceMetadataUrl = new URL(cachedResourceMetadataUrl);
    } catch {
      logMCPDebug(serverName, `Invalid cached resourceMetadataUrl: ${cachedResourceMetadataUrl}`);
    }
  let wwwAuthParams = {
    scope: cachedStepUpScope,
    resourceMetadataUrl
  }, flowAttemptId = randomUUID7();
  logEvent("tengu_mcp_oauth_flow_start", {
    flowAttemptId,
    isOAuthFlow: !0,
    transportType: serverConfig.type,
    ...getLoggingSafeMcpBaseUrl(serverConfig) ? {
      mcpServerBaseUrl: getLoggingSafeMcpBaseUrl(serverConfig)
    } : {}
  });
  let authorizationCodeObtained = !1;
  try {
    let configuredCallbackPort = serverConfig.oauth?.callbackPort, port = configuredCallbackPort ?? await findAvailablePort(), redirectUri = buildRedirectUri(port);
    logMCPDebug(serverName, `Using redirect port: ${port}${configuredCallbackPort ? " (from config)" : ""}`);
    let provider5 = new ClaudeAuthProvider(serverName, serverConfig, redirectUri, !0, onAuthorizationUrl, options2?.skipBrowserOpen);
    try {
      let metadata = await fetchAuthServerMetadata(serverName, serverConfig.url, serverConfig.oauth?.authServerMetadataUrl, void 0, wwwAuthParams.resourceMetadataUrl);
      if (metadata)
        provider5.setMetadata(metadata), logMCPDebug(serverName, `Fetched OAuth metadata with scope: ${getScopeFromMetadata(metadata) || "NONE"}`);
    } catch (error44) {
      logMCPDebug(serverName, `Failed to fetch OAuth metadata: ${errorMessage(error44)}`);
    }
    let oauthState = await provider5.state(), server = null, timeoutId = null, abortHandler = null, cleanup = () => {
      if (server)
        server.removeAllListeners(), server.on("error", () => {}), server.close(), server = null;
      if (timeoutId)
        clearTimeout(timeoutId), timeoutId = null;
      if (abortSignal && abortHandler)
        abortSignal.removeEventListener("abort", abortHandler), abortHandler = null;
      logMCPDebug(serverName, "MCP OAuth server cleaned up");
    }, authorizationCode = await new Promise((resolve24, reject2) => {
      let resolved = !1, resolveOnce = (code) => {
        if (resolved)
          return;
        resolved = !0, resolve24(code);
      }, rejectOnce = (error44) => {
        if (resolved)
          return;
        resolved = !0, reject2(error44);
      };
      if (abortSignal) {
        if (abortHandler = () => {
          cleanup(), rejectOnce(new AuthenticationCancelledError);
        }, abortSignal.aborted) {
          abortHandler();
          return;
        }
        abortSignal.addEventListener("abort", abortHandler);
      }
      if (options2?.onWaitingForCallback)
        options2.onWaitingForCallback((callbackUrl) => {
          try {
            let parsed = new URL(callbackUrl), code = parsed.searchParams.get("code"), state3 = parsed.searchParams.get("state"), error44 = parsed.searchParams.get("error");
            if (error44) {
              let errorDescription = parsed.searchParams.get("error_description") || "";
              cleanup(), rejectOnce(Error(`OAuth error: ${error44} - ${errorDescription}`));
              return;
            }
            if (!code)
              return;
            if (state3 !== oauthState) {
              cleanup(), rejectOnce(Error("OAuth state mismatch - possible CSRF attack"));
              return;
            }
            logMCPDebug(serverName, "Received auth code via manual callback URL"), cleanup(), resolveOnce(code);
          } catch {}
        });
      server = createServer5((req, res) => {
        let parsedUrl = parse14(req.url || "", !0);
        if (parsedUrl.pathname === "/callback") {
          let code = parsedUrl.query.code, state3 = parsedUrl.query.state, error44 = parsedUrl.query.error, errorDescription = parsedUrl.query.error_description, errorUri = parsedUrl.query.error_uri;
          if (!error44 && state3 !== oauthState) {
            res.writeHead(400, { "Content-Type": "text/html" }), res.end("<h1>Authentication Error</h1><p>Invalid state parameter. Please try again.</p><p>You can close this window.</p>"), cleanup(), rejectOnce(Error("OAuth state mismatch - possible CSRF attack"));
            return;
          }
          if (error44) {
            res.writeHead(200, { "Content-Type": "text/html" });
            let sanitizedError = import_xss2.default(String(error44)), sanitizedErrorDescription = errorDescription ? import_xss2.default(String(errorDescription)) : "";
            res.end(`<h1>Authentication Error</h1><p>${sanitizedError}: ${sanitizedErrorDescription}</p><p>You can close this window.</p>`), cleanup();
            let errorMessage2 = `OAuth error: ${error44}`;
            if (errorDescription)
              errorMessage2 += ` - ${errorDescription}`;
            if (errorUri)
              errorMessage2 += ` (See: ${errorUri})`;
            rejectOnce(Error(errorMessage2));
            return;
          }
          if (code)
            res.writeHead(200, { "Content-Type": "text/html" }), res.end("<h1>Authentication Successful</h1><p>You can close this window. Return to Claude Code.</p>"), cleanup(), resolveOnce(code);
        }
      }), server.on("error", (err2) => {
        if (cleanup(), err2.code === "EADDRINUSE") {
          let findCmd = getPlatform() === "windows" ? `netstat -ano | findstr :${port}` : `lsof -ti:${port} -sTCP:LISTEN`;
          rejectOnce(Error(`OAuth callback port ${port} is already in use \u2014 another process may be holding it. ` + `Run \`${findCmd}\` to find it.`));
        } else
          rejectOnce(Error(`OAuth callback server failed: ${err2.message}`));
      }), server.listen(port, "127.0.0.1", async () => {
        try {
          logMCPDebug(serverName, "Starting SDK auth"), logMCPDebug(serverName, `Server URL: ${serverConfig.url}`);
          let result2 = await auth13(provider5, {
            serverUrl: serverConfig.url,
            scope: wwwAuthParams.scope,
            resourceMetadataUrl: wwwAuthParams.resourceMetadataUrl
          });
          if (logMCPDebug(serverName, `Initial auth result: ${result2}`), result2 !== "REDIRECT")
            logMCPDebug(serverName, `Unexpected auth result, expected REDIRECT: ${result2}`);
        } catch (error44) {
          logMCPDebug(serverName, `SDK auth error: ${error44}`), cleanup(), rejectOnce(Error(`SDK auth failed: ${errorMessage(error44)}`));
        }
      }), server.unref(), timeoutId = setTimeout((cleanup2, rejectOnce2) => {
        cleanup2(), rejectOnce2(Error("Authentication timeout"));
      }, 300000, cleanup, rejectOnce), timeoutId.unref();
    });
    authorizationCodeObtained = !0, logMCPDebug(serverName, "Completing auth flow with authorization code");
    let result = await auth13(provider5, {
      serverUrl: serverConfig.url,
      authorizationCode,
      resourceMetadataUrl: wwwAuthParams.resourceMetadataUrl
    });
    if (logMCPDebug(serverName, `Auth result: ${result}`), result === "AUTHORIZED") {
      let savedTokens = await provider5.tokens();
      if (logMCPDebug(serverName, `Tokens after auth: ${savedTokens ? "Present" : "Missing"}`), savedTokens)
        logMCPDebug(serverName, `Token access_token length: ${savedTokens.access_token?.length}`), logMCPDebug(serverName, `Token expires_in: ${savedTokens.expires_in}`);
      logEvent("tengu_mcp_oauth_flow_success", {
        flowAttemptId,
        transportType: serverConfig.type,
        ...getLoggingSafeMcpBaseUrl(serverConfig) ? {
          mcpServerBaseUrl: getLoggingSafeMcpBaseUrl(serverConfig)
        } : {}
      });
    } else
      throw Error("Unexpected auth result: " + result);
  } catch (error44) {
    logMCPDebug(serverName, `Error during auth completion: ${error44}`);
    let reason = "unknown", oauthErrorCode, httpStatus;
    if (error44 instanceof AuthenticationCancelledError)
      reason = "cancelled";
    else if (authorizationCodeObtained)
      reason = "token_exchange_failed";
    else {
      let msg = errorMessage(error44);
      if (msg.includes("Authentication timeout"))
        reason = "timeout";
      else if (msg.includes("OAuth state mismatch"))
        reason = "state_mismatch";
      else if (msg.includes("OAuth error:"))
        reason = "provider_denied";
      else if (msg.includes("already in use") || msg.includes("EADDRINUSE") || msg.includes("callback server failed") || msg.includes("No available port"))
        reason = "port_unavailable";
      else if (msg.includes("SDK auth failed"))
        reason = "sdk_auth_failed";
    }
    if (error44 instanceof OAuthError) {
      oauthErrorCode = error44.errorCode;
      let statusMatch = error44.message.match(/^HTTP (\d{3}):/);
      if (statusMatch)
        httpStatus = Number(statusMatch[1]);
      if (error44.errorCode === "invalid_client" && error44.message.includes("Client not found")) {
        let storage2 = getSecureStorage(), existingData = storage2.read() || {}, serverKey2 = getServerKey(serverName, serverConfig);
        if (existingData.mcpOAuth?.[serverKey2])
          delete existingData.mcpOAuth[serverKey2].clientId, delete existingData.mcpOAuth[serverKey2].clientSecret, storage2.update(existingData);
      }
    }
    throw logEvent("tengu_mcp_oauth_flow_error", {
      flowAttemptId,
      reason,
      error_code: oauthErrorCode,
      http_status: httpStatus?.toString(),
      transportType: serverConfig.type,
      ...getLoggingSafeMcpBaseUrl(serverConfig) ? {
        mcpServerBaseUrl: getLoggingSafeMcpBaseUrl(serverConfig)
      } : {}
    }), error44;
  }
}
