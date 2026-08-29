// Original: src/utils/toolSchemaCache.ts
function getToolSchemaCache() {
  return TOOL_SCHEMA_CACHE;
}
function clearToolSchemaCache() {
  TOOL_SCHEMA_CACHE.clear();
}
var TOOL_SCHEMA_CACHE;
var init_toolSchemaCache = __esm(() => {
  TOOL_SCHEMA_CACHE = /* @__PURE__ */ new Map;
});
