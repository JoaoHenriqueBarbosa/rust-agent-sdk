// var: require_HashMap
var require_HashMap = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AttributeHashMap = exports.HashMap = void 0;
  var utils_1 = require_utils11();

  class HashMap {
    _valueMap = /* @__PURE__ */ new Map;
    _keyMap = /* @__PURE__ */ new Map;
    _hash;
    constructor(hash) {
      this._hash = hash;
    }
    get(key2, hashCode) {
      return hashCode ??= this._hash(key2), this._valueMap.get(hashCode);
    }
    getOrDefault(key2, defaultFactory) {
      let hash = this._hash(key2);
      if (this._valueMap.has(hash))
        return this._valueMap.get(hash);
      let val = defaultFactory();
      if (!this._keyMap.has(hash))
        this._keyMap.set(hash, key2);
      return this._valueMap.set(hash, val), val;
    }
    set(key2, value, hashCode) {
      if (hashCode ??= this._hash(key2), !this._keyMap.has(hashCode))
        this._keyMap.set(hashCode, key2);
      this._valueMap.set(hashCode, value);
    }
    has(key2, hashCode) {
      return hashCode ??= this._hash(key2), this._valueMap.has(hashCode);
    }
    *keys() {
      let keyIterator = this._keyMap.entries(), next = keyIterator.next();
      while (next.done !== !0)
        yield [next.value[1], next.value[0]], next = keyIterator.next();
    }
    *entries() {
      let valueIterator = this._valueMap.entries(), next = valueIterator.next();
      while (next.done !== !0)
        yield [this._keyMap.get(next.value[0]), next.value[1], next.value[0]], next = valueIterator.next();
    }
    get size() {
      return this._valueMap.size;
    }
  }
  exports.HashMap = HashMap;

  class AttributeHashMap extends HashMap {
    constructor() {
      super(utils_1.hashAttributes);
    }
  }
  exports.AttributeHashMap = AttributeHashMap;
});
