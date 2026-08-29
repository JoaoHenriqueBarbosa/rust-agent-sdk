// function: normalizeContentFromAPI
function normalizeContentFromAPI(contentBlocks, tools, agentId) {
  if (!contentBlocks)
    return [];
  return contentBlocks.map((contentBlock) => {
    switch (contentBlock.type) {
      case "tool_use": {
        if (typeof contentBlock.input !== "string" && !isObject_default(contentBlock.input))
          throw Error("Tool use input must be a string or object");
        let normalizedInput;
        if (typeof contentBlock.input === "string") {
          let parsed = safeParseJSON(contentBlock.input);
          if (parsed === null && contentBlock.input.length > 0)
            logEvent("tengu_tool_input_json_parse_fail", {
              toolName: sanitizeToolNameForAnalytics(contentBlock.name),
              inputLen: contentBlock.input.length
            });
          normalizedInput = parsed ?? {};
        } else
          normalizedInput = contentBlock.input;
        if (typeof normalizedInput === "object" && normalizedInput !== null) {
          let tool = findToolByName(tools, contentBlock.name);
          if (tool)
            try {
              normalizedInput = normalizeToolInput(tool, normalizedInput, agentId);
            } catch (error44) {
              logError2(Error("Error normalizing tool input: " + error44));
            }
        }
        return {
          ...contentBlock,
          input: normalizedInput
        };
      }
      case "text":
        if (contentBlock.text.trim().length === 0)
          logEvent("tengu_model_whitespace_response", {
            length: contentBlock.text.length
          });
        return contentBlock;
      case "code_execution_tool_result":
      case "mcp_tool_use":
      case "mcp_tool_result":
      case "container_upload":
        return contentBlock;
      case "server_tool_use":
        if (typeof contentBlock.input === "string")
          return {
            ...contentBlock,
            input: safeParseJSON(contentBlock.input) ?? {}
          };
        return contentBlock;
      default:
        return contentBlock;
    }
  });
}
