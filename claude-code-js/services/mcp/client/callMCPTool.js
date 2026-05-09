// function: callMCPTool
async function callMCPTool({
  client: { client: client15, name: name3, config: config10 },
  tool,
  args,
  meta,
  signal,
  onProgress
}) {
  let toolStartTime = Date.now(), progressInterval;
  try {
    logMCPDebug(name3, `Calling MCP tool: ${tool}`), progressInterval = setInterval((startTime, name4, tool2) => {
      let elapsed2 = Date.now() - startTime, duration4 = `${Math.floor(elapsed2 / 1000)}s`;
      logMCPDebug(name4, `Tool '${tool2}' still running (${duration4} elapsed)`);
    }, 30000, toolStartTime, name3, tool);
    let timeoutMs = getMcpToolTimeoutMs(), timeoutId, timeoutPromise = new Promise((_, reject2) => {
      timeoutId = setTimeout((reject3, name4, tool2, timeoutMs2) => {
        reject3(new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(`MCP server "${name4}" tool "${tool2}" timed out after ${Math.floor(timeoutMs2 / 1000)}s`, "MCP tool timeout"));
      }, timeoutMs, reject2, name3, tool, timeoutMs);
    }), result = await Promise.race([
      client15.callTool({
        name: tool,
        arguments: args,
        _meta: meta
      }, CallToolResultSchema, {
        signal,
        timeout: timeoutMs,
        onprogress: onProgress ? (sdkProgress) => {
          onProgress({
            type: "mcp_progress",
            status: "progress",
            serverName: name3,
            toolName: tool,
            progress: sdkProgress.progress,
            total: sdkProgress.total,
            progressMessage: sdkProgress.message
          });
        } : void 0
      }),
      timeoutPromise
    ]).finally(() => {
      if (timeoutId)
        clearTimeout(timeoutId);
    });
    if ("isError" in result && result.isError) {
      let errorDetails = "Unknown error";
      if ("content" in result && Array.isArray(result.content) && result.content.length > 0) {
        let firstContent = result.content[0];
        if (firstContent && typeof firstContent === "object" && "text" in firstContent)
          errorDetails = firstContent.text;
      } else if ("error" in result)
        errorDetails = String(result.error);
      throw logMCPError(name3, errorDetails), new McpToolCallError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(errorDetails, "MCP tool returned error", "_meta" in result && result._meta ? { _meta: result._meta } : void 0);
    }
    let elapsed = Date.now() - toolStartTime, duration3 = elapsed < 1000 ? `${elapsed}ms` : elapsed < 60000 ? `${Math.floor(elapsed / 1000)}s` : `${Math.floor(elapsed / 60000)}m ${Math.floor(elapsed % 60000 / 1000)}s`;
    logMCPDebug(name3, `Tool '${tool}' completed successfully in ${duration3}`);
    let codeIndexingTool = detectCodeIndexingFromMcpServerName(name3);
    if (codeIndexingTool)
      logEvent("tengu_code_indexing_tool_used", {
        tool: codeIndexingTool,
        source: "mcp",
        success: !0
      });
    return {
      content: await processMCPResult(result, tool, name3),
      _meta: result._meta,
      structuredContent: result.structuredContent
    };
  } catch (e) {
    if (progressInterval !== void 0)
      clearInterval(progressInterval);
    let elapsed = Date.now() - toolStartTime;
    if (e instanceof Error && e.name !== "AbortError")
      logMCPDebug(name3, `Tool '${tool}' failed after ${Math.floor(elapsed / 1000)}s: ${e.message}`);
    if (e instanceof Error) {
      if (("code" in e ? e.code : void 0) === 401 || e instanceof UnauthorizedError)
        throw logMCPDebug(name3, "Tool call returned 401 Unauthorized - token may have expired"), logEvent("tengu_mcp_tool_call_auth_error", {}), new McpAuthError(name3, `MCP server "${name3}" requires re-authorization (token expired)`);
      let isSessionExpired = isMcpSessionExpiredError(e), isConnectionClosedOnHttp = "code" in e && e.code === -32000 && e.message.includes("Connection closed") && (config10.type === "http" || config10.type === "claudeai-proxy");
      if (isSessionExpired || isConnectionClosedOnHttp)
        throw logMCPDebug(name3, `MCP session expired during tool call (${isSessionExpired ? "404/-32001" : "connection closed"}), clearing connection cache for re-initialization`), logEvent("tengu_mcp_session_expired", {}), await clearServerCache(name3, config10), new McpSessionExpiredError(name3);
    }
    if (!(e instanceof Error) || e.name !== "AbortError")
      throw e;
    return { content: void 0 };
  } finally {
    if (progressInterval !== void 0)
      clearInterval(progressInterval);
  }
}
