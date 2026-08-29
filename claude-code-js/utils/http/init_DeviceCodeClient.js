// var: init_DeviceCodeClient
var init_DeviceCodeClient = __esm(() => {
  init_index_node();
  init_Constants2();
  init_ClientAuthErrorCodes2();
  init_BaseClient();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  DeviceCodeClient = class DeviceCodeClient extends BaseClient {
    constructor(configuration) {
      super(configuration);
    }
    async acquireToken(request2) {
      let deviceCodeResponse = await this.getDeviceCode(request2);
      request2.deviceCodeCallback(deviceCodeResponse);
      let reqTimestamp = exports_TimeUtils.nowSeconds(), response7 = await this.acquireTokenWithDeviceCode(request2, deviceCodeResponse), responseHandler = new ResponseHandler(this.config.authOptions.clientId, this.cacheManager, this.cryptoUtils, this.logger, this.performanceClient, this.config.serializableCache, this.config.persistencePlugin);
      return responseHandler.validateTokenResponse(response7, request2.correlationId), responseHandler.handleServerTokenResponse(response7, this.authority, reqTimestamp, request2, ApiId.acquireTokenByDeviceCode);
    }
    async getDeviceCode(request2) {
      let queryParametersString = this.createExtraQueryParameters(request2), endpoint7 = UrlString.appendQueryString(this.authority.deviceCodeEndpoint, queryParametersString), queryString = this.createQueryString(request2), headers = this.createTokenRequestHeaders(), thumbprint = {
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
      return this.executePostRequestToDeviceCodeEndpoint(endpoint7, queryString, headers, thumbprint, request2.correlationId);
    }
    createExtraQueryParameters(request2) {
      let parameters = /* @__PURE__ */ new Map;
      if (request2.extraQueryParameters)
        exports_RequestParameterBuilder.addExtraParameters(parameters, request2.extraQueryParameters);
      return exports_UrlUtils.mapToQueryString(parameters);
    }
    async executePostRequestToDeviceCodeEndpoint(deviceCodeEndpoint, queryString, headers, thumbprint, correlationId) {
      let { body: { user_code: userCode, device_code: deviceCode, verification_uri: verificationUri, expires_in: expiresIn, interval, message } } = await this.sendPostRequest(thumbprint, deviceCodeEndpoint, {
        body: queryString,
        headers
      }, correlationId);
      return {
        userCode,
        deviceCode,
        verificationUri,
        expiresIn,
        interval,
        message
      };
    }
    createQueryString(request2) {
      let parameters = /* @__PURE__ */ new Map;
      if (exports_RequestParameterBuilder.addScopes(parameters, request2.scopes), exports_RequestParameterBuilder.addClientId(parameters, this.config.authOptions.clientId), request2.extraQueryParameters)
        exports_RequestParameterBuilder.addExtraParameters(parameters, request2.extraQueryParameters);
      if (request2.claims || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0)
        exports_RequestParameterBuilder.addClaims(parameters, request2.claims, this.config.authOptions.clientCapabilities);
      return exports_UrlUtils.mapToQueryString(parameters);
    }
    continuePolling(deviceCodeExpirationTime, userSpecifiedTimeout, userSpecifiedCancelFlag) {
      if (userSpecifiedCancelFlag)
        throw this.logger.error("Token request cancelled by setting DeviceCodeRequest.cancel = true", ""), createClientAuthError(deviceCodePollingCancelled);
      else if (userSpecifiedTimeout && userSpecifiedTimeout < deviceCodeExpirationTime && exports_TimeUtils.nowSeconds() > userSpecifiedTimeout)
        throw this.logger.error(`User defined timeout for device code polling reached. The timeout was set for ${userSpecifiedTimeout}`, ""), createClientAuthError(userTimeoutReached);
      else if (exports_TimeUtils.nowSeconds() > deviceCodeExpirationTime) {
        if (userSpecifiedTimeout)
          this.logger.verbose(`User specified timeout ignored as the device code has expired before the timeout elapsed. The user specified timeout was set for ${userSpecifiedTimeout}`, "");
        throw this.logger.error(`Device code expired. Expiration time of device code was ${deviceCodeExpirationTime}`, ""), createClientAuthError(deviceCodeExpired);
      }
      return !0;
    }
    async acquireTokenWithDeviceCode(request2, deviceCodeResponse) {
      let queryParametersString = this.createTokenQueryParameters(request2), endpoint7 = UrlString.appendQueryString(this.authority.tokenEndpoint, queryParametersString), requestBody = this.createTokenRequestBody(request2, deviceCodeResponse), headers = this.createTokenRequestHeaders(), userSpecifiedTimeout = request2.timeout ? exports_TimeUtils.nowSeconds() + request2.timeout : void 0, deviceCodeExpirationTime = exports_TimeUtils.nowSeconds() + deviceCodeResponse.expiresIn, pollingIntervalMilli = deviceCodeResponse.interval * 1000;
      while (this.continuePolling(deviceCodeExpirationTime, userSpecifiedTimeout, request2.cancel)) {
        let thumbprint = {
          clientId: this.config.authOptions.clientId,
          authority: request2.authority,
          scopes: request2.scopes,
          claims: request2.claims,
          authenticationScheme: request2.authenticationScheme,
          resourceRequestMethod: request2.resourceRequestMethod,
          resourceRequestUri: request2.resourceRequestUri,
          shrClaims: request2.shrClaims,
          sshKid: request2.sshKid
        }, response7 = await this.executePostToTokenEndpoint(endpoint7, requestBody, headers, thumbprint, request2.correlationId);
        if (response7.body && response7.body.error)
          if (response7.body.error === exports_Constants.AUTHORIZATION_PENDING)
            this.logger.info("Authorization pending. Continue polling.", request2.correlationId), await exports_TimeUtils.delay(pollingIntervalMilli);
          else
            throw this.logger.info("Unexpected error in polling from the server", request2.correlationId), createAuthError(exports_AuthErrorCodes.postRequestFailed, response7.body.error);
        else
          return this.logger.verbose("Authorization completed successfully. Polling stopped.", request2.correlationId), response7.body;
      }
      throw this.logger.error("Polling stopped for unknown reasons.", request2.correlationId), createClientAuthError(deviceCodeUnknownError);
    }
    createTokenRequestBody(request2, deviceCodeResponse) {
      let parameters = /* @__PURE__ */ new Map;
      exports_RequestParameterBuilder.addScopes(parameters, request2.scopes), exports_RequestParameterBuilder.addClientId(parameters, this.config.authOptions.clientId), exports_RequestParameterBuilder.addGrantType(parameters, exports_Constants.GrantType.DEVICE_CODE_GRANT), exports_RequestParameterBuilder.addDeviceCode(parameters, deviceCodeResponse.deviceCode);
      let correlationId = request2.correlationId || this.config.cryptoInterface.createNewGuid();
      if (exports_RequestParameterBuilder.addCorrelationId(parameters, correlationId), exports_RequestParameterBuilder.addClientInfo(parameters), exports_RequestParameterBuilder.addLibraryInfo(parameters, this.config.libraryInfo), exports_RequestParameterBuilder.addApplicationTelemetry(parameters, this.config.telemetry.application), exports_RequestParameterBuilder.addThrottling(parameters), this.serverTelemetryManager)
        exports_RequestParameterBuilder.addServerTelemetry(parameters, this.serverTelemetryManager);
      if (!StringUtils.isEmptyObj(request2.claims) || this.config.authOptions.clientCapabilities && this.config.authOptions.clientCapabilities.length > 0)
        exports_RequestParameterBuilder.addClaims(parameters, request2.claims, this.config.authOptions.clientCapabilities);
      return exports_UrlUtils.mapToQueryString(parameters);
    }
  };
});
