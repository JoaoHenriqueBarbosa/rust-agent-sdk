// Original: src/services/analytics/firstPartyEventLogger.ts
var exports_firstPartyEventLogger = {};
__export(exports_firstPartyEventLogger, {
  shutdown1PEventLogging: () => shutdown1PEventLogging,
  shouldSampleEvent: () => shouldSampleEvent,
  reinitialize1PEventLoggingIfConfigChanged: () => reinitialize1PEventLoggingIfConfigChanged,
  logGrowthBookExperimentTo1P: () => logGrowthBookExperimentTo1P,
  logEventTo1P: () => logEventTo1P,
  is1PEventLoggingEnabled: () => is1PEventLoggingEnabled,
  initialize1PEventLogging: () => initialize1PEventLogging,
  getEventSamplingConfig: () => getEventSamplingConfig
});
function getEventSamplingConfig() {
  return {};
}
function shouldSampleEvent(_eventName) {
  return 0;
}
async function shutdown1PEventLogging() {}
function is1PEventLoggingEnabled() {
  return !1;
}
function logEventTo1P(_eventName, _metadata) {}
function logGrowthBookExperimentTo1P(_data) {}
function initialize1PEventLogging() {}
async function reinitialize1PEventLoggingIfConfigChanged() {}
