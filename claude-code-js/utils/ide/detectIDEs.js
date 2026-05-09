// function: detectIDEs
async function detectIDEs(includeInvalid) {
  let detectedIDEs = [];
  try {
    let ssePort = process.env.CLAUDE_CODE_SSE_PORT, envPort = ssePort ? parseInt(ssePort) : null, cwd2 = getOriginalCwd().normalize("NFC"), lockfiles = await getSortedIdeLockfiles(), lockfileInfos = await Promise.all(lockfiles.map(readIdeLockfile)), getAncestors = makeAncestorPidLookup(), needsAncestryCheck = getPlatform() !== "wsl" && isSupportedTerminal();
    for (let lockfileInfo of lockfileInfos) {
      if (!lockfileInfo)
        continue;
      let isValid2 = !1;
      if (isEnvTruthy(process.env.CLAUDE_CODE_IDE_SKIP_VALID_CHECK))
        isValid2 = !0;
      else if (lockfileInfo.port === envPort)
        isValid2 = !0;
      else
        isValid2 = lockfileInfo.workspaceFolders.some((idePath) => {
          if (!idePath)
            return !1;
          let localPath = idePath;
          if (getPlatform() === "wsl" && lockfileInfo.runningInWindows && process.env.WSL_DISTRO_NAME) {
            if (!checkWSLDistroMatch(idePath, process.env.WSL_DISTRO_NAME))
              return !1;
            let resolvedOriginal = resolve24(localPath).normalize("NFC");
            if (cwd2 === resolvedOriginal || cwd2.startsWith(resolvedOriginal + pathSeparator))
              return !0;
            localPath = new WindowsToWSLConverter(process.env.WSL_DISTRO_NAME).toLocalPath(idePath);
          }
          let resolvedPath5 = resolve24(localPath).normalize("NFC");
          if (getPlatform() === "windows") {
            let normalizedCwd = cwd2.replace(/^[a-zA-Z]:/, (match) => match.toUpperCase()), normalizedResolvedPath = resolvedPath5.replace(/^[a-zA-Z]:/, (match) => match.toUpperCase());
            return normalizedCwd === normalizedResolvedPath || normalizedCwd.startsWith(normalizedResolvedPath + pathSeparator);
          }
          return cwd2 === resolvedPath5 || cwd2.startsWith(resolvedPath5 + pathSeparator);
        });
      if (!isValid2 && !includeInvalid)
        continue;
      if (needsAncestryCheck) {
        if (!(envPort !== null && lockfileInfo.port === envPort)) {
          if (!lockfileInfo.pid || !isProcessRunning2(lockfileInfo.pid))
            continue;
          if (process.ppid !== lockfileInfo.pid) {
            if (!(await getAncestors()).has(lockfileInfo.pid))
              continue;
          }
        }
      }
      let ideName = lockfileInfo.ideName ?? (isSupportedTerminal() ? toIDEDisplayName(envDynamic.terminal) : "IDE"), host = await detectHostIP(lockfileInfo.runningInWindows, lockfileInfo.port), url3;
      if (lockfileInfo.useWebSocket)
        url3 = `ws://${host}:${lockfileInfo.port}`;
      else
        url3 = `http://${host}:${lockfileInfo.port}/sse`;
      detectedIDEs.push({
        url: url3,
        name: ideName,
        workspaceFolders: lockfileInfo.workspaceFolders,
        port: lockfileInfo.port,
        isValid: isValid2,
        authToken: lockfileInfo.authToken,
        ideRunningInWindows: lockfileInfo.runningInWindows
      });
    }
    if (!includeInvalid && envPort) {
      let envPortMatch = detectedIDEs.filter((ide) => ide.isValid && ide.port === envPort);
      if (envPortMatch.length === 1)
        return envPortMatch;
    }
  } catch (error44) {
    logError2(error44);
  }
  return detectedIDEs;
}
