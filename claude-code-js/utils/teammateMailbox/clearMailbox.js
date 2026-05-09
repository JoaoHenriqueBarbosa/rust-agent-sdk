// function: clearMailbox
async function clearMailbox(agentName, teamName) {
  let inboxPath = getInboxPath(agentName, teamName);
  try {
    await writeFile17(inboxPath, "[]", { encoding: "utf-8", flag: "r+" }), logForDebugging(`[TeammateMailbox] Cleared inbox for ${agentName}`);
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      return;
    logForDebugging(`Failed to clear inbox for ${agentName}: ${error44}`), logError2(error44);
  }
}
