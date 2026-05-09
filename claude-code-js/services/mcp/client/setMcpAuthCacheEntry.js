// function: setMcpAuthCacheEntry
function setMcpAuthCacheEntry(serverId) {
  writeChain = writeChain.then(async () => {
    let cache5 = await getMcpAuthCache();
    cache5[serverId] = { timestamp: Date.now() };
    let cachePath = getMcpAuthCachePath();
    await mkdir8(dirname29(cachePath), { recursive: !0 }), await writeFile10(cachePath, jsonStringify(cache5)), authCachePromise = null;
  }).catch(() => {});
}
