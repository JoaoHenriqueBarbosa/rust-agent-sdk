// function: getAllFilesWithCount
function getAllFilesWithCount(dirPath, baseDir = dirPath, fileList = {}, additionalPatterns = [], ignoredCount = 0) {
  let files = readdirSync4(dirPath), ignoreChecker = buildIgnoreChecker(additionalPatterns);
  for (let file2 of files) {
    let filePath = join36(dirPath, file2), relativePath = relative5(baseDir, filePath);
    if (ignoreChecker.ignores(relativePath)) {
      ignoredCount++;
      continue;
    }
    let stat13 = statSync8(filePath);
    if (stat13.isDirectory())
      ignoredCount = getAllFilesWithCount(filePath, baseDir, fileList, additionalPatterns, ignoredCount).ignoredCount;
    else {
      let zipPath = relativePath.split(sep9).join("/");
      fileList[zipPath] = {
        data: readFileSync13(filePath),
        mode: stat13.mode
      };
    }
  }
  return { files: fileList, ignoredCount };
}
