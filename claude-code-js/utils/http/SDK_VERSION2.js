// var: SDK_VERSION2
var SDK_VERSION2 = "1.22.3", DEFAULT_RETRY_POLICY_COUNT2 = 3;

// node_modules/@azure/core-rest-pipeline/dist/esm/util/userAgent.js
function getUserAgentString(telemetryInfo) {
  let parts = [];
  for (let [key, value] of telemetryInfo) {
    let token = value ? `${key}/${value}` : key;
    parts.push(token);
  }
  return parts.join(" ");
}
