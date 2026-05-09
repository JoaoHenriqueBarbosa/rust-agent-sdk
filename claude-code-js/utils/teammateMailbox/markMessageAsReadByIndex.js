// function: markMessageAsReadByIndex
async function markMessageAsReadByIndex(agentName, teamName, messageIndex) {
  let inboxPath = getInboxPath(agentName, teamName);
  logForDebugging(`[TeammateMailbox] markMessageAsReadByIndex called: agentName=${agentName}, teamName=${teamName}, index=${messageIndex}, path=${inboxPath}`);
  let lockFilePath = `${inboxPath}.lock`, release;
  try {
    logForDebugging("[TeammateMailbox] markMessageAsReadByIndex: acquiring lock..."), release = await lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS2
    }), logForDebugging("[TeammateMailbox] markMessageAsReadByIndex: lock acquired");
    let messages = await readMailbox(agentName, teamName);
    if (logForDebugging(`[TeammateMailbox] markMessageAsReadByIndex: read ${messages.length} messages after lock`), messageIndex < 0 || messageIndex >= messages.length) {
      logForDebugging(`[TeammateMailbox] markMessageAsReadByIndex: index ${messageIndex} out of bounds (${messages.length} messages)`);
      return;
    }
    let message = messages[messageIndex];
    if (!message || message.read) {
      logForDebugging("[TeammateMailbox] markMessageAsReadByIndex: message already read or missing");
      return;
    }
    messages[messageIndex] = { ...message, read: !0 }, await writeFile17(inboxPath, jsonStringify(messages, null, 2), "utf-8"), logForDebugging(`[TeammateMailbox] markMessageAsReadByIndex: marked message at index ${messageIndex} as read`);
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT") {
      logForDebugging(`[TeammateMailbox] markMessageAsReadByIndex: file does not exist at ${inboxPath}`);
      return;
    }
    logForDebugging(`[TeammateMailbox] markMessageAsReadByIndex FAILED for ${agentName}: ${error44}`), logError2(error44);
  } finally {
    if (release)
      await release(), logForDebugging("[TeammateMailbox] markMessageAsReadByIndex: lock released");
  }
}
