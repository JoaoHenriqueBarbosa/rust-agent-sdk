// function: getMcpAllowlistSettings
function getMcpAllowlistSettings() {
  if (shouldAllowManagedMcpServersOnly())
    return getSettingsForSource("policySettings") ?? {};
  return getInitialSettings();
}
