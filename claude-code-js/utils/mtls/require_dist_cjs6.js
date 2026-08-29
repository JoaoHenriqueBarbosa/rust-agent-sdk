// var: require_dist_cjs6
var require_dist_cjs6 = __commonJS((exports) => {
  class ProviderError extends Error {
    name = "ProviderError";
    tryNextLink;
    constructor(message, options = !0) {
      let logger, tryNextLink = !0;
      if (typeof options === "boolean")
        logger = void 0, tryNextLink = options;
      else if (options != null && typeof options === "object")
        logger = options.logger, tryNextLink = options.tryNextLink ?? !0;
      super(message);
      this.tryNextLink = tryNextLink, Object.setPrototypeOf(this, ProviderError.prototype), logger?.debug?.(`@smithy/property-provider ${tryNextLink ? "->" : "(!)"} ${message}`);
    }
    static from(error41, options = !0) {
      return Object.assign(new this(error41.message, options), error41);
    }
  }

  class CredentialsProviderError extends ProviderError {
    name = "CredentialsProviderError";
    constructor(message, options = !0) {
      super(message, options);
      Object.setPrototypeOf(this, CredentialsProviderError.prototype);
    }
  }

  class TokenProviderError extends ProviderError {
    name = "TokenProviderError";
    constructor(message, options = !0) {
      super(message, options);
      Object.setPrototypeOf(this, TokenProviderError.prototype);
    }
  }
  var chain = (...providers) => async () => {
    if (providers.length === 0)
      throw new ProviderError("No providers in chain");
    let lastProviderError;
    for (let provider of providers)
      try {
        return await provider();
      } catch (err) {
        if (lastProviderError = err, err?.tryNextLink)
          continue;
        throw err;
      }
    throw lastProviderError;
  }, fromStatic = (staticValue) => () => Promise.resolve(staticValue), memoize2 = (provider, isExpired, requiresRefresh) => {
    let resolved, pending, hasResult, isConstant = !1, coalesceProvider = async () => {
      if (!pending)
        pending = provider();
      try {
        resolved = await pending, hasResult = !0, isConstant = !1;
      } finally {
        pending = void 0;
      }
      return resolved;
    };
    if (isExpired === void 0)
      return async (options) => {
        if (!hasResult || options?.forceRefresh)
          resolved = await coalesceProvider();
        return resolved;
      };
    return async (options) => {
      if (!hasResult || options?.forceRefresh)
        resolved = await coalesceProvider();
      if (isConstant)
        return resolved;
      if (requiresRefresh && !requiresRefresh(resolved))
        return isConstant = !0, resolved;
      if (isExpired(resolved))
        return await coalesceProvider(), resolved;
      return resolved;
    };
  };
  exports.CredentialsProviderError = CredentialsProviderError;
  exports.ProviderError = ProviderError;
  exports.TokenProviderError = TokenProviderError;
  exports.chain = chain;
  exports.fromStatic = fromStatic;
  exports.memoize = memoize2;
});
