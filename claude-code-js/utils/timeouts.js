// Original: src/utils/timeouts.ts
function getDefaultBashTimeoutMs(env5 = process.env) {
  let envValue = env5.BASH_DEFAULT_TIMEOUT_MS;
  if (envValue) {
    let parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0)
      return parsed;
  }
  return 120000;
}
function getMaxBashTimeoutMs(env5 = process.env) {
  let envValue = env5.BASH_MAX_TIMEOUT_MS;
  if (envValue) {
    let parsed = parseInt(envValue, 10);
    if (!isNaN(parsed) && parsed > 0)
      return Math.max(parsed, getDefaultBashTimeoutMs(env5));
  }
  return Math.max(600000, getDefaultBashTimeoutMs(env5));
}
