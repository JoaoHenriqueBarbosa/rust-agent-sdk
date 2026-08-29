// function: getInitialSettings
function getInitialSettings() {
  let { settings } = getSettingsWithErrors();
  return settings || {};
}
