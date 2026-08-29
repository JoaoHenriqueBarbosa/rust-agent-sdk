// function: getLSPDiagnosticAttachments
async function getLSPDiagnosticAttachments(toolUseContext) {
  if (!toolUseContext.options.tools.some((t2) => toolMatchesName(t2, BASH_TOOL_NAME)))
    return [];
  logForDebugging("LSP Diagnostics: getLSPDiagnosticAttachments called");
  try {
    let diagnosticSets = checkForLSPDiagnostics();
    if (diagnosticSets.length === 0)
      return [];
    logForDebugging(`LSP Diagnostics: Found ${diagnosticSets.length} pending diagnostic set(s)`);
    let attachments = diagnosticSets.map(({ files: files2 }) => ({
      type: "diagnostics",
      files: files2,
      isNew: !0
    }));
    if (diagnosticSets.length > 0)
      clearAllLSPDiagnostics(), logForDebugging(`LSP Diagnostics: Cleared ${diagnosticSets.length} delivered diagnostic(s) from registry`);
    return logForDebugging(`LSP Diagnostics: Returning ${attachments.length} diagnostic attachment(s)`), attachments;
  } catch (error44) {
    let err2 = toError(error44);
    return logError2(Error(`Failed to get LSP diagnostic attachments: ${err2.message}`)), [];
  }
}
