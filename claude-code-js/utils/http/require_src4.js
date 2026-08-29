// var: require_src4
var require_src4 = __commonJS((exports) => {
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
  }), __exportStar2 = exports && exports.__exportStar || function(m4, exports2) {
    for (var p4 in m4)
      if (p4 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p4))
        __createBinding2(exports2, m4, p4);
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.gcpResidencyCache = exports.METADATA_SERVER_DETECTION = exports.HEADERS = exports.HEADER_VALUE = exports.HEADER_NAME = exports.SECONDARY_HOST_ADDRESS = exports.HOST_ADDRESS = exports.BASE_PATH = void 0;
  exports.instance = instance;
  exports.project = project;
  exports.universe = universe;
  exports.bulk = bulk;
  exports.isAvailable = isAvailable;
  exports.resetIsAvailableCache = resetIsAvailableCache;
  exports.getGCPResidency = getGCPResidency;
  exports.setGCPResidency = setGCPResidency;
  exports.requestTimeout = requestTimeout;
  var gaxios_1 = require_src2(), jsonBigint = require_json_bigint(), gcp_residency_1 = require_gcp_residency(), logger34 = require_src3();
  exports.BASE_PATH = "/computeMetadata/v1";
  exports.HOST_ADDRESS = "http://169.254.169.254";
  exports.SECONDARY_HOST_ADDRESS = "http://metadata.google.internal.";
  exports.HEADER_NAME = "Metadata-Flavor";
  exports.HEADER_VALUE = "Google";
  exports.HEADERS = Object.freeze({ [exports.HEADER_NAME]: exports.HEADER_VALUE });
  var log3 = logger34.log("gcp metadata");
  exports.METADATA_SERVER_DETECTION = Object.freeze({
    "assume-present": "don't try to ping the metadata server, but assume it's present",
    none: "don't try to ping the metadata server, but don't try to use it either",
    "bios-only": "treat the result of a BIOS probe as canonical (don't fall back to pinging)",
    "ping-only": "skip the BIOS probe, and go straight to pinging"
  });
  function getBaseUrl(baseUrl) {
    if (!baseUrl)
      baseUrl = process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST || exports.HOST_ADDRESS;
    if (!/^https?:\/\//.test(baseUrl))
      baseUrl = `http://${baseUrl}`;
    return new URL(exports.BASE_PATH, baseUrl).href;
  }
  function validate3(options) {
    Object.keys(options).forEach((key) => {
      switch (key) {
        case "params":
        case "property":
        case "headers":
          break;
        case "qs":
          throw Error("'qs' is not a valid configuration option. Please use 'params' instead.");
        default:
          throw Error(`'${key}' is not a valid configuration option.`);
      }
    });
  }
  async function metadataAccessor(type, options = {}, noResponseRetries = 3, fastFail = !1) {
    let metadataKey = "", params = {}, headers = {};
    if (typeof type === "object") {
      let metadataAccessor2 = type;
      metadataKey = metadataAccessor2.metadataKey, params = metadataAccessor2.params || params, headers = metadataAccessor2.headers || headers, noResponseRetries = metadataAccessor2.noResponseRetries || noResponseRetries, fastFail = metadataAccessor2.fastFail || fastFail;
    } else
      metadataKey = type;
    if (typeof options === "string")
      metadataKey += `/${options}`;
    else {
      if (validate3(options), options.property)
        metadataKey += `/${options.property}`;
      headers = options.headers || headers, params = options.params || params;
    }
    let requestMethod = fastFail ? fastFailMetadataRequest : gaxios_1.request, req = {
      url: `${getBaseUrl()}/${metadataKey}`,
      headers: { ...exports.HEADERS, ...headers },
      retryConfig: { noResponseRetries },
      params,
      responseType: "text",
      timeout: requestTimeout()
    };
    log3.info("instance request %j", req);
    let res = await requestMethod(req);
    if (log3.info("instance metadata is %s", res.data), res.headers[exports.HEADER_NAME.toLowerCase()] !== exports.HEADER_VALUE)
      throw Error(`Invalid response from metadata service: incorrect ${exports.HEADER_NAME} header. Expected '${exports.HEADER_VALUE}', got ${res.headers[exports.HEADER_NAME.toLowerCase()] ? `'${res.headers[exports.HEADER_NAME.toLowerCase()]}'` : "no header"}`);
    if (typeof res.data === "string")
      try {
        return jsonBigint.parse(res.data);
      } catch (_a2) {}
    return res.data;
  }
  async function fastFailMetadataRequest(options) {
    var _a2;
    let secondaryOptions = {
      ...options,
      url: (_a2 = options.url) === null || _a2 === void 0 ? void 0 : _a2.toString().replace(getBaseUrl(), getBaseUrl(exports.SECONDARY_HOST_ADDRESS))
    }, responded = !1, r1 = (0, gaxios_1.request)(options).then((res) => {
      return responded = !0, res;
    }).catch((err) => {
      if (responded)
        return r22;
      else
        throw responded = !0, err;
    }), r22 = (0, gaxios_1.request)(secondaryOptions).then((res) => {
      return responded = !0, res;
    }).catch((err) => {
      if (responded)
        return r1;
      else
        throw responded = !0, err;
    });
    return Promise.race([r1, r22]);
  }
  function instance(options) {
    return metadataAccessor("instance", options);
  }
  function project(options) {
    return metadataAccessor("project", options);
  }
  function universe(options) {
    return metadataAccessor("universe", options);
  }
  async function bulk(properties) {
    let r4 = {};
    return await Promise.all(properties.map((item) => {
      return (async () => {
        let res = await metadataAccessor(item), key = item.metadataKey;
        r4[key] = res;
      })();
    })), r4;
  }
  function detectGCPAvailableRetries() {
    return process.env.DETECT_GCP_RETRIES ? Number(process.env.DETECT_GCP_RETRIES) : 0;
  }
  var cachedIsAvailableResponse;
  async function isAvailable() {
    if (process.env.METADATA_SERVER_DETECTION) {
      let value = process.env.METADATA_SERVER_DETECTION.trim().toLocaleLowerCase();
      if (!(value in exports.METADATA_SERVER_DETECTION))
        throw RangeError(`Unknown \`METADATA_SERVER_DETECTION\` env variable. Got \`${value}\`, but it should be \`${Object.keys(exports.METADATA_SERVER_DETECTION).join("`, `")}\`, or unset`);
      switch (value) {
        case "assume-present":
          return !0;
        case "none":
          return !1;
        case "bios-only":
          return getGCPResidency();
        case "ping-only":
      }
    }
    try {
      if (cachedIsAvailableResponse === void 0)
        cachedIsAvailableResponse = metadataAccessor("instance", void 0, detectGCPAvailableRetries(), !(process.env.GCE_METADATA_IP || process.env.GCE_METADATA_HOST));
      return await cachedIsAvailableResponse, !0;
    } catch (e) {
      let err = e;
      if (process.env.DEBUG_AUTH)
        console.info(err);
      if (err.type === "request-timeout")
        return !1;
      if (err.response && err.response.status === 404)
        return !1;
      else {
        if (!(err.response && err.response.status === 404) && (!err.code || ![
          "EHOSTDOWN",
          "EHOSTUNREACH",
          "ENETUNREACH",
          "ENOENT",
          "ENOTFOUND",
          "ECONNREFUSED"
        ].includes(err.code))) {
          let code = "UNKNOWN";
          if (err.code)
            code = err.code;
          process.emitWarning(`received unexpected error = ${err.message} code = ${code}`, "MetadataLookupWarning");
        }
        return !1;
      }
    }
  }
  function resetIsAvailableCache() {
    cachedIsAvailableResponse = void 0;
  }
  exports.gcpResidencyCache = null;
  function getGCPResidency() {
    if (exports.gcpResidencyCache === null)
      setGCPResidency();
    return exports.gcpResidencyCache;
  }
  function setGCPResidency(value = null) {
    exports.gcpResidencyCache = value !== null ? value : (0, gcp_residency_1.detectGCPResidency)();
  }
  function requestTimeout() {
    return getGCPResidency() ? 0 : 3000;
  }
  __exportStar2(require_gcp_residency(), exports);
});
