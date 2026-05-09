// function: isModeSetRequest
function isModeSetRequest(messageText) {
  try {
    let parsed = ModeSetRequestMessageSchema().safeParse(jsonParse(messageText));
    if (parsed.success)
      return parsed.data;
  } catch {}
  return null;
}
