// var: init_ClientCredentialClient
var init_ClientCredentialClient = __esm(() => {
  init_index_node();
  init_Constants2();
  init_BaseClient();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  ClientCredentialClient = class ClientCredentialClient extends BaseClient {
    constructor(configuration, appTokenProvider) {
      super(configuration);
      this.appTokenProvider = appTokenProvider;
    }
    async acquireToken(request2) {
      if (request2.skipCache || request2.claims)
        return this.executeTokenRequest(request2, this.authority);
      let [cachedAuthenticationResult, lastCacheOutcome] = await this.getCachedAuthenticationResult(request2, this.config, this.cryptoUtils, this.authority, this.cacheManager, this.serverTelemetryManager);
      if (cachedAuthenticationResult) {
        if (lastCacheOutcome === exports_Constants.CacheOutcome.PROACTIVELY_REFRESHED) {
          this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.", request2.correlationId);
          let refreshAccessToken = !0;
          await this.executeTokenRequest(request2, this.authority, refreshAccessToken);
        }
        return cachedAuthenticationResult;
      } else
        return this.executeTokenRequest(request2, this.authority);
    }
    async getCachedAuthenticationResult(request2, config8, cryptoUtils, authority, cacheManager, serverTelemetryManager) {
      let clientConfiguration = config8, managedIdentityConfiguration = config8, lastCacheOutcome = exports_Constants.CacheOutcome.NOT_APPLICABLE, cacheContext;
      if (clientConfiguration.serializableCache && clientConfiguration.persistencePlugin)
        cacheContext = new TokenCacheContext(clientConfiguration.serializableCache, !1), await clientConfiguration.persistencePlugin.beforeCacheAccess(cacheContext);
      let cachedAccessToken = this.readAccessTokenFromCache(authority, managedIdentityConfiguration.managedIdentityId?.id || clientConfiguration.authOptions.clientId, new ScopeSet(request2.scopes || []), cacheManager, request2.correlationId);
      if (clientConfiguration.serializableCache && clientConfiguration.persistencePlugin && cacheContext)
        await clientConfiguration.persistencePlugin.afterCacheAccess(cacheContext);
      if (!cachedAccessToken)
        return serverTelemetryManager?.setCacheOutcome(exports_Constants.CacheOutcome.NO_CACHED_ACCESS_TOKEN), [null, exports_Constants.CacheOutcome.NO_CACHED_ACCESS_TOKEN];
      if (exports_TimeUtils.isTokenExpired(cachedAccessToken.expiresOn, clientConfiguration.systemOptions?.tokenRenewalOffsetSeconds || exports_Constants.DEFAULT_TOKEN_RENEWAL_OFFSET_SEC))
        return serverTelemetryManager?.setCacheOutcome(exports_Constants.CacheOutcome.CACHED_ACCESS_TOKEN_EXPIRED), [null, exports_Constants.CacheOutcome.CACHED_ACCESS_TOKEN_EXPIRED];
      if (cachedAccessToken.refreshOn && exports_TimeUtils.isTokenExpired(cachedAccessToken.refreshOn.toString(), 0))
        lastCacheOutcome = exports_Constants.CacheOutcome.PROACTIVELY_REFRESHED, serverTelemetryManager?.setCacheOutcome(exports_Constants.CacheOutcome.PROACTIVELY_REFRESHED);
      return [
        await ResponseHandler.generateAuthenticationResult(cryptoUtils, authority, {
          account: null,
          idToken: null,
          accessToken: cachedAccessToken,
          refreshToken: null,
          appMetadata: null
        }, !0, request2, this.performanceClient),
        lastCacheOutcome
      ];
    }
    readAccessTokenFromCache(authority, id, scopeSet, cacheManager, correlationId) {
      let accessTokenFilter = {
        homeAccountId: "",
        environment: authority.canonicalAuthorityUrlComponents.HostNameAndPort,
        credentialType: exports_Constants.CredentialType.ACCESS_TOKEN,
        clientId: id,
        realm: authority.tenant,
        target: ScopeSet.createSearchScopes(scopeSet.asArray())
      }, accessTokens = cacheManager.getAccessTokensByFilter(accessTokenFilter, correlationId);
      if (accessTokens.length < 1)
        return null;
      else if (accessTokens.length > 1)
        throw createClientAuthError(exports_ClientAuthErrorCodes.multipleMatchingTokens);
      return accessTokens[0];
    }
    async executeTokenRequest(request2, authority, refreshAccessToken) {
      let serverTokenResponse, reqTimestamp;
      if (this.appTokenProvider) {
        this.logger.info("Using appTokenProvider extensibility.", request2.correlationId);
        let appTokenPropviderParameters = {
          correlationId: request2.correlationId,
          tenantId: this.config.authOptions.authority.tenant,
          scopes: request2.scopes,
          claims: request2.claims
        };
        reqTimestamp = exports_TimeUtils.nowSeconds();
        let appTokenProviderResult = await this.appTokenProvider(appTokenPropviderParameters);
        serverTokenResponse = {
          access_token: appTokenProviderResult.accessToken,
          expires_in: appTokenProviderResult.expiresInSeconds,
          refresh_in: appTokenProviderResult.refreshInSeconds,
          token_type: exports_Constants.AuthenticationScheme.BEARER
        };
      } else {
        let queryParametersString = this.createTokenQueryParameters(request2), endpoint7 = UrlString.appendQueryString(authority.tokenEndpoint, queryParametersString), requestBody = await this.createTokenRequestBody(request2), headers = this.createTokenRequestHeaders(), thumbprint = {
          clientId: this.config.authOptions.clientId,
          authority: request2.authority,
          scopes: request2.scopes,
          claims: request2.claims,
          authenticationScheme: request2.authenticationScheme,
          resourceRequestMethod: request2.resourceRequestMethod,
          resourceRequestUri: request2.resourceRequestUri,
          shrClaims: request2.shrClaims,
          sshKid: request2.sshKid
        };
        this.logger.info("Sending token request to endpoint: " + authority.tokenEndpoint, request2.correlationId), reqTimestamp = exports_TimeUtils.nowSeconds();
        let response7 = await this.executePostToTokenEndpoint(endpoint7, requestBody, headers, thumbprint, request2.correlationId);
        serverTokenResponse = response7.body, serverTokenResponse.status = response7.status;
      }
      let responseHandler = new ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.performanceClient, this.config.serializableCache, this.config.persistencePlugin);
      return responseHandler.validateTokenResponse(serverTokenResponse, request2.correlationId, refreshAccessToken), await responseHandler.handleServerTokenResponse(serverTokenResponse, this.authority, reqTimestamp, request2, ApiId.acquireTokenByClientCredential);
    }
    async createTokenRequestBody(request2) {
      let parameters = /* @__PURE__ */ new Map;
      if (exports_RequestParameterBuilder.addClientId(parameters, this.config.authOptions.clientId), exports_RequestParameterBuilder.addScopes(parameters, request2.scopes, !1), exports_RequestParameterBuilder.addGrantType(parameters, exports_Constants.GrantType.CLIENT_CREDENTIALS_GRANT), exports_RequestParameterBuilder.addLibraryInfo(parameters, this.config.libraryInfo), exports_RequestParameterBuilder.addApplicationTelemetry(parameters, this.config.telemetry.application), exports_RequestParameterBuilder.addThrottling(parameters), this.serverTelemetryManager)
        exports_RequestParameterBuilder.addServerTelemetry(parameters, this.serverTelemetryManager);
      let correlationId = request2.correlationId || this.config.cryptoInterface.createNewGuid();
      if (exports_RequestParameterBuilder.addCorrelationId(parameters, correlationId), this.config.clientCredentials.clientSecret)
        exports_RequestParameterBuilder.addClientSecret(parameters, this.config.clientCredentials.clientSecret);
      let clientAssertion = request2.clientAssertion || this.config.clientCredentials.clientAssertion;
      if (clientAssertion)
        exports_RequestParameterBuilder.addClientAssertion(parameters, await getClientAssertion(clientAssertion.assertion, this.config.authOptions.clientId, request2.resourceRequestUri)), exports_RequestParameterBuilder.addClientAssertionType(parameters, clientAssertion.assertionType);
      if (!StringUtils.isEmptyObj(request2.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0)
        exports_RequestParameterBuilder.addClaims(parameters, request2.claims, this.config.authOptions.clientCapabilities);
      return exports_UrlUtils.mapToQueryString(parameters);
    }
  };
});
