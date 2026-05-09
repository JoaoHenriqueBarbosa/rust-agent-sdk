// var: require_exporter
var require_exporter = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports._export = void 0;
  var api_1 = require_src7(), suppress_tracing_1 = require_suppress_tracing();
  function _export(exporter, arg) {
    return new Promise((resolve26) => {
      api_1.context.with((0, suppress_tracing_1.suppressTracing)(api_1.context.active()), () => {
        exporter.export(arg, resolve26);
      });
    });
  }
  exports._export = _export;
});
