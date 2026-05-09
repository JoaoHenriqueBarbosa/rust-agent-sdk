// function: markMessagesAsRead
async function markMessagesAsRead(agentName, teamName) {
  let inboxPath = getInboxPath(agentName, teamName);
  logForDebugging(`[TeammateMailbox] markMessagesAsRead called: agentName=${agentName}, teamName=${teamName}, path=${inboxPath}`);
  let lockFilePath = `${inboxPath}.lock`, release;
  try {
    logForDebugging("[TeammateMailbox] markMessagesAsRead: acquiring lock..."), release = await lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS2
    }), logForDebugging("[TeammateMailbox] markMessagesAsRead: lock acquired");
    let messages = await readMailbox(agentName, teamName);
    if (logForDebugging(`[TeammateMailbox] markMessagesAsRead: read ${messages.length} messages after lock`), messages.length === 0) {
      logForDebugging("[TeammateMailbox] markMessagesAsRead: no messages to mark");
      return;
    }
    let unreadCount = count2(messages, (m4) => !m4.read);
    logForDebugging(`[TeammateMailbox] markMessagesAsRead: ${unreadCount} unread of ${messages.length} total`);
    for (let m4 of messages)
      m4.read = !0;
    await writeFile17(inboxPath, jsonStringify(messages, null, 2), "utf-8"), logForDebugging(`[TeammateMailbox] markMessagesAsRead: WROTE ${unreadCount} message(s) as read to ${inboxPath}`);
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT") {
      logForDebugging(`[TeammateMailbox] markMessagesAsRead: file does not exist at ${inboxPath}`);
      return;
    }
    logForDebugging(`[TeammateMailbox] markMessagesAsRead FAILED for ${agentName}: ${error44}`), logError2(error44);
  } finally {
    if (release)
      await release(), logForDebugging("[TeammateMailbox] markMessagesAsRead: lock released");
  }
}
