// function: addClaims
function addClaims(parameters, claims, clientCapabilities) {
  let mergedClaims = addClientCapabilitiesToClaims(claims, clientCapabilities);
  try {
    JSON.parse(mergedClaims);
  } catch (e) {
    throw createClientConfigurationError(invalidClaims);
  }
  parameters.set(CLAIMS, mergedClaims);
}
