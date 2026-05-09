// Original: src/services/mcp/oauthPort.ts
import { createServer as createServer3 } from "http";
function buildRedirectUri(port = REDIRECT_PORT_FALLBACK) {
  return `http://localhost:${port}/callback`;
}
function getMcpOAuthCallbackPort() {
  let port = parseInt(process.env.MCP_OAUTH_CALLBACK_PORT || "", 10);
  return port > 0 ? port : void 0;
}
async function findAvailablePort() {
  let configuredPort = getMcpOAuthCallbackPort();
  if (configuredPort)
    return configuredPort;
  let { min, max: max2 } = REDIRECT_PORT_RANGE, range = max2 - min + 1, maxAttempts = Math.min(range, 100);
  for (let attempt = 0;attempt < maxAttempts; attempt++) {
    let port = min + Math.floor(Math.random() * range);
    try {
      return await new Promise((resolve24, reject2) => {
        let testServer = createServer3();
        testServer.once("error", reject2), testServer.listen(port, () => {
          testServer.close(() => resolve24());
        });
      }), port;
    } catch {
      continue;
    }
  }
  try {
    return await new Promise((resolve24, reject2) => {
      let testServer = createServer3();
      testServer.once("error", reject2), testServer.listen(REDIRECT_PORT_FALLBACK, () => {
        testServer.close(() => resolve24());
      });
    }), REDIRECT_PORT_FALLBACK;
  } catch {
    throw Error("No available ports for OAuth redirect");
  }
}
var REDIRECT_PORT_RANGE, REDIRECT_PORT_FALLBACK = 3118;
var init_oauthPort = __esm(() => {
  init_platform();
  REDIRECT_PORT_RANGE = getPlatform() === "windows" ? { min: 39152, max: 49151 } : { min: 49152, max: 65535 };
});
