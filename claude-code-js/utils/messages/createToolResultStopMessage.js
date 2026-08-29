// function: createToolResultStopMessage
function createToolResultStopMessage(toolUseID) {
  return {
    type: "tool_result",
    content: CANCEL_MESSAGE,
    is_error: !0,
    tool_use_id: toolUseID
  };
}
