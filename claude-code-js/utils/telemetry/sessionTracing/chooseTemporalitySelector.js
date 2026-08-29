// function: chooseTemporalitySelector
function chooseTemporalitySelector(temporalityPreference) {
  if (temporalityPreference != null) {
    if (temporalityPreference === AggregationTemporalityPreference.DELTA)
      return DeltaTemporalitySelector;
    else if (temporalityPreference === AggregationTemporalityPreference.LOWMEMORY)
      return LowMemoryTemporalitySelector;
    return CumulativeTemporalitySelector;
  }
  return chooseTemporalitySelectorFromEnvironment();
}
