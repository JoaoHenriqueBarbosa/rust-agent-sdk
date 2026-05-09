// function: removeDirectoryIfEmpty
async function removeDirectoryIfEmpty(path16) {
  try {
    await rmdir(path16), logForDebugging(`Removed empty directory at ${path16}`);
  } catch (error44) {
    let code = getErrnoCode(error44);
    if (code !== "ENOTDIR" && code !== "ENOENT" && code !== "ENOTEMPTY")
      logForDebugging(`Could not remove directory at ${path16}: ${error44}`);
  }
}
