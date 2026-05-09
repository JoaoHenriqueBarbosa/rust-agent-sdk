// function: extractSectionName
function extractSectionName(content) {
  let headingMatch = content.match(/^#+\s+(.+)$/m);
  if (headingMatch)
    return headingMatch[1].trim();
  let firstLine = content.split(`
`).find((l3) => l3.trim().length > 0) ?? "";
  return firstLine.length > 40 ? firstLine.slice(0, 40) + "\u2026" : firstLine;
}
