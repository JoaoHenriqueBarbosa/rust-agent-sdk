// function: isShutdownRequest
function isShutdownRequest(messageText) {
  try {
    let result = ShutdownRequestMessageSchema().safeParse(jsonParse(messageText));
    if (result.success)
      return result.data;
  } catch {}
  return null;
}
