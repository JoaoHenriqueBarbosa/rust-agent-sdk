// function: handleFileSystemError
function handleFileSystemError(error41, path9) {
  if (typeof error41 === "object" && error41 && "code" in error41 && error41.code === "ENOENT")
    logForDebugging(`Broken symlink or missing file encountered for settings.json at path: ${path9}`);
  else
    logError2(error41);
}
