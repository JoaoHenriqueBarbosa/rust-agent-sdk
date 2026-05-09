// Original: src/components/permissions/FilePermissionDialog/ideDiffConfig.ts
function createSingleEditDiffConfig(filePath, oldString, newString, replaceAll2) {
  return {
    filePath,
    edits: [
      {
        old_string: oldString,
        new_string: newString,
        replace_all: replaceAll2
      }
    ],
    editMode: "single"
  };
}
