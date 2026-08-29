// function: extractSnippet
function extractSnippet(text2, query3, contextChars) {
  let matchIndex = text2.toLowerCase().indexOf(query3.toLowerCase());
  if (matchIndex === -1)
    return null;
  let matchEnd = matchIndex + query3.length, snippetStart = Math.max(0, matchIndex - contextChars), snippetEnd = Math.min(text2.length, matchEnd + contextChars), beforeRaw = text2.slice(snippetStart, matchIndex), matchText = text2.slice(matchIndex, matchEnd), afterRaw = text2.slice(matchEnd, snippetEnd);
  return {
    before: (snippetStart > 0 ? "\u2026" : "") + beforeRaw.replace(/\s+/g, " ").trimStart(),
    match: matchText.trim(),
    after: afterRaw.replace(/\s+/g, " ").trimEnd() + (snippetEnd < text2.length ? "\u2026" : "")
  };
}
