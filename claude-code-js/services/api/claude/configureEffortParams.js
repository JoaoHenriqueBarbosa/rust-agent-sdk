// function: configureEffortParams
function configureEffortParams(effortValue, outputConfig, extraBodyParams, betas, model) {
  if (!modelSupportsEffort(model) || "effort" in outputConfig)
    return;
  if (effortValue === void 0)
    betas.push(EFFORT_BETA_HEADER);
  else if (typeof effortValue === "string")
    outputConfig.effort = effortValue, betas.push(EFFORT_BETA_HEADER);
}
