// Original: src/utils/directMemberMessage.ts
function parseDirectMemberMessage(input) {
  let match = input.match(/^@([\w-]+)\s+(.+)$/s);
  if (!match)
    return null;
  let [, recipientName, message] = match;
  if (!recipientName || !message)
    return null;
  let trimmedMessage = message.trim();
  if (!trimmedMessage)
    return null;
  return { recipientName, message: trimmedMessage };
}
async function sendDirectMemberMessage(recipientName, message, teamContext, writeToMailbox2) {
  if (!teamContext || !writeToMailbox2)
    return { success: !1, error: "no_team_context" };
  if (!Object.values(teamContext.teammates ?? {}).find((t2) => t2.name === recipientName))
    return { success: !1, error: "unknown_recipient", recipientName };
  return await writeToMailbox2(recipientName, {
    from: "user",
    text: message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, teamContext.teamName), { success: !0, recipientName };
}
