// var: require_util2
var require_util2 = __commonJS((exports) => {
  var __classPrivateFieldGet3 = exports && exports.__classPrivateFieldGet || function(receiver, state3, kind, f) {
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a getter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state3.get(receiver);
  }, _LRUCache_instances, _LRUCache_cache, _LRUCache_moveToEnd, _LRUCache_evict;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.LRUCache = void 0;
  exports.snakeToCamel = snakeToCamel;
  exports.originalOrCamelOptions = originalOrCamelOptions;
  function snakeToCamel(str) {
    return str.replace(/([_][^_])/g, (match) => match.slice(1).toUpperCase());
  }
  function originalOrCamelOptions(obj) {
    function get2(key) {
      var _a2;
      let o5 = obj || {};
      return (_a2 = o5[key]) !== null && _a2 !== void 0 ? _a2 : o5[snakeToCamel(key)];
    }
    return { get: get2 };
  }

  class LRUCache {
    constructor(options) {
      _LRUCache_instances.add(this), _LRUCache_cache.set(this, /* @__PURE__ */ new Map), this.capacity = options.capacity, this.maxAge = options.maxAge;
    }
    set(key, value) {
      __classPrivateFieldGet3(this, _LRUCache_instances, "m", _LRUCache_moveToEnd).call(this, key, value), __classPrivateFieldGet3(this, _LRUCache_instances, "m", _LRUCache_evict).call(this);
    }
    get(key) {
      let item = __classPrivateFieldGet3(this, _LRUCache_cache, "f").get(key);
      if (!item)
        return;
      return __classPrivateFieldGet3(this, _LRUCache_instances, "m", _LRUCache_moveToEnd).call(this, key, item.value), __classPrivateFieldGet3(this, _LRUCache_instances, "m", _LRUCache_evict).call(this), item.value;
    }
  }
  exports.LRUCache = LRUCache;
  _LRUCache_cache = /* @__PURE__ */ new WeakMap, _LRUCache_instances = /* @__PURE__ */ new WeakSet, _LRUCache_moveToEnd = function(key, value) {
    __classPrivateFieldGet3(this, _LRUCache_cache, "f").delete(key), __classPrivateFieldGet3(this, _LRUCache_cache, "f").set(key, {
      value,
      lastAccessed: Date.now()
    });
  }, _LRUCache_evict = function() {
    let cutoffDate = this.maxAge ? Date.now() - this.maxAge : 0, oldestItem = __classPrivateFieldGet3(this, _LRUCache_cache, "f").entries().next();
    while (!oldestItem.done && (__classPrivateFieldGet3(this, _LRUCache_cache, "f").size > this.capacity || oldestItem.value[1].lastAccessed < cutoffDate))
      __classPrivateFieldGet3(this, _LRUCache_cache, "f").delete(oldestItem.value[0]), oldestItem = __classPrivateFieldGet3(this, _LRUCache_cache, "f").entries().next();
  };
});
