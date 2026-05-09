// function: isSearchOrReadBashCommand
function isSearchOrReadBashCommand(command12) {
  let partsWithOperators;
  try {
    partsWithOperators = splitCommandWithOperators(command12);
  } catch {
    return {
      isSearch: !1,
      isRead: !1,
      isList: !1
    };
  }
  if (partsWithOperators.length === 0)
    return {
      isSearch: !1,
      isRead: !1,
      isList: !1
    };
  let hasSearch = !1, hasRead = !1, hasList = !1, hasNonNeutralCommand = !1, skipNextAsRedirectTarget = !1;
  for (let part of partsWithOperators) {
    if (skipNextAsRedirectTarget) {
      skipNextAsRedirectTarget = !1;
      continue;
    }
    if (part === ">" || part === ">>" || part === ">&") {
      skipNextAsRedirectTarget = !0;
      continue;
    }
    if (part === "||" || part === "&&" || part === "|" || part === ";")
      continue;
    let baseCommand = part.trim().split(/\s+/)[0];
    if (!baseCommand)
      continue;
    if (BASH_SEMANTIC_NEUTRAL_COMMANDS.has(baseCommand))
      continue;
    hasNonNeutralCommand = !0;
    let isPartSearch = BASH_SEARCH_COMMANDS.has(baseCommand), isPartRead = BASH_READ_COMMANDS.has(baseCommand), isPartList = BASH_LIST_COMMANDS.has(baseCommand);
    if (!isPartSearch && !isPartRead && !isPartList)
      return {
        isSearch: !1,
        isRead: !1,
        isList: !1
      };
    if (isPartSearch)
      hasSearch = !0;
    if (isPartRead)
      hasRead = !0;
    if (isPartList)
      hasList = !0;
  }
  if (!hasNonNeutralCommand)
    return {
      isSearch: !1,
      isRead: !1,
      isList: !1
    };
  return {
    isSearch: hasSearch,
    isRead: hasRead,
    isList: hasList
  };
}
