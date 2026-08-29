// function: gitClone
async function gitClone(gitUrl, targetPath, ref, sparsePaths) {
  let useSparse = sparsePaths && sparsePaths.length > 0, args = [
    "-c",
    "core.sshCommand=ssh -o BatchMode=yes -o StrictHostKeyChecking=yes",
    "clone",
    "--depth",
    "1"
  ];
  if (useSparse)
    args.push("--filter=blob:none", "--no-checkout");
  else
    args.push("--recurse-submodules", "--shallow-submodules");
  if (ref)
    args.push("--branch", ref);
  args.push(gitUrl, targetPath);
  let timeoutMs = getPluginGitTimeoutMs();
  logForDebugging(`git clone: url=${redactUrlCredentials(gitUrl)} ref=${ref ?? "default"} timeout=${timeoutMs}ms`);
  let result = await execFileNoThrowWithCwd(gitExe(), args, {
    timeout: timeoutMs,
    stdin: "ignore",
    env: { ...process.env, ...GIT_NO_PROMPT_ENV }
  }), redacted = redactUrlCredentials(gitUrl);
  if (gitUrl !== redacted) {
    if (result.error)
      result.error = result.error.replaceAll(gitUrl, redacted);
    if (result.stderr)
      result.stderr = result.stderr.replaceAll(gitUrl, redacted);
  }
  if (result.code === 0) {
    if (useSparse) {
      let sparseResult = await execFileNoThrowWithCwd(gitExe(), ["sparse-checkout", "set", "--cone", "--", ...sparsePaths], {
        cwd: targetPath,
        timeout: timeoutMs,
        stdin: "ignore",
        env: { ...process.env, ...GIT_NO_PROMPT_ENV }
      });
      if (sparseResult.code !== 0)
        return {
          code: sparseResult.code,
          stderr: `git sparse-checkout set failed: ${sparseResult.stderr}`
        };
      let checkoutResult = await execFileNoThrowWithCwd(gitExe(), ["checkout", "HEAD"], {
        cwd: targetPath,
        timeout: timeoutMs,
        stdin: "ignore",
        env: { ...process.env, ...GIT_NO_PROMPT_ENV }
      });
      if (checkoutResult.code !== 0)
        return {
          code: checkoutResult.code,
          stderr: `git checkout after sparse-checkout failed: ${checkoutResult.stderr}`
        };
    }
    return logForDebugging(`git clone succeeded: ${redactUrlCredentials(gitUrl)}`), result;
  }
  if (logForDebugging(`git clone failed: url=${redactUrlCredentials(gitUrl)} code=${result.code} error=${result.error ?? "none"} stderr=${result.stderr}`, { level: "warn" }), result.error?.includes("timed out"))
    return {
      ...result,
      stderr: `Git clone timed out after ${Math.round(timeoutMs / 1000)}s. The repository may be too large for the current timeout. Set CLAUDE_CODE_PLUGIN_GIT_TIMEOUT_MS to increase it (e.g., 300000 for 5 minutes).

Original error: ${result.stderr}`
    };
  if (result.stderr) {
    if (result.stderr.includes("REMOTE HOST IDENTIFICATION HAS CHANGED")) {
      let host = extractSshHost(gitUrl), removeHint = host ? `ssh-keygen -R ${host}` : "ssh-keygen -R <host>";
      return {
        ...result,
        stderr: `SSH host key has changed (server key rotation or possible MITM). Remove the stale known_hosts entry:
  ${removeHint}
Then connect once manually to verify and accept the new key.

Original error: ${result.stderr}`
      };
    }
    if (result.stderr.includes("Host key verification failed")) {
      let host = extractSshHost(gitUrl), connectHint = host ? `ssh -T git@${host}` : "ssh -T git@<host>";
      return {
        ...result,
        stderr: `SSH host key is not in your known_hosts file. To add it, connect once manually (this will show the fingerprint for you to verify):
  ${connectHint}

Or use an HTTPS URL instead (recommended for public repos).

Original error: ${result.stderr}`
      };
    }
    if (result.stderr.includes("Permission denied (publickey)") || result.stderr.includes("Could not read from remote repository"))
      return {
        ...result,
        stderr: `SSH authentication failed. Please ensure your SSH keys are configured for GitHub, or use an HTTPS URL instead.

Original error: ${result.stderr}`
      };
    if (isAuthenticationError(result.stderr))
      return {
        ...result,
        stderr: `HTTPS authentication failed. Please ensure your credential helper is configured (e.g., gh auth login).

Original error: ${result.stderr}`
      };
    if (result.stderr.includes("timed out") || result.stderr.includes("timeout") || result.stderr.includes("Could not resolve host"))
      return {
        ...result,
        stderr: `Network error or timeout while cloning repository. Please check your internet connection and try again.

Original error: ${result.stderr}`
      };
  }
  if (!result.stderr)
    return {
      code: result.code,
      stderr: result.error || `git clone exited with code ${result.code} (no stderr output). Run with --debug to see the full command.`
    };
  return result;
}
