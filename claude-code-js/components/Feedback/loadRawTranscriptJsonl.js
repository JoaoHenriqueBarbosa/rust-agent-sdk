// function: loadRawTranscriptJsonl
async function loadRawTranscriptJsonl() {
  try {
    let transcriptPath = getTranscriptPath(), {
      size
    } = await stat35(transcriptPath);
    if (size > MAX_TRANSCRIPT_READ_BYTES)
      return logForDebugging(`Skipping raw transcript read: file too large (${size} bytes)`, {
        level: "warn"
      }), null;
    return await readFile38(transcriptPath, "utf-8");
  } catch {
    return null;
  }
}
