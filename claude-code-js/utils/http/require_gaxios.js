// var: require_gaxios
var require_gaxios = __commonJS((exports) => {
  var __createBinding2 = exports && exports.__createBinding || (Object.create ? function(o5, m4, k3, k22) {
    if (k22 === void 0)
      k22 = k3;
    var desc = Object.getOwnPropertyDescriptor(m4, k3);
    if (!desc || ("get" in desc ? !m4.__esModule : desc.writable || desc.configurable))
      desc = { enumerable: !0, get: function() {
        return m4[k3];
      } };
    Object.defineProperty(o5, k22, desc);
  } : function(o5, m4, k3, k22) {
    if (k22 === void 0)
      k22 = k3;
    o5[k22] = m4[k3];
  }), __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o5, v2) {
    Object.defineProperty(o5, "default", { enumerable: !0, value: v2 });
  } : function(o5, v2) {
    o5.default = v2;
  }), __importStar2 = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k3 in mod)
        if (k3 !== "default" && Object.prototype.hasOwnProperty.call(mod, k3))
          __createBinding2(result, mod, k3);
    }
    return __setModuleDefault(result, mod), result;
  }, __classPrivateFieldGet3 = exports && exports.__classPrivateFieldGet || function(receiver, state3, kind, f) {
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a getter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state3.get(receiver);
  }, __classPrivateFieldSet3 = exports && exports.__classPrivateFieldSet || function(receiver, state3, value, kind, f) {
    if (kind === "m")
      throw TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a setter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state3.set(receiver, value), value;
  }, __importDefault2 = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  }, _Gaxios_instances, _a2, _Gaxios_urlMayUseProxy, _Gaxios_applyRequestInterceptors, _Gaxios_applyResponseInterceptors, _Gaxios_prepareRequest, _Gaxios_proxyAgent, _Gaxios_getProxyAgent;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Gaxios = void 0;
  var extend_1 = __importDefault2(require_extend()), https_1 = __require("https"), node_fetch_1 = __importDefault2(__require("node-fetch")), querystring_1 = __importDefault2(__require("querystring")), is_stream_1 = __importDefault2(require_is_stream()), url_1 = __require("url"), common_1 = require_common2(), retry_1 = require_retry2(), stream_1 = __require("stream"), uuid_1 = require_dist5(), interceptor_1 = require_interceptor(), fetch2 = hasFetch() ? window.fetch : node_fetch_1.default;
  function hasWindow() {
    return typeof window < "u" && !!window;
  }
  function hasFetch() {
    return hasWindow() && !!window.fetch;
  }
  function hasBuffer() {
    return typeof Buffer < "u";
  }
  function hasHeader2(options, header) {
    return !!getHeader(options, header);
  }
  function getHeader(options, header) {
    header = header.toLowerCase();
    for (let key of Object.keys((options === null || options === void 0 ? void 0 : options.headers) || {}))
      if (header === key.toLowerCase())
        return options.headers[key];
    return;
  }

  class Gaxios {
    constructor(defaults2) {
      _Gaxios_instances.add(this), this.agentCache = /* @__PURE__ */ new Map, this.defaults = defaults2 || {}, this.interceptors = {
        request: new interceptor_1.GaxiosInterceptorManager,
        response: new interceptor_1.GaxiosInterceptorManager
      };
    }
    async request(opts = {}) {
      return opts = await __classPrivateFieldGet3(this, _Gaxios_instances, "m", _Gaxios_prepareRequest).call(this, opts), opts = await __classPrivateFieldGet3(this, _Gaxios_instances, "m", _Gaxios_applyRequestInterceptors).call(this, opts), __classPrivateFieldGet3(this, _Gaxios_instances, "m", _Gaxios_applyResponseInterceptors).call(this, this._request(opts));
    }
    async _defaultAdapter(opts) {
      let res = await (opts.fetchImplementation || fetch2)(opts.url, opts), data = await this.getResponseData(opts, res);
      return this.translateResponse(opts, res, data);
    }
    async _request(opts = {}) {
      var _b;
      try {
        let translatedResponse;
        if (opts.adapter)
          translatedResponse = await opts.adapter(opts, this._defaultAdapter.bind(this));
        else
          translatedResponse = await this._defaultAdapter(opts);
        if (!opts.validateStatus(translatedResponse.status)) {
          if (opts.responseType === "stream") {
            let response7 = "";
            await new Promise((resolve9) => {
              (translatedResponse === null || translatedResponse === void 0 ? void 0 : translatedResponse.data).on("data", (chunk) => {
                response7 += chunk;
              }), (translatedResponse === null || translatedResponse === void 0 ? void 0 : translatedResponse.data).on("end", resolve9);
            }), translatedResponse.data = response7;
          }
          throw new common_1.GaxiosError(`Request failed with status code ${translatedResponse.status}`, opts, translatedResponse);
        }
        return translatedResponse;
      } catch (e) {
        let err = e instanceof common_1.GaxiosError ? e : new common_1.GaxiosError(e.message, opts, void 0, e), { shouldRetry, config: config8 } = await (0, retry_1.getRetryConfig)(err);
        if (shouldRetry && config8)
          return err.config.retryConfig.currentRetryAttempt = config8.retryConfig.currentRetryAttempt, opts.retryConfig = (_b = err.config) === null || _b === void 0 ? void 0 : _b.retryConfig, this._request(opts);
        throw err;
      }
    }
    async getResponseData(opts, res) {
      switch (opts.responseType) {
        case "stream":
          return res.body;
        case "json": {
          let data = await res.text();
          try {
            data = JSON.parse(data);
          } catch (_b) {}
          return data;
        }
        case "arraybuffer":
          return res.arrayBuffer();
        case "blob":
          return res.blob();
        case "text":
          return res.text();
        default:
          return this.getResponseDataFromContentType(res);
      }
    }
    validateStatus(status) {
      return status >= 200 && status < 300;
    }
    paramsSerializer(params) {
      return querystring_1.default.stringify(params);
    }
    translateResponse(opts, res, data) {
      let headers = {};
      return res.headers.forEach((value, key) => {
        headers[key] = value;
      }), {
        config: opts,
        data,
        headers,
        status: res.status,
        statusText: res.statusText,
        request: {
          responseURL: res.url
        }
      };
    }
    async getResponseDataFromContentType(response7) {
      let contentType = response7.headers.get("Content-Type");
      if (contentType === null)
        return response7.text();
      if (contentType = contentType.toLowerCase(), contentType.includes("application/json")) {
        let data = await response7.text();
        try {
          data = JSON.parse(data);
        } catch (_b) {}
        return data;
      } else if (contentType.match(/^text\//))
        return response7.text();
      else
        return response7.blob();
    }
    async* getMultipartRequest(multipartOptions, boundary) {
      let finale = `--${boundary}--`;
      for (let currentPart of multipartOptions) {
        let partContentType = currentPart.headers["Content-Type"] || "application/octet-stream";
        if (yield `--${boundary}\r
Content-Type: ${partContentType}\r
\r
`, typeof currentPart.content === "string")
          yield currentPart.content;
        else
          yield* currentPart.content;
        yield `\r
`;
      }
      yield finale;
    }
  }
  exports.Gaxios = Gaxios;
  _a2 = Gaxios, _Gaxios_instances = /* @__PURE__ */ new WeakSet, _Gaxios_urlMayUseProxy = function(url3, noProxy = []) {
    var _b, _c;
    let candidate = new url_1.URL(url3), noProxyList = [...noProxy], noProxyEnvList = ((_c = (_b = process.env.NO_PROXY) !== null && _b !== void 0 ? _b : process.env.no_proxy) === null || _c === void 0 ? void 0 : _c.split(",")) || [];
    for (let rule of noProxyEnvList)
      noProxyList.push(rule.trim());
    for (let rule of noProxyList)
      if (rule instanceof RegExp) {
        if (rule.test(candidate.toString()))
          return !1;
      } else if (rule instanceof url_1.URL) {
        if (rule.origin === candidate.origin)
          return !1;
      } else if (rule.startsWith("*.") || rule.startsWith(".")) {
        let cleanedRule = rule.replace(/^\*\./, ".");
        if (candidate.hostname.endsWith(cleanedRule))
          return !1;
      } else if (rule === candidate.origin || rule === candidate.hostname || rule === candidate.href)
        return !1;
    return !0;
  }, _Gaxios_applyRequestInterceptors = async function(options) {
    let promiseChain = Promise.resolve(options);
    for (let interceptor of this.interceptors.request.values())
      if (interceptor)
        promiseChain = promiseChain.then(interceptor.resolved, interceptor.rejected);
    return promiseChain;
  }, _Gaxios_applyResponseInterceptors = async function(response7) {
    let promiseChain = Promise.resolve(response7);
    for (let interceptor of this.interceptors.response.values())
      if (interceptor)
        promiseChain = promiseChain.then(interceptor.resolved, interceptor.rejected);
    return promiseChain;
  }, _Gaxios_prepareRequest = async function(options) {
    var _b, _c, _d, _e;
    let opts = (0, extend_1.default)(!0, {}, this.defaults, options);
    if (!opts.url)
      throw Error("URL is required.");
    let baseUrl = opts.baseUrl || opts.baseURL;
    if (baseUrl)
      opts.url = baseUrl.toString() + opts.url;
    if (opts.paramsSerializer = opts.paramsSerializer || this.paramsSerializer, opts.params && Object.keys(opts.params).length > 0) {
      let additionalQueryParams = opts.paramsSerializer(opts.params);
      if (additionalQueryParams.startsWith("?"))
        additionalQueryParams = additionalQueryParams.slice(1);
      let prefix = opts.url.toString().includes("?") ? "&" : "?";
      opts.url = opts.url + prefix + additionalQueryParams;
    }
    if (typeof options.maxContentLength === "number")
      opts.size = options.maxContentLength;
    if (typeof options.maxRedirects === "number")
      opts.follow = options.maxRedirects;
    if (opts.headers = opts.headers || {}, opts.multipart === void 0 && opts.data) {
      let isFormData2 = typeof FormData > "u" ? !1 : (opts === null || opts === void 0 ? void 0 : opts.data) instanceof FormData;
      if (is_stream_1.default.readable(opts.data))
        opts.body = opts.data;
      else if (hasBuffer() && Buffer.isBuffer(opts.data)) {
        if (opts.body = opts.data, !hasHeader2(opts, "Content-Type"))
          opts.headers["Content-Type"] = "application/json";
      } else if (typeof opts.data === "object") {
        if (!isFormData2)
          if (getHeader(opts, "content-type") === "application/x-www-form-urlencoded")
            opts.body = opts.paramsSerializer(opts.data);
          else {
            if (!hasHeader2(opts, "Content-Type"))
              opts.headers["Content-Type"] = "application/json";
            opts.body = JSON.stringify(opts.data);
          }
      } else
        opts.body = opts.data;
    } else if (opts.multipart && opts.multipart.length > 0) {
      let boundary = (0, uuid_1.v4)();
      opts.headers["Content-Type"] = `multipart/related; boundary=${boundary}`;
      let bodyStream = new stream_1.PassThrough;
      opts.body = bodyStream, (0, stream_1.pipeline)(this.getMultipartRequest(opts.multipart, boundary), bodyStream, () => {});
    }
    if (opts.validateStatus = opts.validateStatus || this.validateStatus, opts.responseType = opts.responseType || "unknown", !opts.headers.Accept && opts.responseType === "json")
      opts.headers.Accept = "application/json";
    opts.method = opts.method || "GET";
    let proxy = opts.proxy || ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.HTTPS_PROXY) || ((_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.https_proxy) || ((_d = process === null || process === void 0 ? void 0 : process.env) === null || _d === void 0 ? void 0 : _d.HTTP_PROXY) || ((_e = process === null || process === void 0 ? void 0 : process.env) === null || _e === void 0 ? void 0 : _e.http_proxy), urlMayUseProxy = __classPrivateFieldGet3(this, _Gaxios_instances, "m", _Gaxios_urlMayUseProxy).call(this, opts.url, opts.noProxy);
    if (opts.agent)
      ;
    else if (proxy && urlMayUseProxy) {
      let HttpsProxyAgent3 = await __classPrivateFieldGet3(_a2, _a2, "m", _Gaxios_getProxyAgent).call(_a2);
      if (this.agentCache.has(proxy))
        opts.agent = this.agentCache.get(proxy);
      else
        opts.agent = new HttpsProxyAgent3(proxy, {
          cert: opts.cert,
          key: opts.key
        }), this.agentCache.set(proxy, opts.agent);
    } else if (opts.cert && opts.key)
      if (this.agentCache.has(opts.key))
        opts.agent = this.agentCache.get(opts.key);
      else
        opts.agent = new https_1.Agent({
          cert: opts.cert,
          key: opts.key
        }), this.agentCache.set(opts.key, opts.agent);
    if (typeof opts.errorRedactor !== "function" && opts.errorRedactor !== !1)
      opts.errorRedactor = common_1.defaultErrorRedactor;
    return opts;
  }, _Gaxios_getProxyAgent = async function() {
    return __classPrivateFieldSet3(this, _a2, __classPrivateFieldGet3(this, _a2, "f", _Gaxios_proxyAgent) || (await Promise.resolve().then(() => __importStar2(require_dist2()))).HttpsProxyAgent, "f", _Gaxios_proxyAgent), __classPrivateFieldGet3(this, _a2, "f", _Gaxios_proxyAgent);
  };
  _Gaxios_proxyAgent = { value: void 0 };
});
