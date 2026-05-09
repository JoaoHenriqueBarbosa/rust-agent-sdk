// function: shouldExclude
function shouldExclude(filePath, additionalPatterns = []) {
  return buildIgnoreChecker(additionalPatterns).ignores(filePath);
}
