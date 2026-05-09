// function: getNetworkRestrictionConfig
function getNetworkRestrictionConfig() {
  if (!config8)
    return {};
  let allowedHosts = config8.network.allowedDomains, deniedHosts = config8.network.deniedDomains;
  return {
    ...allowedHosts.length > 0 && { allowedHosts },
    ...deniedHosts.length > 0 && { deniedHosts }
  };
}
