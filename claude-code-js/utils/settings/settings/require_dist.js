// var: require_dist
var require_dist = __commonJS((exports) => {
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
  }, __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Agent = void 0;
  var net = __importStar(__require("net")), http3 = __importStar(__require("http")), https_1 = __require("https");
  __exportStar(require_helpers(), exports);
  var INTERNAL = Symbol("AgentBaseInternalState");

  class Agent extends http3.Agent {
    constructor(opts) {
      super(opts);
      this[INTERNAL] = {};
    }
    isSecureEndpoint(options) {
      if (options) {
        if (typeof options.secureEndpoint === "boolean")
          return options.secureEndpoint;
        if (typeof options.protocol === "string")
          return options.protocol === "https:";
      }
      let { stack } = Error();
      if (typeof stack !== "string")
        return !1;
      return stack.split(`
`).some((l) => l.indexOf("(https.js:") !== -1 || l.indexOf("node:https:") !== -1);
    }
    incrementSockets(name) {
      if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0)
        return null;
      if (!this.sockets[name])
        this.sockets[name] = [];
      let fakeSocket = new net.Socket({ writable: !1 });
      return this.sockets[name].push(fakeSocket), this.totalSocketCount++, fakeSocket;
    }
    decrementSockets(name, socket) {
      if (!this.sockets[name] || socket === null)
        return;
      let sockets = this.sockets[name], index = sockets.indexOf(socket);
      if (index !== -1) {
        if (sockets.splice(index, 1), this.totalSocketCount--, sockets.length === 0)
          delete this.sockets[name];
      }
    }
    getName(options) {
      if (this.isSecureEndpoint(options))
        return https_1.Agent.prototype.getName.call(this, options);
      return super.getName(options);
    }
    createSocket(req, options, cb) {
      let connectOpts = {
        ...options,
        secureEndpoint: this.isSecureEndpoint(options)
      }, name = this.getName(connectOpts), fakeSocket = this.incrementSockets(name);
      Promise.resolve().then(() => this.connect(req, connectOpts)).then((socket) => {
        if (this.decrementSockets(name, fakeSocket), socket instanceof http3.Agent)
          try {
            return socket.addRequest(req, connectOpts);
          } catch (err) {
            return cb(err);
          }
        this[INTERNAL].currentSocket = socket, super.createSocket(req, options, cb);
      }, (err) => {
        this.decrementSockets(name, fakeSocket), cb(err);
      });
    }
    createConnection() {
      let socket = this[INTERNAL].currentSocket;
      if (this[INTERNAL].currentSocket = void 0, !socket)
        throw Error("No socket was returned in the `connect()` function");
      return socket;
    }
    get defaultPort() {
      return this[INTERNAL].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
    }
    set defaultPort(v) {
      if (this[INTERNAL])
        this[INTERNAL].defaultPort = v;
    }
    get protocol() {
      return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
    }
    set protocol(v) {
      if (this[INTERNAL])
        this[INTERNAL].protocol = v;
    }
  }
  exports.Agent = Agent;
});
