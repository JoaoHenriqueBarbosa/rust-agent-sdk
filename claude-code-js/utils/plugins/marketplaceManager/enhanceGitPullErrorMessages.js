// function: enhanceGitPullErrorMessages
function enhanceGitPullErrorMessages(result) {
  if (result.code === 0)
    return result;
  if (result.error?.includes("timed out")) {
    let timeoutSec = Math.round(getPluginGitTimeoutMs() / 1000);
    return {
      ...result,
      stderr: `Git pull timed out after ${timeoutSec}s. Try increasing the timeout via CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS environment variable.

Original error: ${result.stderr}`
    };
  }
  if (result.stderr.includes("REMOTE HOST IDENTIFICATION HAS CHANGED"))
    return {
      ...result,
      stderr: `SSH host key for this marketplace's git host has changed (server key rotation or possible MITM). Remove the stale entry with: ssh-keygen -R <host>
Then connect once manually to accept the new key.

Original error: ${result.stderr}`
    };
  if (result.stderr.includes("Host key verification failed"))
    return {
      ...result,
      stderr: `SSH host key verification failed while updating marketplace. The host key is not in your known_hosts file. Connect once manually to add it (e.g., ssh -T git@<host>), or remove and re-add the marketplace with an HTTPS URL.

Original error: ${result.stderr}`
    };
  if (result.stderr.includes("Permission denied (publickey)") || result.stderr.includes("Could not read from remote repository"))
    return {
      ...result,
      stderr: `SSH authentication failed while updating marketplace. Please ensure your SSH keys are configured.

Original error: ${result.stderr}`
    };
  if (result.stderr.includes("timed out") || result.stderr.includes("Could not resolve host"))
    return {
      ...result,
      stderr: `Network error while updating marketplace. Please check your internet connection.

Original error: ${result.stderr}`
    };
  return result;
}
