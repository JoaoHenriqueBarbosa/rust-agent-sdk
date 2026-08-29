// function: extractMcpResourceMentions
function extractMcpResourceMentions(content) {
  let atMentionRegex = /(^|\s)@([^\s]+:[^\s]+)\b/g, matches2 = content.match(atMentionRegex) || [];
  return uniq(matches2.map((match) => match.slice(match.indexOf("@") + 1)));
}
