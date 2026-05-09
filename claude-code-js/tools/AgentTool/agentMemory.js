// Original: src/tools/AgentTool/agentMemory.ts
import { join as join24, normalize as normalize4, sep as sep5 } from "path";
function sanitizeAgentTypeForPath(agentType) {
  return agentType.replace(/:/g, "-");
}
function getLocalAgentMemoryDir(dirName) {
  if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR)
    return join24(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects", sanitizePath2(findCanonicalGitRoot(getProjectRoot()) ?? getProjectRoot()), "agent-memory-local", dirName) + sep5;
  return join24(getCwd(), ".claude", "agent-memory-local", dirName) + sep5;
}
function getAgentMemoryDir(agentType, scope) {
  let dirName = sanitizeAgentTypeForPath(agentType);
  switch (scope) {
    case "project":
      return join24(getCwd(), ".claude", "agent-memory", dirName) + sep5;
    case "local":
      return getLocalAgentMemoryDir(dirName);
    case "user":
      return join24(getMemoryBaseDir(), "agent-memory", dirName) + sep5;
  }
}
function isAgentMemoryPath(absolutePath) {
  let normalizedPath = normalize4(absolutePath), memoryBase = getMemoryBaseDir();
  if (normalizedPath.startsWith(join24(memoryBase, "agent-memory") + sep5))
    return !0;
  if (normalizedPath.startsWith(join24(getCwd(), ".claude", "agent-memory") + sep5))
    return !0;
  if (process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR) {
    if (normalizedPath.includes(sep5 + "agent-memory-local" + sep5) && normalizedPath.startsWith(join24(process.env.CLAUDE_CODE_REMOTE_MEMORY_DIR, "projects") + sep5))
      return !0;
  } else if (normalizedPath.startsWith(join24(getCwd(), ".claude", "agent-memory-local") + sep5))
    return !0;
  return !1;
}
function getMemoryScopeDisplay(memory) {
  switch (memory) {
    case "user":
      return `User (${join24(getMemoryBaseDir(), "agent-memory")}/)`;
    case "project":
      return "Project (.claude/agent-memory/)";
    case "local":
      return `Local (${getLocalAgentMemoryDir("...")})`;
    default:
      return "None";
  }
}
function loadAgentMemoryPrompt(agentType, scope) {
  let scopeNote;
  switch (scope) {
    case "user":
      scopeNote = "- Since this memory is user-scope, keep learnings general since they apply across all projects";
      break;
    case "project":
      scopeNote = "- Since this memory is project-scope and shared with your team via version control, tailor your memories to this project";
      break;
    case "local":
      scopeNote = "- Since this memory is local-scope (not checked into version control), tailor your memories to this project and machine";
      break;
  }
  let memoryDir = getAgentMemoryDir(agentType, scope);
  ensureMemoryDirExists(memoryDir);
  let coworkExtraGuidelines = process.env.CLAUDE_COWORK_MEMORY_EXTRA_GUIDELINES;
  return buildMemoryPrompt({
    displayName: "Persistent Agent Memory",
    memoryDir,
    extraGuidelines: coworkExtraGuidelines && coworkExtraGuidelines.trim().length > 0 ? [scopeNote, coworkExtraGuidelines] : [scopeNote]
  });
}
var init_agentMemory = __esm(() => {
  init_state();
  init_memdir();
  init_paths();
  init_cwd2();
  init_git();
  init_path2();
});
