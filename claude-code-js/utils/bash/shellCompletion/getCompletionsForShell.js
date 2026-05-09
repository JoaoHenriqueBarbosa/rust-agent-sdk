// function: getCompletionsForShell
async function getCompletionsForShell(shellType, prefix, completionType, abortSignal) {
  let command19;
  if (shellType === "bash")
    command19 = getBashCompletionCommand(prefix, completionType);
  else if (shellType === "zsh")
    command19 = getZshCompletionCommand(prefix, completionType);
  else
    return [];
  return (await (await exec4(command19, abortSignal, "bash", {
    timeout: SHELL_COMPLETION_TIMEOUT_MS
  })).result).stdout.split(`
`).filter((line) => line.trim()).slice(0, MAX_SHELL_COMPLETIONS).map((text2) => ({
    id: text2,
    displayText: text2,
    description: void 0,
    metadata: { completionType }
  }));
}
