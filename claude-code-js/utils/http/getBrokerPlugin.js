// function: getBrokerPlugin
function getBrokerPlugin(isVSCodePlugin) {
  let { credentialName, packageName, pluginVar, brokerInfo } = brokerConfig[isVSCodePlugin ? "vsCode" : "native"];
  if (brokerInfo === void 0)
    throw Error(brokerErrorTemplates.missing(credentialName, packageName, pluginVar));
  if (brokerInfo.broker.isBrokerAvailable === !1)
    throw Error(brokerErrorTemplates.unavailable(credentialName, packageName));
  return brokerInfo.broker;
}
