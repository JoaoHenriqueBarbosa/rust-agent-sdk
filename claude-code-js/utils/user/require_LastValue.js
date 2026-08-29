// var: require_LastValue
var require_LastValue = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.LastValueAggregator = exports.LastValueAccumulation = void 0;
  var types_1 = require_types3(), core_1 = require_src9(), MetricData_1 = require_MetricData();

  class LastValueAccumulation {
    startTime;
    _current;
    sampleTime;
    constructor(startTime, current = 0, sampleTime = [0, 0]) {
      this.startTime = startTime, this._current = current, this.sampleTime = sampleTime;
    }
    record(value) {
      this._current = value, this.sampleTime = (0, core_1.millisToHrTime)(Date.now());
    }
    setStartTime(startTime) {
      this.startTime = startTime;
    }
    toPointValue() {
      return this._current;
    }
  }
  exports.LastValueAccumulation = LastValueAccumulation;

  class LastValueAggregator {
    kind = types_1.AggregatorKind.LAST_VALUE;
    createAccumulation(startTime) {
      return new LastValueAccumulation(startTime);
    }
    merge(previous, delta) {
      let latestAccumulation = (0, core_1.hrTimeToMicroseconds)(delta.sampleTime) >= (0, core_1.hrTimeToMicroseconds)(previous.sampleTime) ? delta : previous;
      return new LastValueAccumulation(previous.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
    }
    diff(previous, current) {
      let latestAccumulation = (0, core_1.hrTimeToMicroseconds)(current.sampleTime) >= (0, core_1.hrTimeToMicroseconds)(previous.sampleTime) ? current : previous;
      return new LastValueAccumulation(current.startTime, latestAccumulation.toPointValue(), latestAccumulation.sampleTime);
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
      return {
        descriptor,
        aggregationTemporality,
        dataPointType: MetricData_1.DataPointType.GAUGE,
        dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
          return {
            attributes,
            startTime: accumulation.startTime,
            endTime,
            value: accumulation.toPointValue()
          };
        })
      };
    }
  }
  exports.LastValueAggregator = LastValueAggregator;
});
