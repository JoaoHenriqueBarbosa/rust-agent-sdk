// function: generateFilesystemArgs
async function generateFilesystemArgs(readConfig, writeConfig, ripgrepConfig = { command: "rg" }, mandatoryDenySearchDepth = DEFAULT_MANDATORY_DENY_SEARCH_DEPTH, allowGitConfig = !1, abortSignal) {
  let args = [], allowedWritePaths = [], denyWriteArgs = [];
  if (writeConfig) {
    args.push("--ro-bind", "/", "/");
    for (let pathPattern of writeConfig.allowOnly || []) {
      let normalizedPath = normalizePathForSandbox(pathPattern);
      if (logForDebugging2(`[Sandbox Linux] Processing write path: ${pathPattern} -> ${normalizedPath}`), normalizedPath.startsWith("/dev/")) {
        logForDebugging2(`[Sandbox Linux] Skipping /dev path: ${normalizedPath}`);
        continue;
      }
      if (!fs12.existsSync(normalizedPath)) {
        logForDebugging2(`[Sandbox Linux] Skipping non-existent write path: ${normalizedPath}`);
        continue;
      }
      try {
        let resolvedPath5 = fs12.realpathSync(normalizedPath), normalizedForComparison = normalizedPath.replace(/\/+$/, "");
        if (resolvedPath5 !== normalizedForComparison && isSymlinkOutsideBoundary(normalizedPath, resolvedPath5)) {
          logForDebugging2(`[Sandbox Linux] Skipping symlink write path pointing outside expected location: ${pathPattern} -> ${resolvedPath5}`);
          continue;
        }
      } catch {
        logForDebugging2(`[Sandbox Linux] Skipping write path that could not be resolved: ${normalizedPath}`);
        continue;
      }
      args.push("--bind", normalizedPath, normalizedPath), allowedWritePaths.push(normalizedPath);
    }
    let denyPaths = [
      ...writeConfig.denyWithinAllow || [],
      ...await linuxGetMandatoryDenyPaths(ripgrepConfig, mandatoryDenySearchDepth, allowGitConfig, abortSignal)
    ], seenDenyWrite = /* @__PURE__ */ new Set;
    for (let pathPattern of denyPaths) {
      let normalizedPath = normalizePathForSandbox(pathPattern);
      if (seenDenyWrite.has(normalizedPath))
        continue;
      if (seenDenyWrite.add(normalizedPath), normalizedPath.startsWith("/dev/"))
        continue;
      let symlinkInPath = findSymlinkInPath(normalizedPath, allowedWritePaths);
      if (symlinkInPath) {
        denyWriteArgs.push("--ro-bind", "/dev/null", symlinkInPath), logForDebugging2(`[Sandbox Linux] Mounted /dev/null at symlink ${symlinkInPath} to prevent symlink replacement attack`);
        continue;
      }
      if (!fs12.existsSync(normalizedPath)) {
        if (hasFileAncestor(normalizedPath)) {
          logForDebugging2(`[Sandbox Linux] Skipping deny path with file ancestor (cannot create paths under a file): ${normalizedPath}`);
          continue;
        }
        let ancestorPath = path14.dirname(normalizedPath);
        while (ancestorPath !== "/" && !fs12.existsSync(ancestorPath))
          ancestorPath = path14.dirname(ancestorPath);
        if (allowedWritePaths.some((allowedPath) => ancestorPath.startsWith(allowedPath + "/") || ancestorPath === allowedPath || normalizedPath.startsWith(allowedPath + "/"))) {
          let firstNonExistent = findFirstNonExistentComponent(normalizedPath);
          if (firstNonExistent !== normalizedPath) {
            let emptyDir = fs12.mkdtempSync(path14.join(tmpdir2(), "claude-empty-"));
            denyWriteArgs.push("--ro-bind", emptyDir, firstNonExistent), bwrapMountPoints.add(firstNonExistent), registerExitCleanupHandler(), logForDebugging2(`[Sandbox Linux] Mounted empty dir at ${firstNonExistent} to block creation of ${normalizedPath}`);
          } else
            denyWriteArgs.push("--ro-bind", "/dev/null", firstNonExistent), bwrapMountPoints.add(firstNonExistent), registerExitCleanupHandler(), logForDebugging2(`[Sandbox Linux] Mounted /dev/null at ${firstNonExistent} to block creation of ${normalizedPath}`);
        } else
          logForDebugging2(`[Sandbox Linux] Skipping non-existent deny path not within allowed paths: ${normalizedPath}`);
        continue;
      }
      if (allowedWritePaths.some((allowedPath) => normalizedPath.startsWith(allowedPath + "/") || normalizedPath === allowedPath))
        denyWriteArgs.push("--ro-bind", normalizedPath, normalizedPath);
      else
        logForDebugging2(`[Sandbox Linux] Skipping deny path not within allowed paths: ${normalizedPath}`);
    }
  } else
    args.push("--bind", "/", "/");
  let readDenyPaths = [], readAllowPaths = (readConfig?.allowWithinDeny || []).map((p4) => normalizePathForSandbox(p4)), maskedFiles = /* @__PURE__ */ new Set, rootSkip = /* @__PURE__ */ new Set(["proc", "dev", "sys"]);
  for (let p4 of readConfig?.denyOnly || [])
    if (normalizePathForSandbox(p4) === "/") {
      for (let child of fs12.readdirSync("/"))
        if (!rootSkip.has(child))
          readDenyPaths.push("/" + child);
    } else
      readDenyPaths.push(p4);
  if (fs12.existsSync("/etc/ssh/ssh_config.d"))
    readDenyPaths.push("/etc/ssh/ssh_config.d");
  let normalizedDenyPaths = readDenyPaths.map((p4) => normalizePathForSandbox(p4)).sort((a2, b) => a2.split("/").length - b.split("/").length);
  for (let normalizedPath of normalizedDenyPaths) {
    if (!fs12.existsSync(normalizedPath)) {
      logForDebugging2(`[Sandbox Linux] Skipping non-existent read deny path: ${normalizedPath}`);
      continue;
    }
    let denySep = normalizedPath === "/" ? "/" : normalizedPath + "/";
    if (fs12.statSync(normalizedPath).isDirectory()) {
      args.push("--tmpfs", normalizedPath);
      for (let writePath of allowedWritePaths)
        if (writePath.startsWith(denySep) || writePath === normalizedPath)
          args.push("--bind", writePath, writePath), logForDebugging2(`[Sandbox Linux] Re-bound write path wiped by denyRead tmpfs: ${writePath}`);
      for (let allowPath of readAllowPaths)
        if (allowPath.startsWith(denySep) || allowPath === normalizedPath) {
          if (!fs12.existsSync(allowPath)) {
            logForDebugging2(`[Sandbox Linux] Skipping non-existent read allow path: ${allowPath}`);
            continue;
          }
          if (allowedWritePaths.some((w2) => (w2.startsWith(denySep) || w2 === normalizedPath) && (allowPath === w2 || allowPath.startsWith(w2 + "/"))))
            continue;
          args.push("--ro-bind", allowPath, allowPath), logForDebugging2(`[Sandbox Linux] Re-allowed read access within denied region: ${allowPath}`);
        }
    } else {
      if (readAllowPaths.includes(normalizedPath)) {
        logForDebugging2(`[Sandbox Linux] Skipping read deny for re-allowed path: ${normalizedPath}`);
        continue;
      }
      args.push("--ro-bind", "/dev/null", normalizedPath), maskedFiles.add(normalizedPath);
    }
  }
  for (let i4 = 0;i4 < denyWriteArgs.length; i4 += 3) {
    let dest = denyWriteArgs[i4 + 2];
    if (maskedFiles.has(dest))
      continue;
    args.push(denyWriteArgs[i4], denyWriteArgs[i4 + 1], dest);
  }
  return args;
}
