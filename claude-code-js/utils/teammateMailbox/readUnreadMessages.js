// function: readUnreadMessages
async function readUnreadMessages(agentName, teamName) {
  let messages = await readMailbox(agentName, teamName), unread = messages.filter((m4) => !m4.read);
  return logForDebugging(`[TeammateMailbox] readUnreadMessages: ${unread.length} unread of ${messages.length} total`), unread;
}
