// function: formatTranscriptWithSummarization
async function formatTranscriptWithSummarization(log3) {
  let fullTranscript = formatTranscriptForFacets(log3);
  if (fullTranscript.length <= 30000)
    return fullTranscript;
  let CHUNK_SIZE2 = 25000, chunks = [];
  for (let i5 = 0;i5 < fullTranscript.length; i5 += CHUNK_SIZE2)
    chunks.push(fullTranscript.slice(i5, i5 + CHUNK_SIZE2));
  let summaries = await Promise.all(chunks.map(summarizeTranscriptChunk)), meta = logToSessionMeta(log3);
  return [
    `Session: ${meta.session_id.slice(0, 8)}`,
    `Date: ${meta.start_time}`,
    `Project: ${meta.project_path}`,
    `Duration: ${meta.duration_minutes} min`,
    `[Long session - ${chunks.length} parts summarized]`,
    ""
  ].join(`
`) + summaries.join(`

---

`);
}
