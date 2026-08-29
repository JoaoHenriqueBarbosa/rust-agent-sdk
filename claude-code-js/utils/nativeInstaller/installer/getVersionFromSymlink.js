// function: getVersionFromSymlink
async function getVersionFromSymlink(symlinkPath) {
  try {
    let target = await readlink(symlinkPath), absoluteTarget = resolve26(dirname30(symlinkPath), target);
    if (await isPossibleClaudeBinary(absoluteTarget))
      return absoluteTarget;
  } catch {}
  return null;
}
