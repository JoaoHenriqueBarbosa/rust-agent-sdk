// function: createCanUseToolWithPermissionPrompt
function createCanUseToolWithPermissionPrompt(permissionPromptTool) {
  let canUseTool = async (tool, input, toolUseContext, assistantMessage, toolUseId, forceDecision) => {
    let mainPermissionResult = forceDecision ?? await hasPermissionsToUseTool(tool, input, toolUseContext, assistantMessage, toolUseId);
    if (mainPermissionResult.behavior === "allow" || mainPermissionResult.behavior === "deny")
      return mainPermissionResult;
    let { signal: combinedSignal, cleanup: cleanupAbortListener } = createCombinedAbortSignal(toolUseContext.abortController.signal);
    if (combinedSignal.aborted)
      return cleanupAbortListener(), {
        behavior: "deny",
        message: "Permission prompt was aborted.",
        decisionReason: {
          type: "permissionPromptTool",
          permissionPromptToolName: tool.name,
          toolResult: void 0
        }
      };
    let abortPromise = new Promise((resolve47) => {
      combinedSignal.addEventListener("abort", () => resolve47("aborted"), {
        once: !0
      });
    }), toolCallPromise = permissionPromptTool.call({
      tool_name: tool.name,
      input,
      tool_use_id: toolUseId
    }, toolUseContext, canUseTool, assistantMessage), raceResult = await Promise.race([toolCallPromise, abortPromise]);
    if (cleanupAbortListener(), raceResult === "aborted" || combinedSignal.aborted)
      return {
        behavior: "deny",
        message: "Permission prompt was aborted.",
        decisionReason: {
          type: "permissionPromptTool",
          permissionPromptToolName: tool.name,
          toolResult: void 0
        }
      };
    let result = raceResult, permissionToolResultBlockParam = permissionPromptTool.mapToolResultToToolResultBlockParam(result.data, "1");
    if (!permissionToolResultBlockParam.content || !Array.isArray(permissionToolResultBlockParam.content) || !permissionToolResultBlockParam.content[0] || permissionToolResultBlockParam.content[0].type !== "text" || typeof permissionToolResultBlockParam.content[0].text !== "string")
      throw Error('Permission prompt tool returned an invalid result. Expected a single text block param with type="text" and a string text value.');
    return permissionPromptToolResultToPermissionDecision(outputSchema33().parse(safeParseJSON(permissionToolResultBlockParam.content[0].text)), permissionPromptTool, input, toolUseContext);
  };
  return canUseTool;
}
