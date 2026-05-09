// class: ClaudeAuthProvider
class ClaudeAuthProvider {
  serverName;
  serverConfig;
  redirectUri;
  handleRedirection;
  _codeVerifier;
  _authorizationUrl;
  _state;
  _scopes;
  _metadata;
  _refreshInProgress;
  _pendingStepUpScope;
  onAuthorizationUrlCallback;
  skipBrowserOpen;
  constructor(serverName, serverConfig, redirectUri = buildRedirectUri(), handleRedirection = !1, onAuthorizationUrl, skipBrowserOpen) {
    this.serverName = serverName, this.serverConfig = serverConfig, this.redirectUri = redirectUri, this.handleRedirection = handleRedirection, this.onAuthorizationUrlCallback = onAuthorizationUrl, this.skipBrowserOpen = skipBrowserOpen ?? !1;
  }
  get redirectUrl() {
    return this.redirectUri;
  }
  get authorizationUrl() {
    return this._authorizationUrl;
  }
  get clientMetadata() {
    let metadata = {
      client_name: `Claude Code (${this.serverName})`,
      redirect_uris: [this.redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none"
    }, metadataScope = getScopeFromMetadata(this._metadata);
    if (metadataScope)
      metadata.scope = metadataScope, logMCPDebug(this.serverName, `Using scope from metadata: ${metadata.scope}`);
    return metadata;
  }
  get clientMetadataUrl() {
    let override = process.env.MCP_OAUTH_CLIENT_METADATA_URL;
    if (override)
      return logMCPDebug(this.serverName, `Using CIMD URL from env: ${override}`), override;
    return MCP_CLIENT_METADATA_URL;
  }
  setMetadata(metadata) {
    this._metadata = metadata;
  }
  markStepUpPending(scope) {
    this._pendingStepUpScope = scope, logMCPDebug(this.serverName, `Marked step-up pending: ${scope}`);
  }
  async state() {
    if (!this._state)
      this._state = randomBytes6(32).toString("base64url"), logMCPDebug(this.serverName, "Generated new OAuth state");
    return this._state;
  }
  async clientInformation() {
    let data = getSecureStorage().read(), serverKey = getServerKey(this.serverName, this.serverConfig), storedInfo = data?.mcpOAuth?.[serverKey];
    if (storedInfo?.clientId)
      return logMCPDebug(this.serverName, "Found client info"), {
        client_id: storedInfo.clientId,
        client_secret: storedInfo.clientSecret
      };
    let configClientId = this.serverConfig.oauth?.clientId;
    if (configClientId) {
      let clientConfig = data?.mcpOAuthClientConfig?.[serverKey];
      return logMCPDebug(this.serverName, "Using pre-configured client ID"), {
        client_id: configClientId,
        client_secret: clientConfig?.clientSecret
      };
    }
    logMCPDebug(this.serverName, "No client info found");
    return;
  }
  async saveClientInformation(clientInformation) {
    let storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(this.serverName, this.serverConfig), updatedData = {
      ...existingData,
      mcpOAuth: {
        ...existingData.mcpOAuth,
        [serverKey]: {
          ...existingData.mcpOAuth?.[serverKey],
          serverName: this.serverName,
          serverUrl: this.serverConfig.url,
          clientId: clientInformation.client_id,
          clientSecret: clientInformation.client_secret,
          accessToken: existingData.mcpOAuth?.[serverKey]?.accessToken || "",
          expiresAt: existingData.mcpOAuth?.[serverKey]?.expiresAt || 0
        }
      }
    };
    storage.update(updatedData);
  }
  async tokens() {
    let data = await getSecureStorage().readAsync(), serverKey = getServerKey(this.serverName, this.serverConfig), tokenData = data?.mcpOAuth?.[serverKey];
    if (isXaaEnabled() && this.serverConfig.oauth?.xaa && !tokenData?.refreshToken && (!tokenData?.accessToken || (tokenData.expiresAt - Date.now()) / 1000 <= 300)) {
      if (!this._refreshInProgress)
        logMCPDebug(this.serverName, tokenData ? "XAA: access_token expiring, attempting silent exchange" : "XAA: no access_token yet, attempting silent exchange"), this._refreshInProgress = this.xaaRefresh().finally(() => {
          this._refreshInProgress = void 0;
        });
      try {
        let refreshed = await this._refreshInProgress;
        if (refreshed)
          return refreshed;
      } catch (e) {
        logMCPDebug(this.serverName, `XAA silent exchange failed: ${errorMessage(e)}`);
      }
    }
    if (!tokenData) {
      logMCPDebug(this.serverName, "No token data found");
      return;
    }
    let expiresIn = (tokenData.expiresAt - Date.now()) / 1000, currentScopes = tokenData.scope?.split(" ") ?? [], needsStepUp = this._pendingStepUpScope !== void 0 && this._pendingStepUpScope.split(" ").some((s2) => !currentScopes.includes(s2));
    if (needsStepUp)
      logMCPDebug(this.serverName, `Step-up pending (${this._pendingStepUpScope}), omitting refresh_token`);
    if (expiresIn <= 0 && !tokenData.refreshToken) {
      logMCPDebug(this.serverName, "Token expired without refresh token");
      return;
    }
    if (expiresIn <= 300 && tokenData.refreshToken && !needsStepUp) {
      if (!this._refreshInProgress)
        logMCPDebug(this.serverName, `Token expires in ${Math.floor(expiresIn)}s, attempting proactive refresh`), this._refreshInProgress = this.refreshAuthorization(tokenData.refreshToken).finally(() => {
          this._refreshInProgress = void 0;
        });
      else
        logMCPDebug(this.serverName, "Token refresh already in progress, reusing existing promise");
      try {
        let refreshed = await this._refreshInProgress;
        if (refreshed)
          return logMCPDebug(this.serverName, "Token refreshed successfully"), refreshed;
        logMCPDebug(this.serverName, "Token refresh failed, returning current tokens");
      } catch (error44) {
        logMCPDebug(this.serverName, `Token refresh error: ${errorMessage(error44)}`);
      }
    }
    let tokens = {
      access_token: tokenData.accessToken,
      refresh_token: needsStepUp ? void 0 : tokenData.refreshToken,
      expires_in: expiresIn,
      scope: tokenData.scope,
      token_type: "Bearer"
    };
    return logMCPDebug(this.serverName, "Returning tokens"), logMCPDebug(this.serverName, `Token length: ${tokens.access_token?.length}`), logMCPDebug(this.serverName, `Has refresh token: ${!!tokens.refresh_token}`), logMCPDebug(this.serverName, `Expires in: ${Math.floor(expiresIn)}s`), tokens;
  }
  async saveTokens(tokens) {
    this._pendingStepUpScope = void 0;
    let storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(this.serverName, this.serverConfig);
    logMCPDebug(this.serverName, "Saving tokens"), logMCPDebug(this.serverName, `Token expires in: ${tokens.expires_in}`), logMCPDebug(this.serverName, `Has refresh token: ${!!tokens.refresh_token}`);
    let updatedData = {
      ...existingData,
      mcpOAuth: {
        ...existingData.mcpOAuth,
        [serverKey]: {
          ...existingData.mcpOAuth?.[serverKey],
          serverName: this.serverName,
          serverUrl: this.serverConfig.url,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
          scope: tokens.scope
        }
      }
    };
    storage.update(updatedData);
  }
  async xaaRefresh() {
    let idp = getXaaIdpSettings();
    if (!idp)
      return;
    let idToken = getCachedIdpIdToken(idp.issuer);
    if (!idToken) {
      logMCPDebug(this.serverName, "XAA: id_token not cached, needs interactive re-auth");
      return;
    }
    let clientId = this.serverConfig.oauth?.clientId, clientConfig = getMcpClientConfig(this.serverName, this.serverConfig);
    if (!clientId || !clientConfig?.clientSecret) {
      logMCPDebug(this.serverName, "XAA: missing clientId or clientSecret in config \u2014 skipping silent refresh");
      return;
    }
    let idpClientSecret = getIdpClientSecret(idp.issuer), oidc;
    try {
      oidc = await discoverOidc(idp.issuer);
    } catch (e) {
      logMCPDebug(this.serverName, `XAA: OIDC discovery failed in silent refresh: ${errorMessage(e)}`);
      return;
    }
    try {
      let tokens = await performCrossAppAccess(this.serverConfig.url, {
        clientId,
        clientSecret: clientConfig.clientSecret,
        idpClientId: idp.clientId,
        idpClientSecret,
        idpIdToken: idToken,
        idpTokenEndpoint: oidc.token_endpoint
      }, this.serverName), storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(this.serverName, this.serverConfig), prev = existingData.mcpOAuth?.[serverKey];
      return storage.update({
        ...existingData,
        mcpOAuth: {
          ...existingData.mcpOAuth,
          [serverKey]: {
            ...prev,
            serverName: this.serverName,
            serverUrl: this.serverConfig.url,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token ?? prev?.refreshToken,
            expiresAt: Date.now() + (tokens.expires_in || 3600) * 1000,
            scope: tokens.scope,
            clientId,
            clientSecret: clientConfig.clientSecret,
            discoveryState: {
              authorizationServerUrl: tokens.authorizationServerUrl
            }
          }
        }
      }), {
        access_token: tokens.access_token,
        token_type: "Bearer",
        expires_in: tokens.expires_in,
        scope: tokens.scope,
        refresh_token: tokens.refresh_token
      };
    } catch (e) {
      if (e instanceof XaaTokenExchangeError && e.shouldClearIdToken)
        clearIdpIdToken(idp.issuer), logMCPDebug(this.serverName, "XAA: cleared id_token after exchange failure");
      throw e;
    }
  }
  async redirectToAuthorization(authorizationUrl) {
    this._authorizationUrl = authorizationUrl.toString();
    let scopes = authorizationUrl.searchParams.get("scope");
    if (logMCPDebug(this.serverName, `Authorization URL: ${redactSensitiveUrlParams(authorizationUrl.toString())}`), logMCPDebug(this.serverName, `Scopes in URL: ${scopes || "NOT FOUND"}`), scopes)
      this._scopes = scopes, logMCPDebug(this.serverName, `Captured scopes from authorization URL: ${scopes}`);
    else {
      let metadataScope = getScopeFromMetadata(this._metadata);
      if (metadataScope)
        this._scopes = metadataScope, logMCPDebug(this.serverName, `Using scopes from metadata: ${metadataScope}`);
      else
        logMCPDebug(this.serverName, "No scopes available from URL or metadata");
    }
    if (this._scopes && !this.handleRedirection) {
      let storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(this.serverName, this.serverConfig), existing = existingData.mcpOAuth?.[serverKey];
      if (existing)
        existing.stepUpScope = this._scopes, storage.update(existingData), logMCPDebug(this.serverName, `Persisted step-up scope: ${this._scopes}`);
    }
    if (!this.handleRedirection) {
      logMCPDebug(this.serverName, "Redirection handling is disabled, skipping redirect");
      return;
    }
    let urlString = authorizationUrl.toString();
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://"))
      throw Error("Invalid authorization URL: must use http:// or https:// scheme");
    logMCPDebug(this.serverName, "Redirecting to authorization URL");
    let redactedUrl = redactSensitiveUrlParams(urlString);
    if (logMCPDebug(this.serverName, `Authorization URL: ${redactedUrl}`), this.onAuthorizationUrlCallback)
      this.onAuthorizationUrlCallback(urlString);
    if (!this.skipBrowserOpen) {
      if (logMCPDebug(this.serverName, `Opening authorization URL: ${redactedUrl}`), !await openBrowser(urlString))
        logMCPDebug(this.serverName, "Browser didn't open automatically. URL is shown in UI.");
    } else
      logMCPDebug(this.serverName, `Skipping browser open (skipBrowserOpen=true). URL: ${redactedUrl}`);
  }
  async saveCodeVerifier(codeVerifier) {
    logMCPDebug(this.serverName, "Saving code verifier"), this._codeVerifier = codeVerifier;
  }
  async codeVerifier() {
    if (!this._codeVerifier)
      throw logMCPDebug(this.serverName, "No code verifier saved"), Error("No code verifier saved");
    return logMCPDebug(this.serverName, "Returning code verifier"), this._codeVerifier;
  }
  async invalidateCredentials(scope) {
    let storage = getSecureStorage(), existingData = storage.read();
    if (!existingData?.mcpOAuth)
      return;
    let serverKey = getServerKey(this.serverName, this.serverConfig), tokenData = existingData.mcpOAuth[serverKey];
    if (!tokenData)
      return;
    switch (scope) {
      case "all":
        delete existingData.mcpOAuth[serverKey];
        break;
      case "client":
        tokenData.clientId = void 0, tokenData.clientSecret = void 0;
        break;
      case "tokens":
        tokenData.accessToken = "", tokenData.refreshToken = void 0, tokenData.expiresAt = 0;
        break;
      case "verifier":
        this._codeVerifier = void 0;
        return;
      case "discovery":
        tokenData.discoveryState = void 0, tokenData.stepUpScope = void 0;
        break;
    }
    storage.update(existingData), logMCPDebug(this.serverName, `Invalidated credentials (scope: ${scope})`);
  }
  async saveDiscoveryState(state3) {
    let storage = getSecureStorage(), existingData = storage.read() || {}, serverKey = getServerKey(this.serverName, this.serverConfig);
    logMCPDebug(this.serverName, `Saving discovery state (authServer: ${state3.authorizationServerUrl})`);
    let updatedData = {
      ...existingData,
      mcpOAuth: {
        ...existingData.mcpOAuth,
        [serverKey]: {
          ...existingData.mcpOAuth?.[serverKey],
          serverName: this.serverName,
          serverUrl: this.serverConfig.url,
          accessToken: existingData.mcpOAuth?.[serverKey]?.accessToken || "",
          expiresAt: existingData.mcpOAuth?.[serverKey]?.expiresAt || 0,
          discoveryState: {
            authorizationServerUrl: state3.authorizationServerUrl,
            resourceMetadataUrl: state3.resourceMetadataUrl
          }
        }
      }
    };
    storage.update(updatedData);
  }
  async discoveryState() {
    let data = getSecureStorage().read(), serverKey = getServerKey(this.serverName, this.serverConfig), cached2 = data?.mcpOAuth?.[serverKey]?.discoveryState;
    if (cached2?.authorizationServerUrl)
      return logMCPDebug(this.serverName, `Returning cached discovery state (authServer: ${cached2.authorizationServerUrl})`), {
        authorizationServerUrl: cached2.authorizationServerUrl,
        resourceMetadataUrl: cached2.resourceMetadataUrl,
        resourceMetadata: cached2.resourceMetadata,
        authorizationServerMetadata: cached2.authorizationServerMetadata
      };
    let metadataUrl = this.serverConfig.oauth?.authServerMetadataUrl;
    if (metadataUrl) {
      logMCPDebug(this.serverName, `Fetching metadata from configured URL: ${metadataUrl}`);
      try {
        let metadata = await fetchAuthServerMetadata(this.serverName, this.serverConfig.url, metadataUrl);
        if (metadata)
          return {
            authorizationServerUrl: metadata.issuer,
            authorizationServerMetadata: metadata
          };
      } catch (error44) {
        logMCPDebug(this.serverName, `Failed to fetch from configured metadata URL: ${errorMessage(error44)}`);
      }
    }
    return;
  }
  async refreshAuthorization(refreshToken) {
    let serverKey = getServerKey(this.serverName, this.serverConfig), claudeDir = getClaudeConfigHomeDir();
    await mkdir6(claudeDir, { recursive: !0 });
    let sanitizedKey = serverKey.replace(/[^a-zA-Z0-9]/g, "_"), lockfilePath = join53(claudeDir, `mcp-refresh-${sanitizedKey}.lock`), release;
    for (let retry8 = 0;retry8 < MAX_LOCK_RETRIES; retry8++)
      try {
        logMCPDebug(this.serverName, `Acquiring refresh lock (attempt ${retry8 + 1})`), release = await lock(lockfilePath, {
          realpath: !1,
          onCompromised: () => {
            logMCPDebug(this.serverName, "Refresh lock was compromised");
          }
        }), logMCPDebug(this.serverName, "Acquired refresh lock");
        break;
      } catch (e) {
        let code = getErrnoCode(e);
        if (code === "ELOCKED") {
          logMCPDebug(this.serverName, `Refresh lock held by another process, waiting (attempt ${retry8 + 1}/${MAX_LOCK_RETRIES})`), await sleep3(1000 + Math.random() * 1000);
          continue;
        }
        logMCPDebug(this.serverName, `Failed to acquire refresh lock: ${code}, proceeding without lock`);
        break;
      }
    if (!release)
      logMCPDebug(this.serverName, `Could not acquire refresh lock after ${MAX_LOCK_RETRIES} retries, proceeding without lock`);
    try {
      clearKeychainCache();
      let tokenData = getSecureStorage().read()?.mcpOAuth?.[serverKey];
      if (tokenData) {
        let expiresIn = (tokenData.expiresAt - Date.now()) / 1000;
        if (expiresIn > 300)
          return logMCPDebug(this.serverName, `Another process already refreshed tokens (expires in ${Math.floor(expiresIn)}s)`), {
            access_token: tokenData.accessToken,
            refresh_token: tokenData.refreshToken,
            expires_in: expiresIn,
            scope: tokenData.scope,
            token_type: "Bearer"
          };
        if (tokenData.refreshToken)
          refreshToken = tokenData.refreshToken;
      }
      return await this._doRefresh(refreshToken);
    } finally {
      if (release)
        try {
          await release(), logMCPDebug(this.serverName, "Released refresh lock");
        } catch {
          logMCPDebug(this.serverName, "Failed to release refresh lock");
        }
    }
  }
  async _doRefresh(refreshToken) {
    let mcpServerBaseUrl = getLoggingSafeMcpBaseUrl(this.serverConfig), emitRefreshEvent = (outcome, reason) => {
      logEvent(outcome === "success" ? "tengu_mcp_oauth_refresh_success" : "tengu_mcp_oauth_refresh_failure", {
        transportType: this.serverConfig.type,
        ...mcpServerBaseUrl ? {
          mcpServerBaseUrl
        } : {},
        ...reason ? {
          reason
        } : {}
      });
    };
    for (let attempt = 1;attempt <= 3; attempt++)
      try {
        logMCPDebug(this.serverName, "Starting token refresh");
        let authFetch = createAuthFetch(), metadata = this._metadata;
        if (!metadata) {
          let cached2 = await this.discoveryState();
          if (cached2?.authorizationServerMetadata)
            logMCPDebug(this.serverName, "Using persisted auth server metadata for refresh"), metadata = cached2.authorizationServerMetadata;
          else if (cached2?.authorizationServerUrl)
            logMCPDebug(this.serverName, `Re-discovering metadata from persisted auth server URL: ${cached2.authorizationServerUrl}`), metadata = await discoverAuthorizationServerMetadata(cached2.authorizationServerUrl, { fetchFn: authFetch });
        }
        if (!metadata)
          metadata = await fetchAuthServerMetadata(this.serverName, this.serverConfig.url, this.serverConfig.oauth?.authServerMetadataUrl, authFetch);
        if (!metadata) {
          logMCPDebug(this.serverName, "Failed to discover OAuth metadata"), emitRefreshEvent("failure", "metadata_discovery_failed");
          return;
        }
        this._metadata = metadata;
        let clientInfo = await this.clientInformation();
        if (!clientInfo) {
          logMCPDebug(this.serverName, "No client information available"), emitRefreshEvent("failure", "no_client_info");
          return;
        }
        let newTokens = await refreshAuthorization(new URL(this.serverConfig.url), {
          metadata,
          clientInformation: clientInfo,
          refreshToken,
          resource: new URL(this.serverConfig.url),
          fetchFn: authFetch
        });
        if (newTokens)
          return logMCPDebug(this.serverName, "Token refresh successful"), await this.saveTokens(newTokens), emitRefreshEvent("success"), newTokens;
        logMCPDebug(this.serverName, "Token refresh returned no tokens"), emitRefreshEvent("failure", "no_tokens_returned");
        return;
      } catch (error44) {
        if (error44 instanceof InvalidGrantError) {
          logMCPDebug(this.serverName, `Token refresh failed with invalid_grant: ${error44.message}`), clearKeychainCache();
          let data = getSecureStorage().read(), serverKey = getServerKey(this.serverName, this.serverConfig), tokenData = data?.mcpOAuth?.[serverKey];
          if (tokenData) {
            let expiresIn = (tokenData.expiresAt - Date.now()) / 1000;
            if (expiresIn > 300)
              return logMCPDebug(this.serverName, "Another process refreshed tokens, using those"), {
                access_token: tokenData.accessToken,
                refresh_token: tokenData.refreshToken,
                expires_in: expiresIn,
                scope: tokenData.scope,
                token_type: "Bearer"
              };
          }
          logMCPDebug(this.serverName, "No valid tokens in storage, clearing stored tokens"), await this.invalidateCredentials("tokens"), emitRefreshEvent("failure", "invalid_grant");
          return;
        }
        let isTimeoutError = error44 instanceof Error && /timeout|timed out|etimedout|econnreset/i.test(error44.message), isTransientServerError = error44 instanceof ServerError2 || error44 instanceof TemporarilyUnavailableError || error44 instanceof TooManyRequestsError, isRetryable = isTimeoutError || isTransientServerError;
        if (!isRetryable || attempt >= 3) {
          logMCPDebug(this.serverName, `Token refresh failed: ${errorMessage(error44)}`), emitRefreshEvent("failure", isRetryable ? "transient_retries_exhausted" : "request_failed");
          return;
        }
        let delayMs = 1000 * Math.pow(2, attempt - 1);
        logMCPDebug(this.serverName, `Token refresh failed, retrying in ${delayMs}ms (attempt ${attempt}/3)`), await sleep3(delayMs);
      }
    return;
  }
}
