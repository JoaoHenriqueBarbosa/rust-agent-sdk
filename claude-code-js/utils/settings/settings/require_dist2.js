// var: require_dist2
var require_dist2 = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o2, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable))
      desc = { enumerable: !0, get: function() {
        return m[k];
      } };
    Object.defineProperty(o2, k2, desc);
  } : function(o2, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o2[k2] = m[k];
  }), __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o2, v) {
    Object.defineProperty(o2, "default", { enumerable: !0, value: v });
  } : function(o2, v) {
    o2.default = v;
  }), __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    return __setModuleDefault(result, mod), result;
  }, __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.HttpsProxyAgent = void 0;
  var net = __importStar(__require("net")), tls = __importStar(__require("tls")), assert_1 = __importDefault(__require("assert")), debug_1 = __importDefault(require_src()), agent_base_1 = require_dist(), url_1 = __require("url"), parse_proxy_response_1 = require_parse_proxy_response(), debug = (0, debug_1.default)("https-proxy-agent"), setServernameFromNonIpHost = (options) => {
    if (options.servername === void 0 && options.host && !net.isIP(options.host))
      return {
        ...options,
        servername: options.host
      };
    return options;
  };

  class HttpsProxyAgent extends agent_base_1.Agent {
    constructor(proxy, opts) {
      super(opts);
      this.options = { path: void 0 }, this.proxy = typeof proxy === "string" ? new url_1.URL(proxy) : proxy, this.proxyHeaders = opts?.headers ?? {}, debug("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
      let host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""), port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
      this.connectOpts = {
        ALPNProtocols: ["http/1.1"],
        ...opts ? omit2(opts, "headers") : null,
        host,
        port
      };
    }
    async connect(req, opts) {
      let { proxy } = this;
      if (!opts.host)
        throw TypeError('No "host" provided');
      let socket;
      if (proxy.protocol === "https:")
        debug("Creating `tls.Socket`: %o", this.connectOpts), socket = tls.connect(setServernameFromNonIpHost(this.connectOpts));
      else
        debug("Creating `net.Socket`: %o", this.connectOpts), socket = net.connect(this.connectOpts);
      let headers = typeof this.proxyHeaders === "function" ? this.proxyHeaders() : { ...this.proxyHeaders }, host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host, payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r
`;
      if (proxy.username || proxy.password) {
        let auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
        headers["Proxy-Authorization"] = `Basic ${Buffer.from(auth).toString("base64")}`;
      }
      if (headers.Host = `${host}:${opts.port}`, !headers["Proxy-Connection"])
        headers["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close";
      for (let name of Object.keys(headers))
        payload += `${name}: ${headers[name]}\r
`;
      let proxyResponsePromise = (0, parse_proxy_response_1.parseProxyResponse)(socket);
      socket.write(`${payload}\r
`);
      let { connect, buffered } = await proxyResponsePromise;
      if (req.emit("proxyConnect", connect), this.emit("proxyConnect", connect, req), connect.statusCode === 200) {
        if (req.once("socket", resume), opts.secureEndpoint)
          return debug("Upgrading socket connection to TLS"), tls.connect({
            ...omit2(setServernameFromNonIpHost(opts), "host", "path", "port"),
            socket
          });
        return socket;
      }
      socket.destroy();
      let fakeSocket = new net.Socket({ writable: !1 });
      return fakeSocket.readable = !0, req.once("socket", (s) => {
        debug("Replaying proxy buffer for failed request"), (0, assert_1.default)(s.listenerCount("data") > 0), s.push(buffered), s.push(null);
      }), fakeSocket;
    }
  }
  HttpsProxyAgent.protocols = ["http", "https"];
  exports.HttpsProxyAgent = HttpsProxyAgent;
  function resume(socket) {
    socket.resume();
  }
  function omit2(obj, ...keys2) {
    let ret = {}, key;
    for (key in obj)
      if (!keys2.includes(key))
        ret[key] = obj[key];
    return ret;
  }
});
