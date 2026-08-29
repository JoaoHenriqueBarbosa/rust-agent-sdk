// function: formatReplacementValue
function formatReplacementValue(options2) {
  let {
    displayText,
    mode,
    hasAtPrefix,
    needsQuotes,
    isQuoted,
    isComplete
  } = options2, space = isComplete ? " " : "";
  if (isQuoted || needsQuotes)
    return mode === "bash" ? `"${displayText}"${space}` : `@"${displayText}"${space}`;
  else if (hasAtPrefix)
    return mode === "bash" ? `${displayText}${space}` : `@${displayText}${space}`;
  else
    return displayText;
}
