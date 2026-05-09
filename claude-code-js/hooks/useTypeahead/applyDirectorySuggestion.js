// function: applyDirectorySuggestion
function applyDirectorySuggestion(input, suggestionId, tokenStartPos, tokenLength, isDirectory) {
  let suffix = isDirectory ? "/" : " ", before2 = input.slice(0, tokenStartPos), after2 = input.slice(tokenStartPos + tokenLength), replacement = "@" + suggestionId + suffix;
  return {
    newInput: before2 + replacement + after2,
    cursorPos: before2.length + replacement.length
  };
}
