// function: markMessagesAsReadByPredicate
async function markMessagesAsReadByPredicate(agentName, predicate, teamName) {
  let inboxPath = getInboxPath(agentName, teamName), lockFilePath = `${inboxPath}.lock`, release;
  try {
    release = await lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS2
    });
    let messages = await readMailbox(agentName, teamName);
    if (messages.length === 0)
      return;
    let updatedMessages = messages.map((m4) => !m4.read && predicate(m4) ? { ...m4, read: !0 } : m4);
    await writeFile17(inboxPath, jsonStringify(updatedMessages, null, 2), "utf-8");
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      return;
    logError2(error44);
  } finally {
    if (release)
      try {
        await release();
      } catch {}
  }
}
