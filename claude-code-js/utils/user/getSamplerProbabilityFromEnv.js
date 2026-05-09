// function: getSamplerProbabilityFromEnv
function getSamplerProbabilityFromEnv() {
  let probability = import_core50.getNumberFromEnv("OTEL_TRACES_SAMPLER_ARG");
  if (probability == null)
    return import_api8.diag.error(`OTEL_TRACES_SAMPLER_ARG is blank, defaulting to ${DEFAULT_RATIO}.`), DEFAULT_RATIO;
  if (probability < 0 || probability > 1)
    return import_api8.diag.error(`OTEL_TRACES_SAMPLER_ARG=${probability} was given, but it is out of range ([0..1]), defaulting to ${DEFAULT_RATIO}.`), DEFAULT_RATIO;
  return probability;
}
