// function: chooseTemporalitySelectorFromEnvironment
function chooseTemporalitySelectorFromEnvironment() {
  let configuredTemporality = (import_core58.getStringFromEnv("OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE") ?? "cumulative").toLowerCase();
  if (configuredTemporality === "cumulative")
    return CumulativeTemporalitySelector;
  if (configuredTemporality === "delta")
    return DeltaTemporalitySelector;
  if (configuredTemporality === "lowmemory")
    return LowMemoryTemporalitySelector;
  return import_api11.diag.warn(`OTEL_EXPORTER_OTLP_METRICS_TEMPORALITY_PREFERENCE is set to '${configuredTemporality}', but only 'cumulative' and 'delta' are allowed. Using default ('cumulative') instead.`), CumulativeTemporalitySelector;
}
