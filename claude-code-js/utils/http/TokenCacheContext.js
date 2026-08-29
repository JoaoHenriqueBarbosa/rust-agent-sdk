// class: TokenCacheContext
class TokenCacheContext {
  constructor(tokenCache, hasChanged) {
    this.cache = tokenCache, this.hasChanged = hasChanged;
  }
  get cacheHasChanged() {
    return this.hasChanged;
  }
  get tokenCache() {
    return this.cache;
  }
}
