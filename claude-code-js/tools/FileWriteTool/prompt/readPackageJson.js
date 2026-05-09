// function: readPackageJson
function readPackageJson(dirPath) {
  let packageJsonPath = join35(dirPath, "package.json");
  if (existsSync7(packageJsonPath))
    try {
      return JSON.parse(readFileSync12(packageJsonPath, "utf-8"));
    } catch (e) {}
  return {};
}
