// var: require_baggage_impl
var require_baggage_impl = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.BaggageImpl = void 0;

  class BaggageImpl {
    constructor(entries) {
      this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map;
    }
    getEntry(key2) {
      let entry = this._entries.get(key2);
      if (!entry)
        return;
      return Object.assign({}, entry);
    }
    getAllEntries() {
      return Array.from(this._entries.entries());
    }
    setEntry(key2, entry) {
      let newBaggage = new BaggageImpl(this._entries);
      return newBaggage._entries.set(key2, entry), newBaggage;
    }
    removeEntry(key2) {
      let newBaggage = new BaggageImpl(this._entries);
      return newBaggage._entries.delete(key2), newBaggage;
    }
    removeEntries(...keys2) {
      let newBaggage = new BaggageImpl(this._entries);
      for (let key2 of keys2)
        newBaggage._entries.delete(key2);
      return newBaggage;
    }
    clear() {
      return new BaggageImpl;
    }
  }
  exports.BaggageImpl = BaggageImpl;
});
