// function: getSortedIdeLockfiles
async function getSortedIdeLockfiles() {
  try {
    let ideLockFilePaths = await getIdeLockfilesPaths();
    return (await Promise.all(ideLockFilePaths.map(async (ideLockFilePath) => {
      try {
        let lockEntries = (await getFsImplementation().readdir(ideLockFilePath)).filter((file2) => file2.name.endsWith(".lock"));
        return (await Promise.all(lockEntries.map(async (file2) => {
          let fullPath = join57(ideLockFilePath, file2.name);
          try {
            let fileStat = await getFsImplementation().stat(fullPath);
            return { path: fullPath, mtime: fileStat.mtime };
          } catch {
            return null;
          }
        }))).filter((s2) => s2 !== null);
      } catch (error44) {
        if (!isFsInaccessible(error44))
          logError2(error44);
        return [];
      }
    }))).flat().sort((a2, b) => b.mtime.getTime() - a2.mtime.getTime()).map((file2) => file2.path);
  } catch (error44) {
    return logError2(error44), [];
  }
}
