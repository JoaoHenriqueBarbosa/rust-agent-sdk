// function: getDefaultProxySettingsInternal
function getDefaultProxySettingsInternal() {
  let envProxy = loadEnvironmentProxyValue();
  return envProxy ? new URL(envProxy) : void 0;
}
