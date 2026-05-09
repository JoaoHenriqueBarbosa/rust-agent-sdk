// Original: src/constants/product.ts
function isRemoteSessionStaging(sessionId, ingressUrl) {
  return sessionId?.includes("_staging_") === !0 || ingressUrl?.includes("staging") === !0;
}
function isRemoteSessionLocal(sessionId, ingressUrl) {
  return sessionId?.includes("_local_") === !0 || ingressUrl?.includes("localhost") === !0;
}
function getClaudeAiBaseUrl(sessionId, ingressUrl) {
  if (isRemoteSessionLocal(sessionId, ingressUrl))
    return "http://localhost:4000";
  if (isRemoteSessionStaging(sessionId, ingressUrl))
    return "https://claude-ai.staging.ant.dev";
  return "https://claude.ai";
}
function getRemoteSessionUrl(sessionId, ingressUrl) {
  return `${getClaudeAiBaseUrl(sessionId, ingressUrl)}/code/${sessionId}`;
}
var PRODUCT_URL = "https://claude.com/claude-code";
