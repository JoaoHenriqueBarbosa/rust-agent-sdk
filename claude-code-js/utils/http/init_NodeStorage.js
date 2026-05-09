// var: init_NodeStorage
var init_NodeStorage = __esm(() => {
  init_index_node();
  init_Deserializer();
  init_Serializer();
  init_CacheHelpers2();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  NodeStorage = class NodeStorage extends CacheManager {
    constructor(logger10, clientId, cryptoImpl, staticAuthorityOptions) {
      super(clientId, cryptoImpl, logger10, new StubPerformanceClient, staticAuthorityOptions);
      this.cache = {}, this.changeEmitters = [], this.logger = logger10;
    }
    registerChangeEmitter(func) {
      this.changeEmitters.push(func);
    }
    emitChange() {
      this.changeEmitters.forEach((func) => func.call(null));
    }
    cacheToInMemoryCache(cache4) {
      let inMemoryCache = {
        accounts: {},
        idTokens: {},
        accessTokens: {},
        refreshTokens: {},
        appMetadata: {}
      };
      for (let key in cache4) {
        let value = cache4[key];
        if (typeof value !== "object")
          continue;
        if (exports_AccountEntityUtils.isAccountEntity(value))
          inMemoryCache.accounts[key] = value;
        else if (exports_CacheHelpers.isIdTokenEntity(value))
          inMemoryCache.idTokens[key] = value;
        else if (exports_CacheHelpers.isAccessTokenEntity(value))
          inMemoryCache.accessTokens[key] = value;
        else if (exports_CacheHelpers.isRefreshTokenEntity(value))
          inMemoryCache.refreshTokens[key] = value;
        else if (exports_CacheHelpers.isAppMetadataEntity(key, value))
          inMemoryCache.appMetadata[key] = value;
        else
          continue;
      }
      return inMemoryCache;
    }
    inMemoryCacheToCache(inMemoryCache) {
      let cache4 = this.getCache();
      return cache4 = {
        ...cache4,
        ...inMemoryCache.accounts,
        ...inMemoryCache.idTokens,
        ...inMemoryCache.accessTokens,
        ...inMemoryCache.refreshTokens,
        ...inMemoryCache.appMetadata
      }, cache4;
    }
    getInMemoryCache() {
      return this.logger.trace("Getting in-memory cache", ""), this.cacheToInMemoryCache(this.getCache());
    }
    setInMemoryCache(inMemoryCache) {
      this.logger.trace("Setting in-memory cache", "");
      let cache4 = this.inMemoryCacheToCache(inMemoryCache);
      this.setCache(cache4), this.emitChange();
    }
    getCache() {
      return this.logger.trace("Getting cache key-value store", ""), this.cache;
    }
    setCache(cache4) {
      this.logger.trace("Setting cache key value store", ""), this.cache = cache4, this.emitChange();
    }
    getItem(key) {
      return this.logger.tracePii(`Item key: ${key}`, ""), this.getCache()[key];
    }
    setItem(key, value) {
      this.logger.tracePii(`Item key: ${key}`, "");
      let cache4 = this.getCache();
      cache4[key] = value, this.setCache(cache4);
    }
    generateCredentialKey(credential) {
      return generateCredentialKey(credential);
    }
    generateAccountKey(account) {
      return generateAccountKey(account);
    }
    getAccountKeys() {
      let inMemoryCache = this.getInMemoryCache();
      return Object.keys(inMemoryCache.accounts);
    }
    getTokenKeys() {
      let inMemoryCache = this.getInMemoryCache();
      return {
        idToken: Object.keys(inMemoryCache.idTokens),
        accessToken: Object.keys(inMemoryCache.accessTokens),
        refreshToken: Object.keys(inMemoryCache.refreshTokens)
      };
    }
    getAccount(accountKey) {
      let cachedAccount = this.getItem(accountKey);
      return cachedAccount && typeof cachedAccount === "object" ? { ...cachedAccount } : null;
    }
    async setAccount(account) {
      let accountKey = this.generateAccountKey(exports_AccountEntityUtils.getAccountInfo(account));
      this.setItem(accountKey, account);
    }
    getIdTokenCredential(idTokenKey) {
      let idToken = this.getItem(idTokenKey);
      if (exports_CacheHelpers.isIdTokenEntity(idToken))
        return idToken;
      return null;
    }
    async setIdTokenCredential(idToken) {
      let idTokenKey = this.generateCredentialKey(idToken);
      this.setItem(idTokenKey, idToken);
    }
    getAccessTokenCredential(accessTokenKey) {
      let accessToken = this.getItem(accessTokenKey);
      if (exports_CacheHelpers.isAccessTokenEntity(accessToken))
        return accessToken;
      return null;
    }
    async setAccessTokenCredential(accessToken) {
      let accessTokenKey = this.generateCredentialKey(accessToken);
      this.setItem(accessTokenKey, accessToken);
    }
    getRefreshTokenCredential(refreshTokenKey) {
      let refreshToken = this.getItem(refreshTokenKey);
      if (exports_CacheHelpers.isRefreshTokenEntity(refreshToken))
        return refreshToken;
      return null;
    }
    async setRefreshTokenCredential(refreshToken) {
      let refreshTokenKey = this.generateCredentialKey(refreshToken);
      this.setItem(refreshTokenKey, refreshToken);
    }
    getAppMetadata(appMetadataKey) {
      let appMetadata = this.getItem(appMetadataKey);
      if (exports_CacheHelpers.isAppMetadataEntity(appMetadataKey, appMetadata))
        return appMetadata;
      return null;
    }
    setAppMetadata(appMetadata) {
      let appMetadataKey = exports_CacheHelpers.generateAppMetadataKey(appMetadata);
      this.setItem(appMetadataKey, appMetadata);
    }
    getServerTelemetry(serverTelemetrykey) {
      let serverTelemetryEntity = this.getItem(serverTelemetrykey);
      if (serverTelemetryEntity && exports_CacheHelpers.isServerTelemetryEntity(serverTelemetrykey, serverTelemetryEntity))
        return serverTelemetryEntity;
      return null;
    }
    setServerTelemetry(serverTelemetryKey, serverTelemetry) {
      this.setItem(serverTelemetryKey, serverTelemetry);
    }
    getAuthorityMetadata(key) {
      let authorityMetadataEntity = this.getItem(key);
      if (authorityMetadataEntity && exports_CacheHelpers.isAuthorityMetadataEntity(key, authorityMetadataEntity))
        return authorityMetadataEntity;
      return null;
    }
    getAuthorityMetadataKeys() {
      return this.getKeys().filter((key) => {
        return this.isAuthorityMetadata(key);
      });
    }
    setAuthorityMetadata(key, metadata) {
      this.setItem(key, metadata);
    }
    getThrottlingCache(throttlingCacheKey) {
      let throttlingCache = this.getItem(throttlingCacheKey);
      if (throttlingCache && exports_CacheHelpers.isThrottlingEntity(throttlingCacheKey, throttlingCache))
        return throttlingCache;
      return null;
    }
    setThrottlingCache(throttlingCacheKey, throttlingCache) {
      this.setItem(throttlingCacheKey, throttlingCache);
    }
    removeItem(key) {
      this.logger.tracePii(`Item key: ${key}`, "");
      let result = !1, cache4 = this.getCache();
      if (cache4[key])
        delete cache4[key], result = !0;
      if (result)
        this.setCache(cache4), this.emitChange();
      return result;
    }
    removeOutdatedAccount(accountKey) {
      this.removeItem(accountKey);
    }
    containsKey(key) {
      return this.getKeys().includes(key);
    }
    getKeys() {
      this.logger.trace("Retrieving all cache keys", "");
      let cache4 = this.getCache();
      return [...Object.keys(cache4)];
    }
    clear() {
      this.logger.trace("Clearing cache entries created by MSAL", ""), this.getKeys().forEach((key) => {
        this.removeItem(key);
      }), this.emitChange();
    }
    static generateInMemoryCache(cache4) {
      return Deserializer.deserializeAllCache(Deserializer.deserializeJSONBlob(cache4));
    }
    static generateJsonCache(inMemoryCache) {
      return Serializer.serializeAllCache(inMemoryCache);
    }
    updateCredentialCacheKey(currentCacheKey, credential) {
      let updatedCacheKey = this.generateCredentialKey(credential);
      if (currentCacheKey !== updatedCacheKey) {
        let cacheItem = this.getItem(currentCacheKey);
        if (cacheItem)
          return this.removeItem(currentCacheKey), this.setItem(updatedCacheKey, cacheItem), this.logger.verbose(`Updated an outdated ${credential.credentialType} cache key`, ""), updatedCacheKey;
        else
          this.logger.error(`Attempted to update an outdated ${credential.credentialType} cache key but no item matching the outdated key was found in storage`, "");
      }
      return currentCacheKey;
    }
  };
});
