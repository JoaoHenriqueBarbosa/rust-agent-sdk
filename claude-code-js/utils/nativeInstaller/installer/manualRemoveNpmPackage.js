// function: manualRemoveNpmPackage
async function manualRemoveNpmPackage(packageName) {
  try {
    let prefixResult = await execFileNoThrowWithCwd("npm", [
      "config",
      "get",
      "prefix"
    ]);
    if (prefixResult.code !== 0 || !prefixResult.stdout)
      return {
        success: !1,
        error: "Failed to get npm global prefix"
      };
    let globalPrefix = prefixResult.stdout.trim(), manuallyRemoved = !1;
    async function tryRemove(filePath, description) {
      try {
        return await unlink6(filePath), logForDebugging(`Manually removed ${description}: ${filePath}`), !0;
      } catch {
        return !1;
      }
    }
    if (getPlatform3().startsWith("win32")) {
      let binCmd = join69(globalPrefix, "claude.cmd"), binPs1 = join69(globalPrefix, "claude.ps1"), binExe = join69(globalPrefix, "claude");
      if (await tryRemove(binCmd, "bin script"))
        manuallyRemoved = !0;
      if (await tryRemove(binPs1, "PowerShell script"))
        manuallyRemoved = !0;
      if (await tryRemove(binExe, "bin executable"))
        manuallyRemoved = !0;
    } else {
      let binSymlink = join69(globalPrefix, "bin", "claude");
      if (await tryRemove(binSymlink, "bin symlink"))
        manuallyRemoved = !0;
    }
    if (manuallyRemoved) {
      logForDebugging(`Successfully removed ${packageName} manually`);
      let nodeModulesPath = getPlatform3().startsWith("win32") ? join69(globalPrefix, "node_modules", packageName) : join69(globalPrefix, "lib", "node_modules", packageName);
      return {
        success: !0,
        warning: `${packageName} executables removed, but node_modules directory was left intact for safety. You may manually delete it later at: ${nodeModulesPath}`
      };
    } else
      return { success: !1 };
  } catch (manualError) {
    return logForDebugging(`Manual removal failed: ${manualError}`, {
      level: "error"
    }), {
      success: !1,
      error: `Manual removal failed: ${manualError}`
    };
  }
}
