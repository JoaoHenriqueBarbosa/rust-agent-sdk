// function: hasProgressMessage
function hasProgressMessage(data) {
  if (!("message" in data))
    return !1;
  let msg = data.message;
  return msg != null && typeof msg === "object" && "type" in msg;
}
