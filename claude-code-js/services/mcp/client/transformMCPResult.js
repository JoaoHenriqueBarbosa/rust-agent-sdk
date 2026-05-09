// function: transformMCPResult
async function transformMCPResult(result, tool, name3) {
  if (result && typeof result === "object") {
    if ("toolResult" in result)
      return {
        content: String(result.toolResult),
        type: "toolResult"
      };
    if ("structuredContent" in result && result.structuredContent !== void 0)
      return {
        content: jsonStringify(result.structuredContent),
        type: "structuredContent",
        schema: inferCompactSchema(result.structuredContent)
      };
    if ("content" in result && Array.isArray(result.content)) {
      let transformedContent = (await Promise.all(result.content.map((item) => transformResultContent(item, name3)))).flat();
      return {
        content: transformedContent,
        type: "contentArray",
        schema: inferCompactSchema(transformedContent)
      };
    }
  }
  let errorMessage2 = `MCP server "${name3}" tool "${tool}": unexpected response format`;
  throw logMCPError(name3, errorMessage2), new TelemetrySafeError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS(errorMessage2, "MCP tool unexpected response format");
}
