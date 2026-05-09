// var: require_View
var require_View = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.View = void 0;
  var Predicate_1 = require_Predicate(), AttributesProcessor_1 = require_AttributesProcessor(), InstrumentSelector_1 = require_InstrumentSelector(), MeterSelector_1 = require_MeterSelector(), AggregationOption_1 = require_AggregationOption();
  function isSelectorNotProvided(options2) {
    return options2.instrumentName == null && options2.instrumentType == null && options2.instrumentUnit == null && options2.meterName == null && options2.meterVersion == null && options2.meterSchemaUrl == null;
  }
  function validateViewOptions(viewOptions) {
    if (isSelectorNotProvided(viewOptions))
      throw Error("Cannot create view with no selector arguments supplied");
    if (viewOptions.name != null && (viewOptions?.instrumentName == null || Predicate_1.PatternPredicate.hasWildcard(viewOptions.instrumentName)))
      throw Error("Views with a specified name must be declared with an instrument selector that selects at most one instrument per meter.");
  }

  class View {
    name;
    description;
    aggregation;
    attributesProcessor;
    instrumentSelector;
    meterSelector;
    aggregationCardinalityLimit;
    constructor(viewOptions) {
      if (validateViewOptions(viewOptions), viewOptions.attributesProcessors != null)
        this.attributesProcessor = (0, AttributesProcessor_1.createMultiAttributesProcessor)(viewOptions.attributesProcessors);
      else
        this.attributesProcessor = (0, AttributesProcessor_1.createNoopAttributesProcessor)();
      this.name = viewOptions.name, this.description = viewOptions.description, this.aggregation = (0, AggregationOption_1.toAggregation)(viewOptions.aggregation ?? { type: AggregationOption_1.AggregationType.DEFAULT }), this.instrumentSelector = new InstrumentSelector_1.InstrumentSelector({
        name: viewOptions.instrumentName,
        type: viewOptions.instrumentType,
        unit: viewOptions.instrumentUnit
      }), this.meterSelector = new MeterSelector_1.MeterSelector({
        name: viewOptions.meterName,
        version: viewOptions.meterVersion,
        schemaUrl: viewOptions.meterSchemaUrl
      }), this.aggregationCardinalityLimit = viewOptions.aggregationCardinalityLimit;
    }
  }
  exports.View = View;
});
