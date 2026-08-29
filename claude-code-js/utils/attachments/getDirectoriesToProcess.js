// function: getDirectoriesToProcess
function getDirectoriesToProcess(targetPath, originalCwd) {
  let targetDir = dirname39(resolve35(targetPath)), nestedDirs = [], currentDir = targetDir;
  while (currentDir !== originalCwd && currentDir !== parse17(currentDir).root) {
    if (currentDir.startsWith(originalCwd))
      nestedDirs.push(currentDir);
    currentDir = dirname39(currentDir);
  }
  nestedDirs.reverse();
  let cwdLevelDirs = [];
  currentDir = originalCwd;
  while (currentDir !== parse17(currentDir).root)
    cwdLevelDirs.push(currentDir), currentDir = dirname39(currentDir);
  return cwdLevelDirs.reverse(), { nestedDirs, cwdLevelDirs };
}
