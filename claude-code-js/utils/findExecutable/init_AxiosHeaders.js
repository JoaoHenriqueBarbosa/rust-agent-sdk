// var: init_AxiosHeaders
var init_AxiosHeaders = __esm(() => {
  init_utils();
  init_parseHeaders();
  $internals = Symbol("internals");
  AxiosHeaders = class AxiosHeaders {
    constructor(headers) {
      headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
      let self2 = this;
      function setHeader(_value, _header, _rewrite) {
        let lHeader = normalizeHeader(_header);
        if (!lHeader)
          throw Error("header name must be a non-empty string");
        let key = utils_default.findKey(self2, lHeader);
        if (!key || self2[key] === void 0 || _rewrite === !0 || _rewrite === void 0 && self2[key] !== !1)
          self2[key || _header] = normalizeValue(_value);
      }
      let setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
      if (utils_default.isPlainObject(header) || header instanceof this.constructor)
        setHeaders(header, valueOrRewrite);
      else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header))
        setHeaders(parseHeaders_default(header), valueOrRewrite);
      else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
        let obj = {}, dest, key;
        for (let entry of header) {
          if (!utils_default.isArray(entry))
            throw TypeError("Object iterator must return a key-value pair");
          obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
        }
        setHeaders(obj, valueOrRewrite);
      } else
        header != null && setHeader(valueOrRewrite, header, rewrite);
      return this;
    }
    get(header, parser) {
      if (header = normalizeHeader(header), header) {
        let key = utils_default.findKey(this, header);
        if (key) {
          let value = this[key];
          if (!parser)
            return value;
          if (parser === !0)
            return parseTokens(value);
          if (utils_default.isFunction(parser))
            return parser.call(this, value, key);
          if (utils_default.isRegExp(parser))
            return parser.exec(value);
          throw TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(header, matcher) {
      if (header = normalizeHeader(header), header) {
        let key = utils_default.findKey(this, header);
        return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
      }
      return !1;
    }
    delete(header, matcher) {
      let self2 = this, deleted = !1;
      function deleteHeader(_header) {
        if (_header = normalizeHeader(_header), _header) {
          let key = utils_default.findKey(self2, _header);
          if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher)))
            delete self2[key], deleted = !0;
        }
      }
      if (utils_default.isArray(header))
        header.forEach(deleteHeader);
      else
        deleteHeader(header);
      return deleted;
    }
    clear(matcher) {
      let keys2 = Object.keys(this), i2 = keys2.length, deleted = !1;
      while (i2--) {
        let key = keys2[i2];
        if (!matcher || matchHeaderValue(this, this[key], key, matcher, !0))
          delete this[key], deleted = !0;
      }
      return deleted;
    }
    normalize(format3) {
      let self2 = this, headers = {};
      return utils_default.forEach(this, (value, header) => {
        let key = utils_default.findKey(headers, header);
        if (key) {
          self2[key] = normalizeValue(value), delete self2[header];
          return;
        }
        let normalized = format3 ? formatHeader(header) : String(header).trim();
        if (normalized !== header)
          delete self2[header];
        self2[normalized] = normalizeValue(value), headers[normalized] = !0;
      }), this;
    }
    concat(...targets) {
      return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
      let obj = Object.create(null);
      return utils_default.forEach(this, (value, header) => {
        value != null && value !== !1 && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
      }), obj;
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join(`
`);
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(thing) {
      return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
      let computed = new this(first);
      return targets.forEach((target) => computed.set(target)), computed;
    }
    static accessor(header) {
      let accessors = (this[$internals] = this[$internals] = {
        accessors: {}
      }).accessors, prototype2 = this.prototype;
      function defineAccessor(_header) {
        let lHeader = normalizeHeader(_header);
        if (!accessors[lHeader])
          buildAccessors(prototype2, _header), accessors[lHeader] = !0;
      }
      return utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header), this;
    }
  };
  AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
  ]);
  utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
    let mapped = key[0].toUpperCase() + key.slice(1);
    return {
      get: () => value,
      set(headerValue) {
        this[mapped] = headerValue;
      }
    };
  });
  utils_default.freezeMethods(AxiosHeaders);
  AxiosHeaders_default = AxiosHeaders;
});
