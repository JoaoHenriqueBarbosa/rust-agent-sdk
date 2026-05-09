// function: createFallbackTitle
function createFallbackTitle(description) {
  let firstLine = description.split(`
`)[0] || "";
  if (firstLine.length <= 60 && firstLine.length > 5)
    return firstLine;
  let truncated = firstLine.slice(0, 60);
  if (firstLine.length > 60) {
    let lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 30)
      truncated = truncated.slice(0, lastSpace);
    truncated += "...";
  }
  return truncated.length < 10 ? "Bug Report" : truncated;
}
