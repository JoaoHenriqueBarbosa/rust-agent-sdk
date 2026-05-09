// function: scanAllSessions
async function scanAllSessions() {
  let projectsDir = getProjectsDir2(), dirents;
  try {
    dirents = await readdir26(projectsDir, { withFileTypes: !0 });
  } catch {
    return [];
  }
  let projectDirs = dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => join133(projectsDir, dirent.name)), allSessions = [];
  for (let i5 = 0;i5 < projectDirs.length; i5++) {
    let sessionFiles = await getSessionFilesWithMtime(projectDirs[i5]);
    for (let [sessionId, fileInfo] of sessionFiles)
      allSessions.push({
        sessionId,
        path: fileInfo.path,
        mtime: fileInfo.mtime,
        size: fileInfo.size
      });
    if (i5 % 10 === 9)
      await new Promise((resolve44) => setImmediate(resolve44));
  }
  return allSessions.sort((a2, b) => b.mtime - a2.mtime), allSessions;
}
