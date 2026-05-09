// Original: src/services/mcp/headersHelper.ts
function isMcpServerFromProjectOrLocalSettings(config10) {
  return config10.scope === "project" || config10.scope === "local";
}
async function getMcpHeadersFromHelper(serverName, config10) {
  if (!config10.headersHelper)
    return null;
  if ("scope" in config10 && isMcpServerFromProjectOrLocalSettings(config10) && !getIsNonInteractiveSession()) {
    if (!checkHasTrustDialogAccepted()) {
      let error44 = Error(`Security: headersHelper for MCP server '${serverName}' executed before workspace trust is confirmed. If you see this message, post in https://github.com/anthropics/claude-code/issues.`);
      return logAntError("MCP headersHelper invoked before trust check", error44), logEvent("tengu_mcp_headersHelper_missing_trust", {}), null;
    }
  }
  try {
    logMCPDebug(serverName, "Executing headersHelper to get dynamic headers");
    let execResult = await execFileNoThrowWithCwd(config10.headersHelper, [], {
      shell: !0,
      timeout: 1e4,
      env: {
        ...process.env,
        CLAUDE_CODE_MCP_SERVER_NAME: serverName,
        CLAUDE_CODE_MCP_SERVER_URL: config10.url
      }
    });
    if (execResult.code !== 0 || !execResult.stdout)
      throw Error(`headersHelper for MCP server '${serverName}' did not return a valid value`);
    let result = execResult.stdout.trim(), headers = jsonParse(result);
    if (typeof headers !== "object" || headers === null || Array.isArray(headers))
      throw Error(`headersHelper for MCP server '${serverName}' must return a JSON object with string key-value pairs`);
    for (let [key2, value] of Object.entries(headers))
      if (typeof value !== "string")
        throw Error(`headersHelper for MCP server '${serverName}' returned non-string value for key "${key2}": ${typeof value}`);
    return logMCPDebug(serverName, `Successfully retrieved ${Object.keys(headers).length} headers from headersHelper`), headers;
  } catch (error44) {
    return logMCPError(serverName, `Error getting headers from headersHelper: ${errorMessage(error44)}`), logError2(Error(`Error getting MCP headers from headersHelper for server '${serverName}': ${errorMessage(error44)}`)), null;
  }
}
async function getMcpServerHeaders(serverName, config10) {
  let staticHeaders = config10.headers || {}, dynamicHeaders = await getMcpHeadersFromHelper(serverName, config10) || {};
  return {
    ...staticHeaders,
    ...dynamicHeaders
  };
}
var init_headersHelper = __esm(() => {
  init_state();
  init_config4();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_log3();
  init_slowOperations();
});
