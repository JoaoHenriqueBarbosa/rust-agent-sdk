// function: atomicMoveToInstallPath
async function atomicMoveToInstallPath(stagedBinaryPath, installPath) {
  await mkdir10(dirname30(installPath), { recursive: !0 });
  let tempInstallPath = `${installPath}.tmp.${process.pid}.${Date.now()}`;
  try {
    await copyFile3(stagedBinaryPath, tempInstallPath), await chmod5(tempInstallPath, 493), await rename2(tempInstallPath, installPath), logForDebugging(`Atomically installed binary to ${installPath}`);
  } catch (error44) {
    try {
      await unlink6(tempInstallPath);
    } catch {}
    throw error44;
  }
}
