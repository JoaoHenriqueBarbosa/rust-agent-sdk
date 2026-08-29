// Original: src/services/mcp/claudeai.ts
function clearClaudeAIMcpConfigsCache() {
  fetchClaudeAIMcpConfigsIfEligible.cache.clear?.(), clearMcpAuthCache();
}
function markClaudeAiMcpConnected(name3) {
  saveGlobalConfig((current) => {
    let seen = current.claudeAiMcpEverConnected ?? [];
    if (seen.includes(name3))
      return current;
    return { ...current, claudeAiMcpEverConnected: [...seen, name3] };
  });
}
function hasClaudeAiMcpEverConnected(name3) {
  return (getGlobalConfig().claudeAiMcpEverConnected ?? []).includes(name3);
}
var FETCH_TIMEOUT_MS = 5000, MCP_SERVERS_BETA_HEADER = "mcp-servers-2025-12-04", fetchClaudeAIMcpConfigsIfEligible;
var init_claudeai = __esm(() => {
  init_axios2();
  init_memoize();
  init_oauth();
  init_auth14();
  init_config4();
  init_debug();
  init_envUtils();
  init_client20();
  fetchClaudeAIMcpConfigsIfEligible = memoize_default(async () => {
    try {
      if (isEnvDefinedFalsy(process.env.ENABLE_CLAUDEAI_MCP_SERVERS))
        return logForDebugging("[claudeai-mcp] Disabled via env var"), logEvent("tengu_claudeai_mcp_eligibility", {
          state: "disabled_env_var"
        }), {};
      let tokens = getClaudeAIOAuthTokens();
      if (!tokens?.accessToken)
        return logForDebugging("[claudeai-mcp] No access token"), logEvent("tengu_claudeai_mcp_eligibility", {
          state: "no_oauth_token"
        }), {};
      if (!tokens.scopes?.includes("user:mcp_servers"))
        return logForDebugging(`[claudeai-mcp] Missing user:mcp_servers scope (scopes=${tokens.scopes?.join(",") || "none"})`), logEvent("tengu_claudeai_mcp_eligibility", {
          state: "missing_scope"
        }), {};
      let url3 = `${getOauthConfig().BASE_API_URL}/v1/mcp_servers?limit=1000`;
      logForDebugging(`[claudeai-mcp] Fetching from ${url3}`);
      let response7 = await axios_default.get(url3, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
          "Content-Type": "application/json",
          "anthropic-beta": MCP_SERVERS_BETA_HEADER,
          "anthropic-version": "2023-06-01"
        },
        timeout: FETCH_TIMEOUT_MS
      }), configs = {}, usedNormalizedNames = /* @__PURE__ */ new Set;
      for (let server of response7.data.data) {
        let baseName = `claude.ai ${server.display_name}`, finalName = baseName, finalNormalized = normalizeNameForMCP(finalName), count3 = 1;
        while (usedNormalizedNames.has(finalNormalized))
          count3++, finalName = `${baseName} (${count3})`, finalNormalized = normalizeNameForMCP(finalName);
        usedNormalizedNames.add(finalNormalized), configs[finalName] = {
          type: "claudeai-proxy",
          url: server.url,
          id: server.id,
          scope: "claudeai"
        };
      }
      return logForDebugging(`[claudeai-mcp] Fetched ${Object.keys(configs).length} servers`), logEvent("tengu_claudeai_mcp_eligibility", {
        state: "eligible"
      }), configs;
    } catch {
      return logForDebugging("[claudeai-mcp] Fetch failed"), {};
    }
  });
});
