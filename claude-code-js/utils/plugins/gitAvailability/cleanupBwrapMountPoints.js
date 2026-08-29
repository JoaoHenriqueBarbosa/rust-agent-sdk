// function: cleanupBwrapMountPoints
function cleanupBwrapMountPoints(opts) {
  if (!opts?.force) {
    if (activeSandboxCount > 0)
      activeSandboxCount--;
    if (activeSandboxCount > 0) {
      logForDebugging2(`[Sandbox Linux] Deferring mount point cleanup \u2014 ${activeSandboxCount} sandbox(es) still active`);
      return;
    }
  } else
    activeSandboxCount = 0;
  for (let mountPoint of bwrapMountPoints)
    try {
      let stat12 = fs12.statSync(mountPoint);
      if (stat12.isFile() && stat12.size === 0)
        fs12.unlinkSync(mountPoint), logForDebugging2(`[Sandbox Linux] Cleaned up bwrap mount point (file): ${mountPoint}`);
      else if (stat12.isDirectory()) {
        if (fs12.readdirSync(mountPoint).length === 0)
          fs12.rmdirSync(mountPoint), logForDebugging2(`[Sandbox Linux] Cleaned up bwrap mount point (dir): ${mountPoint}`);
      }
    } catch {}
  bwrapMountPoints.clear();
}
