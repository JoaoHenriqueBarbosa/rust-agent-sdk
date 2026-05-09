// Original: src/components/agents/agentFileUtils.ts
import { mkdir as mkdir31, open as open12, unlink as unlink16 } from "fs/promises";
import { join as join122 } from "path";
function formatAgentAsMarkdown(agentType, whenToUse, tools, systemPrompt, color3, model, memory2, effort) {
  let escapedWhenToUse = whenToUse.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\\\n"), toolsLine = tools === void 0 || tools.length === 1 && tools[0] === "*" ? "" : `
tools: ${tools.join(", ")}`, modelLine = model ? `
model: ${model}` : "", effortLine = effort !== void 0 ? `
effort: ${effort}` : "", colorLine = color3 ? `
color: ${color3}` : "", memoryLine = memory2 ? `
memory: ${memory2}` : "";
  return `---
name: ${agentType}
description: "${escapedWhenToUse}"${toolsLine}${modelLine}${effortLine}${colorLine}${memoryLine}
---

${systemPrompt}
`;
}
function getAgentDirectoryPath(location) {
  switch (location) {
    case "flagSettings":
      throw Error(`Cannot get directory path for ${location} agents`);
    case "userSettings":
      return join122(getClaudeConfigHomeDir(), AGENT_PATHS.AGENTS_DIR);
    case "projectSettings":
      return join122(getCwd(), AGENT_PATHS.FOLDER_NAME, AGENT_PATHS.AGENTS_DIR);
    case "policySettings":
      return join122(getManagedFilePath(), AGENT_PATHS.FOLDER_NAME, AGENT_PATHS.AGENTS_DIR);
    case "localSettings":
      return join122(getCwd(), AGENT_PATHS.FOLDER_NAME, AGENT_PATHS.AGENTS_DIR);
  }
}
function getRelativeAgentDirectoryPath(location) {
  switch (location) {
    case "projectSettings":
      return join122(".", AGENT_PATHS.FOLDER_NAME, AGENT_PATHS.AGENTS_DIR);
    default:
      return getAgentDirectoryPath(location);
  }
}
function getNewAgentFilePath(agent) {
  let dirPath = getAgentDirectoryPath(agent.source);
  return join122(dirPath, `${agent.agentType}.md`);
}
function getActualAgentFilePath(agent) {
  if (agent.source === "built-in")
    return "Built-in";
  if (agent.source === "plugin")
    throw Error("Cannot get file path for plugin agents");
  let dirPath = getAgentDirectoryPath(agent.source), filename = agent.filename || agent.agentType;
  return join122(dirPath, `${filename}.md`);
}
function getNewRelativeAgentFilePath(agent) {
  if (agent.source === "built-in")
    return "Built-in";
  let dirPath = getRelativeAgentDirectoryPath(agent.source);
  return join122(dirPath, `${agent.agentType}.md`);
}
function getActualRelativeAgentFilePath(agent) {
  if (isBuiltInAgent(agent))
    return "Built-in";
  if (isPluginAgent(agent))
    return `Plugin: ${agent.plugin || "Unknown"}`;
  if (agent.source === "flagSettings")
    return "CLI argument";
  let dirPath = getRelativeAgentDirectoryPath(agent.source), filename = agent.filename || agent.agentType;
  return join122(dirPath, `${filename}.md`);
}
async function ensureAgentDirectoryExists(source) {
  let dirPath = getAgentDirectoryPath(source);
  return await mkdir31(dirPath, { recursive: !0 }), dirPath;
}
async function saveAgentToFile(source, agentType, whenToUse, tools, systemPrompt, checkExists = !0, color3, model, memory2, effort) {
  if (source === "built-in")
    throw Error("Cannot save built-in agents");
  await ensureAgentDirectoryExists(source);
  let filePath = getNewAgentFilePath({ source, agentType }), content = formatAgentAsMarkdown(agentType, whenToUse, tools, systemPrompt, color3, model, memory2, effort);
  try {
    await writeFileAndFlush(filePath, content, checkExists ? "wx" : "w");
  } catch (e) {
    if (getErrnoCode(e) === "EEXIST")
      throw Error(`Agent file already exists: ${filePath}`);
    throw e;
  }
}
async function updateAgentFile(agent, newWhenToUse, newTools, newSystemPrompt, newColor, newModel, newMemory, newEffort) {
  if (agent.source === "built-in")
    throw Error("Cannot update built-in agents");
  let filePath = getActualAgentFilePath(agent), content = formatAgentAsMarkdown(agent.agentType, newWhenToUse, newTools, newSystemPrompt, newColor, newModel, newMemory, newEffort);
  await writeFileAndFlush(filePath, content);
}
async function deleteAgentFromFile(agent) {
  if (agent.source === "built-in")
    throw Error("Cannot delete built-in agents");
  let filePath = getActualAgentFilePath(agent);
  try {
    await unlink16(filePath);
  } catch (e) {
    if (getErrnoCode(e) !== "ENOENT")
      throw e;
  }
}
async function writeFileAndFlush(filePath, content, flag = "w") {
  let handle = await open12(filePath, flag);
  try {
    await handle.writeFile(content, { encoding: "utf-8" }), await handle.datasync();
  } finally {
    await handle.close();
  }
}
var init_agentFileUtils = __esm(() => {
  init_managedPath();
  init_loadAgentsDir();
  init_cwd2();
  init_envUtils();
  init_errors();
  init_types23();
});
