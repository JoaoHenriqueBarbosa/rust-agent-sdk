// function: copyDir
async function copyDir(src, dest) {
  await getFsImplementation().mkdir(dest);
  let entries2 = await readdir18(src, { withFileTypes: !0 });
  for (let entry of entries2) {
    let srcPath = join100(src, entry.name), destPath = join100(dest, entry.name);
    if (entry.isDirectory())
      await copyDir(srcPath, destPath);
    else if (entry.isFile())
      await copyFile7(srcPath, destPath);
    else if (entry.isSymbolicLink()) {
      let linkTarget = await readlink2(srcPath), resolvedTarget;
      try {
        resolvedTarget = await realpath10(srcPath);
      } catch {
        await symlink3(linkTarget, destPath);
        continue;
      }
      let resolvedSrc;
      try {
        resolvedSrc = await realpath10(src);
      } catch {
        resolvedSrc = src;
      }
      let srcPrefix = resolvedSrc.endsWith(sep23) ? resolvedSrc : resolvedSrc + sep23;
      if (resolvedTarget.startsWith(srcPrefix) || resolvedTarget === resolvedSrc) {
        let targetRelativeToSrc = relative20(resolvedSrc, resolvedTarget), destTargetPath = join100(dest, targetRelativeToSrc), relativeLinkPath = relative20(dirname46(destPath), destTargetPath);
        await symlink3(relativeLinkPath, destPath);
      } else
        await symlink3(resolvedTarget, destPath);
    }
  }
}
