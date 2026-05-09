// Original: src/utils/claudeCodeHints.ts
function extractClaudeCodeHints(output, command12) {
  if (!output.includes("<claude-code-hint"))
    return { hints: [], stripped: output };
  let sourceCommand = firstCommandToken(command12), hints = [], stripped = output.replace(HINT_TAG_RE, (rawLine) => {
    let attrs = parseAttrs(rawLine), v2 = Number(attrs.v), type = attrs.type, value = attrs.value;
    if (!SUPPORTED_VERSIONS.has(v2))
      return logForDebugging(`[claudeCodeHints] dropped hint with unsupported v=${attrs.v}`), "";
    if (!type || !SUPPORTED_TYPES.has(type))
      return logForDebugging(`[claudeCodeHints] dropped hint with unsupported type=${type}`), "";
    if (!value)
      return logForDebugging("[claudeCodeHints] dropped hint with empty value"), "";
    return hints.push({ v: v2, type, value, sourceCommand }), "";
  }), collapsed = hints.length > 0 || stripped !== output ? stripped.replace(/\n{3,}/g, `

`) : stripped;
  return { hints, stripped: collapsed };
}
function parseAttrs(tagBody) {
  let attrs = {};
  for (let m4 of tagBody.matchAll(ATTR_RE))
    attrs[m4[1]] = m4[2] ?? m4[3] ?? "";
  return attrs;
}
function firstCommandToken(command12) {
  let trimmed = command12.trim(), spaceIdx = trimmed.search(/\s/);
  return spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
}
function setPendingHint(hint) {
  if (shownThisSession)
    return;
  pendingHint = hint, notify();
}
function clearPendingHint() {
  if (pendingHint !== null)
    pendingHint = null, notify();
}
function markShownThisSession() {
  shownThisSession = !0;
}
function getPendingHintSnapshot() {
  return pendingHint;
}
function hasShownHintThisSession() {
  return shownThisSession;
}
var SUPPORTED_VERSIONS, SUPPORTED_TYPES, HINT_TAG_RE, ATTR_RE, pendingHint = null, shownThisSession = !1, pendingHintChanged, notify, subscribeToPendingHint;
var init_claudeCodeHints = __esm(() => {
  init_debug();
  SUPPORTED_VERSIONS = /* @__PURE__ */ new Set([1]), SUPPORTED_TYPES = /* @__PURE__ */ new Set(["plugin"]), HINT_TAG_RE = /^[ \t]*<claude-code-hint\s+([^>]*?)\s*\/>[ \t]*$/gm, ATTR_RE = /(\w+)=(?:"([^"]*)"|([^\s/>]+))/g;
  pendingHintChanged = createSignal(), notify = pendingHintChanged.emit;
  subscribeToPendingHint = pendingHintChanged.subscribe;
});
