// function: parseSettingsFile
function parseSettingsFile(path9) {
  let cached2 = getCachedParsedFile(path9);
  if (cached2)
    return {
      settings: cached2.settings ? clone(cached2.settings) : null,
      errors: cached2.errors
    };
  let result = parseSettingsFileUncached(path9);
  return setCachedParsedFile(path9, result), {
    settings: result.settings ? clone(result.settings) : null,
    errors: result.errors
  };
}
