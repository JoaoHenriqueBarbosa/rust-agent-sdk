// function: cleanupNpmInstallations
async function cleanupNpmInstallations() {
  let errors8 = [], warnings = [], removed = 0, codePackageResult = await attemptNpmUninstall("@anthropic-ai/claude-code");
  if (codePackageResult.success) {
    if (removed++, codePackageResult.warning)
      warnings.push(codePackageResult.warning);
  } else if (codePackageResult.error)
    errors8.push(codePackageResult.error);
  let localInstallDir = join69(homedir23(), ".claude", "local");
  try {
    await rm5(localInstallDir, { recursive: !0 }), removed++, logForDebugging(`Removed local installation at ${localInstallDir}`);
  } catch (error44) {
    if (!isENOENT(error44))
      errors8.push(`Failed to remove ${localInstallDir}: ${error44}`), logForDebugging(`Failed to remove local installation: ${error44}`, {
        level: "error"
      });
  }
  return { removed, errors: errors8, warnings };
}
