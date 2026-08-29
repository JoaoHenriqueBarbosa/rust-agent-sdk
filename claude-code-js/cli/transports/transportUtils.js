// Original: src/cli/transports/transportUtils.ts
import { URL as URL4 } from "url";
function getTransportForUrl(url3, headers = {}, sessionId, refreshHeaders) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_CCR_V2)) {
    let sseUrl = new URL4(url3.href);
    if (sseUrl.protocol === "wss:")
      sseUrl.protocol = "https:";
    else if (sseUrl.protocol === "ws:")
      sseUrl.protocol = "http:";
    return sseUrl.pathname = sseUrl.pathname.replace(/\/$/, "") + "/worker/events/stream", new SSETransport(sseUrl, headers, sessionId, refreshHeaders);
  }
  if (url3.protocol === "ws:" || url3.protocol === "wss:") {
    if (isEnvTruthy(process.env.CLAUDE_CODE_POST_FOR_SESSION_INGRESS_V2))
      return new HybridTransport(url3, headers, sessionId, refreshHeaders);
    return new WebSocketTransport2(url3, headers, sessionId, refreshHeaders);
  } else
    throw Error(`Unsupported protocol: ${url3.protocol}`);
}
var init_transportUtils = __esm(() => {
  init_envUtils();
  init_HybridTransport();
  init_SSETransport();
  init_WebSocketTransport();
});
