// function: enforceResourceParameter
function enforceResourceParameter(isMcp, request2) {
  if (!isMcp)
    return;
  if (request2.resource && (containsResourceParam(request2.extraParameters) || containsResourceParam(request2.extraQueryParameters)))
    throw createClientAuthError(misplacedResourceParam);
  if (!request2.resource)
    throw createClientAuthError(resourceParameterRequired);
}
