// function: createToolUseMessage
function createToolUseMessage(toolName, input) {
  return createUserMessage({
    content: `Called the ${toolName} tool with the following input: ${jsonStringify(input)}`,
    isMeta: !0
  });
}
