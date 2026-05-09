// function: isAnyTracingEnabled
function isAnyTracingEnabled() {
  return isEnhancedTelemetryEnabled() || isBetaTracingEnabled();
}
