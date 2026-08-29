// function: getCanUseToolFn
function getCanUseToolFn(permissionPromptToolName, structuredIO, getMcpTools, onPermissionPrompt) {
  if (permissionPromptToolName === "stdio")
    return structuredIO.createCanUseTool(onPermissionPrompt);
  if (!permissionPromptToolName)
    return async (tool, input, toolUseContext, assistantMessage, toolUseId, forceDecision) => forceDecision ?? await hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseId);
  let resolved = null;
  return async (tool, input, toolUseContext, assistantMessage, toolUseId, forceDecision) => {
    if (!resolved) {
      let mcpTools = getMcpTools(), permissionPromptTool = mcpTools.find((t2) => toolMatchesName(t2, permissionPromptToolName));
      if (!permissionPromptTool) {
        let error44 = `Error: MCP tool ${permissionPromptToolName} (passed via --permission-prompt-tool) not found. Available MCP tools: ${mcpTools.map((t2) => t2.name).join(", ") || "none"}`;
        throw process.stderr.write(`${error44}
`), gracefulShutdownSync(1), Error(error44);
      }
      if (!permissionPromptTool.inputJSONSchema) {
        let error44 = `Error: tool ${permissionPromptToolName} (passed via --permission-prompt-tool) must be an MCP tool`;
        throw process.stderr.write(`${error44}
`), gracefulShutdownSync(1), Error(error44);
      }
      resolved = createCanUseToolWithPermissionPrompt(permissionPromptTool);
    }
    return resolved(tool, input, toolUseContext, assistantMessage, toolUseId, forceDecision);
  };
}
