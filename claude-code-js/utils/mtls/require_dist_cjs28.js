// var: require_dist_cjs28
var require_dist_cjs28 = __commonJS((exports) => {
  var types3 = require_dist_cjs27(), getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
    return {
      setHttpHandler(handler) {
        runtimeConfig.httpHandler = handler;
      },
      httpHandler() {
        return runtimeConfig.httpHandler;
      },
      updateHttpClientConfig(key, value) {
        runtimeConfig.httpHandler?.updateHttpClientConfig(key, value);
      },
      httpHandlerConfigs() {
        return runtimeConfig.httpHandler.httpHandlerConfigs();
      }
    };
  }, resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
    return {
      httpHandler: httpHandlerExtensionConfiguration.httpHandler()
    };
  };

  class Field2 {
    name;
    kind;
    values;
    constructor({ name, kind = types3.FieldPosition.HEADER, values = [] }) {
      this.name = name, this.kind = kind, this.values = values;
    }
    add(value) {
      this.values.push(value);
    }
    set(values) {
      this.values = values;
    }
    remove(value) {
      this.values = this.values.filter((v) => v !== value);
    }
    toString() {
      return this.values.map((v) => v.includes(",") || v.includes(" ") ? `"${v}"` : v).join(", ");
    }
    get() {
      return this.values;
    }
  }

  class Fields2 {
    entries = {};
    encoding;
    constructor({ fields = [], encoding = "utf-8" }) {
      fields.forEach(this.setField.bind(this)), this.encoding = encoding;
    }
    setField(field) {
      this.entries[field.name.toLowerCase()] = field;
    }
    getField(name) {
      return this.entries[name.toLowerCase()];
    }
    removeField(name) {
      delete this.entries[name.toLowerCase()];
    }
    getByType(kind) {
      return Object.values(this.entries).filter((field) => field.kind === kind);
    }
  }

  class HttpRequest2 {
    method;
    protocol;
    hostname;
    port;
    path;
    query;
    headers;
    username;
    password;
    fragment;
    body;
    constructor(options) {
      this.method = options.method || "GET", this.hostname = options.hostname || "localhost", this.port = options.port, this.query = options.query || {}, this.headers = options.headers || {}, this.body = options.body, this.protocol = options.protocol ? options.protocol.slice(-1) !== ":" ? `${options.protocol}:` : options.protocol : "https:", this.path = options.path ? options.path.charAt(0) !== "/" ? `/${options.path}` : options.path : "/", this.username = options.username, this.password = options.password, this.fragment = options.fragment;
    }
    static clone(request2) {
      let cloned = new HttpRequest2({
        ...request2,
        headers: { ...request2.headers }
      });
      if (cloned.query)
        cloned.query = cloneQuery2(cloned.query);
      return cloned;
    }
    static isInstance(request2) {
      if (!request2)
        return !1;
      let req = request2;
      return "method" in req && "protocol" in req && "hostname" in req && "path" in req && typeof req.query === "object" && typeof req.headers === "object";
    }
    clone() {
      return HttpRequest2.clone(this);
    }
  }
  function cloneQuery2(query) {
    return Object.keys(query).reduce((carry, paramName) => {
      let param = query[paramName];
      return {
        ...carry,
        [paramName]: Array.isArray(param) ? [...param] : param
      };
    }, {});
  }

  class HttpResponse {
    statusCode;
    reason;
    headers;
    body;
    constructor(options) {
      this.statusCode = options.statusCode, this.reason = options.reason, this.headers = options.headers || {}, this.body = options.body;
    }
    static isInstance(response2) {
      if (!response2)
        return !1;
      let resp = response2;
      return typeof resp.statusCode === "number" && typeof resp.headers === "object";
    }
  }
  function isValidHostname2(hostname2) {
    return /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/.test(hostname2);
  }
  exports.Field = Field2;
  exports.Fields = Fields2;
  exports.HttpRequest = HttpRequest2;
  exports.HttpResponse = HttpResponse;
  exports.getHttpHandlerExtensionConfiguration = getHttpHandlerExtensionConfiguration;
  exports.isValidHostname = isValidHostname2;
  exports.resolveHttpHandlerRuntimeConfig = resolveHttpHandlerRuntimeConfig;
});
