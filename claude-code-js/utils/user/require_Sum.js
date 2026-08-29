// var: require_Sum
var require_Sum = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.SumAggregator = exports.SumAccumulation = void 0;
  var types_1 = require_types3(), MetricData_1 = require_MetricData();

  class SumAccumulation {
    startTime;
    monotonic;
    _current;
    reset;
    constructor(startTime, monotonic, current = 0, reset4 = !1) {
      this.startTime = startTime, this.monotonic = monotonic, this._current = current, this.reset = reset4;
    }
    record(value) {
      if (this.monotonic && value < 0)
        return;
      this._current += value;
    }
    setStartTime(startTime) {
      this.startTime = startTime;
    }
    toPointValue() {
      return this._current;
    }
  }
  exports.SumAccumulation = SumAccumulation;

  class SumAggregator {
    kind = types_1.AggregatorKind.SUM;
    monotonic;
    constructor(monotonic) {
      this.monotonic = monotonic;
    }
    createAccumulation(startTime) {
      return new SumAccumulation(startTime, this.monotonic);
    }
    merge(previous, delta) {
      let prevPv = previous.toPointValue(), deltaPv = delta.toPointValue();
      if (delta.reset)
        return new SumAccumulation(delta.startTime, this.monotonic, deltaPv, delta.reset);
      return new SumAccumulation(previous.startTime, this.monotonic, prevPv + deltaPv);
    }
    diff(previous, current) {
      let prevPv = previous.toPointValue(), currPv = current.toPointValue();
      if (this.monotonic && prevPv > currPv)
        return new SumAccumulation(current.startTime, this.monotonic, currPv, !0);
      return new SumAccumulation(current.startTime, this.monotonic, currPv - prevPv);
    }
    toMetricData(descriptor, aggregationTemporality, accumulationByAttributes, endTime) {
      return {
        descriptor,
        aggregationTemporality,
        dataPointType: MetricData_1.DataPointType.SUM,
        dataPoints: accumulationByAttributes.map(([attributes, accumulation]) => {
          return {
            attributes,
            startTime: accumulation.startTime,
            endTime,
            value: accumulation.toPointValue()
          };
        }),
        isMonotonic: this.monotonic
      };
    }
  }
  exports.SumAggregator = SumAggregator;
});
