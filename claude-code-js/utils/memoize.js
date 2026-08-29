// Original: src/utils/memoize.ts
function memoizeWithTTLAsync(f, cacheLifetimeMs = 300000) {
  let cache = /* @__PURE__ */ new Map, inFlight = /* @__PURE__ */ new Map, memoized = async (...args) => {
    let key = jsonStringify(args), cached2 = cache.get(key), now = Date.now();
    if (!cached2) {
      let pending = inFlight.get(key);
      if (pending)
        return pending;
      let promise2 = f(...args);
      inFlight.set(key, promise2);
      try {
        let result = await promise2;
        if (inFlight.get(key) === promise2)
          cache.set(key, {
            value: result,
            timestamp: now,
            refreshing: !1
          });
        return result;
      } finally {
        if (inFlight.get(key) === promise2)
          inFlight.delete(key);
      }
    }
    if (cached2 && now - cached2.timestamp > cacheLifetimeMs && !cached2.refreshing) {
      cached2.refreshing = !0;
      let staleEntry = cached2;
      return f(...args).then((newValue) => {
        if (cache.get(key) === staleEntry)
          cache.set(key, {
            value: newValue,
            timestamp: Date.now(),
            refreshing: !1
          });
      }).catch((e) => {
        if (logError2(e), cache.get(key) === staleEntry)
          cache.delete(key);
      }), cached2.value;
    }
    return cache.get(key).value;
  };
  return memoized.cache = {
    clear: () => {
      cache.clear(), inFlight.clear();
    }
  }, memoized;
}
function memoizeWithLRU(f, cacheFn, maxCacheSize = 100) {
  let cache = new L({
    max: maxCacheSize
  }), memoized = (...args) => {
    let key = cacheFn(...args), cached2 = cache.get(key);
    if (cached2 !== void 0)
      return cached2;
    let result = f(...args);
    return cache.set(key, result), result;
  };
  return memoized.cache = {
    clear: () => cache.clear(),
    size: () => cache.size,
    delete: (key) => cache.delete(key),
    get: (key) => cache.peek(key),
    has: (key) => cache.has(key)
  }, memoized;
}
var init_memoize2 = __esm(() => {
  init_index_min();
  init_log3();
  init_slowOperations();
});
