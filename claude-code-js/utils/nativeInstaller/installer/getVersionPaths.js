// function: getVersionPaths
async function getVersionPaths(version5) {
  let dirs = getBaseDirectories(), dirsToCreate = [dirs.versions, dirs.staging, dirs.locks];
  await Promise.all(dirsToCreate.map((dir) => mkdir10(dir, { recursive: !0 })));
  let executableParentDir = dirname30(dirs.executable);
  await mkdir10(executableParentDir, { recursive: !0 });
  let installPath = join69(dirs.versions, version5);
  try {
    await stat19(installPath);
  } catch {
    await writeFile15(installPath, "", { encoding: "utf8" });
  }
  return {
    stagingPath: join69(dirs.staging, version5),
    installPath
  };
}
