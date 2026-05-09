// function: getAllFiles
function getAllFiles(dirPath, baseDir = dirPath, fileList = {}, additionalPatterns = []) {
  let files = readdirSync4(dirPath), ignoreChecker = buildIgnoreChecker(additionalPatterns);
  for (let file2 of files) {
    let filePath = join36(dirPath, file2), relativePath = relative5(baseDir, filePath);
    if (ignoreChecker.ignores(relativePath))
      continue;
    if (statSync8(filePath).isDirectory())
      getAllFiles(filePath, baseDir, fileList, additionalPatterns);
    else {
      let zipPath = relativePath.split(sep9).join("/");
      fileList[zipPath] = readFileSync13(filePath);
    }
  }
  return fileList;
}
