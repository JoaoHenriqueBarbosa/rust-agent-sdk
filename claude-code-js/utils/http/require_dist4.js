// var: require_dist4
var require_dist4 = __commonJS((exports) => {
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
  }, __importDefault2 = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.HttpProxyAgent = void 0;
  var net = __importStar2(__require("net")), tls = __importStar2(__require("tls")), debug_1 = __importDefault2(require_src()), events_1 = __require("events"), agent_base_1 = require_dist(), url_1 = __require("url"), debug = (0, debug_1.default)("http-proxy-agent");

  class HttpProxyAgent extends agent_base_1.Agent {
    constructor(proxy, opts) {
      super(opts);
      this.proxy = typeof proxy === "string" ? new url_1.URL(proxy) : proxy, this.proxyHeaders = opts?.headers ?? {}, debug("Creating new HttpProxyAgent instance: %o", this.proxy.href);
      let host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""), port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ...opts ? omit2(opts, "headers") : null,
        host,
        port
      };
    }
    addRequest(req, opts) {
      req._header = null, this.setRequestProps(req, opts), super.addRequest(req, opts);
    }
    setRequestProps(req, opts) {
      let { proxy } = this, protocol = opts.secureEndpoint ? "https:" : "http:", hostname2 = req.getHeader("host") || "localhost", base2 = `${protocol}//${hostname2}`, url3 = new url_1.URL(req.path, base2);
      if (opts.port !== 80)
        url3.port = String(opts.port);
      req.path = String(url3);
      let headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders };
      if (proxy.username || proxy.password) {
        let auth13 = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
        headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth13).toString("base64")}`;
      }
      if (!headers["Proxy-Connection"])
        headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let name3 of Object.keys(headers)) {
        let value = headers[name3];
        if (value)
          req.setHeader(name3, value);
      }
    }
    async connect(req, opts) {
      if (req._header = null, !req.path.includes("://"))
        this.setRequestProps(req, opts);
      let first, endOfHeaders;
      if (debug("Regenerating stored HTTP header string for request"), req._implicitHeader(), req.outputData && req.outputData.length > 0)
        debug("Patching connection write() output buffer with updated header"), first = req.outputData[0].data, endOfHeaders = first.indexOf(`\r
\r
`) + 4, req.outputData[0].data = req._header + first.substring(endOfHeaders), debug("Output buffer: %o", req.outputData[0].data);
      let socket;
      if (this.proxy.protocol === "https:")
        debug("Creating `tls.Socket`: %o", this.connectOpts), socket = tls.connect(this.connectOpts);
      else
        debug("Creating `net.Socket`: %o", this.connectOpts), socket = net.connect(this.connectOpts);
      return await (0, events_1.once)(socket, "connect"), socket;
    }
  }
  HttpProxyAgent.protocols = ["http", "https"];
  exports.HttpProxyAgent = HttpProxyAgent;
  function omit2(obj, ...keys2) {
    let ret = {}, key;
    for (key in obj)
      if (!keys2.includes(key))
        ret[key] = obj[key];
    return ret;
  }
});
