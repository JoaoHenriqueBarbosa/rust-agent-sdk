// function: detectSessionFileType2
function detectSessionFileType2(filePath) {
  let configDir = getClaudeConfigHomeDir();
  if (!filePath.startsWith(configDir))
    return null;
  let normalizedPath = filePath.split(win323.sep).join(posix6.sep);
  if (normalizedPath.includes("/session-memory/") && normalizedPath.endsWith(".md"))
    return "session_memory";
  if (normalizedPath.includes("/projects/") && normalizedPath.endsWith(".jsonl"))
    return "session_transcript";
  return null;
}
