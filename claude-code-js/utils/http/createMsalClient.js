// function: createMsalClient
function createMsalClient(clientId, tenantId, createMsalClientOptions = {}) {
  let state3 = {
    msalConfig: generateMsalConfiguration(clientId, tenantId, createMsalClientOptions),
    cachedAccount: createMsalClientOptions.authenticationRecord ? publicToMsal(createMsalClientOptions.authenticationRecord) : null,
    pluginConfiguration: msalPlugins.generatePluginConfiguration(createMsalClientOptions),
    logger: createMsalClientOptions.logger ?? msalLogger
  }, publicApps = /* @__PURE__ */ new Map;
  async function getPublicApp(options = {}) {
    let appKey = options.enableCae ? "CAE" : "default", publicClientApp = publicApps.get(appKey);
    if (publicClientApp)
      return state3.logger.getToken.info("Existing PublicClientApplication found in cache, returning it."), publicClientApp;
    state3.logger.getToken.info(`Creating new PublicClientApplication with CAE ${options.enableCae ? "enabled" : "disabled"}.`);
    let cachePlugin = options.enableCae ? state3.pluginConfiguration.cache.cachePluginCae : state3.pluginConfiguration.cache.cachePlugin;
    return state3.msalConfig.auth.clientCapabilities = options.enableCae ? ["cp1"] : void 0, publicClientApp = new PublicClientApplication({
      ...state3.msalConfig,
      broker: { nativeBrokerPlugin: state3.pluginConfiguration.broker.nativeBrokerPlugin },
      cache: { cachePlugin: await cachePlugin }
    }), publicApps.set(appKey, publicClientApp), publicClientApp;
  }
  let confidentialApps = /* @__PURE__ */ new Map;
  async function getConfidentialApp(options = {}) {
    let appKey = options.enableCae ? "CAE" : "default", confidentialClientApp = confidentialApps.get(appKey);
    if (confidentialClientApp)
      return state3.logger.getToken.info("Existing ConfidentialClientApplication found in cache, returning it."), confidentialClientApp;
    state3.logger.getToken.info(`Creating new ConfidentialClientApplication with CAE ${options.enableCae ? "enabled" : "disabled"}.`);
    let cachePlugin = options.enableCae ? state3.pluginConfiguration.cache.cachePluginCae : state3.pluginConfiguration.cache.cachePlugin;
    return state3.msalConfig.auth.clientCapabilities = options.enableCae ? ["cp1"] : void 0, confidentialClientApp = new ConfidentialClientApplication({
      ...state3.msalConfig,
      broker: { nativeBrokerPlugin: state3.pluginConfiguration.broker.nativeBrokerPlugin },
      cache: { cachePlugin: await cachePlugin }
    }), confidentialApps.set(appKey, confidentialClientApp), confidentialClientApp;
  }
  async function getTokenSilent(app, scopes, options = {}) {
    if (state3.cachedAccount === null)
      throw state3.logger.getToken.info("No cached account found in local state."), new AuthenticationRequiredError({ scopes });
    if (options.claims)
      state3.cachedClaims = options.claims;
    let silentRequest = {
      account: state3.cachedAccount,
      scopes,
      claims: state3.cachedClaims
    };
    if (state3.pluginConfiguration.broker.isEnabled) {
      if (silentRequest.extraQueryParameters ||= {}, state3.pluginConfiguration.broker.enableMsaPassthrough)
        silentRequest.extraQueryParameters.msal_request_type = "consumer_passthrough";
    }
    if (options.proofOfPossessionOptions)
      silentRequest.shrNonce = options.proofOfPossessionOptions.nonce, silentRequest.authenticationScheme = "pop", silentRequest.resourceRequestMethod = options.proofOfPossessionOptions.resourceRequestMethod, silentRequest.resourceRequestUri = options.proofOfPossessionOptions.resourceRequestUrl;
    state3.logger.getToken.info("Attempting to acquire token silently");
    try {
      return await app.acquireTokenSilent(silentRequest);
    } catch (err) {
      throw handleMsalError(scopes, err, options);
    }
  }
  function calculateRequestAuthority(options) {
    if (options?.tenantId)
      return getAuthority(options.tenantId, getAuthorityHost(createMsalClientOptions));
    return state3.msalConfig.auth.authority;
  }
  async function withSilentAuthentication(msalApp, scopes, options, onAuthenticationRequired) {
    let response7 = null;
    try {
      response7 = await getTokenSilent(msalApp, scopes, options);
    } catch (e) {
      if (e.name !== "AuthenticationRequiredError")
        throw e;
      if (options.disableAutomaticAuthentication)
        throw new AuthenticationRequiredError({
          scopes,
          getTokenOptions: options,
          message: "Automatic authentication has been disabled. You may call the authentication() method."
        });
    }
    if (response7 === null)
      try {
        response7 = await onAuthenticationRequired();
      } catch (err) {
        throw handleMsalError(scopes, err, options);
      }
    return ensureValidMsalToken(scopes, response7, options), state3.cachedAccount = response7?.account ?? null, state3.logger.getToken.info(formatSuccess(scopes)), {
      token: response7.accessToken,
      expiresOnTimestamp: response7.expiresOn.getTime(),
      refreshAfterTimestamp: response7.refreshOn?.getTime(),
      tokenType: response7.tokenType
    };
  }
  async function getTokenByClientSecret(scopes, clientSecret, options = {}) {
    state3.logger.getToken.info("Attempting to acquire token using client secret"), state3.msalConfig.auth.clientSecret = clientSecret;
    let msalApp = await getConfidentialApp(options);
    try {
      let response7 = await msalApp.acquireTokenByClientCredential({
        scopes,
        authority: calculateRequestAuthority(options),
        azureRegion: calculateRegionalAuthority(),
        claims: options?.claims
      });
      return ensureValidMsalToken(scopes, response7, options), state3.logger.getToken.info(formatSuccess(scopes)), {
        token: response7.accessToken,
        expiresOnTimestamp: response7.expiresOn.getTime(),
        refreshAfterTimestamp: response7.refreshOn?.getTime(),
        tokenType: response7.tokenType
      };
    } catch (err) {
      throw handleMsalError(scopes, err, options);
    }
  }
  async function getTokenByClientAssertion(scopes, clientAssertion, options = {}) {
    state3.logger.getToken.info("Attempting to acquire token using client assertion"), state3.msalConfig.auth.clientAssertion = clientAssertion;
    let msalApp = await getConfidentialApp(options);
    try {
      let response7 = await msalApp.acquireTokenByClientCredential({
        scopes,
        authority: calculateRequestAuthority(options),
        azureRegion: calculateRegionalAuthority(),
        claims: options?.claims,
        clientAssertion
      });
      return ensureValidMsalToken(scopes, response7, options), state3.logger.getToken.info(formatSuccess(scopes)), {
        token: response7.accessToken,
        expiresOnTimestamp: response7.expiresOn.getTime(),
        refreshAfterTimestamp: response7.refreshOn?.getTime(),
        tokenType: response7.tokenType
      };
    } catch (err) {
      throw handleMsalError(scopes, err, options);
    }
  }
  async function getTokenByClientCertificate(scopes, certificate, options = {}) {
    state3.logger.getToken.info("Attempting to acquire token using client certificate"), state3.msalConfig.auth.clientCertificate = certificate;
    let msalApp = await getConfidentialApp(options);
    try {
      let response7 = await msalApp.acquireTokenByClientCredential({
        scopes,
        authority: calculateRequestAuthority(options),
        azureRegion: calculateRegionalAuthority(),
        claims: options?.claims
      });
      return ensureValidMsalToken(scopes, response7, options), state3.logger.getToken.info(formatSuccess(scopes)), {
        token: response7.accessToken,
        expiresOnTimestamp: response7.expiresOn.getTime(),
        refreshAfterTimestamp: response7.refreshOn?.getTime(),
        tokenType: response7.tokenType
      };
    } catch (err) {
      throw handleMsalError(scopes, err, options);
    }
  }
  async function getTokenByDeviceCode(scopes, deviceCodeCallback, options = {}) {
    state3.logger.getToken.info("Attempting to acquire token using device code");
    let msalApp = await getPublicApp(options);
    return withSilentAuthentication(msalApp, scopes, options, () => {
      let requestOptions = {
        scopes,
        cancel: options?.abortSignal?.aborted ?? !1,
        deviceCodeCallback,
        authority: calculateRequestAuthority(options),
        claims: options?.claims
      }, deviceCodeRequest = msalApp.acquireTokenByDeviceCode(requestOptions);
      if (options.abortSignal)
        options.abortSignal.addEventListener("abort", () => {
          requestOptions.cancel = !0;
        });
      return deviceCodeRequest;
    });
  }
  async function getTokenByUsernamePassword(scopes, username, password, options = {}) {
    state3.logger.getToken.info("Attempting to acquire token using username and password");
    let msalApp = await getPublicApp(options);
    return withSilentAuthentication(msalApp, scopes, options, () => {
      let requestOptions = {
        scopes,
        username,
        password,
        authority: calculateRequestAuthority(options),
        claims: options?.claims
      };
      return msalApp.acquireTokenByUsernamePassword(requestOptions);
    });
  }
  function getActiveAccount() {
    if (!state3.cachedAccount)
      return;
    return msalToPublic(clientId, state3.cachedAccount);
  }
  async function getTokenByAuthorizationCode(scopes, redirectUri, authorizationCode, clientSecret, options = {}) {
    state3.logger.getToken.info("Attempting to acquire token using authorization code");
    let msalApp;
    if (clientSecret)
      state3.msalConfig.auth.clientSecret = clientSecret, msalApp = await getConfidentialApp(options);
    else
      msalApp = await getPublicApp(options);
    return withSilentAuthentication(msalApp, scopes, options, () => {
      return msalApp.acquireTokenByCode({
        scopes,
        redirectUri,
        code: authorizationCode,
        authority: calculateRequestAuthority(options),
        claims: options?.claims
      });
    });
  }
  async function getTokenOnBehalfOf(scopes, userAssertionToken, clientCredentials, options = {}) {
    if (msalLogger.getToken.info("Attempting to acquire token on behalf of another user"), typeof clientCredentials === "string")
      msalLogger.getToken.info("Using client secret for on behalf of flow"), state3.msalConfig.auth.clientSecret = clientCredentials;
    else if (typeof clientCredentials === "function")
      msalLogger.getToken.info("Using client assertion callback for on behalf of flow"), state3.msalConfig.auth.clientAssertion = clientCredentials;
    else
      msalLogger.getToken.info("Using client certificate for on behalf of flow"), state3.msalConfig.auth.clientCertificate = clientCredentials;
    let msalApp = await getConfidentialApp(options);
    try {
      let response7 = await msalApp.acquireTokenOnBehalfOf({
        scopes,
        authority: calculateRequestAuthority(options),
        claims: options.claims,
        oboAssertion: userAssertionToken
      });
      return ensureValidMsalToken(scopes, response7, options), msalLogger.getToken.info(formatSuccess(scopes)), {
        token: response7.accessToken,
        expiresOnTimestamp: response7.expiresOn.getTime(),
        refreshAfterTimestamp: response7.refreshOn?.getTime(),
        tokenType: response7.tokenType
      };
    } catch (err) {
      throw handleMsalError(scopes, err, options);
    }
  }
  function createBaseInteractiveRequest(scopes, options) {
    return {
      openBrowser: async (url3) => {
        await (await Promise.resolve().then(() => (init_open(), exports_open))).default(url3, { newInstance: !0 });
      },
      scopes,
      authority: calculateRequestAuthority(options),
      claims: options?.claims,
      loginHint: options?.loginHint,
      errorTemplate: options?.browserCustomizationOptions?.errorMessage,
      successTemplate: options?.browserCustomizationOptions?.successMessage,
      prompt: options?.loginHint ? "login" : "select_account"
    };
  }
  async function getBrokeredTokenInternal(scopes, useDefaultBrokerAccount, options = {}) {
    msalLogger.verbose("Authentication will resume through the broker");
    let app = await getPublicApp(options), interactiveRequest = createBaseInteractiveRequest(scopes, options);
    if (state3.pluginConfiguration.broker.parentWindowHandle)
      interactiveRequest.windowHandle = Buffer.from(state3.pluginConfiguration.broker.parentWindowHandle);
    else
      msalLogger.warning("Parent window handle is not specified for the broker. This may cause unexpected behavior. Please provide the parentWindowHandle.");
    if (state3.pluginConfiguration.broker.enableMsaPassthrough)
      (interactiveRequest.extraQueryParameters ??= {}).msal_request_type = "consumer_passthrough";
    if (useDefaultBrokerAccount)
      interactiveRequest.prompt = "none", msalLogger.verbose("Attempting broker authentication using the default broker account");
    else
      msalLogger.verbose("Attempting broker authentication without the default broker account");
    if (options.proofOfPossessionOptions)
      interactiveRequest.shrNonce = options.proofOfPossessionOptions.nonce, interactiveRequest.authenticationScheme = "pop", interactiveRequest.resourceRequestMethod = options.proofOfPossessionOptions.resourceRequestMethod, interactiveRequest.resourceRequestUri = options.proofOfPossessionOptions.resourceRequestUrl;
    try {
      return await app.acquireTokenInteractive(interactiveRequest);
    } catch (e) {
      if (msalLogger.verbose(`Failed to authenticate through the broker: ${e.message}`), options.disableAutomaticAuthentication)
        throw new AuthenticationRequiredError({
          scopes,
          getTokenOptions: options,
          message: "Cannot silently authenticate with default broker account."
        });
      if (useDefaultBrokerAccount)
        return getBrokeredTokenInternal(scopes, !1, options);
      else
        throw e;
    }
  }
  async function getBrokeredToken(scopes, useDefaultBrokerAccount, options = {}) {
    msalLogger.getToken.info(`Attempting to acquire token using brokered authentication with useDefaultBrokerAccount: ${useDefaultBrokerAccount}`);
    let response7 = await getBrokeredTokenInternal(scopes, useDefaultBrokerAccount, options);
    return ensureValidMsalToken(scopes, response7, options), state3.cachedAccount = response7?.account ?? null, state3.logger.getToken.info(formatSuccess(scopes)), {
      token: response7.accessToken,
      expiresOnTimestamp: response7.expiresOn.getTime(),
      refreshAfterTimestamp: response7.refreshOn?.getTime(),
      tokenType: response7.tokenType
    };
  }
  async function getTokenByInteractiveRequest(scopes, options = {}) {
    msalLogger.getToken.info("Attempting to acquire token interactively");
    let app = await getPublicApp(options);
    return withSilentAuthentication(app, scopes, options, async () => {
      let interactiveRequest = createBaseInteractiveRequest(scopes, options);
      if (state3.pluginConfiguration.broker.isEnabled)
        return getBrokeredTokenInternal(scopes, state3.pluginConfiguration.broker.useDefaultBrokerAccount ?? !1, options);
      if (options.proofOfPossessionOptions)
        interactiveRequest.shrNonce = options.proofOfPossessionOptions.nonce, interactiveRequest.authenticationScheme = "pop", interactiveRequest.resourceRequestMethod = options.proofOfPossessionOptions.resourceRequestMethod, interactiveRequest.resourceRequestUri = options.proofOfPossessionOptions.resourceRequestUrl;
      return app.acquireTokenInteractive(interactiveRequest);
    });
  }
  return {
    getActiveAccount,
    getBrokeredToken,
    getTokenByClientSecret,
    getTokenByClientAssertion,
    getTokenByClientCertificate,
    getTokenByDeviceCode,
    getTokenByUsernamePassword,
    getTokenByAuthorizationCode,
    getTokenOnBehalfOf,
    getTokenByInteractiveRequest
  };
}
