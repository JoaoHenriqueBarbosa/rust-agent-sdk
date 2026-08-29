// function: processMCPResult
async function processMCPResult(result, tool, name3) {
  let { content, type, schema: schema5 } = await transformMCPResult(result, tool, name3);
  if (name3 === "ide")
    return content;
  if (!await mcpContentNeedsTruncation(content))
    return content;
  let sizeEstimateTokens = getContentSizeEstimate(content);
  if (isEnvDefinedFalsy(process.env.ENABLE_MCP_LARGE_OUTPUT_FILES))
    return logEvent("tengu_mcp_large_result_handled", {
      outcome: "truncated",
      reason: "env_disabled",
      sizeEstimateTokens
    }), await truncateMcpContentIfNeeded(content);
  if (!content)
    return content;
  if (contentContainsImages(content))
    return logEvent("tengu_mcp_large_result_handled", {
      outcome: "truncated",
      reason: "contains_images",
      sizeEstimateTokens
    }), await truncateMcpContentIfNeeded(content);
  let timestamp = Date.now(), persistId = `mcp-${normalizeNameForMCP(name3)}-${normalizeNameForMCP(tool)}-${timestamp}`, contentStr = typeof content === "string" ? content : jsonStringify(content, null, 2), persistResult = await persistToolResult(contentStr, persistId);
  if (isPersistError(persistResult)) {
    let contentLength = contentStr.length;
    return logEvent("tengu_mcp_large_result_handled", {
      outcome: "truncated",
      reason: "persist_failed",
      sizeEstimateTokens
    }), `Error: result (${contentLength.toLocaleString()} characters) exceeds maximum allowed tokens. Failed to save output to file: ${persistResult.error}. If this MCP server provides pagination or filtering tools, use them to retrieve specific portions of the data.`;
  }
  logEvent("tengu_mcp_large_result_handled", {
    outcome: "persisted",
    reason: "file_saved",
    sizeEstimateTokens,
    persistedSizeChars: persistResult.originalSize
  });
  let formatDescription = getFormatDescription(type, schema5);
  return getLargeOutputInstructions(persistResult.filepath, persistResult.originalSize, formatDescription);
}
