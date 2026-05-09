// function: hasUnresolvedHooksFromLookup
function hasUnresolvedHooksFromLookup(toolUseID, hookEvent, lookups) {
  let inProgressCount = lookups.inProgressHookCounts.get(toolUseID)?.get(hookEvent) ?? 0, resolvedCount = lookups.resolvedHookCounts.get(toolUseID)?.get(hookEvent) ?? 0;
  return inProgressCount > resolvedCount;
}
