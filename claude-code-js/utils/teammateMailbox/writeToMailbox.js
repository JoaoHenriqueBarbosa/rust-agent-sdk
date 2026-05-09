// function: writeToMailbox
async function writeToMailbox(recipientName, message, teamName) {
  await ensureInboxDir(teamName);
  let inboxPath = getInboxPath(recipientName, teamName), lockFilePath = `${inboxPath}.lock`;
  logForDebugging(`[TeammateMailbox] writeToMailbox: recipient=${recipientName}, from=${message.from}, path=${inboxPath}`);
  try {
    await writeFile17(inboxPath, "[]", { encoding: "utf-8", flag: "wx" }), logForDebugging("[TeammateMailbox] writeToMailbox: created new inbox file");
  } catch (error44) {
    if (getErrnoCode(error44) !== "EEXIST") {
      logForDebugging(`[TeammateMailbox] writeToMailbox: failed to create inbox file: ${error44}`), logError2(error44);
      return;
    }
  }
  let release;
  try {
    release = await lock(inboxPath, {
      lockfilePath: lockFilePath,
      ...LOCK_OPTIONS2
    });
    let messages = await readMailbox(recipientName, teamName), newMessage = {
      ...message,
      read: !1
    };
    messages.push(newMessage), await writeFile17(inboxPath, jsonStringify(messages, null, 2), "utf-8"), logForDebugging(`[TeammateMailbox] Wrote message to ${recipientName}'s inbox from ${message.from}`);
  } catch (error44) {
    logForDebugging(`Failed to write to inbox for ${recipientName}: ${error44}`), logError2(error44);
  } finally {
    if (release)
      await release();
  }
}
