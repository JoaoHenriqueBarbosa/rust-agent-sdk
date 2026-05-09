// function: seedDirFor
function seedDirFor(installLocation) {
  return getPluginSeedDirs().find((d) => installLocation === d || installLocation.startsWith(d + sep21));
}
