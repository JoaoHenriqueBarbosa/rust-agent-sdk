// function: getCachedDefaultHttpClient
function getCachedDefaultHttpClient() {
  if (!cachedHttpClient)
    cachedHttpClient = createDefaultHttpClient2();
  return cachedHttpClient;
}
