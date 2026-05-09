// function: dedupeWhitespaceInChangeObjects
function dedupeWhitespaceInChangeObjects(startKeep, deletion, insertion, endKeep) {
  if (deletion && insertion) {
    var oldWsPrefix = deletion.value.match(/^\s*/)[0], oldWsSuffix = deletion.value.match(/\s*$/)[0], newWsPrefix = insertion.value.match(/^\s*/)[0], newWsSuffix = insertion.value.match(/\s*$/)[0];
    if (startKeep) {
      var commonWsPrefix = longestCommonPrefix(oldWsPrefix, newWsPrefix);
      startKeep.value = replaceSuffix(startKeep.value, newWsPrefix, commonWsPrefix), deletion.value = removePrefix(deletion.value, commonWsPrefix), insertion.value = removePrefix(insertion.value, commonWsPrefix);
    }
    if (endKeep) {
      var commonWsSuffix = longestCommonSuffix(oldWsSuffix, newWsSuffix);
      endKeep.value = replacePrefix(endKeep.value, newWsSuffix, commonWsSuffix), deletion.value = removeSuffix(deletion.value, commonWsSuffix), insertion.value = removeSuffix(insertion.value, commonWsSuffix);
    }
  } else if (insertion) {
    if (startKeep)
      insertion.value = insertion.value.replace(/^\s*/, "");
    if (endKeep)
      endKeep.value = endKeep.value.replace(/^\s*/, "");
  } else if (startKeep && endKeep) {
    var newWsFull = endKeep.value.match(/^\s*/)[0], delWsStart = deletion.value.match(/^\s*/)[0], delWsEnd = deletion.value.match(/\s*$/)[0], newWsStart = longestCommonPrefix(newWsFull, delWsStart);
    deletion.value = removePrefix(deletion.value, newWsStart);
    var newWsEnd = longestCommonSuffix(removePrefix(newWsFull, newWsStart), delWsEnd);
    deletion.value = removeSuffix(deletion.value, newWsEnd), endKeep.value = replacePrefix(endKeep.value, newWsFull, newWsEnd), startKeep.value = replaceSuffix(startKeep.value, newWsFull, newWsFull.slice(0, newWsFull.length - newWsEnd.length));
  } else if (endKeep) {
    var endKeepWsPrefix = endKeep.value.match(/^\s*/)[0], deletionWsSuffix = deletion.value.match(/\s*$/)[0], overlap = maximumOverlap(deletionWsSuffix, endKeepWsPrefix);
    deletion.value = removeSuffix(deletion.value, overlap);
  } else if (startKeep) {
    var startKeepWsSuffix = startKeep.value.match(/\s*$/)[0], deletionWsPrefix = deletion.value.match(/^\s*/)[0], _overlap = maximumOverlap(startKeepWsSuffix, deletionWsPrefix);
    deletion.value = removePrefix(deletion.value, _overlap);
  }
}
