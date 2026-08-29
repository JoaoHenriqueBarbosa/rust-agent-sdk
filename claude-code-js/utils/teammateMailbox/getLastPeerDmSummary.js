// function: getLastPeerDmSummary
function getLastPeerDmSummary(messages) {
  for (let i5 = messages.length - 1;i5 >= 0; i5--) {
    let msg = messages[i5];
    if (!msg)
      continue;
    if (msg.type === "user" && typeof msg.message.content === "string")
      break;
    if (msg.type !== "assistant")
      continue;
    for (let block2 of msg.message.content)
      if (block2.type === "tool_use" && block2.name === SEND_MESSAGE_TOOL_NAME && typeof block2.input === "object" && block2.input !== null && "to" in block2.input && typeof block2.input.to === "string" && block2.input.to !== "*" && block2.input.to.toLowerCase() !== TEAM_LEAD_NAME.toLowerCase() && "message" in block2.input && typeof block2.input.message === "string") {
        let to = block2.input.to, summary = "summary" in block2.input && typeof block2.input.summary === "string" ? block2.input.summary : block2.input.message.slice(0, 80);
        return `[to ${to}] ${summary}`;
      }
  }
  return;
}
