// function: computeStickyPromptText
function computeStickyPromptText(msg) {
  let raw = null;
  if (msg.type === "user") {
    if (msg.isMeta || msg.isVisibleInTranscriptOnly)
      return null;
    let block2 = msg.message.content[0];
    if (block2?.type !== "text")
      return null;
    raw = block2.text;
  } else if (msg.type === "attachment" && msg.attachment.type === "queued_command" && msg.attachment.commandMode !== "task-notification" && !msg.attachment.isMeta) {
    let p4 = msg.attachment.prompt;
    raw = typeof p4 === "string" ? p4 : p4.flatMap((b) => b.type === "text" ? [b.text] : []).join(`
`);
  }
  if (raw === null)
    return null;
  let t2 = stripSystemReminders(raw);
  if (t2.startsWith("<") || t2 === "")
    return null;
  return t2;
}
