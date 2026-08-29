// Original: src/services/mcp/normalization.ts
function normalizeNameForMCP(name) {
  let normalized = name.replace(/[^a-zA-Z0-9_-]/g, "_");
  if (name.startsWith("claude.ai "))
    normalized = normalized.replace(/_+/g, "_").replace(/^_|_$/g, "");
  return normalized;
}
