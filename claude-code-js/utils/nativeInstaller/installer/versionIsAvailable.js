// function: versionIsAvailable
async function versionIsAvailable(version5) {
  let { installPath } = await getVersionPaths(version5);
  return isPossibleClaudeBinary(installPath);
}
