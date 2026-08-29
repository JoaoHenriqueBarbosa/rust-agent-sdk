// var: VERSION
var VERSION = "0.52.0";

// node_modules/@anthropic-ai/sdk/internal/detect-platform.mjs
function getDetectedPlatform() {
  if (typeof Deno < "u" && Deno.build != null)
    return "deno";
  if (typeof EdgeRuntime < "u")
    return "edge";
  if (Object.prototype.toString.call(typeof globalThis.process < "u" ? globalThis.process : 0) === "[object process]")
    return "node";
  return "unknown";
}
