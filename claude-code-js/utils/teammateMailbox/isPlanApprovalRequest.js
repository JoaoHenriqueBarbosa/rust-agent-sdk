// function: isPlanApprovalRequest
function isPlanApprovalRequest(messageText) {
  try {
    let result = PlanApprovalRequestMessageSchema().safeParse(jsonParse(messageText));
    if (result.success)
      return result.data;
  } catch {}
  return null;
}
