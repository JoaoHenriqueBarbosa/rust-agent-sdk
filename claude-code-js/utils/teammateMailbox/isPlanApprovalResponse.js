// function: isPlanApprovalResponse
function isPlanApprovalResponse(messageText) {
  try {
    let result = PlanApprovalResponseMessageSchema().safeParse(jsonParse(messageText));
    if (result.success)
      return result.data;
  } catch {}
  return null;
}
