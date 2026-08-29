// var: require_Drop
var require_Drop = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DropAggregator = void 0;
  var types_1 = require_types3();

  class DropAggregator {
    kind = types_1.AggregatorKind.DROP;
    createAccumulation() {
      return;
    }
    merge(_previous, _delta) {
      return;
    }
    diff(_previous, _current) {
      return;
    }
    toMetricData(_descriptor, _aggregationTemporality, _accumulationByAttributes, _endTime) {
      return;
    }
  }
  exports.DropAggregator = DropAggregator;
});
