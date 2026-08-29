// function: getNestedMemoryAttachmentsForFile
async function getNestedMemoryAttachmentsForFile(filePath, toolUseContext, appState) {
  let attachments = [];
  try {
    if (!pathInAllowedWorkingPath(filePath, appState.toolPermissionContext))
      return attachments;
    let processedPaths = /* @__PURE__ */ new Set, originalCwd = getOriginalCwd(), managedUserRules = await getManagedAndUserConditionalRules(filePath, processedPaths);
    attachments.push(...memoryFilesToAttachments(managedUserRules, toolUseContext, filePath));
    let { nestedDirs, cwdLevelDirs } = getDirectoriesToProcess(filePath, originalCwd);
    for (let dir of nestedDirs) {
      let memoryFiles = await getMemoryFilesForNestedDirectory(dir, filePath, processedPaths);
      attachments.push(...memoryFilesToAttachments(memoryFiles, toolUseContext, filePath));
    }
    for (let dir of cwdLevelDirs) {
      let conditionalRules = (await getConditionalRulesForCwdLevelDirectory(dir, filePath, processedPaths)).filter((f) => !skipProjectLevel || f.type !== "Project" && f.type !== "Local");
      attachments.push(...memoryFilesToAttachments(conditionalRules, toolUseContext, filePath));
    }
  } catch (error44) {
    logError2(error44);
  }
  return attachments;
}
