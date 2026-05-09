// Original: src/utils/sessionEnvVars.ts
function getSessionEnvVars() {
  return sessionEnvVars;
}
function clearSessionEnvVars() {
  sessionEnvVars.clear();
}
var sessionEnvVars;
var init_sessionEnvVars = __esm(() => {
  sessionEnvVars = /* @__PURE__ */ new Map;
});
