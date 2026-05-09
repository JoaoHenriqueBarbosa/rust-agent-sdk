// function: getIdeLockfilesPaths
async function getIdeLockfilesPaths() {
  let paths2 = [join57(getClaudeConfigHomeDir(), "ide")];
  if (getPlatform() !== "wsl")
    return paths2;
  let windowsHome = await getWindowsUserProfile();
  if (windowsHome) {
    let wslPath = new WindowsToWSLConverter(process.env.WSL_DISTRO_NAME).toLocalPath(windowsHome);
    paths2.push(resolve24(wslPath, ".claude", "ide"));
  }
  try {
    let userDirs = await getFsImplementation().readdir("/mnt/c/Users");
    for (let user of userDirs) {
      if (!user.isDirectory() && !user.isSymbolicLink())
        continue;
      if (user.name === "Public" || user.name === "Default" || user.name === "Default User" || user.name === "All Users")
        continue;
      paths2.push(join57("/mnt/c/Users", user.name, ".claude", "ide"));
    }
  } catch (error44) {
    if (isFsInaccessible(error44))
      logForDebugging(`WSL IDE lockfile path detection failed (${error44.code}): ${errorMessage(error44)}`);
    else
      logError2(error44);
  }
  return paths2;
}
