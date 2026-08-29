// function: getDiagnosticAttachments
async function getDiagnosticAttachments(toolUseContext) {
  if (!toolUseContext.options.tools.some((t2) => toolMatchesName(t2, BASH_TOOL_NAME)))
    return [];
  let newDiagnostics = await diagnosticTracker.getNewDiagnostics();
  if (newDiagnostics.length === 0)
    return [];
  return [
    {
      type: "diagnostics",
      files: newDiagnostics,
      isNew: !0
    }
  ];
}
