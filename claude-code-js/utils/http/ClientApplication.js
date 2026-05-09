// class: ClientApplication
class ClientApplication {
  constructor(configuration) {
    this.config = buildAppConfiguration(configuration), this.cryptoProvider = new CryptoProvider, this.logger = new Logger(this.config.system.loggerOptions, name2, version4), this.storage = new NodeStorage(this.logger, this.config.auth.clientId, this.cryptoProvider, buildStaticAuthorityOptions(this.config.auth)), this.tokenCache = new TokenCache(this.storage, this.logger, this.config.cache.cachePlugin);
  }
  async getAuthCodeUrl(request2) {
    this.logger.info("getAuthCodeUrl called", request2.correlationId || "");
    let validRequest = {
      ...request2,
      ...await this.initializeBaseRequest(request2),
      responseMode: request2.responseMode || exports_Constants.ResponseMode.QUERY,
      authenticationScheme: exports_Constants.AuthenticationScheme.BEARER,
      state: request2.state || "",
      nonce: request2.nonce || ""
    }, discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions);
    return getAuthCodeRequestUrl(this.config, discoveredAuthority, validRequest, this.logger);
  }
  async acquireTokenByCode(request2, authCodePayLoad) {
    if (this.logger.info("acquireTokenByCode called", request2.correlationId || ""), request2.state && authCodePayLoad)
      this.logger.info("acquireTokenByCode - validating state", request2.correlationId || ""), this.validateState(request2.state, authCodePayLoad.state || ""), authCodePayLoad = { ...authCodePayLoad, state: "" };
    let validRequest = {
      ...request2,
      ...await this.initializeBaseRequest(request2),
      authenticationScheme: exports_Constants.AuthenticationScheme.BEARER
    }, serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenByCode, validRequest.correlationId);
    try {
      let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions), authClientConfig = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, validRequest.redirectUri, serverTelemetryManager), authorizationCodeClient = new AuthorizationCodeClient(authClientConfig, new StubPerformanceClient);
      return this.logger.verbose("Auth code client created", validRequest.correlationId), await authorizationCodeClient.acquireToken(validRequest, ApiId.acquireTokenByCode, authCodePayLoad);
    } catch (e) {
      if (e instanceof AuthError)
        e.setCorrelationId(validRequest.correlationId);
      throw serverTelemetryManager.cacheFailedRequest(e), e;
    }
  }
  async acquireTokenByRefreshToken(request2) {
    this.logger.info("acquireTokenByRefreshToken called", request2.correlationId || "");
    let validRequest = {
      ...request2,
      ...await this.initializeBaseRequest(request2),
      authenticationScheme: exports_Constants.AuthenticationScheme.BEARER
    }, serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenByRefreshToken, validRequest.correlationId);
    try {
      let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions), refreshTokenClientConfig = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, validRequest.redirectUri || "", serverTelemetryManager), refreshTokenClient = new RefreshTokenClient(refreshTokenClientConfig, new StubPerformanceClient);
      return this.logger.verbose("Refresh token client created", validRequest.correlationId), await refreshTokenClient.acquireToken(validRequest, ApiId.acquireTokenByRefreshToken);
    } catch (e) {
      if (e instanceof AuthError)
        e.setCorrelationId(validRequest.correlationId);
      throw serverTelemetryManager.cacheFailedRequest(e), e;
    }
  }
  async acquireTokenSilent(request2) {
    let validRequest = {
      ...request2,
      ...await this.initializeBaseRequest(request2),
      forceRefresh: request2.forceRefresh || !1
    }, serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenSilent, validRequest.correlationId, validRequest.forceRefresh);
    try {
      let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions), clientConfiguration = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, validRequest.redirectUri || "", serverTelemetryManager), silentFlowClient = new SilentFlowClient(clientConfiguration, new StubPerformanceClient);
      this.logger.verbose("Silent flow client created", validRequest.correlationId);
      try {
        return await this.tokenCache.overwriteCache(), await this.acquireCachedTokenSilent(validRequest, silentFlowClient, clientConfiguration);
      } catch (error43) {
        if (error43 instanceof ClientAuthError && error43.errorCode === exports_ClientAuthErrorCodes.tokenRefreshRequired)
          return new RefreshTokenClient(clientConfiguration, new StubPerformanceClient).acquireTokenByRefreshToken(validRequest, ApiId.acquireTokenSilent);
        throw error43;
      }
    } catch (error43) {
      if (error43 instanceof AuthError)
        error43.setCorrelationId(validRequest.correlationId);
      throw serverTelemetryManager.cacheFailedRequest(error43), error43;
    }
  }
  async acquireCachedTokenSilent(validRequest, silentFlowClient, clientConfiguration) {
    let [authResponse, cacheOutcome] = await silentFlowClient.acquireCachedToken({
      ...validRequest,
      scopes: validRequest.scopes?.length ? validRequest.scopes : [...exports_Constants.OIDC_DEFAULT_SCOPES]
    });
    if (cacheOutcome === exports_Constants.CacheOutcome.PROACTIVELY_REFRESHED) {
      this.logger.info("ClientApplication:acquireCachedTokenSilent - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.", validRequest.correlationId);
      let refreshTokenClient = new RefreshTokenClient(clientConfiguration, new StubPerformanceClient);
      try {
        await refreshTokenClient.acquireTokenByRefreshToken(validRequest, ApiId.acquireTokenSilent);
      } catch {}
    }
    return authResponse;
  }
  async acquireTokenByUsernamePassword(request2) {
    this.logger.info("acquireTokenByUsernamePassword called", request2.correlationId || "");
    let validRequest = {
      ...request2,
      ...await this.initializeBaseRequest(request2)
    }, serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenByUsernamePassword, validRequest.correlationId);
    try {
      let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions), usernamePasswordClientConfig = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, "", serverTelemetryManager), usernamePasswordClient = new UsernamePasswordClient(usernamePasswordClientConfig);
      return this.logger.verbose("Username password client created", validRequest.correlationId), await usernamePasswordClient.acquireToken(validRequest);
    } catch (e) {
      if (e instanceof AuthError)
        e.setCorrelationId(validRequest.correlationId);
      throw serverTelemetryManager.cacheFailedRequest(e), e;
    }
  }
  getTokenCache() {
    return this.logger.info("getTokenCache called", ""), this.tokenCache;
  }
  validateState(state2, cachedState) {
    if (!state2)
      throw NodeAuthError.createStateNotFoundError();
    if (state2 !== cachedState)
      throw createClientAuthError(exports_ClientAuthErrorCodes.stateMismatch);
  }
  getLogger() {
    return this.logger;
  }
  setLogger(logger10) {
    this.logger = logger10;
  }
  async buildOauthClientConfiguration(discoveredAuthority, requestCorrelationId, redirectUri, serverTelemetryManager) {
    return this.logger.verbose("buildOauthClientConfiguration called", requestCorrelationId), this.logger.info(`Building oauth client configuration with the following authority: ${discoveredAuthority.tokenEndpoint}.`, requestCorrelationId), serverTelemetryManager?.updateRegionDiscoveryMetadata(discoveredAuthority.regionDiscoveryMetadata), {
      authOptions: {
        clientId: this.config.auth.clientId,
        authority: discoveredAuthority,
        clientCapabilities: this.config.auth.clientCapabilities,
        redirectUri,
        isMcp: this.config.auth.isMcp
      },
      loggerOptions: {
        logLevel: this.config.system.loggerOptions.logLevel,
        loggerCallback: this.config.system.loggerOptions.loggerCallback,
        piiLoggingEnabled: this.config.system.loggerOptions.piiLoggingEnabled,
        correlationId: requestCorrelationId
      },
      cryptoInterface: this.cryptoProvider,
      networkInterface: this.config.system.networkClient,
      storageInterface: this.storage,
      serverTelemetryManager,
      clientCredentials: {
        clientSecret: this.clientSecret,
        clientAssertion: await this.getClientAssertion(discoveredAuthority)
      },
      libraryInfo: {
        sku: Constants.MSAL_SKU,
        version: version4,
        cpu: process.arch || "",
        os: process.platform || ""
      },
      telemetry: this.config.telemetry,
      persistencePlugin: this.config.cache.cachePlugin,
      serializableCache: this.tokenCache
    };
  }
  async getClientAssertion(authority) {
    if (this.developerProvidedClientAssertion)
      this.clientAssertion = ClientAssertion.fromAssertion(await getClientAssertion(this.developerProvidedClientAssertion, this.config.auth.clientId, authority.tokenEndpoint));
    return this.clientAssertion && {
      assertion: this.clientAssertion.getJwt(this.cryptoProvider, this.config.auth.clientId, authority.tokenEndpoint),
      assertionType: Constants.JWT_BEARER_ASSERTION_TYPE
    };
  }
  async initializeBaseRequest(authRequest) {
    let correlationId = authRequest.correlationId || this.cryptoProvider.createNewGuid();
    if (this.logger.verbose("initializeRequestScopes called", correlationId), authRequest.authenticationScheme && authRequest.authenticationScheme === exports_Constants.AuthenticationScheme.POP)
      this.logger.verbose("Authentication Scheme 'pop' is not supported yet, setting Authentication Scheme to 'Bearer' for request", correlationId);
    return authRequest.authenticationScheme = exports_Constants.AuthenticationScheme.BEARER, {
      ...authRequest,
      scopes: [
        ...authRequest && authRequest.scopes || [],
        ...exports_Constants.OIDC_DEFAULT_SCOPES
      ],
      correlationId,
      authority: authRequest.authority || this.config.auth.authority
    };
  }
  initializeServerTelemetryManager(apiId, correlationId, forceRefresh) {
    let telemetryPayload = {
      clientId: this.config.auth.clientId,
      correlationId,
      apiId,
      forceRefresh: forceRefresh || !1
    };
    return new ServerTelemetryManager(telemetryPayload, this.storage);
  }
  async createAuthority(authorityString, requestCorrelationId, azureRegionConfiguration, azureCloudOptions) {
    this.logger.verbose("createAuthority called", requestCorrelationId);
    let authorityUrl = Authority.generateAuthority(authorityString, azureCloudOptions || this.config.auth.azureCloudOptions), authorityOptions = {
      protocolMode: this.config.system.protocolMode,
      knownAuthorities: this.config.auth.knownAuthorities,
      cloudDiscoveryMetadata: this.config.auth.cloudDiscoveryMetadata,
      authorityMetadata: this.config.auth.authorityMetadata,
      azureRegionConfiguration
    };
    return exports_AuthorityFactory.createDiscoveredInstance(authorityUrl, this.config.system.networkClient, this.storage, authorityOptions, this.logger, requestCorrelationId, new StubPerformanceClient);
  }
  clearCache() {
    this.storage.clear();
  }
}
