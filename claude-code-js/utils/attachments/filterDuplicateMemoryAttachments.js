// function: filterDuplicateMemoryAttachments
function filterDuplicateMemoryAttachments(attachments, readFileState) {
  return attachments.map((attachment) => {
    if (attachment.type !== "relevant_memories")
      return attachment;
    let filtered = attachment.memories.filter((m4) => !readFileState.has(m4.path));
    for (let m4 of filtered)
      readFileState.set(m4.path, {
        content: m4.content,
        timestamp: m4.mtimeMs,
        offset: void 0,
        limit: m4.limit
      });
    return filtered.length > 0 ? { ...attachment, memories: filtered } : null;
  }).filter((a2) => a2 !== null);
}
