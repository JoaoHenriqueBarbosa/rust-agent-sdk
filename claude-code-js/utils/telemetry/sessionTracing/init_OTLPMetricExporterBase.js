// var: init_OTLPMetricExporterBase
var init_OTLPMetricExporterBase = __esm(() => {
  init_OTLPMetricExporterOptions();
  import_core58 = __toESM(require_src9(), 1), import_sdk_metrics2 = __toESM(require_src11(), 1), import_otlp_exporter_base = __toESM(require_src12(), 1), import_api11 = __toESM(require_src7(), 1);
  DEFAULT_AGGREGATION = Object.freeze({
    type: import_sdk_metrics2.AggregationType.DEFAULT
  });
  OTLPMetricExporterBase = class OTLPMetricExporterBase extends import_otlp_exporter_base.OTLPExporterBase {
    _aggregationTemporalitySelector;
    _aggregationSelector;
    constructor(delegate, config10) {
      super(delegate);
      this._aggregationSelector = chooseAggregationSelector(config10), this._aggregationTemporalitySelector = chooseTemporalitySelector(config10?.temporalityPreference);
    }
    selectAggregation(instrumentType) {
      return this._aggregationSelector(instrumentType);
    }
    selectAggregationTemporality(instrumentType) {
      return this._aggregationTemporalitySelector(instrumentType);
    }
  };
});
