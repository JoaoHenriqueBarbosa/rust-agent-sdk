// function: safeCallProgress
function safeCallProgress(onProgress, message) {
  if (!onProgress)
    return;
  try {
    onProgress(message);
  } catch (callbackError) {
    logForDebugging(`Progress callback error: ${errorMessage(callbackError)}`, {
      level: "warn"
    });
  }
}
