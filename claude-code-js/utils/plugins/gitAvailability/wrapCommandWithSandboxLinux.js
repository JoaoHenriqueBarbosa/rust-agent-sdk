// function: wrapCommandWithSandboxLinux
async function wrapCommandWithSandboxLinux(params) {
  let { command: command12, needsNetworkRestriction, httpSocketPath, socksSocketPath, httpProxyPort, socksProxyPort, readConfig, writeConfig, enableWeakerNestedSandbox, allowAllUnixSockets, binShell, ripgrepConfig = { command: "rg" }, mandatoryDenySearchDepth = DEFAULT_MANDATORY_DENY_SEARCH_DEPTH, allowGitConfig = !1, seccompConfig, abortSignal } = params, hasReadRestrictions = readConfig && readConfig.denyOnly.length > 0, hasWriteRestrictions = writeConfig !== void 0;
  if (!needsNetworkRestriction && !hasReadRestrictions && !hasWriteRestrictions)
    return command12;
  activeSandboxCount++;
  let bwrapArgs = ["--new-session", "--die-with-parent"], applySeccompPrefix;
  try {
    if (!allowAllUnixSockets)
      if (applySeccompPrefix = resolveApplySeccompPrefix(seccompConfig?.applyPath, seccompConfig?.argv0), !applySeccompPrefix)
        logForDebugging2("[Sandbox Linux] apply-seccomp binary not available - unix socket blocking disabled. Install @anthropic-ai/sandbox-runtime globally for full protection.", { level: "warn" });
      else
        logForDebugging2("[Sandbox Linux] Applying seccomp filter for Unix socket blocking");
    else
      logForDebugging2("[Sandbox Linux] Skipping seccomp filter - allowAllUnixSockets is enabled");
    if (needsNetworkRestriction) {
      if (bwrapArgs.push("--unshare-net"), httpSocketPath && socksSocketPath) {
        if (!fs12.existsSync(httpSocketPath))
          throw Error(`Linux HTTP bridge socket does not exist: ${httpSocketPath}. The bridge process may have died. Try reinitializing the sandbox.`);
        if (!fs12.existsSync(socksSocketPath))
          throw Error(`Linux SOCKS bridge socket does not exist: ${socksSocketPath}. The bridge process may have died. Try reinitializing the sandbox.`);
        bwrapArgs.push("--bind", httpSocketPath, httpSocketPath), bwrapArgs.push("--bind", socksSocketPath, socksSocketPath);
        let proxyEnv = generateProxyEnvVars(3128, 1080);
        if (bwrapArgs.push(...proxyEnv.flatMap((env5) => {
          let firstEq = env5.indexOf("="), key = env5.slice(0, firstEq), value = env5.slice(firstEq + 1);
          return ["--setenv", key, value];
        })), httpProxyPort !== void 0)
          bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_HTTP_PROXY_PORT", String(httpProxyPort));
        if (socksProxyPort !== void 0)
          bwrapArgs.push("--setenv", "CLAUDE_CODE_HOST_SOCKS_PROXY_PORT", String(socksProxyPort));
      }
    }
    let fsArgs = await generateFilesystemArgs(readConfig, writeConfig, ripgrepConfig, mandatoryDenySearchDepth, allowGitConfig, abortSignal);
    if (bwrapArgs.push(...fsArgs), bwrapArgs.push("--dev", "/dev"), bwrapArgs.push("--unshare-pid"), !enableWeakerNestedSandbox)
      bwrapArgs.push("--proc", "/proc");
    else
      bwrapArgs.push("--unshare-user", "--bind", "/proc", "/proc");
    let shellName = binShell || "bash", shell = whichSync2(shellName);
    if (!shell)
      throw Error(`Shell '${shellName}' not found in PATH`);
    if (bwrapArgs.push("--", shell, "-c"), needsNetworkRestriction && httpSocketPath && socksSocketPath) {
      let sandboxCommand = buildSandboxCommand(httpSocketPath, socksSocketPath, command12, applySeccompPrefix, shell);
      bwrapArgs.push(sandboxCommand);
    } else if (applySeccompPrefix) {
      let applySeccompCmd = applySeccompPrefix + import_shell_quote.default.quote([shell, "-c", command12]);
      bwrapArgs.push(applySeccompCmd);
    } else
      bwrapArgs.push(command12);
    let wrappedCommand = import_shell_quote.default.quote(["bwrap", ...bwrapArgs]), restrictions = [];
    if (needsNetworkRestriction)
      restrictions.push("network");
    if (hasReadRestrictions || hasWriteRestrictions)
      restrictions.push("filesystem");
    if (applySeccompPrefix)
      restrictions.push("seccomp(unix-block)");
    return logForDebugging2(`[Sandbox Linux] Wrapped command with bwrap (${restrictions.join(", ")} restrictions)`), wrappedCommand;
  } catch (error44) {
    if (activeSandboxCount > 0)
      activeSandboxCount--;
    throw error44;
  }
}
