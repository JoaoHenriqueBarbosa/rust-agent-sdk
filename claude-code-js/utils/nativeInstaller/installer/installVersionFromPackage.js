// function: installVersionFromPackage
async function installVersionFromPackage(stagingPath, installPath) {
  try {
    let nodeModulesDir = join69(stagingPath, "node_modules", "@anthropic-ai"), nativePackage = (await readdir8(nodeModulesDir)).find((entry) => entry.startsWith("claude-cli-native-"));
    if (!nativePackage)
      throw logEvent("tengu_native_install_package_failure", {
        stage_find_package: !0,
        error_package_not_found: !0
      }), Error("Could not find platform-specific native package");
    let stagedBinaryPath = join69(nodeModulesDir, nativePackage, "cli");
    try {
      await stat19(stagedBinaryPath);
    } catch {
      throw logEvent("tengu_native_install_package_failure", {
        stage_binary_exists: !0,
        error_binary_not_found: !0
      }), Error("Native binary not found in staged package");
    }
    await atomicMoveToInstallPath(stagedBinaryPath, installPath), await rm5(stagingPath, { recursive: !0, force: !0 }), logEvent("tengu_native_install_package_success", {});
  } catch (error44) {
    let msg = errorMessage(error44);
    if (!msg.includes("Could not find platform-specific") && !msg.includes("Native binary not found"))
      logEvent("tengu_native_install_package_failure", {
        stage_atomic_move: !0,
        error_move_failed: !0
      });
    throw logError2(toError(error44)), error44;
  }
}
