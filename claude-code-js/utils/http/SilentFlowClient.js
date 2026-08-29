// class: SilentFlowClient
class SilentFlowClient {
  constructor(configuration, performanceClient) {
    this.config = buildClientConfiguration(configuration), this.logger = new Logger(this.config.loggerOptions, name, version2), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = performanceClient;
  }
  async acquireCachedToken(request2) {
    let lastCacheOutcome = CacheOutcome.NOT_APPLICABLE;
    if (request2.forceRefresh || !StringUtils.isEmptyObj(request2.claims))
      throw this.setCacheOutcome(CacheOutcome.FORCE_REFRESH_OR_CLAIMS, request2.correlationId), createClientAuthError(tokenRefreshRequired);
    if (!request2.account)
      throw createClientAuthError(noAccountInSilentRequest);
    let requestTenantId = request2.account.tenantId || getTenantFromAuthorityString(request2.authority), tokenKeys = this.cacheManager.getTokenKeys(), cachedAccessToken = this.cacheManager.getAccessToken(request2.account, request2, tokenKeys, requestTenantId);
    if (!cachedAccessToken)
      throw this.setCacheOutcome(CacheOutcome.NO_CACHED_ACCESS_TOKEN, request2.correlationId), createClientAuthError(tokenRefreshRequired);
    else if (wasClockTurnedBack(cachedAccessToken.cachedAt) || isTokenExpired(cachedAccessToken.expiresOn, this.config.systemOptions.tokenRenewalOffsetSeconds))
      throw this.setCacheOutcome(CacheOutcome.CACHED_ACCESS_TOKEN_EXPIRED, request2.correlationId), createClientAuthError(tokenRefreshRequired);
    else if (request2.resource) {
      if (cachedAccessToken.resource !== request2.resource)
        throw this.setCacheOutcome(CacheOutcome.NO_CACHED_ACCESS_TOKEN, request2.correlationId), createClientAuthError(tokenRefreshRequired);
    } else if (cachedAccessToken.refreshOn && isTokenExpired(cachedAccessToken.refreshOn, 0))
      lastCacheOutcome = CacheOutcome.PROACTIVELY_REFRESHED;
    let environment = request2.authority || this.authority.getPreferredCache(), cacheRecord = {
      account: this.cacheManager.getAccount(this.cacheManager.generateAccountKey(request2.account), request2.correlationId),
      accessToken: cachedAccessToken,
      idToken: this.cacheManager.getIdToken(request2.account, request2.correlationId, tokenKeys, requestTenantId),
      refreshToken: null,
      appMetadata: this.cacheManager.readAppMetadataFromCache(environment, request2.correlationId)
    };
    if (this.setCacheOutcome(lastCacheOutcome, request2.correlationId), this.config.serverTelemetryManager)
      this.config.serverTelemetryManager.incrementCacheHits();
    return [
      await invokeAsync(this.generateResultFromCacheRecord.bind(this), SilentFlowClientGenerateResultFromCacheRecord, this.logger, this.performanceClient, request2.correlationId)(cacheRecord, request2),
      lastCacheOutcome
    ];
  }
  setCacheOutcome(cacheOutcome, correlationId) {
    if (this.serverTelemetryManager?.setCacheOutcome(cacheOutcome), this.performanceClient?.addFields({
      cacheOutcome
    }, correlationId), cacheOutcome !== CacheOutcome.NOT_APPLICABLE)
      this.logger.info(`Token refresh is required due to cache outcome: '${cacheOutcome}'`, correlationId);
  }
  async generateResultFromCacheRecord(cacheRecord, request2) {
    let idTokenClaims;
    if (cacheRecord.idToken)
      idTokenClaims = extractTokenClaims(cacheRecord.idToken.secret, this.config.cryptoInterface.base64Decode);
    if (request2.maxAge || request2.maxAge === 0) {
      let authTime = idTokenClaims?.auth_time;
      if (!authTime)
        throw createClientAuthError(authTimeNotFound);
      checkMaxAge(authTime, request2.maxAge);
    }
    return ResponseHandler.generateAuthenticationResult(this.cryptoUtils, this.authority, cacheRecord, !0, request2, this.performanceClient, idTokenClaims);
  }
}
