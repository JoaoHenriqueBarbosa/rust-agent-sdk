// function: handleRemoteAuthFailure
function handleRemoteAuthFailure(name3, serverRef, transportType) {
  return logEvent("tengu_mcp_server_needs_auth", {
    transportType,
    ...mcpBaseUrlAnalytics(serverRef)
  }), logMCPDebug(name3, `Authentication required for ${{
    sse: "SSE",
    http: "HTTP",
    "claudeai-proxy": "claude.ai proxy"
  }[transportType]} server`), setMcpAuthCacheEntry(name3), { name: name3, type: "needs-auth", config: serverRef };
}
