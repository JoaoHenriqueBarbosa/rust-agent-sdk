// var: require_metrics_api
var require_metrics_api = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.metrics = void 0;
  var metrics_1 = require_metrics();
  exports.metrics = metrics_1.MetricsAPI.getInstance();
});
