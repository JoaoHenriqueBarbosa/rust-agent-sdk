// function: getUserAgentValue
async function getUserAgentValue(prefix) {
  let runtimeInfo = /* @__PURE__ */ new Map;
  runtimeInfo.set("core-rest-pipeline", SDK_VERSION2), await setPlatformSpecificData(runtimeInfo);
  let defaultAgent = getUserAgentString(runtimeInfo);
  return prefix ? `${prefix} ${defaultAgent}` : defaultAgent;
}
