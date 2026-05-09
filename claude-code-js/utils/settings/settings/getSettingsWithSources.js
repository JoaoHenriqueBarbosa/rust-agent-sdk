// function: getSettingsWithSources
function getSettingsWithSources() {
  resetSettingsCache();
  let sources = [];
  for (let source of getEnabledSettingSources()) {
    let settings = getSettingsForSource(source);
    if (settings && Object.keys(settings).length > 0)
      sources.push({ source, settings });
  }
  return { effective: getInitialSettings(), sources };
}
