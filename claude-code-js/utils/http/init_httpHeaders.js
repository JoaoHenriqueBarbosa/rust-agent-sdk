// var: init_httpHeaders
var init_httpHeaders = __esm(() => {
  HttpHeadersImpl = class HttpHeadersImpl {
    _headersMap;
    constructor(rawHeaders) {
      if (this._headersMap = /* @__PURE__ */ new Map, rawHeaders)
        for (let headerName of Object.keys(rawHeaders))
          this.set(headerName, rawHeaders[headerName]);
    }
    set(name3, value) {
      this._headersMap.set(normalizeName(name3), { name: name3, value: String(value).trim() });
    }
    get(name3) {
      return this._headersMap.get(normalizeName(name3))?.value;
    }
    has(name3) {
      return this._headersMap.has(normalizeName(name3));
    }
    delete(name3) {
      this._headersMap.delete(normalizeName(name3));
    }
    toJSON(options = {}) {
      let result = {};
      if (options.preserveCase)
        for (let entry of this._headersMap.values())
          result[entry.name] = entry.value;
      else
        for (let [normalizedName, entry] of this._headersMap)
          result[normalizedName] = entry.value;
      return result;
    }
    toString() {
      return JSON.stringify(this.toJSON({ preserveCase: !0 }));
    }
    [Symbol.iterator]() {
      return headerIterator(this._headersMap);
    }
  };
});
