// function: extractAtMentionedFiles
function extractAtMentionedFiles(content) {
  let quotedAtMentionRegex = /(^|\s)@"([^"]+)"/g, regularAtMentionRegex = /(^|\s)@([^\s]+)\b/g, quotedMatches = [], regularMatches = [], match;
  while ((match = quotedAtMentionRegex.exec(content)) !== null)
    if (match[2] && !match[2].endsWith(" (agent)"))
      quotedMatches.push(match[2]);
  return (content.match(regularAtMentionRegex) || []).forEach((match2) => {
    let filename = match2.slice(match2.indexOf("@") + 1);
    if (!filename.startsWith('"'))
      regularMatches.push(filename);
  }), uniq([...quotedMatches, ...regularMatches]);
}
