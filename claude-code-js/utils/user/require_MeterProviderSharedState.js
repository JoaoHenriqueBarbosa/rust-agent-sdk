// var: require_MeterProviderSharedState
var require_MeterProviderSharedState = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.MeterProviderSharedState = void 0;
  var utils_1 = require_utils11(), ViewRegistry_1 = require_ViewRegistry(), MeterSharedState_1 = require_MeterSharedState(), AggregationOption_1 = require_AggregationOption();

  class MeterProviderSharedState {
    viewRegistry = new ViewRegistry_1.ViewRegistry;
    metricCollectors = [];
    meterSharedStates = /* @__PURE__ */ new Map;
    resource;
    constructor(resource) {
      this.resource = resource;
    }
    getMeterSharedState(instrumentationScope) {
      let id = (0, utils_1.instrumentationScopeId)(instrumentationScope), meterSharedState = this.meterSharedStates.get(id);
      if (meterSharedState == null)
        meterSharedState = new MeterSharedState_1.MeterSharedState(this, instrumentationScope), this.meterSharedStates.set(id, meterSharedState);
      return meterSharedState;
    }
    selectAggregations(instrumentType) {
      let result = [];
      for (let collector of this.metricCollectors)
        result.push([
          collector,
          (0, AggregationOption_1.toAggregation)(collector.selectAggregation(instrumentType))
        ]);
      return result;
    }
  }
  exports.MeterProviderSharedState = MeterProviderSharedState;
});
