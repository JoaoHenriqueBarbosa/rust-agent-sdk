// function: getSettingsForSource
function getSettingsForSource(source) {
  let cached2 = getCachedSettingsForSource(source);
  if (cached2 !== void 0)
    return cached2;
  let result = getSettingsForSourceUncached(source);
  return setCachedSettingsForSource(source, result), result;
}
