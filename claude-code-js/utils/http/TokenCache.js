// class: TokenCache
class TokenCache {
  constructor(storage, logger10, cachePlugin) {
    if (this.cacheHasChanged = !1, this.storage = storage, this.storage.registerChangeEmitter(this.handleChangeEvent.bind(this)), cachePlugin)
      this.persistence = cachePlugin;
    this.logger = logger10;
  }
  hasChanged() {
    return this.cacheHasChanged;
  }
  serialize() {
    this.logger.trace("Serializing in-memory cache", "");
    let finalState = Serializer.serializeAllCache(this.storage.getInMemoryCache());
    if (this.cacheSnapshot)
      this.logger.trace("Reading cache snapshot from disk", ""), finalState = this.mergeState(JSON.parse(this.cacheSnapshot), finalState);
    else
      this.logger.trace("No cache snapshot to merge", "");
    return this.cacheHasChanged = !1, JSON.stringify(finalState);
  }
  deserialize(cache4) {
    if (this.logger.trace("Deserializing JSON to in-memory cache", ""), this.cacheSnapshot = cache4, this.cacheSnapshot) {
      this.logger.trace("Reading cache snapshot from disk", "");
      let deserializedCache = Deserializer.deserializeAllCache(this.overlayDefaults(JSON.parse(this.cacheSnapshot)));
      this.storage.setInMemoryCache(deserializedCache);
    } else
      this.logger.trace("No cache snapshot to deserialize", "");
  }
  getKVStore() {
    return this.storage.getCache();
  }
  getCacheSnapshot() {
    let deserializedPersistentStorage = NodeStorage.generateInMemoryCache(this.cacheSnapshot);
    return this.storage.inMemoryCacheToCache(deserializedPersistentStorage);
  }
  async getAllAccounts(correlationId = new CryptoProvider().createNewGuid()) {
    this.logger.trace("getAllAccounts called", correlationId);
    let cacheContext;
    try {
      if (this.persistence)
        cacheContext = new TokenCacheContext(this, !1), await this.persistence.beforeCacheAccess(cacheContext);
      return this.storage.getAllAccounts({}, correlationId);
    } finally {
      if (this.persistence && cacheContext)
        await this.persistence.afterCacheAccess(cacheContext);
    }
  }
  async getAccountByHomeId(homeAccountId) {
    let allAccounts = await this.getAllAccounts();
    if (homeAccountId && allAccounts && allAccounts.length)
      return allAccounts.filter((accountObj) => accountObj.homeAccountId === homeAccountId)[0] || null;
    else
      return null;
  }
  async getAccountByLocalId(localAccountId) {
    let allAccounts = await this.getAllAccounts();
    if (localAccountId && allAccounts && allAccounts.length)
      return allAccounts.filter((accountObj) => accountObj.localAccountId === localAccountId)[0] || null;
    else
      return null;
  }
  async removeAccount(account, correlationId) {
    this.logger.trace("removeAccount called", correlationId || "");
    let cacheContext;
    try {
      if (this.persistence)
        cacheContext = new TokenCacheContext(this, !0), await this.persistence.beforeCacheAccess(cacheContext);
      this.storage.removeAccount(account, correlationId || new GuidGenerator().generateGuid());
    } finally {
      if (this.persistence && cacheContext)
        await this.persistence.afterCacheAccess(cacheContext);
    }
  }
  async overwriteCache() {
    if (!this.persistence) {
      this.logger.info("No persistence layer specified, cache cannot be overwritten", "");
      return;
    }
    this.logger.info("Overwriting in-memory cache with persistent cache", ""), this.storage.clear();
    let cacheContext = new TokenCacheContext(this, !1);
    await this.persistence.beforeCacheAccess(cacheContext);
    let cacheSnapshot = this.getCacheSnapshot();
    this.storage.setCache(cacheSnapshot), await this.persistence.afterCacheAccess(cacheContext);
  }
  handleChangeEvent() {
    this.cacheHasChanged = !0;
  }
  mergeState(oldState, currentState) {
    this.logger.trace("Merging in-memory cache with cache snapshot", "");
    let stateAfterRemoval = this.mergeRemovals(oldState, currentState);
    return this.mergeUpdates(stateAfterRemoval, currentState);
  }
  mergeUpdates(oldState, newState) {
    return Object.keys(newState).forEach((newKey) => {
      let newValue = newState[newKey];
      if (!oldState.hasOwnProperty(newKey)) {
        if (newValue !== null)
          oldState[newKey] = newValue;
      } else {
        let newValueNotNull = newValue !== null, newValueIsObject = typeof newValue === "object", newValueIsNotArray = !Array.isArray(newValue), oldStateNotUndefinedOrNull = typeof oldState[newKey] < "u" && oldState[newKey] !== null;
        if (newValueNotNull && newValueIsObject && newValueIsNotArray && oldStateNotUndefinedOrNull)
          this.mergeUpdates(oldState[newKey], newValue);
        else
          oldState[newKey] = newValue;
      }
    }), oldState;
  }
  mergeRemovals(oldState, newState) {
    this.logger.trace("Remove updated entries in cache", "");
    let accounts = oldState.Account ? this.mergeRemovalsDict(oldState.Account, newState.Account) : oldState.Account, accessTokens = oldState.AccessToken ? this.mergeRemovalsDict(oldState.AccessToken, newState.AccessToken) : oldState.AccessToken, refreshTokens = oldState.RefreshToken ? this.mergeRemovalsDict(oldState.RefreshToken, newState.RefreshToken) : oldState.RefreshToken, idTokens = oldState.IdToken ? this.mergeRemovalsDict(oldState.IdToken, newState.IdToken) : oldState.IdToken, appMetadata = oldState.AppMetadata ? this.mergeRemovalsDict(oldState.AppMetadata, newState.AppMetadata) : oldState.AppMetadata;
    return {
      ...oldState,
      Account: accounts,
      AccessToken: accessTokens,
      RefreshToken: refreshTokens,
      IdToken: idTokens,
      AppMetadata: appMetadata
    };
  }
  mergeRemovalsDict(oldState, newState) {
    let finalState = { ...oldState };
    return Object.keys(oldState).forEach((oldKey) => {
      if (!newState || !newState.hasOwnProperty(oldKey))
        delete finalState[oldKey];
    }), finalState;
  }
  overlayDefaults(passedInCache) {
    return this.logger.trace("Overlaying input cache with the default cache", ""), {
      Account: {
        ...defaultSerializedCache.Account,
        ...passedInCache.Account
      },
      IdToken: {
        ...defaultSerializedCache.IdToken,
        ...passedInCache.IdToken
      },
      AccessToken: {
        ...defaultSerializedCache.AccessToken,
        ...passedInCache.AccessToken
      },
      RefreshToken: {
        ...defaultSerializedCache.RefreshToken,
        ...passedInCache.RefreshToken
      },
      AppMetadata: {
        ...defaultSerializedCache.AppMetadata,
        ...passedInCache.AppMetadata
      }
    };
  }
}
