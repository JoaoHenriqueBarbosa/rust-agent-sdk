// function: computeDiffStatsBetweenMessages
function computeDiffStatsBetweenMessages(messages, fromMessageId, toMessageId) {
  let startIndex = messages.findIndex((msg) => msg.uuid === fromMessageId);
  if (startIndex === -1)
    return;
  let endIndex = toMessageId ? messages.findIndex((msg) => msg.uuid === toMessageId) : messages.length;
  if (endIndex === -1)
    endIndex = messages.length;
  let filesChanged = [], insertions = 0, deletions = 0;
  for (let i5 = startIndex + 1;i5 < endIndex; i5++) {
    let msg = messages[i5];
    if (!msg || !isToolUseResultMessage(msg))
      continue;
    let result = msg.toolUseResult;
    if (!result || !result.filePath || !result.structuredPatch)
      continue;
    if (!filesChanged.includes(result.filePath))
      filesChanged.push(result.filePath);
    try {
      if ("type" in result && result.type === "create")
        insertions += result.content.split(/\r?\n/).length;
      else
        for (let hunk of result.structuredPatch) {
          let additions = count2(hunk.lines, (line) => line.startsWith("+")), removals = count2(hunk.lines, (line) => line.startsWith("-"));
          insertions += additions, deletions += removals;
        }
    } catch {
      continue;
    }
  }
  return {
    filesChanged,
    insertions,
    deletions
  };
}
