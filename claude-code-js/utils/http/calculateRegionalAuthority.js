// function: calculateRegionalAuthority
function calculateRegionalAuthority(regionalAuthority) {
  let azureRegion = regionalAuthority;
  if (azureRegion === void 0 && globalThis.process?.env?.AZURE_REGIONAL_AUTHORITY_NAME !== void 0)
    azureRegion = process.env.AZURE_REGIONAL_AUTHORITY_NAME;
  if (azureRegion === RegionalAuthority.AutoDiscoverRegion)
    return "AUTO_DISCOVER";
  return azureRegion;
}
