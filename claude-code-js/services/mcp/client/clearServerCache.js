// function: clearServerCache
async function clearServerCache(name3, serverRef) {
  let key2 = getServerCacheKey(name3, serverRef);
  try {
    let wrappedClient = await connectToServer(name3, serverRef);
    if (wrappedClient.type === "connected")
      await wrappedClient.cleanup();
  } catch {}
  connectToServer.cache.delete(key2), fetchToolsForClient.cache.delete(name3), fetchResourcesForClient.cache.delete(name3), fetchCommandsForClient.cache.delete(name3);
}
