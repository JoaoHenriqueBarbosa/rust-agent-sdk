// function: isCloudInstanceDiscoveryErrorResponse
function isCloudInstanceDiscoveryErrorResponse(response7) {
  return response7.hasOwnProperty("error") && response7.hasOwnProperty("error_description");
}
