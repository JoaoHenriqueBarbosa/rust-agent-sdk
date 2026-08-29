// function: isIdleNotification
function isIdleNotification(messageText) {
  try {
    let parsed = jsonParse(messageText);
    if (parsed && parsed.type === "idle_notification")
      return parsed;
  } catch {}
  return null;
}
