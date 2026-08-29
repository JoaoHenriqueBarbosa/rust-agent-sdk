// function: getSelectedLinesFromIDE
async function getSelectedLinesFromIDE(ideSelection, toolUseContext) {
  let ideName = getConnectedIdeName(toolUseContext.options.mcpClients);
  if (!ideName || ideSelection?.lineStart === void 0 || !ideSelection.text || !ideSelection.filePath)
    return [];
  let appState = toolUseContext.getAppState();
  if (isFileReadDenied(ideSelection.filePath, appState.toolPermissionContext))
    return [];
  return [
    {
      type: "selected_lines_in_ide",
      ideName,
      lineStart: ideSelection.lineStart,
      lineEnd: ideSelection.lineStart + ideSelection.lineCount - 1,
      filename: ideSelection.filePath,
      content: ideSelection.text,
      displayPath: relative19(getCwd(), ideSelection.filePath)
    }
  ];
}
