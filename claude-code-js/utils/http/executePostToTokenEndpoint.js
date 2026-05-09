// function: executePostToTokenEndpoint
async function executePostToTokenEndpoint(tokenEndpoint, queryString, headers, thumbprint, correlationId, cacheManager, networkClient, logger10, performanceClient, serverTelemetryManager) {
  let response7 = await sendPostRequest(thumbprint, tokenEndpoint, { body: queryString, headers }, correlationId, cacheManager, networkClient, logger10, performanceClient);
  if (serverTelemetryManager && response7.status < 500 && response7.status !== 429)
    serverTelemetryManager.clearTelemetryCache();
  return response7;
}
