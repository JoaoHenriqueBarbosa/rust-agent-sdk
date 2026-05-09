// function: createToolResultMessage
function createToolResultMessage(tool, toolUseResult) {
  try {
    let result = tool.mapToolResultToToolResultBlockParam(toolUseResult, "1");
    if (Array.isArray(result.content) && result.content.some((block2) => block2.type === "image"))
      return createUserMessage({
        content: result.content,
        isMeta: !0
      });
    let contentStr = typeof result.content === "string" ? result.content : jsonStringify(result.content);
    return createUserMessage({
      content: `Result of calling the ${tool.name} tool:
${contentStr}`,
      isMeta: !0
    });
  } catch {
    return createUserMessage({
      content: `Result of calling the ${tool.name} tool: Error`,
      isMeta: !0
    });
  }
}
