// function: shouldAllowManagedMcpServersOnly
function shouldAllowManagedMcpServersOnly() {
  return getSettingsForSource("policySettings")?.allowManagedMcpServersOnly === !0;
}
