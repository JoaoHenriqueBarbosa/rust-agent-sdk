// function: generateBashSuggestions
async function generateBashSuggestions(input, cursorOffset) {
  try {
    if (currentShellCompletionAbortController)
      currentShellCompletionAbortController.abort();
    return currentShellCompletionAbortController = new AbortController, await getShellCompletions(input, cursorOffset, currentShellCompletionAbortController.signal);
  } catch {
    return logEvent("tengu_shell_completion_failed", {}), [];
  }
}
