// function: installFromLocal
async function installFromLocal(sourcePath, targetPath) {
  if (!await pathExists(sourcePath))
    throw Error(`Source path does not exist: ${sourcePath}`);
  await copyDir(sourcePath, targetPath);
  let gitPath = join100(targetPath, ".git");
  await rm11(gitPath, { recursive: !0, force: !0 });
}
