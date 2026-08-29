// Original: src/utils/settings/validateEditTool.ts
function validateInputForSettingsFileEdit(filePath, originalContent, getUpdatedContent) {
  if (!isClaudeSettingsPath(filePath))
    return null;
  if (!validateSettingsFileContent(originalContent).isValid)
    return null;
  let updatedContent = getUpdatedContent(), afterValidation = validateSettingsFileContent(updatedContent);
  if (!afterValidation.isValid)
    return {
      result: !1,
      message: `Claude Code settings.json validation failed after edit:
${afterValidation.error}

Full schema:
${afterValidation.fullSchema}
IMPORTANT: Do not update the env unless explicitly instructed to do so.`,
      errorCode: 10
    };
  return null;
}
var init_validateEditTool = __esm(() => {
  init_filesystem();
  init_validation2();
});
