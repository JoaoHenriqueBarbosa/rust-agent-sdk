// class: AuthorizationCodeClient
class AuthorizationCodeClient {
  constructor(configuration, performanceClient) {
    this.includeRedirectUri = !0, this.config = buildClientConfiguration(configuration), this.logger = new Logger(this.config.loggerOptions, name, version2), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = performanceClient, this.oidcDefaultScopes = this.config.authOptions.authority.options.OIDCOptions?.defaultScopes;
  }
  async acquireToken(request2, apiId, authCodePayload) {
    if (!request2.code)
      throw createClientAuthError(requestCannotBeMade);
    if (authCodePayload && authCodePayload.cloud_instance_host_name)
      await invokeAsync(this.updateTokenEndpointAuthority.bind(this), UpdateTokenEndpointAuthority, this.logger, this.performanceClient, request2.correlationId)(authCodePayload.cloud_instance_host_name, request2.correlationId);
    let reqTimestamp = nowSeconds(), response7 = await invokeAsync(this.executeTokenRequest.bind(this), AuthClientExecuteTokenRequest, this.logger, this.performanceClient, request2.correlationId)(this.authority, request2, this.serverTelemetryManager), requestId = response7.headers?.[HeaderNames.X_MS_REQUEST_ID], responseHandler = new ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.performanceClient, this.config.serializableCache, this.config.persistencePlugin);
    return responseHandler.validateTokenResponse(response7.body, request2.correlationId), invokeAsync(responseHandler.handleServerTokenResponse.bind(responseHandler), HandleServerTokenResponse, this.logger, this.performanceClient, request2.correlationId)(response7.body, this.authority, reqTimestamp, request2, apiId, authCodePayload, void 0, void 0, void 0, requestId);
  }
  getLogoutUri(logoutRequest) {
    if (!logoutRequest)
      throw createClientConfigurationError(logoutRequestEmpty);
    let queryString = this.createLogoutUrlQueryString(logoutRequest);
    return UrlString.appendQueryString(this.authority.endSessionEndpoint, queryString);
  }
  async executeTokenRequest(authority, request2, serverTelemetryManager) {
    let queryParametersString = createTokenQueryParameters(request2, this.config.authOptions.clientId, this.config.authOptions.redirectUri, this.performanceClient), endpoint7 = UrlString.appendQueryString(authority.tokenEndpoint, queryParametersString), requestBody = await invokeAsync(this.createTokenRequestBody.bind(this), AuthClientCreateTokenRequestBody, this.logger, this.performanceClient, request2.correlationId)(request2), ccsCredential = void 0;
    if (request2.clientInfo)
      try {
        let clientInfo = buildClientInfo(request2.clientInfo, this.cryptoUtils.base64Decode);
        ccsCredential = {
          credential: `${clientInfo.uid}${CLIENT_INFO_SEPARATOR}${clientInfo.utid}`,
          type: CcsCredentialType.HOME_ACCOUNT_ID
        };
      } catch (e) {
        this.logger.verbose(`Could not parse client info for CCS Header: '${e}'`, request2.correlationId);
      }
    let headers = createTokenRequestHeaders(this.logger, this.config.systemOptions.preventCorsPreflight, ccsCredential || request2.ccsCredential), thumbprint = getRequestThumbprint(this.config.authOptions.clientId, request2);
    return invokeAsync(executePostToTokenEndpoint, AuthorizationCodeClientExecutePostToTokenEndpoint, this.logger, this.performanceClient, request2.correlationId)(endpoint7, requestBody, headers, thumbprint, request2.correlationId, this.cacheManager, this.networkClient, this.logger, this.performanceClient, serverTelemetryManager);
  }
  async createTokenRequestBody(request2) {
    let parameters = /* @__PURE__ */ new Map;
    if (addClientId(parameters, request2.embeddedClientId || request2.extraParameters?.[CLIENT_ID] || this.config.authOptions.clientId), !this.includeRedirectUri) {
      if (!request2.redirectUri)
        throw createClientConfigurationError(redirectUriEmpty);
    } else
      addRedirectUri(parameters, request2.redirectUri);
    if (addScopes(parameters, request2.scopes, !0, this.oidcDefaultScopes), addResource(parameters, request2.resource), addAuthorizationCode(parameters, request2.code), addLibraryInfo(parameters, this.config.libraryInfo), addApplicationTelemetry(parameters, this.config.telemetry.application), addThrottling(parameters), this.serverTelemetryManager && !isOidcProtocolMode(this.config))
      addServerTelemetry(parameters, this.serverTelemetryManager);
    if (request2.codeVerifier)
      addCodeVerifier(parameters, request2.codeVerifier);
    if (this.config.clientCredentials.clientSecret)
      addClientSecret(parameters, this.config.clientCredentials.clientSecret);
    if (this.config.clientCredentials.clientAssertion) {
      let clientAssertion = this.config.clientCredentials.clientAssertion;
      addClientAssertion(parameters, await getClientAssertion(clientAssertion.assertion, this.config.authOptions.clientId, request2.resourceRequestUri)), addClientAssertionType(parameters, clientAssertion.assertionType);
    }
    if (addGrantType(parameters, GrantType.AUTHORIZATION_CODE_GRANT), addClientInfo(parameters), request2.authenticationScheme === AuthenticationScheme.POP) {
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
    let ccsCred = void 0;
    if (request2.clientInfo)
      try {
        let clientInfo = buildClientInfo(request2.clientInfo, this.cryptoUtils.base64Decode);
        ccsCred = {
          credential: `${clientInfo.uid}${CLIENT_INFO_SEPARATOR}${clientInfo.utid}`,
          type: CcsCredentialType.HOME_ACCOUNT_ID
        };
      } catch (e) {
        this.logger.verbose(`Could not parse client info for CCS Header: '${e}'`, request2.correlationId);
      }
    else
      ccsCred = request2.ccsCredential;
    if (this.config.systemOptions.preventCorsPreflight && ccsCred)
      switch (ccsCred.type) {
        case CcsCredentialType.HOME_ACCOUNT_ID:
          try {
            let clientInfo = buildClientInfoFromHomeAccountId(ccsCred.credential);
            addCcsOid(parameters, clientInfo);
          } catch (e) {
            this.logger.verbose(`Could not parse home account ID for CCS Header: '${e}'`, request2.correlationId);
          }
          break;
        case CcsCredentialType.UPN:
          addCcsUpn(parameters, ccsCred.credential);
          break;
      }
    if (request2.embeddedClientId)
      addBrokerParameters(parameters, this.config.authOptions.clientId, this.config.authOptions.redirectUri);
    if (request2.extraParameters)
      addExtraParameters(parameters, request2.extraParameters);
    if (request2.enableSpaAuthorizationCode && (!request2.extraParameters || !request2.extraParameters[RETURN_SPA_CODE]))
      addExtraParameters(parameters, {
        [RETURN_SPA_CODE]: "1"
      });
    return instrumentBrokerParams(parameters, request2.correlationId, this.performanceClient), mapToQueryString(parameters);
  }
  createLogoutUrlQueryString(request2) {
    let parameters = /* @__PURE__ */ new Map;
    if (request2.postLogoutRedirectUri)
      addPostLogoutRedirectUri(parameters, request2.postLogoutRedirectUri);
    if (request2.correlationId)
      addCorrelationId(parameters, request2.correlationId);
    if (request2.idTokenHint)
      addIdTokenHint(parameters, request2.idTokenHint);
    if (request2.state)
      addState(parameters, request2.state);
    if (request2.logoutHint)
      addLogoutHint(parameters, request2.logoutHint);
    if (request2.extraQueryParameters)
      addExtraParameters(parameters, request2.extraQueryParameters);
    if (this.config.authOptions.instanceAware)
      addInstanceAware(parameters);
    return mapToQueryString(parameters);
  }
  async updateTokenEndpointAuthority(cloudInstanceHostName, correlationId) {
    let cloudInstanceAuthorityUri = `https://${cloudInstanceHostName}/${this.authority.tenant}/`, cloudInstanceAuthority = await createDiscoveredInstance(cloudInstanceAuthorityUri, this.networkClient, this.cacheManager, this.authority.options, this.logger, correlationId, this.performanceClient);
    this.authority = cloudInstanceAuthority;
  }
}
