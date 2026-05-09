// function: renderToolUseMessage14
function renderToolUseMessage14({
  url: url3,
  prompt
}, {
  verbose
}) {
  if (!url3)
    return null;
  if (verbose)
    return `url: "${url3}"${verbose && prompt ? `, prompt: "${prompt}"` : ""}`;
  return url3;
}
