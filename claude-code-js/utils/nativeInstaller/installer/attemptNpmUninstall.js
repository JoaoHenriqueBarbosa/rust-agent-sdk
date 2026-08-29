// function: attemptNpmUninstall
async function attemptNpmUninstall(packageName) {
  let { code, stderr } = await execFileNoThrowWithCwd("npm", ["uninstall", "-g", packageName], { cwd: process.cwd() });
  if (code === 0)
    return logForDebugging(`Removed global npm installation of ${packageName}`), { success: !0 };
  else if (stderr && !stderr.includes("npm ERR! code E404")) {
    if (stderr.includes("npm error code ENOTEMPTY")) {
      logForDebugging(`Failed to uninstall global npm package ${packageName}: ${stderr}`, { level: "error" }), logForDebugging("Attempting manual removal due to ENOTEMPTY error");
      let manualResult = await manualRemoveNpmPackage(packageName);
      if (manualResult.success)
        return { success: !0, warning: manualResult.warning };
      else if (manualResult.error)
        return {
          success: !1,
          error: `Failed to remove global npm installation of ${packageName}: ${stderr}. Manual removal also failed: ${manualResult.error}`
        };
    }
    return logForDebugging(`Failed to uninstall global npm package ${packageName}: ${stderr}`, { level: "error" }), {
      success: !1,
      error: `Failed to remove global npm installation of ${packageName}: ${stderr}`
    };
  }
  return { success: !1 };
}
