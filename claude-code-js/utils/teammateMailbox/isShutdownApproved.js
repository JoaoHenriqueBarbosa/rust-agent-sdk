// function: isShutdownApproved
function isShutdownApproved(messageText) {
  try {
    let result = ShutdownApprovedMessageSchema().safeParse(jsonParse(messageText));
    if (result.success)
      return result.data;
  } catch {}
  return null;
}
