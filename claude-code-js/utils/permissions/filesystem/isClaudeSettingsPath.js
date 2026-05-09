// function: isClaudeSettingsPath
function isClaudeSettingsPath(filePath) {
  let expandedPath = expandPath(filePath), normalizedPath = normalizeCaseForComparison2(expandedPath);
  if (normalizedPath.endsWith(`${sep32}.claude${sep32}settings.json`) || normalizedPath.endsWith(`${sep32}.claude${sep32}settings.local.json`))
    return !0;
  return getSettingsPaths().some((settingsPath) => normalizeCaseForComparison2(settingsPath) === normalizedPath);
}
