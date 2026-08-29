// var: require_MetricData
var require_MetricData = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DataPointType = exports.InstrumentType = void 0;
  var InstrumentType;
  (function(InstrumentType2) {
    InstrumentType2.COUNTER = "COUNTER", InstrumentType2.GAUGE = "GAUGE", InstrumentType2.HISTOGRAM = "HISTOGRAM", InstrumentType2.UP_DOWN_COUNTER = "UP_DOWN_COUNTER", InstrumentType2.OBSERVABLE_COUNTER = "OBSERVABLE_COUNTER", InstrumentType2.OBSERVABLE_GAUGE = "OBSERVABLE_GAUGE", InstrumentType2.OBSERVABLE_UP_DOWN_COUNTER = "OBSERVABLE_UP_DOWN_COUNTER";
  })(InstrumentType = exports.InstrumentType || (exports.InstrumentType = {}));
  var DataPointType;
  (function(DataPointType2) {
    DataPointType2[DataPointType2.HISTOGRAM = 0] = "HISTOGRAM", DataPointType2[DataPointType2.EXPONENTIAL_HISTOGRAM = 1] = "EXPONENTIAL_HISTOGRAM", DataPointType2[DataPointType2.GAUGE = 2] = "GAUGE", DataPointType2[DataPointType2.SUM = 3] = "SUM";
  })(DataPointType = exports.DataPointType || (exports.DataPointType = {}));
});
