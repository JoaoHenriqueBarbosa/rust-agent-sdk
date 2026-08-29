// function: areMcpConfigsAllowedWithEnterpriseMcpConfig
function areMcpConfigsAllowedWithEnterpriseMcpConfig(configs) {
  return Object.values(configs).every((c3) => c3.type === "sdk" && c3.name === "claude-vscode");
}
