// function: isGitHubSshLikelyConfigured
async function isGitHubSshLikelyConfigured() {
  try {
    let result = await execFileNoThrow("ssh", [
      "-T",
      "-o",
      "BatchMode=yes",
      "-o",
      "ConnectTimeout=2",
      "-o",
      "StrictHostKeyChecking=yes",
      "git@github.com"
    ], {
      timeout: 3000
    }), configured = result.code === 1 && (result.stderr?.includes("successfully authenticated") || result.stdout?.includes("successfully authenticated"));
    return logForDebugging(`SSH config check: code=${result.code} configured=${configured}`), configured;
  } catch (error44) {
    return logForDebugging(`SSH configuration check failed: ${errorMessage(error44)}`, {
      level: "warn"
    }), !1;
  }
}
