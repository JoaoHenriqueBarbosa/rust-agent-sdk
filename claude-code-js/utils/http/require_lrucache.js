// var: require_lrucache
var require_lrucache = __commonJS((exports, module) => {
  class LRUCache {
    constructor() {
      this.max = 1000, this.map = /* @__PURE__ */ new Map;
    }
    get(key) {
      let value = this.map.get(key);
      if (value === void 0)
        return;
      else
        return this.map.delete(key), this.map.set(key, value), value;
    }
    delete(key) {
      return this.map.delete(key);
    }
    set(key, value) {
      if (!this.delete(key) && value !== void 0) {
        if (this.map.size >= this.max) {
          let firstKey = this.map.keys().next().value;
          this.delete(firstKey);
        }
        this.map.set(key, value);
      }
      return this;
    }
  }
  module.exports = LRUCache;
});
