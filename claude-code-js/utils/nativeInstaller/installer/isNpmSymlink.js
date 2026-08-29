// function: isNpmSymlink
async function isNpmSymlink(executablePath) {
  let targetPath = executablePath;
  if ((await lstat4(executablePath)).isSymbolicLink())
    targetPath = await realpath6(executablePath);
  return targetPath.endsWith(".js") || targetPath.includes("node_modules");
}
