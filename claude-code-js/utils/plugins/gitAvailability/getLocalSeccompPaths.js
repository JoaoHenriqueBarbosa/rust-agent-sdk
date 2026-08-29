// function: getLocalSeccompPaths
function getLocalSeccompPaths(filename) {
  let arch2 = getVendorArchitecture();
  if (!arch2)
    return [];
  let baseDir = dirname19(fileURLToPath5(import.meta.url)), relativePath = join31("vendor", "seccomp", arch2, filename);
  return [
    join31(baseDir, relativePath),
    join31(baseDir, "..", "..", relativePath),
    join31(baseDir, "..", relativePath)
  ];
}
