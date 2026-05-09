// function: isCloudInstanceDiscoveryResponse
function isCloudInstanceDiscoveryResponse(response7) {
  return response7.hasOwnProperty("tenant_discovery_endpoint") && response7.hasOwnProperty("metadata");
}
