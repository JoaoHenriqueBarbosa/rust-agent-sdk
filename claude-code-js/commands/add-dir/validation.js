// Original: src/commands/add-dir/validation.ts
import { stat as stat6 } from "fs/promises";
import { dirname as dirname13, resolve as resolve10 } from "path";
async function validateDirectoryForWorkspace(directoryPath, permissionContext) {
  if (!directoryPath)
    return {
      resultType: "emptyPath"
    };
  let absolutePath = resolve10(expandPath(directoryPath));
  try {
    if (!(await stat6(absolutePath)).isDirectory())
      return {
        resultType: "notADirectory",
        directoryPath,
        absolutePath
      };
  } catch (e) {
    let code = getErrnoCode(e);
    if (code === "ENOENT" || code === "ENOTDIR" || code === "EACCES" || code === "EPERM")
      return {
        resultType: "pathNotFound",
        directoryPath,
        absolutePath
      };
    throw e;
  }
  let currentWorkingDirs = allWorkingDirectories(permissionContext);
  for (let workingDir of currentWorkingDirs)
    if (pathInWorkingPath(absolutePath, workingDir))
      return {
        resultType: "alreadyInWorkingDirectory",
        directoryPath,
        workingDir
      };
  return {
    resultType: "success",
    absolutePath
  };
}
function addDirHelpMessage(result) {
  switch (result.resultType) {
    case "emptyPath":
      return "Please provide a directory path.";
    case "pathNotFound":
      return `Path ${source_default.bold(result.absolutePath)} was not found.`;
    case "notADirectory": {
      let parentDir = dirname13(result.absolutePath);
      return `${source_default.bold(result.directoryPath)} is not a directory. Did you mean to add the parent directory ${source_default.bold(parentDir)}?`;
    }
    case "alreadyInWorkingDirectory":
      return `${source_default.bold(result.directoryPath)} is already accessible within the existing working directory ${source_default.bold(result.workingDir)}.`;
    case "success":
      return `Added ${source_default.bold(result.absolutePath)} as a working directory.`;
  }
}
var init_validation3 = __esm(() => {
  init_source();
  init_errors();
  init_path2();
  init_filesystem();
});
