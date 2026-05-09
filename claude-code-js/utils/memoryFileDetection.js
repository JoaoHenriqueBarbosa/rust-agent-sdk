// Original: src/utils/memoryFileDetection.ts
import { normalize as normalize13, posix as posix5, win32 as win322 } from "path";
function toPosix(p4) {
  return p4.split(win322.sep).join(posix5.sep);
}
function toComparable(p4) {
  let posixForm = toPosix(p4);
  return IS_WINDOWS ? posixForm.toLowerCase() : posixForm;
}
function detectSessionFileType(filePath) {
  let configDir = getClaudeConfigHomeDir(), normalized = toComparable(filePath), configDirCmp = toComparable(configDir);
  if (!normalized.startsWith(configDirCmp))
    return null;
  if (normalized.includes("/session-memory/") && normalized.endsWith(".md"))
    return "session_memory";
  if (normalized.includes("/projects/") && normalized.endsWith(".jsonl"))
    return "session_transcript";
  return null;
}
function detectSessionPatternType(pattern) {
  let normalized = pattern.split(win322.sep).join(posix5.sep);
  if (normalized.includes("session-memory") && (normalized.includes(".md") || normalized.endsWith("*")))
    return "session_memory";
  if (normalized.includes(".jsonl") || normalized.includes("projects") && normalized.includes("*.jsonl"))
    return "session_transcript";
  return null;
}
function isAutoMemFile(filePath) {
  if (isAutoMemoryEnabled())
    return isAutoMemPath(filePath);
  return !1;
}
function isAgentMemFile(filePath) {
  if (isAutoMemoryEnabled())
    return isAgentMemoryPath(filePath);
  return !1;
}
function isAutoManagedMemoryFile(filePath) {
  if (isAutoMemFile(filePath))
    return !0;
  if (detectSessionFileType(filePath) !== null)
    return !0;
  if (isAgentMemFile(filePath))
    return !0;
  return !1;
}
function isMemoryDirectory(dirPath) {
  let normalizedPath = normalize13(dirPath), normalizedCmp = toComparable(normalizedPath);
  if (isAutoMemoryEnabled() && (normalizedCmp.includes("/agent-memory/") || normalizedCmp.includes("/agent-memory-local/")))
    return !0;
  if (isAutoMemoryEnabled()) {
    let autoMemPath = getAutoMemPath(), autoMemDirCmp = toComparable(autoMemPath.replace(/[/\\]+$/, "")), autoMemPathCmp = toComparable(autoMemPath);
    if (normalizedCmp === autoMemDirCmp || normalizedCmp.startsWith(autoMemPathCmp))
      return !0;
  }
  let configDirCmp = toComparable(getClaudeConfigHomeDir()), memoryBaseCmp = toComparable(getMemoryBaseDir()), underConfig = normalizedCmp.startsWith(configDirCmp), underMemoryBase = normalizedCmp.startsWith(memoryBaseCmp);
  if (!underConfig && !underMemoryBase)
    return !1;
  if (normalizedCmp.includes("/session-memory/"))
    return !0;
  if (underConfig && normalizedCmp.includes("/projects/"))
    return !0;
  if (isAutoMemoryEnabled() && normalizedCmp.includes("/memory/"))
    return !0;
  return !1;
}
function isShellCommandTargetingMemory(command12) {
  let configDir = getClaudeConfigHomeDir(), memoryBase = getMemoryBaseDir(), autoMemDir = isAutoMemoryEnabled() ? getAutoMemPath().replace(/[/\\]+$/, "") : "", commandCmp = toComparable(command12);
  if (![configDir, memoryBase, autoMemDir].filter(Boolean).some((d) => {
    if (commandCmp.includes(toComparable(d)))
      return !0;
    if (IS_WINDOWS)
      return commandCmp.includes(windowsPathToPosixPath(d).toLowerCase());
    return !1;
  }))
    return !1;
  let matches2 = command12.match(/(?:[A-Za-z]:[/\\]|\/)[^\s'"]+/g);
  if (!matches2)
    return !1;
  for (let match of matches2) {
    let cleanPath = match.replace(/[,;|&>]+$/, ""), nativePath = IS_WINDOWS ? posixPathToWindowsPath(cleanPath) : cleanPath;
    if (isAutoManagedMemoryFile(nativePath) || isMemoryDirectory(nativePath))
      return !0;
  }
  return !1;
}
function isAutoManagedMemoryPattern(pattern) {
  if (detectSessionPatternType(pattern) !== null)
    return !0;
  if (isAutoMemoryEnabled() && (pattern.replace(/\\/g, "/").includes("agent-memory/") || pattern.replace(/\\/g, "/").includes("agent-memory-local/")))
    return !0;
  return !1;
}
var IS_WINDOWS;
var init_memoryFileDetection = __esm(() => {
  init_paths();
  init_agentMemory();
  init_envUtils();
  init_windowsPaths();
  IS_WINDOWS = process.platform === "win32";
});
