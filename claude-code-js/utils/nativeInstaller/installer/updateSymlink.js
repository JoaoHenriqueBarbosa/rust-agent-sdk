// function: updateSymlink
async function updateSymlink(symlinkPath, targetPath) {
  if (getPlatform3().startsWith("win32"))
    try {
      let parentDir2 = dirname30(symlinkPath);
      await mkdir10(parentDir2, { recursive: !0 });
      let existingStats;
      try {
        existingStats = await stat19(symlinkPath);
      } catch {}
      if (existingStats) {
        try {
          let targetStats = await stat19(targetPath);
          if (existingStats.size === targetStats.size)
            return !1;
        } catch {}
        let oldFileName = `${symlinkPath}.old.${Date.now()}`;
        await rename2(symlinkPath, oldFileName);
        try {
          await copyFile3(targetPath, symlinkPath);
          try {
            await unlink6(oldFileName);
          } catch {}
        } catch (copyError) {
          try {
            await rename2(oldFileName, symlinkPath);
          } catch (restoreError) {
            let errorWithCause = Error(`Failed to restore old executable: ${restoreError}`, { cause: copyError });
            throw logError2(errorWithCause), errorWithCause;
          }
          throw copyError;
        }
      } else
        try {
          await copyFile3(targetPath, symlinkPath);
        } catch (e) {
          if (isENOENT(e))
            throw Error(`Source file does not exist: ${targetPath}`);
          throw e;
        }
      return !0;
    } catch (error44) {
      return logError2(Error(`Failed to copy executable from ${targetPath} to ${symlinkPath}: ${error44}`)), !1;
    }
  let parentDir = dirname30(symlinkPath);
  try {
    await mkdir10(parentDir, { recursive: !0 }), logForDebugging(`Created directory ${parentDir} for symlink`);
  } catch (mkdirError) {
    return logError2(Error(`Failed to create directory ${parentDir}: ${mkdirError}`)), !1;
  }
  try {
    let symlinkExists = !1;
    try {
      await stat19(symlinkPath), symlinkExists = !0;
    } catch {}
    if (symlinkExists) {
      try {
        let currentTarget = await readlink(symlinkPath), resolvedCurrentTarget = resolve26(dirname30(symlinkPath), currentTarget), resolvedTargetPath = resolve26(targetPath);
        if (resolvedCurrentTarget === resolvedTargetPath)
          return !1;
      } catch {}
      await unlink6(symlinkPath);
    }
  } catch (error44) {
    logError2(Error(`Failed to check/remove existing symlink: ${error44}`));
  }
  let tempSymlink = `${symlinkPath}.tmp.${process.pid}.${Date.now()}`;
  try {
    return await symlink2(targetPath, tempSymlink), await rename2(tempSymlink, symlinkPath), logForDebugging(`Atomically updated symlink ${symlinkPath} -> ${targetPath}`), !0;
  } catch (error44) {
    try {
      await unlink6(tempSymlink);
    } catch {}
    return logError2(Error(`Failed to create symlink from ${symlinkPath} to ${targetPath}: ${error44}`)), !1;
  }
}
