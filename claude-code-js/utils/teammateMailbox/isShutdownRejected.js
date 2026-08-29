// function: isShutdownRejected
function isShutdownRejected(messageText) {
  try {
    let result = ShutdownRejectedMessageSchema().safeParse(jsonParse(messageText));
    if (result.success)
      return result.data;
  } catch {}
  return null;
}
