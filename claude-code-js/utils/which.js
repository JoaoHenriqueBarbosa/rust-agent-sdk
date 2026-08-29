// Original: src/utils/which.ts
async function whichNodeAsync(command) {
  if (process.platform === "win32") {
    let result2 = await execa(`where.exe ${command}`, {
      shell: !0,
      stderr: "ignore",
      reject: !1
    });
    if (result2.exitCode !== 0 || !result2.stdout)
      return null;
    return result2.stdout.trim().split(/\r?\n/)[0] || null;
  }
  let result = await execa(`which ${command}`, {
    shell: !0,
    stderr: "ignore",
    reject: !1
  });
  if (result.exitCode !== 0 || !result.stdout)
    return null;
  return result.stdout.trim();
}
function whichNodeSync(command) {
  if (process.platform === "win32")
    try {
      return execSync_DEPRECATED(`where.exe ${command}`, {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"]
      }).toString().trim().split(/\r?\n/)[0] || null;
    } catch {
      return null;
    }
  try {
    return execSync_DEPRECATED(`which ${command}`, {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"]
    }).toString().trim() || null;
  } catch {
    return null;
  }
}
var bunWhich, which, whichSync;
var init_which = __esm(() => {
  init_execa();
  init_execSyncWrapper();
  bunWhich = typeof Bun < "u" && typeof Bun.which === "function" ? Bun.which : null, which = bunWhich ? async (command) => bunWhich(command) : whichNodeAsync, whichSync = bunWhich ?? whichNodeSync;
});
