// function: readMailbox
async function readMailbox(agentName, teamName) {
  let inboxPath = getInboxPath(agentName, teamName);
  logForDebugging(`[TeammateMailbox] readMailbox: path=${inboxPath}`);
  try {
    let content = await readFile20(inboxPath, "utf-8"), messages = jsonParse(content);
    return logForDebugging(`[TeammateMailbox] readMailbox: read ${messages.length} message(s)`), messages;
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      return logForDebugging("[TeammateMailbox] readMailbox: file does not exist"), [];
    return logForDebugging(`Failed to read inbox for ${agentName}: ${error44}`), logError2(error44), [];
  }
}
