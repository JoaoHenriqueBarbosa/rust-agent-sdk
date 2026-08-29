// function: getOpenedFileFromIDE
async function getOpenedFileFromIDE(ideSelection, toolUseContext) {
  if (!ideSelection?.filePath || ideSelection.text)
    return [];
  let appState = toolUseContext.getAppState();
  if (isFileReadDenied(ideSelection.filePath, appState.toolPermissionContext))
    return [];
  return [
    ...await getNestedMemoryAttachmentsForFile(ideSelection.filePath, toolUseContext, appState),
    {
      type: "opened_file_in_ide",
      filename: ideSelection.filePath
    }
  ];
}
