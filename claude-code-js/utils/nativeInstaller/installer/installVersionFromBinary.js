// function: installVersionFromBinary
async function installVersionFromBinary(stagingPath, installPath) {
  try {
    let platform5 = getPlatform3(), binaryName = getBinaryName(platform5), stagedBinaryPath = join69(stagingPath, binaryName);
    try {
      await stat19(stagedBinaryPath);
    } catch {
      throw logEvent("tengu_native_install_binary_failure", {
        stage_binary_exists: !0,
        error_binary_not_found: !0
      }), Error("Staged binary not found");
    }
    await atomicMoveToInstallPath(stagedBinaryPath, installPath), await rm5(stagingPath, { recursive: !0, force: !0 }), logEvent("tengu_native_install_binary_success", {});
  } catch (error44) {
    if (!errorMessage(error44).includes("Staged binary not found"))
      logEvent("tengu_native_install_binary_failure", {
        stage_atomic_move: !0,
        error_move_failed: !0
      });
    throw logError2(toError(error44)), error44;
  }
}
