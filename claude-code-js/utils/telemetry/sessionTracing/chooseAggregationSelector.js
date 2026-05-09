// function: chooseAggregationSelector
function chooseAggregationSelector(config10) {
  return config10?.aggregationPreference ?? (() => DEFAULT_AGGREGATION);
}
