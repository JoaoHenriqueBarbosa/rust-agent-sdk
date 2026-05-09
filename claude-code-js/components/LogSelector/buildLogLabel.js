// function: buildLogLabel
function buildLogLabel(log3, maxLabelWidth, options2) {
  let {
    isGroupHeader = !1,
    isChild = !1,
    forkCount = 0
  } = options2 || {}, prefixWidth = isGroupHeader && forkCount > 0 ? PARENT_PREFIX_WIDTH : isChild ? CHILD_PREFIX_WIDTH : 0, sessionCountSuffix = isGroupHeader && forkCount > 0 ? ` (+${forkCount} other ${forkCount === 1 ? "session" : "sessions"})` : "", sidechainSuffix = log3.isSidechain ? " (sidechain)" : "", maxSummaryWidth = maxLabelWidth - prefixWidth - sidechainSuffix.length - sessionCountSuffix.length;
  return `${normalizeAndTruncateToWidth(getLogDisplayTitle(log3), maxSummaryWidth)}${sidechainSuffix}${sessionCountSuffix}`;
}
