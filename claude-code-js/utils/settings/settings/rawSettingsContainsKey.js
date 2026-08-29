// function: rawSettingsContainsKey
function rawSettingsContainsKey(key) {
  for (let source of getEnabledSettingSources()) {
    if (source === "policySettings")
      continue;
    let filePath = getSettingsFilePathForSource(source);
    if (!filePath)
      continue;
    try {
      let { resolvedPath } = safeResolvePath(getFsImplementation(), filePath), content = readFileSync4(resolvedPath);
      if (!content.trim())
        continue;
      let rawData = safeParseJSON(content, !1);
      if (rawData && typeof rawData === "object" && key in rawData)
        return !0;
    } catch (error41) {
      handleFileSystemError(error41, filePath);
    }
  }
  return !1;
}
