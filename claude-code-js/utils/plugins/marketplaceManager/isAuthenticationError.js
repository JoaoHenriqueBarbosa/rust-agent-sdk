// function: isAuthenticationError
function isAuthenticationError(stderr) {
  return stderr.includes("Authentication failed") || stderr.includes("could not read Username") || stderr.includes("terminal prompts disabled") || stderr.includes("403") || stderr.includes("401");
}
