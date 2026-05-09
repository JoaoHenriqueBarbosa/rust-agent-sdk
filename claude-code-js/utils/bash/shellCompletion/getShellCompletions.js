// function: getShellCompletions
async function getShellCompletions(input, cursorOffset, abortSignal) {
  let shellType = getShellType();
  if (shellType !== "bash" && shellType !== "zsh")
    return [];
  try {
    let { prefix, completionType } = parseInputContext(input, cursorOffset);
    if (!prefix)
      return [];
    return (await getCompletionsForShell(shellType, prefix, completionType, abortSignal)).map((suggestion) => ({
      ...suggestion,
      metadata: {
        ...suggestion.metadata,
        inputSnapshot: input
      }
    }));
  } catch (error44) {
    return logForDebugging(`Shell completion failed: ${error44}`), [];
  }
}
