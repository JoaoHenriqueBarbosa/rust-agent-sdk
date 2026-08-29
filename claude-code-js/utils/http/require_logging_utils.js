// var: require_logging_utils
var require_logging_utils = __commonJS((exports) => {
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
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.env = exports.DebugLogBackendBase = exports.placeholder = exports.AdhocDebugLogger = exports.LogSeverity = void 0;
  exports.getNodeBackend = getNodeBackend;
  exports.getDebugBackend = getDebugBackend;
  exports.getStructuredBackend = getStructuredBackend;
  exports.setBackend = setBackend;
  exports.log = log3;
  var node_events_1 = __require("events"), process21 = __importStar2(__require("process")), util10 = __importStar2(__require("util")), colours_1 = require_colours(), LogSeverity;
  (function(LogSeverity2) {
    LogSeverity2.DEFAULT = "DEFAULT", LogSeverity2.DEBUG = "DEBUG", LogSeverity2.INFO = "INFO", LogSeverity2.WARNING = "WARNING", LogSeverity2.ERROR = "ERROR";
  })(LogSeverity || (exports.LogSeverity = LogSeverity = {}));

  class AdhocDebugLogger extends node_events_1.EventEmitter {
    constructor(namespace, upstream) {
      super();
      this.namespace = namespace, this.upstream = upstream, this.func = Object.assign(this.invoke.bind(this), {
        instance: this,
        on: (event, listener) => this.on(event, listener)
      }), this.func.debug = (...args) => this.invokeSeverity(LogSeverity.DEBUG, ...args), this.func.info = (...args) => this.invokeSeverity(LogSeverity.INFO, ...args), this.func.warn = (...args) => this.invokeSeverity(LogSeverity.WARNING, ...args), this.func.error = (...args) => this.invokeSeverity(LogSeverity.ERROR, ...args), this.func.sublog = (namespace2) => log3(namespace2, this.func);
    }
    invoke(fields, ...args) {
      if (this.upstream)
        this.upstream(fields, ...args);
      this.emit("log", fields, args);
    }
    invokeSeverity(severity, ...args) {
      this.invoke({ severity }, ...args);
    }
  }
  exports.AdhocDebugLogger = AdhocDebugLogger;
  exports.placeholder = new AdhocDebugLogger("", () => {}).func;

  class DebugLogBackendBase {
    constructor() {
      var _a2;
      this.cached = /* @__PURE__ */ new Map, this.filters = [], this.filtersSet = !1;
      let nodeFlag = (_a2 = process21.env[exports.env.nodeEnables]) !== null && _a2 !== void 0 ? _a2 : "*";
      if (nodeFlag === "all")
        nodeFlag = "*";
      this.filters = nodeFlag.split(",");
    }
    log(namespace, fields, ...args) {
      try {
        if (!this.filtersSet)
          this.setFilters(), this.filtersSet = !0;
        let logger34 = this.cached.get(namespace);
        if (!logger34)
          logger34 = this.makeLogger(namespace), this.cached.set(namespace, logger34);
        logger34(fields, ...args);
      } catch (e) {
        console.error(e);
      }
    }
  }
  exports.DebugLogBackendBase = DebugLogBackendBase;

  class NodeBackend extends DebugLogBackendBase {
    constructor() {
      super(...arguments);
      this.enabledRegexp = /.*/g;
    }
    isEnabled(namespace) {
      return this.enabledRegexp.test(namespace);
    }
    makeLogger(namespace) {
      if (!this.enabledRegexp.test(namespace))
        return () => {};
      return (fields, ...args) => {
        var _a2;
        let nscolour = `${colours_1.Colours.green}${namespace}${colours_1.Colours.reset}`, pid = `${colours_1.Colours.yellow}${process21.pid}${colours_1.Colours.reset}`, level;
        switch (fields.severity) {
          case LogSeverity.ERROR:
            level = `${colours_1.Colours.red}${fields.severity}${colours_1.Colours.reset}`;
            break;
          case LogSeverity.INFO:
            level = `${colours_1.Colours.magenta}${fields.severity}${colours_1.Colours.reset}`;
            break;
          case LogSeverity.WARNING:
            level = `${colours_1.Colours.yellow}${fields.severity}${colours_1.Colours.reset}`;
            break;
          default:
            level = (_a2 = fields.severity) !== null && _a2 !== void 0 ? _a2 : LogSeverity.DEFAULT;
            break;
        }
        let msg = util10.formatWithOptions({ colors: colours_1.Colours.enabled }, ...args), filteredFields = Object.assign({}, fields);
        delete filteredFields.severity;
        let fieldsJson = Object.getOwnPropertyNames(filteredFields).length ? JSON.stringify(filteredFields) : "", fieldsColour = fieldsJson ? `${colours_1.Colours.grey}${fieldsJson}${colours_1.Colours.reset}` : "";
        console.error("%s [%s|%s] %s%s", pid, nscolour, level, msg, fieldsJson ? ` ${fieldsColour}` : "");
      };
    }
    setFilters() {
      let regexp = this.filters.join(",").replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^");
      this.enabledRegexp = new RegExp(`^${regexp}$`, "i");
    }
  }
  function getNodeBackend() {
    return new NodeBackend;
  }

  class DebugBackend extends DebugLogBackendBase {
    constructor(pkg) {
      super();
      this.debugPkg = pkg;
    }
    makeLogger(namespace) {
      let debugLogger = this.debugPkg(namespace);
      return (fields, ...args) => {
        debugLogger(args[0], ...args.slice(1));
      };
    }
    setFilters() {
      var _a2;
      let existingFilters = (_a2 = process21.env.NODE_DEBUG) !== null && _a2 !== void 0 ? _a2 : "";
      process21.env.NODE_DEBUG = `${existingFilters}${existingFilters ? "," : ""}${this.filters.join(",")}`;
    }
  }
  function getDebugBackend(debugPkg) {
    return new DebugBackend(debugPkg);
  }

  class StructuredBackend extends DebugLogBackendBase {
    constructor(upstream) {
      var _a2;
      super();
      this.upstream = (_a2 = upstream) !== null && _a2 !== void 0 ? _a2 : new NodeBackend;
    }
    makeLogger(namespace) {
      let debugLogger = this.upstream.makeLogger(namespace);
      return (fields, ...args) => {
        var _a2;
        let severity = (_a2 = fields.severity) !== null && _a2 !== void 0 ? _a2 : LogSeverity.INFO, json2 = Object.assign({
          severity,
          message: util10.format(...args)
        }, fields), jsonString = JSON.stringify(json2);
        debugLogger(fields, jsonString);
      };
    }
    setFilters() {
      this.upstream.setFilters();
    }
  }
  function getStructuredBackend(upstream) {
    return new StructuredBackend(upstream);
  }
  exports.env = {
    nodeEnables: "GOOGLE_SDK_NODE_LOGGING"
  };
  var loggerCache = /* @__PURE__ */ new Map, cachedBackend = void 0;
  function setBackend(backend) {
    cachedBackend = backend, loggerCache.clear();
  }
  function log3(namespace, parent) {
    if (!process21.env[exports.env.nodeEnables])
      return exports.placeholder;
    if (!namespace)
      return exports.placeholder;
    if (parent)
      namespace = `${parent.instance.namespace}:${namespace}`;
    let existing = loggerCache.get(namespace);
    if (existing)
      return existing.func;
    if (cachedBackend === null)
      return exports.placeholder;
    else if (cachedBackend === void 0)
      cachedBackend = getNodeBackend();
    let logger34 = (() => {
      let previousBackend = void 0;
      return new AdhocDebugLogger(namespace, (fields, ...args) => {
        if (previousBackend !== cachedBackend) {
          if (cachedBackend === null)
            return;
          else if (cachedBackend === void 0)
            cachedBackend = getNodeBackend();
          previousBackend = cachedBackend;
        }
        cachedBackend === null || cachedBackend === void 0 || cachedBackend.log(namespace, fields, ...args);
      });
    })();
    return loggerCache.set(namespace, logger34), logger34.func;
  }
});
