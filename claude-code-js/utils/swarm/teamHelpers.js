// Original: src/utils/swarm/teamHelpers.ts
var exports_teamHelpers = {};
__export(exports_teamHelpers, {
  writeTeamFileAsync: () => writeTeamFileAsync,
  unregisterTeamForSessionCleanup: () => unregisterTeamForSessionCleanup,
  syncTeammateMode: () => syncTeammateMode,
  setMultipleMemberModes: () => setMultipleMemberModes,
  setMemberMode: () => setMemberMode,
  setMemberActive: () => setMemberActive,
  sanitizeName: () => sanitizeName,
  sanitizeAgentName: () => sanitizeAgentName,
  removeTeammateFromTeamFile: () => removeTeammateFromTeamFile,
  removeMemberFromTeam: () => removeMemberFromTeam,
  removeMemberByAgentId: () => removeMemberByAgentId,
  removeHiddenPaneId: () => removeHiddenPaneId,
  registerTeamForSessionCleanup: () => registerTeamForSessionCleanup,
  readTeamFileAsync: () => readTeamFileAsync,
  readTeamFile: () => readTeamFile,
  inputSchema: () => inputSchema7,
  getTeamFilePath: () => getTeamFilePath,
  getTeamDir: () => getTeamDir,
  cleanupTeamDirectories: () => cleanupTeamDirectories,
  cleanupSessionTeams: () => cleanupSessionTeams,
  addHiddenPaneId: () => addHiddenPaneId
});
import { mkdirSync as mkdirSync6, readFileSync as readFileSync19, writeFileSync as writeFileSync7 } from "fs";
import { mkdir as mkdir13, readFile as readFile21, rm as rm6, writeFile as writeFile18 } from "fs/promises";
import { join as join72 } from "path";
function sanitizeName(name3) {
  return name3.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
}
function sanitizeAgentName(name3) {
  return name3.replace(/@/g, "-");
}
function getTeamDir(teamName) {
  return join72(getTeamsDir(), sanitizeName(teamName));
}
function getTeamFilePath(teamName) {
  return join72(getTeamDir(teamName), "config.json");
}
function readTeamFile(teamName) {
  try {
    let content = readFileSync19(getTeamFilePath(teamName), "utf-8");
    return jsonParse(content);
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return null;
    return logForDebugging(`[TeammateTool] Failed to read team file for ${teamName}: ${errorMessage(e)}`), null;
  }
}
async function readTeamFileAsync(teamName) {
  try {
    let content = await readFile21(getTeamFilePath(teamName), "utf-8");
    return jsonParse(content);
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return null;
    return logForDebugging(`[TeammateTool] Failed to read team file for ${teamName}: ${errorMessage(e)}`), null;
  }
}
function writeTeamFile(teamName, teamFile) {
  let teamDir = getTeamDir(teamName);
  mkdirSync6(teamDir, { recursive: !0 }), writeFileSync7(getTeamFilePath(teamName), jsonStringify(teamFile, null, 2));
}
async function writeTeamFileAsync(teamName, teamFile) {
  let teamDir = getTeamDir(teamName);
  await mkdir13(teamDir, { recursive: !0 }), await writeFile18(getTeamFilePath(teamName), jsonStringify(teamFile, null, 2));
}
function removeTeammateFromTeamFile(teamName, identifier) {
  let identifierStr = identifier.agentId || identifier.name;
  if (!identifierStr)
    return logForDebugging("[TeammateTool] removeTeammateFromTeamFile called with no identifier"), !1;
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return logForDebugging(`[TeammateTool] Cannot remove teammate ${identifierStr}: failed to read team file for "${teamName}"`), !1;
  let originalLength = teamFile.members.length;
  if (teamFile.members = teamFile.members.filter((m4) => {
    if (identifier.agentId && m4.agentId === identifier.agentId)
      return !1;
    if (identifier.name && m4.name === identifier.name)
      return !1;
    return !0;
  }), teamFile.members.length === originalLength)
    return logForDebugging(`[TeammateTool] Teammate ${identifierStr} not found in team file for "${teamName}"`), !1;
  return writeTeamFile(teamName, teamFile), logForDebugging(`[TeammateTool] Removed teammate from team file: ${identifierStr}`), !0;
}
function addHiddenPaneId(teamName, paneId) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return !1;
  let hiddenPaneIds = teamFile.hiddenPaneIds ?? [];
  if (!hiddenPaneIds.includes(paneId))
    hiddenPaneIds.push(paneId), teamFile.hiddenPaneIds = hiddenPaneIds, writeTeamFile(teamName, teamFile), logForDebugging(`[TeammateTool] Added ${paneId} to hidden panes for team ${teamName}`);
  return !0;
}
function removeHiddenPaneId(teamName, paneId) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return !1;
  let hiddenPaneIds = teamFile.hiddenPaneIds ?? [], index = hiddenPaneIds.indexOf(paneId);
  if (index !== -1)
    hiddenPaneIds.splice(index, 1), teamFile.hiddenPaneIds = hiddenPaneIds, writeTeamFile(teamName, teamFile), logForDebugging(`[TeammateTool] Removed ${paneId} from hidden panes for team ${teamName}`);
  return !0;
}
function removeMemberFromTeam(teamName, tmuxPaneId) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return !1;
  let memberIndex = teamFile.members.findIndex((m4) => m4.tmuxPaneId === tmuxPaneId);
  if (memberIndex === -1)
    return !1;
  if (teamFile.members.splice(memberIndex, 1), teamFile.hiddenPaneIds) {
    let hiddenIndex = teamFile.hiddenPaneIds.indexOf(tmuxPaneId);
    if (hiddenIndex !== -1)
      teamFile.hiddenPaneIds.splice(hiddenIndex, 1);
  }
  return writeTeamFile(teamName, teamFile), logForDebugging(`[TeammateTool] Removed member with pane ${tmuxPaneId} from team ${teamName}`), !0;
}
function removeMemberByAgentId(teamName, agentId) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return !1;
  let memberIndex = teamFile.members.findIndex((m4) => m4.agentId === agentId);
  if (memberIndex === -1)
    return !1;
  return teamFile.members.splice(memberIndex, 1), writeTeamFile(teamName, teamFile), logForDebugging(`[TeammateTool] Removed member ${agentId} from team ${teamName}`), !0;
}
function setMemberMode(teamName, memberName, mode) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return !1;
  let member = teamFile.members.find((m4) => m4.name === memberName);
  if (!member)
    return logForDebugging(`[TeammateTool] Cannot set member mode: member ${memberName} not found in team ${teamName}`), !1;
  if (member.mode === mode)
    return !0;
  let updatedMembers = teamFile.members.map((m4) => m4.name === memberName ? { ...m4, mode } : m4);
  return writeTeamFile(teamName, { ...teamFile, members: updatedMembers }), logForDebugging(`[TeammateTool] Set member ${memberName} in team ${teamName} to mode: ${mode}`), !0;
}
function syncTeammateMode(mode, teamNameOverride) {
  if (!isTeammate())
    return;
  let teamName = teamNameOverride ?? getTeamName(), agentName = getAgentName();
  if (teamName && agentName)
    setMemberMode(teamName, agentName, mode);
}
function setMultipleMemberModes(teamName, modeUpdates) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return !1;
  let updateMap = new Map(modeUpdates.map((u5) => [u5.memberName, u5.mode])), anyChanged = !1, updatedMembers = teamFile.members.map((member) => {
    let newMode = updateMap.get(member.name);
    if (newMode !== void 0 && member.mode !== newMode)
      return anyChanged = !0, { ...member, mode: newMode };
    return member;
  });
  if (anyChanged)
    writeTeamFile(teamName, { ...teamFile, members: updatedMembers }), logForDebugging(`[TeammateTool] Set ${modeUpdates.length} member modes in team ${teamName}`);
  return !0;
}
async function setMemberActive(teamName, memberName, isActive) {
  let teamFile = await readTeamFileAsync(teamName);
  if (!teamFile) {
    logForDebugging(`[TeammateTool] Cannot set member active: team ${teamName} not found`);
    return;
  }
  let member = teamFile.members.find((m4) => m4.name === memberName);
  if (!member) {
    logForDebugging(`[TeammateTool] Cannot set member active: member ${memberName} not found in team ${teamName}`);
    return;
  }
  if (member.isActive === isActive)
    return;
  member.isActive = isActive, await writeTeamFileAsync(teamName, teamFile), logForDebugging(`[TeammateTool] Set member ${memberName} in team ${teamName} to ${isActive ? "active" : "idle"}`);
}
async function destroyWorktree(worktreePath) {
  let gitFilePath = join72(worktreePath, ".git"), mainRepoPath = null;
  try {
    let match = (await readFile21(gitFilePath, "utf-8")).trim().match(/^gitdir:\s*(.+)$/);
    if (match && match[1]) {
      let worktreeGitDir = match[1], mainGitDir = join72(worktreeGitDir, "..", "..");
      mainRepoPath = join72(mainGitDir, "..");
    }
  } catch {}
  if (mainRepoPath) {
    let result = await execFileNoThrowWithCwd(gitExe(), ["worktree", "remove", "--force", worktreePath], { cwd: mainRepoPath });
    if (result.code === 0) {
      logForDebugging(`[TeammateTool] Removed worktree via git: ${worktreePath}`);
      return;
    }
    if (result.stderr?.includes("not a working tree")) {
      logForDebugging(`[TeammateTool] Worktree already removed: ${worktreePath}`);
      return;
    }
    logForDebugging(`[TeammateTool] git worktree remove failed, falling back to rm: ${result.stderr}`);
  }
  try {
    await rm6(worktreePath, { recursive: !0, force: !0 }), logForDebugging(`[TeammateTool] Removed worktree directory manually: ${worktreePath}`);
  } catch (error44) {
    logForDebugging(`[TeammateTool] Failed to remove worktree ${worktreePath}: ${errorMessage(error44)}`);
  }
}
function registerTeamForSessionCleanup(teamName) {
  getSessionCreatedTeams().add(teamName);
}
function unregisterTeamForSessionCleanup(teamName) {
  getSessionCreatedTeams().delete(teamName);
}
async function cleanupSessionTeams() {
  let sessionCreatedTeams = getSessionCreatedTeams();
  if (sessionCreatedTeams.size === 0)
    return;
  let teams = Array.from(sessionCreatedTeams);
  logForDebugging(`cleanupSessionTeams: removing ${teams.length} orphan team dir(s): ${teams.join(", ")}`), await Promise.allSettled(teams.map((name3) => killOrphanedTeammatePanes(name3))), await Promise.allSettled(teams.map((name3) => cleanupTeamDirectories(name3))), sessionCreatedTeams.clear();
}
async function killOrphanedTeammatePanes(teamName) {
  let teamFile = readTeamFile(teamName);
  if (!teamFile)
    return;
  let paneMembers = teamFile.members.filter((m4) => m4.name !== TEAM_LEAD_NAME && m4.tmuxPaneId && m4.backendType && isPaneBackend(m4.backendType));
  if (paneMembers.length === 0)
    return;
  let [{ ensureBackendsRegistered: ensureBackendsRegistered2, getBackendByType: getBackendByType2 }, { isInsideTmux: isInsideTmux3 }] = await Promise.all([
    Promise.resolve().then(() => (init_registry(), exports_registry)),
    Promise.resolve().then(() => (init_detection(), exports_detection))
  ]);
  await ensureBackendsRegistered2();
  let useExternalSession = !await isInsideTmux3();
  await Promise.allSettled(paneMembers.map(async (m4) => {
    if (!m4.tmuxPaneId || !m4.backendType || !isPaneBackend(m4.backendType))
      return;
    let ok = await getBackendByType2(m4.backendType).killPane(m4.tmuxPaneId, useExternalSession);
    logForDebugging(`cleanupSessionTeams: killPane ${m4.name} (${m4.backendType} ${m4.tmuxPaneId}) \u2192 ${ok}`);
  }));
}
async function cleanupTeamDirectories(teamName) {
  let sanitizedName = sanitizeName(teamName), teamFile = readTeamFile(teamName), worktreePaths = [];
  if (teamFile) {
    for (let member of teamFile.members)
      if (member.worktreePath)
        worktreePaths.push(member.worktreePath);
  }
  for (let worktreePath of worktreePaths)
    await destroyWorktree(worktreePath);
  let teamDir = getTeamDir(teamName);
  try {
    await rm6(teamDir, { recursive: !0, force: !0 }), logForDebugging(`[TeammateTool] Cleaned up team directory: ${teamDir}`);
  } catch (error44) {
    logForDebugging(`[TeammateTool] Failed to clean up team directory ${teamDir}: ${errorMessage(error44)}`);
  }
  let tasksDir = getTasksDir(sanitizedName);
  try {
    await rm6(tasksDir, { recursive: !0, force: !0 }), logForDebugging(`[TeammateTool] Cleaned up tasks directory: ${tasksDir}`), notifyTasksUpdated();
  } catch (error44) {
    logForDebugging(`[TeammateTool] Failed to clean up tasks directory ${tasksDir}: ${errorMessage(error44)}`);
  }
}
var inputSchema7;
var init_teamHelpers = __esm(() => {
  init_v4();
  init_state();
  init_debug();
  init_envUtils();
  init_errors();
  init_execFileNoThrow();
  init_git();
  init_slowOperations();
  init_tasks();
  init_teammate();
  inputSchema7 = lazySchema(() => exports_external.strictObject({
    operation: exports_external.enum(["spawnTeam", "cleanup"]).describe("Operation: spawnTeam to create a team, cleanup to remove team and task directories."),
    agent_type: exports_external.string().optional().describe('Type/role of the team lead (e.g., "researcher", "test-runner"). Used for team file and inter-agent coordination.'),
    team_name: exports_external.string().optional().describe("Name for the new team to create (required for spawnTeam)."),
    description: exports_external.string().optional().describe("Team description/purpose (only used with spawnTeam).")
  }));
});
