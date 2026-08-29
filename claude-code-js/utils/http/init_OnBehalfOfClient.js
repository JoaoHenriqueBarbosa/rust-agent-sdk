// var: init_OnBehalfOfClient
var init_OnBehalfOfClient = __esm(() => {
  init_index_node();
  init_Constants2();
  init_EncodingUtils();
  init_BaseClient();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  OnBehalfOfClient = class OnBehalfOfClient extends BaseClient {
    constructor(configuration) {
      super(configuration);
    }
    async acquireToken(request2) {
      if (this.scopeSet = new ScopeSet(request2.scopes || []), this.userAssertionHash = await this.cryptoUtils.hashString(request2.oboAssertion), request2.skipCache || request2.claims)
        return this.executeTokenRequest(request2, this.authority, this.userAssertionHash);
      try {
        return await this.getCachedAuthenticationResult(request2);
      } catch (e) {
        return await this.executeTokenRequest(request2, this.authority, this.userAssertionHash);
      }
    }
    async getCachedAuthenticationResult(request2) {
      let cachedAccessToken = this.readAccessTokenFromCacheForOBO(this.config.authOptions.clientId, request2);
      if (!cachedAccessToken)
        throw this.serverTelemetryManager?.setCacheOutcome(exports_Constants.CacheOutcome.NO_CACHED_ACCESS_TOKEN), this.logger.info("SilentFlowClient:acquireCachedToken - No access token found in cache for the given properties.", request2.correlationId), createClientAuthError(exports_ClientAuthErrorCodes.tokenRefreshRequired);
      else if (exports_TimeUtils.isTokenExpired(cachedAccessToken.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds))
        throw this.serverTelemetryManager?.setCacheOutcome(exports_Constants.CacheOutcome.CACHED_ACCESS_TOKEN_EXPIRED), this.logger.info(`OnbehalfofFlow:getCachedAuthenticationResult - Cached access token is expired or will expire within ${this.config.systemOptions.tokenRenewalOffsetSeconds} seconds.`, request2.correlationId), createClientAuthError(exports_ClientAuthErrorCodes.tokenRefreshRequired);
      let cachedIdToken = this.readIdTokenFromCacheForOBO(cachedAccessToken.homeAccountId, request2.correlationId), idTokenClaims, cachedAccount = null;
      if (cachedIdToken) {
        idTokenClaims = exports_AuthToken.extractTokenClaims(cachedIdToken.secret, EncodingUtils.base64Decode);
        let localAccountId = idTokenClaims.oid || idTokenClaims.sub, accountInfo = {
          homeAccountId: cachedIdToken.homeAccountId,
          environment: cachedIdToken.environment,
          tenantId: cachedIdToken.realm,
          username: "",
          localAccountId: localAccountId || ""
        };
        cachedAccount = this.cacheManager.getAccount(this.cacheManager.generateAccountKey(accountInfo), request2.correlationId);
      }
      if (this.config.serverTelemetryManager)
        this.config.serverTelemetryManager.incrementCacheHits();
      return ResponseHandler.generateAuthenticationResult(this.cryptoUtils, this.authority, {
        account: cachedAccount,
        accessToken: cachedAccessToken,
        idToken: cachedIdToken,
        refreshToken: null,
        appMetadata: null
      }, !0, request2, this.performanceClient, idTokenClaims);
    }
    readIdTokenFromCacheForOBO(atHomeAccountId, correlationId) {
      let idTokenFilter = {
        homeAccountId: atHomeAccountId,
        environment: this.authority.canonicalAuthorityUrlComponents.HostNameAndPort,
        credentialType: exports_Constants.CredentialType.ID_TOKEN,
        clientId: this.config.authOptions.clientId,
        realm: this.authority.tenant
      }, idTokenMap = this.cacheManager.getIdTokensByFilter(idTokenFilter, correlationId);
      if (Object.values(idTokenMap).length < 1)
        return null;
      return Object.values(idTokenMap)[0];
    }
    readAccessTokenFromCacheForOBO(clientId, request2) {
      let authScheme = request2.authenticationScheme || exports_Constants.AuthenticationScheme.BEARER, accessTokenFilter = {
        credentialType: authScheme && authScheme.toLowerCase() !== exports_Constants.AuthenticationScheme.BEARER.toLowerCase() ? exports_Constants.CredentialType.ACCESS_TOKEN_WITH_AUTH_SCHEME : exports_Constants.CredentialType.ACCESS_TOKEN,
        clientId,
        target: ScopeSet.createSearchScopes(this.scopeSet.asArray()),
        tokenType: authScheme,
        keyId: request2.sshKid,
        userAssertionHash: this.userAssertionHash
      }, accessTokens = this.cacheManager.getAccessTokensByFilter(accessTokenFilter, request2.correlationId), numAccessTokens = accessTokens.length;
      if (numAccessTokens < 1)
        return null;
      else if (numAccessTokens > 1)
        throw createClientAuthError(exports_ClientAuthErrorCodes.multipleMatchingTokens);
      return accessTokens[0];
    }
    async executeTokenRequest(request2, authority, userAssertionHash) {
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
      }, reqTimestamp = exports_TimeUtils.nowSeconds(), response7 = await this.executePostToTokenEndpoint(endpoint7, requestBody, headers, thumbprint, request2.correlationId), responseHandler = new ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.performanceClient, this.config.serializableCache, this.config.persistencePlugin);
      return responseHandler.validateTokenResponse(response7.body, request2.correlationId), await responseHandler.handleServerTokenResponse(response7.body, this.authority, reqTimestamp, request2, ApiId.acquireTokenByOBO, void 0, userAssertionHash);
    }
    async createTokenRequestBody(request2) {
      let parameters = /* @__PURE__ */ new Map;
      if (exports_RequestParameterBuilder.addClientId(parameters, this.config.authOptions.clientId), exports_RequestParameterBuilder.addScopes(parameters, request2.scopes), exports_RequestParameterBuilder.addGrantType(parameters, exports_Constants.GrantType.JWT_BEARER), exports_RequestParameterBuilder.addClientInfo(parameters), exports_RequestParameterBuilder.addLibraryInfo(parameters, this.config.libraryInfo), exports_RequestParameterBuilder.addApplicationTelemetry(parameters, this.config.telemetry.application), exports_RequestParameterBuilder.addThrottling(parameters), this.serverTelemetryManager)
        exports_RequestParameterBuilder.addServerTelemetry(parameters, this.serverTelemetryManager);
      let correlationId = request2.correlationId || this.config.cryptoInterface.createNewGuid();
      if (exports_RequestParameterBuilder.addCorrelationId(parameters, correlationId), exports_RequestParameterBuilder.addRequestTokenUse(parameters, exports_AADServerParamKeys.ON_BEHALF_OF), exports_RequestParameterBuilder.addOboAssertion(parameters, request2.oboAssertion), this.config.clientCredentials.clientSecret)
        exports_RequestParameterBuilder.addClientSecret(parameters, this.config.clientCredentials.clientSecret);
      let clientAssertion = this.config.clientCredentials.clientAssertion;
      if (clientAssertion)
        exports_RequestParameterBuilder.addClientAssertion(parameters, await getClientAssertion(clientAssertion.assertion, this.config.authOptions.clientId, request2.resourceRequestUri)), exports_RequestParameterBuilder.addClientAssertionType(parameters, clientAssertion.assertionType);
      if (request2.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0)
        exports_RequestParameterBuilder.addClaims(parameters, request2.claims, this.config.authOptions.clientCapabilities);
      return exports_UrlUtils.mapToQueryString(parameters);
    }
  };
});
