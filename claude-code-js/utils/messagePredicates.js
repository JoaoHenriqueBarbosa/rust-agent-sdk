// Original: src/utils/messagePredicates.ts
function isHumanTurn(m4) {
  return m4.type === "user" && !m4.isMeta && m4.toolUseResult === void 0;
}
