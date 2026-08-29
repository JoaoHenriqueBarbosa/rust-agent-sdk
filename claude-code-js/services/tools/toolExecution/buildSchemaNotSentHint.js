// function: buildSchemaNotSentHint
function buildSchemaNotSentHint(tool, messages, tools) {
  if (!isToolSearchEnabledOptimistic())
    return null;
  if (!isToolSearchToolAvailable(tools))
    return null;
  if (!isDeferredTool(tool))
    return null;
  if (extractDiscoveredToolNames(messages).has(tool.name))
    return null;
  return `

This tool's schema was not sent to the API \u2014 it was not in the discovered-tool set derived from message history. ` + `Without the schema in your prompt, typed parameters (arrays, numbers, booleans) get emitted as strings and the client-side parser rejects them. Load the tool first: call ${TOOL_SEARCH_TOOL_NAME} with query "select:${tool.name}", then retry this call.`;
}
