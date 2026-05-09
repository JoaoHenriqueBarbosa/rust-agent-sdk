// Original: src/hooks/useIssueFlagBanner.ts
function isSessionContainerCompatible(messages) {
  for (let msg of messages) {
    if (msg.type !== "assistant")
      continue;
    let content = msg.message.content;
    if (!Array.isArray(content))
      continue;
    for (let block2 of content) {
      if (block2.type !== "tool_use" || !("name" in block2))
        continue;
      let toolName = block2.name;
      if (toolName.startsWith("mcp__"))
        return !1;
      if (toolName === BASH_TOOL_NAME) {
        let command19 = block2.input?.command || "";
        if (EXTERNAL_COMMAND_PATTERNS.some((p4) => p4.test(command19)))
          return !1;
      }
    }
  }
  return !0;
}
function hasFrictionSignal(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (msg.type !== "user")
      continue;
    let text2 = getUserMessageText(msg);
    if (!text2)
      continue;
    return FRICTION_PATTERNS.some((p4) => p4.test(text2));
  }
  return !1;
}
function useIssueFlagBanner(messages, submitCount) {
  return !1;
}
var import_react297, EXTERNAL_COMMAND_PATTERNS, FRICTION_PATTERNS, MIN_SUBMIT_COUNT = 3, COOLDOWN_MS = 1800000;
var init_useIssueFlagBanner = __esm(() => {
  init_messages3();
  import_react297 = __toESM(require_react_development(), 1), EXTERNAL_COMMAND_PATTERNS = [
    /\bcurl\b/,
    /\bwget\b/,
    /\bssh\b/,
    /\bkubectl\b/,
    /\bsrun\b/,
    /\bdocker\b/,
    /\bbq\b/,
    /\bgsutil\b/,
    /\bgcloud\b/,
    /\baws\b/,
    /\bgit\s+push\b/,
    /\bgit\s+pull\b/,
    /\bgit\s+fetch\b/,
    /\bgh\s+(pr|issue)\b/,
    /\bnc\b/,
    /\bncat\b/,
    /\btelnet\b/,
    /\bftp\b/
  ], FRICTION_PATTERNS = [
    /^no[,!]\s/i,
    /\bthat'?s (wrong|incorrect|not (what|right|correct))\b/i,
    /\bnot what I (asked|wanted|meant|said)\b/i,
    /\bI (said|asked|wanted|told you|already said)\b/i,
    /\bwhy did you\b/i,
    /\byou should(n'?t| not)? have\b/i,
    /\byou were supposed to\b/i,
    /\btry again\b/i,
    /\b(undo|revert) (that|this|it|what you)\b/i
  ];
});
