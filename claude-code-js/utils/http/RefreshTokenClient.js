// class: RefreshTokenClient
class RefreshTokenClient {
  constructor(configuration, performanceClient) {
    this.config = buildClientConfiguration(configuration), this.logger = new Logger(this.config.loggerOptions, name, version2), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = performanceClient;
  }
  async acquireToken(request2, apiId) {
    let reqTimestamp = nowSeconds(), response7 = await invokeAsync(this.executeTokenRequest.bind(this), RefreshTokenClientExecuteTokenRequest, this.logger, this.performanceClient, request2.correlationId)(request2, this.authority), requestId = response7.headers?.[HeaderNames.X_MS_REQUEST_ID], responseHandler = new ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.performanceClient, this.config.serializableCache, this.config.persistencePlugin);
    return responseHandler.validateTokenResponse(response7.body, request2.correlationId), invokeAsync(responseHandler.handleServerTokenResponse.bind(responseHandler), HandleServerTokenResponse, this.logger, this.performanceClient, request2.correlationId)(response7.body, this.authority, reqTimestamp, request2, apiId, void 0, void 0, !0, request2.forceCache, requestId);
  }
  async acquireTokenByRefreshToken(request2, apiId) {
    if (!request2)
      throw createClientConfigurationError(tokenRequestEmpty);
    if (!request2.account)
      throw createClientAuthError(noAccountInSilentRequest);
    if (this.cacheManager.isAppMetadataFOCI(request2.account.environment, request2.correlationId))
      try {
        return await invokeAsync(this.acquireTokenWithCachedRefreshToken.bind(this), RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, request2.correlationId)(request2, !0, apiId);
      } catch (e) {
        let noFamilyRTInCache = e instanceof InteractionRequiredAuthError && e.errorCode === noTokensFound, clientMismatchErrorWithFamilyRT = e instanceof ServerError && e.errorCode === INVALID_GRANT_ERROR && e.subError === CLIENT_MISMATCH_ERROR;
        if (noFamilyRTInCache || clientMismatchErrorWithFamilyRT)
          return invokeAsync(this.acquireTokenWithCachedRefreshToken.bind(this), RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, request2.correlationId)(request2, !1, apiId);
        else
          throw e;
      }
    return invokeAsync(this.acquireTokenWithCachedRefreshToken.bind(this), RefreshTokenClientAcquireTokenWithCachedRefreshToken, this.logger, this.performanceClient, request2.correlationId)(request2, !1, apiId);
  }
  async acquireTokenWithCachedRefreshToken(request2, foci, apiId) {
    let refreshToken = invoke(this.cacheManager.getRefreshToken.bind(this.cacheManager), CacheManagerGetRefreshToken, this.logger, this.performanceClient, request2.correlationId)(request2.account, foci, request2.correlationId, void 0);
    if (!refreshToken)
      throw createInteractionRequiredAuthError(noTokensFound);
    if (refreshToken.expiresOn) {
      let offset = request2.refreshTokenExpirationOffsetSeconds || DEFAULT_REFRESH_TOKEN_EXPIRATION_OFFSET_SECONDS;
      if (this.performanceClient?.addFields({
        cacheRtExpiresOnSeconds: Number(refreshToken.expiresOn),
        rtOffsetSeconds: offset
      }, request2.correlationId), isTokenExpired(refreshToken.expiresOn, offset))
        throw createInteractionRequiredAuthError(refreshTokenExpired);
    }
    let refreshTokenRequest = {
      ...request2,
      refreshToken: refreshToken.secret,
      authenticationScheme: request2.authenticationScheme || AuthenticationScheme.BEARER,
      ccsCredential: {
        credential: request2.account.homeAccountId,
        type: CcsCredentialType.HOME_ACCOUNT_ID
      }
    };
    try {
      return await invokeAsync(this.acquireToken.bind(this), RefreshTokenClientAcquireToken, this.logger, this.performanceClient, request2.correlationId)(refreshTokenRequest, apiId);
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        if (e.subError === badToken) {
          this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache", request2.correlationId);
          let badRefreshTokenKey = this.cacheManager.generateCredentialKey(refreshToken);
          this.cacheManager.removeRefreshToken(badRefreshTokenKey, request2.correlationId);
        }
      }
      throw e;
    }
  }
  async executeTokenRequest(request2, authority) {
    let queryParametersString = createTokenQueryParameters(request2, this.config.authOptions.clientId, this.config.authOptions.redirectUri, this.performanceClient), endpoint7 = UrlString.appendQueryString(authority.tokenEndpoint, queryParametersString), requestBody = await invokeAsync(this.createTokenRequestBody.bind(this), RefreshTokenClientCreateTokenRequestBody, this.logger, this.performanceClient, request2.correlationId)(request2), headers = createTokenRequestHeaders(this.logger, this.config.systemOptions.preventCorsPreflight, request2.ccsCredential), thumbprint = getRequestThumbprint(this.config.authOptions.clientId, request2);
    return invokeAsync(executePostToTokenEndpoint, RefreshTokenClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, request2.correlationId)(endpoint7, requestBody, headers, thumbprint, request2.correlationId, this.cacheManager, this.networkClient, this.logger, this.performanceClient, this.serverTelemetryManager);
  }
  async createTokenRequestBody(request2) {
    let parameters = /* @__PURE__ */ new Map;
    if (addClientId(parameters, request2.embeddedClientId || request2.extraParameters?.[CLIENT_ID] || this.config.authOptions.clientId), request2.redirectUri)
      addRedirectUri(parameters, request2.redirectUri);
    if (addScopes(parameters, request2.scopes, !0, this.config.authOptions.authority.options.OIDCOptions?.defaultScopes), addGrantType(parameters, GrantType.REFRESH_TOKEN_GRANT), addClientInfo(parameters), addLibraryInfo(parameters, this.config.libraryInfo), addApplicationTelemetry(parameters, this.config.telemetry.application), addThrottling(parameters), this.serverTelemetryManager && !isOidcProtocolMode(this.config))
      addServerTelemetry(parameters, this.serverTelemetryManager);
    if (addRefreshToken(parameters, request2.refreshToken), this.config.clientCredentials.clientSecret)
      addClientSecret(parameters, this.config.clientCredentials.clientSecret);
    if (this.config.clientCredentials.clientAssertion) {
      let clientAssertion = this.config.clientCredentials.clientAssertion;
      addClientAssertion(parameters, await getClientAssertion(clientAssertion.assertion, this.config.authOptions.clientId, request2.resourceRequestUri)), addClientAssertionType(parameters, clientAssertion.assertionType);
    }
    if (request2.authenticationScheme === AuthenticationScheme.POP) {
      let popTokenGenerator = new PopTokenGenerator(this.cryptoUtils, this.performanceClient), reqCnfData;
      if (!request2.popKid)
        reqCnfData = (await invokeAsync(popTokenGenerator.generateCnf.bind(popTokenGenerator), PopTokenGenerateCnf, this.logger, this.performanceClient, request2.correlationId)(request2, this.logger)).reqCnfString;
      else
        reqCnfData = this.cryptoUtils.encodeKid(request2.popKid);
      addPopToken(parameters, reqCnfData);
    } else if (request2.authenticationScheme === AuthenticationScheme.SSH)
      if (request2.sshJwk)
        addSshJwk(parameters, request2.sshJwk);
      else
        throw createClientConfigurationError(missingSshJwk);
    if (!StringUtils.isEmptyObj(request2.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0)
      addClaims(parameters, request2.claims, this.config.authOptions.clientCapabilities);
    if (this.config.systemOptions.preventCorsPreflight && request2.ccsCredential)
      switch (request2.ccsCredential.type) {
        case CcsCredentialType.HOME_ACCOUNT_ID:
          try {
            let clientInfo = buildClientInfoFromHomeAccountId(request2.ccsCredential.credential);
            addCcsOid(parameters, clientInfo);
          } catch (e) {
            this.logger.verbose(`Could not parse home account ID for CCS Header: '${e}'`, request2.correlationId);
          }
          break;
        case CcsCredentialType.UPN:
          addCcsUpn(parameters, request2.ccsCredential.credential);
          break;
      }
    if (request2.embeddedClientId)
      addBrokerParameters(parameters, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
    if (request2.extraParameters)
      addExtraParameters(parameters, {
        ...request2.extraParameters
      });
    return instrumentBrokerParams(parameters, request2.correlationId, this.performanceClient), mapToQueryString(parameters);
  }
}
