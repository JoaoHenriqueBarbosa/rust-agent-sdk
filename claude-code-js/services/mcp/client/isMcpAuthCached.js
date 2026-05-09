// function: isMcpAuthCached
async function isMcpAuthCached(serverId) {
  let entry = (await getMcpAuthCache())[serverId];
  if (!entry)
    return !1;
  return Date.now() - entry.timestamp < MCP_AUTH_CACHE_TTL_MS;
}
