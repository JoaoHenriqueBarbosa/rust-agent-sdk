// var: init_PublicClientApplication
var init_PublicClientApplication = __esm(() => {
  init_Constants2();
  init_index_node();
  init_ClientApplication();
  init_NodeAuthError();
  init_LoopbackClient();
  init_DeviceCodeClient();
  init_packageMetadata2();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  PublicClientApplication = class PublicClientApplication extends ClientApplication {
    constructor(configuration) {
      super(configuration);
      if (this.config.broker.nativeBrokerPlugin)
        if (this.config.broker.nativeBrokerPlugin.isBrokerAvailable)
          this.nativeBrokerPlugin = this.config.broker.nativeBrokerPlugin, this.nativeBrokerPlugin.setLogger(this.config.system.loggerOptions);
        else
          this.logger.warning("NativeBroker implementation was provided but the broker is unavailable.", "");
      this.skus = ServerTelemetryManager.makeExtraSkuString({
        libraryName: Constants.MSAL_SKU,
        libraryVersion: version4
      });
    }
    async acquireTokenByDeviceCode(request2) {
      this.logger.info("acquireTokenByDeviceCode called", request2.correlationId || ""), enforceResourceParameter(this.config.auth.isMcp, request2);
      let validRequest = Object.assign(request2, await this.initializeBaseRequest(request2)), serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenByDeviceCode, validRequest.correlationId);
      try {
        let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions), deviceCodeConfig = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, "", serverTelemetryManager), deviceCodeClient = new DeviceCodeClient(deviceCodeConfig);
        return this.logger.verbose("Device code client created", validRequest.correlationId), await deviceCodeClient.acquireToken(validRequest);
      } catch (e) {
        if (e instanceof AuthError)
          e.setCorrelationId(validRequest.correlationId);
        throw serverTelemetryManager.cacheFailedRequest(e), e;
      }
    }
    async acquireTokenInteractive(request2) {
      let correlationId = request2.correlationId || this.cryptoProvider.createNewGuid();
      this.logger.trace("acquireTokenInteractive called", correlationId), enforceResourceParameter(this.config.auth.isMcp, request2);
      let { openBrowser, successTemplate, errorTemplate, windowHandle, loopbackClient: customLoopbackClient, ...remainingProperties } = request2;
      if (this.nativeBrokerPlugin) {
        let brokerRequest = {
          ...remainingProperties,
          clientId: this.config.auth.clientId,
          scopes: request2.scopes || exports_Constants.OIDC_DEFAULT_SCOPES,
          redirectUri: request2.redirectUri || "",
          authority: request2.authority || this.config.auth.authority,
          correlationId,
          extraParameters: {
            ...remainingProperties.extraQueryParameters,
            ...remainingProperties.extraParameters,
            [exports_AADServerParamKeys.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: remainingProperties.account?.nativeAccountId
        };
        return this.nativeBrokerPlugin.acquireTokenInteractive(brokerRequest, windowHandle);
      }
      if (request2.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin)
          throw NodeAuthError.createRedirectUriNotSupportedError();
        request2.redirectUri = "";
      }
      let { verifier, challenge } = await this.cryptoProvider.generatePkceCodes(), loopbackClient = customLoopbackClient || new LoopbackClient, authCodeResponse = {}, authCodeListenerError = null;
      try {
        let authCodeListener = loopbackClient.listenForAuthCode(successTemplate, errorTemplate).then((response7) => {
          authCodeResponse = response7;
        }).catch((e) => {
          authCodeListenerError = e;
        }), redirectUri = await this.waitForRedirectUri(loopbackClient), validRequest = {
          ...remainingProperties,
          correlationId,
          scopes: request2.scopes || exports_Constants.OIDC_DEFAULT_SCOPES,
          redirectUri,
          responseMode: exports_Constants.ResponseMode.QUERY,
          codeChallenge: challenge,
          codeChallengeMethod: exports_Constants.CodeChallengeMethodValues.S256
        }, authCodeUrl = await this.getAuthCodeUrl(validRequest);
        if (await openBrowser(authCodeUrl), await authCodeListener, authCodeListenerError)
          throw authCodeListenerError;
        if (authCodeResponse.error)
          throw new ServerError(authCodeResponse.error, authCodeResponse.error_description, authCodeResponse.suberror);
        else if (!authCodeResponse.code)
          throw NodeAuthError.createNoAuthCodeInResponseError();
        let clientInfo = authCodeResponse.client_info, tokenRequest = {
          code: authCodeResponse.code,
          codeVerifier: verifier,
          clientInfo: clientInfo || "",
          ...validRequest
        };
        return await this.acquireTokenByCode(tokenRequest);
      } finally {
        loopbackClient.closeServer();
      }
    }
    async acquireTokenSilent(request2) {
      let correlationId = request2.correlationId || this.cryptoProvider.createNewGuid();
      if (this.logger.trace("acquireTokenSilent called", correlationId), enforceResourceParameter(this.config.auth.isMcp, request2), this.nativeBrokerPlugin) {
        let brokerRequest = {
          ...request2,
          clientId: this.config.auth.clientId,
          scopes: request2.scopes || exports_Constants.OIDC_DEFAULT_SCOPES,
          redirectUri: request2.redirectUri || "",
          authority: request2.authority || this.config.auth.authority,
          correlationId,
          extraParameters: {
            ...request2.extraQueryParameters,
            ...request2.extraParameters,
            [exports_AADServerParamKeys.X_CLIENT_EXTRA_SKU]: this.skus
          },
          accountId: request2.account.nativeAccountId,
          forceRefresh: request2.forceRefresh || !1
        };
        return this.nativeBrokerPlugin.acquireTokenSilent(brokerRequest);
      }
      if (request2.redirectUri) {
        if (!this.config.broker.nativeBrokerPlugin)
          throw NodeAuthError.createRedirectUriNotSupportedError();
        request2.redirectUri = "";
      }
      return super.acquireTokenSilent(request2);
    }
    async acquireTokenByCode(request2, authCodePayLoad) {
      return enforceResourceParameter(this.config.auth.isMcp, request2), super.acquireTokenByCode(request2, authCodePayLoad);
    }
    async acquireTokenByRefreshToken(request2) {
      return enforceResourceParameter(this.config.auth.isMcp, request2), super.acquireTokenByRefreshToken(request2);
    }
    async signOut(request2) {
      if (this.nativeBrokerPlugin && request2.account.nativeAccountId) {
        let signoutRequest = {
          clientId: this.config.auth.clientId,
          accountId: request2.account.nativeAccountId,
          correlationId: request2.correlationId || this.cryptoProvider.createNewGuid()
        };
        await this.nativeBrokerPlugin.signOut(signoutRequest);
      }
      await this.getTokenCache().removeAccount(request2.account, request2.correlationId);
    }
    async getAllAccounts() {
      if (this.nativeBrokerPlugin) {
        let correlationId = this.cryptoProvider.createNewGuid();
        return this.nativeBrokerPlugin.getAllAccounts(this.config.auth.clientId, correlationId);
      }
      return this.getTokenCache().getAllAccounts();
    }
    async waitForRedirectUri(loopbackClient) {
      return new Promise((resolve9, reject) => {
        let ticks = 0, id = setInterval(() => {
          if (LOOPBACK_SERVER_CONSTANTS.TIMEOUT_MS / LOOPBACK_SERVER_CONSTANTS.INTERVAL_MS < ticks) {
            clearInterval(id), reject(NodeAuthError.createLoopbackServerTimeoutError());
            return;
          }
          try {
            let r4 = loopbackClient.getRedirectUri();
            clearInterval(id), resolve9(r4);
            return;
          } catch (e) {
            if (e instanceof AuthError && e.errorCode === NodeAuthErrorMessage.noLoopbackServerExists.code) {
              ticks++;
              return;
            }
            clearInterval(id), reject(e);
            return;
          }
        }, LOOPBACK_SERVER_CONSTANTS.INTERVAL_MS);
      });
    }
  };
});
