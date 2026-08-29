// function: getOrCreateSequentialAppend
function getOrCreateSequentialAppend(sessionId) {
  let sequentialAppend = sequentialAppendBySession.get(sessionId);
  if (!sequentialAppend)
    sequentialAppend = sequential(async (entry, url3, headers) => await appendSessionLogImpl(sessionId, entry, url3, headers)), sequentialAppendBySession.set(sessionId, sequentialAppend);
  return sequentialAppend;
}
