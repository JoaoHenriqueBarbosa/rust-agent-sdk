// function: extractAgentMentions
function extractAgentMentions(content) {
  let results = [], quotedAgentRegex = /(^|\s)@"([\w:.@-]+) \(agent\)"/g, match;
  while ((match = quotedAgentRegex.exec(content)) !== null)
    if (match[2])
      results.push(match[2]);
  let unquotedAgentRegex = /(^|\s)@(agent-[\w:.@-]+)/g, unquotedMatches = content.match(unquotedAgentRegex) || [];
  for (let m4 of unquotedMatches)
    results.push(m4.slice(m4.indexOf("@") + 1));
  return uniq(results);
}
