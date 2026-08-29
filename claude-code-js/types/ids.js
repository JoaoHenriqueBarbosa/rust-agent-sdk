// Original: src/types/ids.ts
function asSessionId(id) {
  return id;
}
function asAgentId(id) {
  return id;
}
function toAgentId(s2) {
  return AGENT_ID_PATTERN.test(s2) ? s2 : null;
}
var AGENT_ID_PATTERN;
var init_ids = __esm(() => {
  AGENT_ID_PATTERN = /^a(?:.+-)?[0-9a-f]{16}$/;
});
