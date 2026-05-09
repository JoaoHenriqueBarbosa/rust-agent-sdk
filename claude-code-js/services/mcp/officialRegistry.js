// Original: src/services/mcp/officialRegistry.ts
async function prefetchOfficialMcpUrls() {}
function isOfficialMcpUrl(normalizedUrl) {
  return officialUrls?.has(normalizedUrl) ?? !1;
}
var officialUrls = void 0;
