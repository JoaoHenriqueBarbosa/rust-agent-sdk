// var: require_http_exporter_transport
var require_http_exporter_transport = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.createHttpExporterTransport = void 0;
  var http_transport_utils_1 = require_http_transport_utils();

  class HttpExporterTransport {
    _utils = null;
    _parameters;
    constructor(parameters) {
      this._parameters = parameters;
    }
    async send(data, timeoutMillis) {
      let { agent, request: request2 } = await this._loadUtils(), headers = await this._parameters.headers();
      return (0, http_transport_utils_1.sendWithHttp)(request2, this._parameters.url, headers, this._parameters.compression, this._parameters.userAgent, agent, data, timeoutMillis);
    }
    shutdown() {}
    async _loadUtils() {
      let utils = this._utils;
      if (utils === null) {
        let protocol = new URL(this._parameters.url).protocol, [agent, request2] = await Promise.all([
          this._parameters.agentFactory(protocol),
          requestFunctionFactory(protocol)
        ]);
        utils = this._utils = { agent, request: request2 };
      }
      return utils;
    }
  }
  async function requestFunctionFactory(protocol) {
    let module2 = protocol === "http:" ? import("http") : import("https"), { request: request2 } = await module2;
    return request2;
  }
  function createHttpExporterTransport(parameters) {
    return new HttpExporterTransport(parameters);
  }
  exports.createHttpExporterTransport = createHttpExporterTransport;
});
