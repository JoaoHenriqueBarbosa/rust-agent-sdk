// var: init_UsernamePasswordClient
var init_UsernamePasswordClient = __esm(() => {
  init_index_node();
  init_Constants2();
  init_BaseClient();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  UsernamePasswordClient = class UsernamePasswordClient extends BaseClient {
    constructor(configuration) {
      super(configuration);
    }
    async acquireToken(request2) {
      this.logger.info("in acquireToken call in username-password client", request2.correlationId);
      let reqTimestamp = exports_TimeUtils.nowSeconds(), response7 = await this.executeTokenRequest(this.authority, request2), responseHandler = new ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.performanceClient, this.config.serializableCache, this.config.persistencePlugin);
      return responseHandler.validateTokenResponse(response7.body, request2.correlationId), responseHandler.handleServerTokenResponse(response7.body, this.authority, reqTimestamp, request2, ApiId.acquireTokenByUsernamePassword);
    }
    async executeTokenRequest(authority, request2) {
      let queryParametersString = this.createTokenQueryParameters(request2), endpoint7 = UrlString.appendQueryString(authority.tokenEndpoint, queryParametersString), requestBody = await this.createTokenRequestBody(request2), headers = this.createTokenRequestHeaders({
        credential: request2.username,
        type: CcsCredentialType.UPN
      }), thumbprint = {
        clientId: this.config.authOptions.clientId,
        authority: authority.canonicalAuthority,
        scopes: request2.scopes,
        claims: request2.claims,
        authenticationScheme: request2.authenticationScheme,
        resourceRequestMethod: request2.resourceRequestMethod,
        resourceRequestUri: request2.resourceRequestUri,
        shrClaims: request2.shrClaims,
        sshKid: request2.sshKid
      };
      return this.executePostToTokenEndpoint(endpoint7, requestBody, headers, thumbprint, request2.correlationId);
    }
    async createTokenRequestBody(request2) {
      let parameters = /* @__PURE__ */ new Map;
      if (exports_RequestParameterBuilder.addClientId(parameters, this.config.authOptions.clientId), exports_RequestParameterBuilder.addUsername(parameters, request2.username), exports_RequestParameterBuilder.addPassword(parameters, request2.password), exports_RequestParameterBuilder.addScopes(parameters, request2.scopes), exports_RequestParameterBuilder.addResponseType(parameters, exports_Constants.OAuthResponseType.IDTOKEN_TOKEN), exports_RequestParameterBuilder.addGrantType(parameters, exports_Constants.GrantType.RESOURCE_OWNER_PASSWORD_GRANT), exports_RequestParameterBuilder.addClientInfo(parameters), exports_RequestParameterBuilder.addLibraryInfo(parameters, this.config.libraryInfo), exports_RequestParameterBuilder.addApplicationTelemetry(parameters, this.config.telemetry.application), exports_RequestParameterBuilder.addThrottling(parameters), this.serverTelemetryManager)
        exports_RequestParameterBuilder.addServerTelemetry(parameters, this.serverTelemetryManager);
      let correlationId = request2.correlationId || this.config.cryptoInterface.createNewGuid();
      if (exports_RequestParameterBuilder.addCorrelationId(parameters, correlationId), this.config.clientCredentials.clientSecret)
        exports_RequestParameterBuilder.addClientSecret(parameters, this.config.clientCredentials.clientSecret);
      let clientAssertion = this.config.clientCredentials.clientAssertion;
      if (clientAssertion)
        exports_RequestParameterBuilder.addClientAssertion(parameters, await getClientAssertion(clientAssertion.assertion, this.config.authOptions.clientId, request2.resourceRequestUri)), exports_RequestParameterBuilder.addClientAssertionType(parameters, clientAssertion.assertionType);
      if (!StringUtils.isEmptyObj(request2.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0)
        exports_RequestParameterBuilder.addClaims(parameters, request2.claims, this.config.authOptions.clientCapabilities);
      if (this.config.systemOptions.preventCorsPreflight && request2.username)
        exports_RequestParameterBuilder.addCcsUpn(parameters, request2.username);
      return exports_UrlUtils.mapToQueryString(parameters);
    }
  };
});
