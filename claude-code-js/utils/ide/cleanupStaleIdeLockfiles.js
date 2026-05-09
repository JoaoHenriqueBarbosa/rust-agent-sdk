// function: cleanupStaleIdeLockfiles
async function cleanupStaleIdeLockfiles() {
  try {
    let lockfiles = await getSortedIdeLockfiles();
    for (let lockfilePath of lockfiles) {
      let lockfileInfo = await readIdeLockfile(lockfilePath);
      if (!lockfileInfo) {
        try {
          await getFsImplementation().unlink(lockfilePath);
        } catch (error44) {
          logError2(error44);
        }
        continue;
      }
      let host = await detectHostIP(lockfileInfo.runningInWindows, lockfileInfo.port), shouldDelete = !1;
      if (lockfileInfo.pid) {
        if (!isProcessRunning2(lockfileInfo.pid)) {
          if (getPlatform() !== "wsl")
            shouldDelete = !0;
          else if (!await checkIdeConnection(host, lockfileInfo.port))
            shouldDelete = !0;
        }
      } else if (!await checkIdeConnection(host, lockfileInfo.port))
        shouldDelete = !0;
      if (shouldDelete)
        try {
          await getFsImplementation().unlink(lockfilePath);
        } catch (error44) {
          logError2(error44);
        }
    }
  } catch (error44) {
    logError2(error44);
  }
}
