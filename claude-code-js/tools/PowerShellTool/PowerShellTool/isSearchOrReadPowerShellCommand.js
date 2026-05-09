// function: isSearchOrReadPowerShellCommand
function isSearchOrReadPowerShellCommand(command12) {
  let trimmed = command12.trim();
  if (!trimmed)
    return {
      isSearch: !1,
      isRead: !1
    };
  let parts = trimmed.split(/\s*[;|]\s*/).filter(Boolean);
  if (parts.length === 0)
    return {
      isSearch: !1,
      isRead: !1
    };
  let hasSearch = !1, hasRead = !1, hasNonNeutralCommand = !1;
  for (let part of parts) {
    let baseCommand = part.trim().split(/\s+/)[0];
    if (!baseCommand)
      continue;
    let canonical = resolveToCanonical(baseCommand);
    if (PS_SEMANTIC_NEUTRAL_COMMANDS.has(canonical))
      continue;
    hasNonNeutralCommand = !0;
    let isPartSearch = PS_SEARCH_COMMANDS.has(canonical), isPartRead = PS_READ_COMMANDS.has(canonical);
    if (!isPartSearch && !isPartRead)
      return {
        isSearch: !1,
        isRead: !1
      };
    if (isPartSearch)
      hasSearch = !0;
    if (isPartRead)
      hasRead = !0;
  }
  if (!hasNonNeutralCommand)
    return {
      isSearch: !1,
      isRead: !1
    };
  return {
    isSearch: hasSearch,
    isRead: hasRead
  };
}
