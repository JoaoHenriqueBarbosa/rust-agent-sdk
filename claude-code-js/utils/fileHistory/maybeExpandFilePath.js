// function: maybeExpandFilePath
function maybeExpandFilePath(filePath) {
  if (isAbsolute14(filePath))
    return filePath;
  return join74(getOriginalCwd(), filePath);
}
