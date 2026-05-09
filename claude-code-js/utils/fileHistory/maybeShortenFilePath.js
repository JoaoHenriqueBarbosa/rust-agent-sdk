// function: maybeShortenFilePath
function maybeShortenFilePath(filePath) {
  if (!isAbsolute14(filePath))
    return filePath;
  let cwd2 = getOriginalCwd();
  if (filePath.startsWith(cwd2))
    return relative10(cwd2, filePath);
  return filePath;
}
