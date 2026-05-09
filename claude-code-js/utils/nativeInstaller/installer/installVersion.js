// function: installVersion
async function installVersion(stagingPath, installPath, downloadType) {
  if (downloadType === "npm")
    await installVersionFromPackage(stagingPath, installPath);
  else
    await installVersionFromBinary(stagingPath, installPath);
}
