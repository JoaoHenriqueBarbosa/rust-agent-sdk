// var: require_NoopMeterProvider
var require_NoopMeterProvider = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NOOP_METER_PROVIDER = exports.NoopMeterProvider = void 0;
  var NoopMeter_1 = require_NoopMeter();

  class NoopMeterProvider {
    getMeter(_name, _version, _options) {
      return NoopMeter_1.NOOP_METER;
    }
  }
  exports.NoopMeterProvider = NoopMeterProvider;
  exports.NOOP_METER_PROVIDER = new NoopMeterProvider;
});
