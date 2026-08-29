// function: checkInstall
async function checkInstall(force = !1) {
  if (isEnvTruthy(process.env.DISABLE_INSTALLATION_CHECKS))
    return [];
  let installationType = await getCurrentInstallationType();
  if (installationType === "development")
    return [];
  let config10 = getGlobalConfig();
  if (!(force || installationType === "native" || config10.installMethod === "native"))
    return [];
  let dirs = getBaseDirectories(), messages = [], localBinDir = dirname30(dirs.executable), resolvedLocalBinPath = resolve26(localBinDir), isWindows3 = getPlatform3().startsWith("win32");
  try {
    await access3(localBinDir);
  } catch {
    messages.push({
      message: `installMethod is native, but directory ${localBinDir} does not exist`,
      userActionRequired: !0,
      type: "error"
    });
  }
  if (isWindows3) {
    if (!await isPossibleClaudeBinary(dirs.executable))
      messages.push({
        message: `installMethod is native, but claude command is missing or invalid at ${dirs.executable}`,
        userActionRequired: !0,
        type: "error"
      });
  } else
    try {
      let target = await readlink(dirs.executable), absoluteTarget = resolve26(dirname30(dirs.executable), target);
      if (!await isPossibleClaudeBinary(absoluteTarget))
        messages.push({
          message: `Claude symlink points to missing or invalid binary: ${target}`,
          userActionRequired: !0,
          type: "error"
        });
    } catch (e) {
      if (isENOENT(e))
        messages.push({
          message: `installMethod is native, but claude command not found at ${dirs.executable}`,
          userActionRequired: !0,
          type: "error"
        });
      else if (!await isPossibleClaudeBinary(dirs.executable))
        messages.push({
          message: `${dirs.executable} exists but is not a valid Claude binary`,
          userActionRequired: !0,
          type: "error"
        });
    }
  if (!(process.env.PATH || "").split(delimiter3).some((entry) => {
    try {
      let resolvedEntry = resolve26(entry);
      if (isWindows3)
        return resolvedEntry.toLowerCase() === resolvedLocalBinPath.toLowerCase();
      return resolvedEntry === resolvedLocalBinPath;
    } catch {
      return !1;
    }
  }))
    if (isWindows3) {
      let windowsBinPath = localBinDir.replace(/\//g, "\\");
      messages.push({
        message: `Native installation exists but ${windowsBinPath} is not in your PATH. Add it by opening: System Properties \u2192 Environment Variables \u2192 Edit User PATH \u2192 New \u2192 Add the path above. Then restart your terminal.`,
        userActionRequired: !0,
        type: "path"
      });
    } else {
      let shellType = getShellType(), configFile = getShellConfigPaths()[shellType], displayPath = configFile ? configFile.replace(homedir23(), "~") : "your shell config file";
      messages.push({
        message: `Native installation exists but ~/.local/bin is not in your PATH. Run:

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ${displayPath} && source ${displayPath}`,
        userActionRequired: !0,
        type: "path"
      });
    }
  return messages;
}
