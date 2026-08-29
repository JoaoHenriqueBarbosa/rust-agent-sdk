// function: handleOrphanedPermissionResponse
async function handleOrphanedPermissionResponse({
  message,
  setAppState,
  onEnqueued,
  handledToolUseIds
}) {
  if (message.response.subtype === "success" && message.response.response?.toolUseID && typeof message.response.response.toolUseID === "string") {
    let permissionResult = message.response.response, { toolUseID } = permissionResult;
    if (!toolUseID)
      return !1;
    if (logForDebugging(`handleOrphanedPermissionResponse: received orphaned control_response for toolUseID=${toolUseID} request_id=${message.response.request_id}`), handledToolUseIds.has(toolUseID))
      return logForDebugging(`handleOrphanedPermissionResponse: skipping duplicate orphaned permission for toolUseID=${toolUseID} (already handled)`), !1;
    let assistantMessage = await findUnresolvedToolUse(toolUseID);
    if (!assistantMessage)
      return logForDebugging(`handleOrphanedPermissionResponse: no unresolved tool_use found for toolUseID=${toolUseID} (already resolved in transcript)`), !1;
    return handledToolUseIds.add(toolUseID), logForDebugging(`handleOrphanedPermissionResponse: enqueuing orphaned permission for toolUseID=${toolUseID} messageID=${assistantMessage.message.id}`), enqueue({
      mode: "orphaned-permission",
      value: [],
      orphanedPermission: {
        permissionResult,
        assistantMessage
      }
    }), onEnqueued?.(), !0;
  }
  return !1;
}
