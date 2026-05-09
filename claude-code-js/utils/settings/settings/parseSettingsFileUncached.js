// function: parseSettingsFileUncached
function parseSettingsFileUncached(path9) {
  try {
    let { resolvedPath } = safeResolvePath(getFsImplementation(), path9), content = readFileSync4(resolvedPath);
    if (content.trim() === "")
      return { settings: {}, errors: [] };
    let data = safeParseJSON(content, !1), ruleWarnings = filterInvalidPermissionRules(data, path9), result = SettingsSchema().safeParse(data);
    if (!result.success) {
      let errors3 = formatZodError(result.error, path9);
      return { settings: null, errors: [...ruleWarnings, ...errors3] };
    }
    return { settings: result.data, errors: ruleWarnings };
  } catch (error41) {
    return handleFileSystemError(error41, path9), { settings: null, errors: [] };
  }
}
