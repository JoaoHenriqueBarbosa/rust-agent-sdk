// Original: src/utils/diff.ts
function adjustHunkLineNumbers(hunks, offset) {
  if (offset === 0)
    return hunks;
  return hunks.map((h4) => ({
    ...h4,
    oldStart: h4.oldStart + offset,
    newStart: h4.newStart + offset
  }));
}
function escapeForDiff(s2) {
  return s2.replaceAll("&", AMPERSAND_TOKEN).replaceAll("$", DOLLAR_TOKEN);
}
function unescapeFromDiff(s2) {
  return s2.replaceAll(AMPERSAND_TOKEN, "&").replaceAll(DOLLAR_TOKEN, "$");
}
function countLinesChanged(patch, newFileContent) {
  let numAdditions = 0, numRemovals = 0;
  if (patch.length === 0 && newFileContent)
    numAdditions = newFileContent.split(/\r?\n/).length;
  else
    numAdditions = patch.reduce((acc, hunk) => acc + count2(hunk.lines, (_) => _.startsWith("+")), 0), numRemovals = patch.reduce((acc, hunk) => acc + count2(hunk.lines, (_) => _.startsWith("-")), 0);
  addToTotalLinesChanged(numAdditions, numRemovals), getLocCounter()?.add(numAdditions, { type: "added" }), getLocCounter()?.add(numRemovals, { type: "removed" }), logEvent("tengu_file_changed", {
    lines_added: numAdditions,
    lines_removed: numRemovals
  });
}
function getPatchFromContents({
  filePath,
  oldContent,
  newContent,
  ignoreWhitespace = !1,
  singleHunk = !1
}) {
  let result = structuredPatch(filePath, filePath, escapeForDiff(oldContent), escapeForDiff(newContent), void 0, void 0, {
    ignoreWhitespace,
    context: singleHunk ? 1e5 : CONTEXT_LINES,
    timeout: DIFF_TIMEOUT_MS
  });
  if (!result)
    return [];
  return result.hunks.map((_) => ({
    ..._,
    lines: _.lines.map(unescapeFromDiff)
  }));
}
function getPatchForDisplay({
  filePath,
  fileContents,
  edits,
  ignoreWhitespace = !1
}) {
  let preparedFileContents = escapeForDiff(convertLeadingTabsToSpaces(fileContents)), result = structuredPatch(filePath, filePath, preparedFileContents, edits.reduce((p4, edit2) => {
    let { old_string, new_string } = edit2, replace_all = "replace_all" in edit2 ? edit2.replace_all : !1, escapedOldString = escapeForDiff(convertLeadingTabsToSpaces(old_string)), escapedNewString = escapeForDiff(convertLeadingTabsToSpaces(new_string));
    if (replace_all)
      return p4.replaceAll(escapedOldString, () => escapedNewString);
    else
      return p4.replace(escapedOldString, () => escapedNewString);
  }, preparedFileContents), void 0, void 0, {
    context: CONTEXT_LINES,
    ignoreWhitespace,
    timeout: DIFF_TIMEOUT_MS
  });
  if (!result)
    return [];
  return result.hunks.map((_) => ({
    ..._,
    lines: _.lines.map(unescapeFromDiff)
  }));
}
var CONTEXT_LINES = 3, DIFF_TIMEOUT_MS = 5000, AMPERSAND_TOKEN = "<<:AMPERSAND_TOKEN:>>", DOLLAR_TOKEN = "<<:DOLLAR_TOKEN:>>";
var init_diff2 = __esm(() => {
  init_lib();
  init_state();
  init_cost_tracker();
  init_file();
});
