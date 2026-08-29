// Original: src/utils/tasks.ts
import { mkdir as mkdir11, readdir as readdir9, readFile as readFile19, unlink as unlink7, writeFile as writeFile16 } from "fs/promises";
import { join as join70 } from "path";
function setLeaderTeamName(teamName) {
  if (leaderTeamName === teamName)
    return;
  leaderTeamName = teamName, notifyTasksUpdated();
}
function clearLeaderTeamName() {
  if (leaderTeamName === void 0)
    return;
  leaderTeamName = void 0, notifyTasksUpdated();
}
function notifyTasksUpdated() {
  try {
    tasksUpdated.emit();
  } catch {}
}
function getHighWaterMarkPath(taskListId) {
  return join70(getTasksDir(taskListId), HIGH_WATER_MARK_FILE);
}
async function readHighWaterMark(taskListId) {
  let path16 = getHighWaterMarkPath(taskListId);
  try {
    let content = (await readFile19(path16, "utf-8")).trim(), value = parseInt(content, 10);
    return isNaN(value) ? 0 : value;
  } catch {
    return 0;
  }
}
async function writeHighWaterMark(taskListId, value) {
  let path16 = getHighWaterMarkPath(taskListId);
  await writeFile16(path16, String(value));
}
function isTodoV2Enabled() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_TASKS))
    return !0;
  return !getIsNonInteractiveSession();
}
async function resetTaskList(taskListId) {
  let dir = getTasksDir(taskListId), lockPath = await ensureTaskListLockFile(taskListId), release;
  try {
    release = await lock(lockPath, LOCK_OPTIONS);
    let currentHighest = await findHighestTaskIdFromFiles(taskListId);
    if (currentHighest > 0) {
      let existingMark = await readHighWaterMark(taskListId);
      if (currentHighest > existingMark)
        await writeHighWaterMark(taskListId, currentHighest);
    }
    let files2;
    try {
      files2 = await readdir9(dir);
    } catch {
      files2 = [];
    }
    for (let file2 of files2)
      if (file2.endsWith(".json") && !file2.startsWith(".")) {
        let filePath = join70(dir, file2);
        try {
          await unlink7(filePath);
        } catch {}
      }
    notifyTasksUpdated();
  } finally {
    if (release)
      await release();
  }
}
function getTaskListId() {
  if (process.env.CLAUDE_CODE_TASK_LIST_ID)
    return process.env.CLAUDE_CODE_TASK_LIST_ID;
  let teammateCtx = getTeammateContext();
  if (teammateCtx)
    return teammateCtx.teamName;
  return getTeamName() || leaderTeamName || getSessionId();
}
function sanitizePathComponent(input) {
  return input.replace(/[^a-zA-Z0-9_-]/g, "-");
}
function getTasksDir(taskListId) {
  return join70(getClaudeConfigHomeDir(), "tasks", sanitizePathComponent(taskListId));
}
function getTaskPath(taskListId, taskId) {
  return join70(getTasksDir(taskListId), `${sanitizePathComponent(taskId)}.json`);
}
async function ensureTasksDir(taskListId) {
  let dir = getTasksDir(taskListId);
  try {
    await mkdir11(dir, { recursive: !0 });
  } catch {}
}
async function findHighestTaskIdFromFiles(taskListId) {
  let dir = getTasksDir(taskListId), files2;
  try {
    files2 = await readdir9(dir);
  } catch {
    return 0;
  }
  let highest = 0;
  for (let file2 of files2) {
    if (!file2.endsWith(".json"))
      continue;
    let taskId = parseInt(file2.replace(".json", ""), 10);
    if (!isNaN(taskId) && taskId > highest)
      highest = taskId;
  }
  return highest;
}
async function findHighestTaskId(taskListId) {
  let [fromFiles, fromMark] = await Promise.all([
    findHighestTaskIdFromFiles(taskListId),
    readHighWaterMark(taskListId)
  ]);
  return Math.max(fromFiles, fromMark);
}
async function createTask(taskListId, taskData) {
  let lockPath = await ensureTaskListLockFile(taskListId), release;
  try {
    release = await lock(lockPath, LOCK_OPTIONS);
    let highestId = await findHighestTaskId(taskListId), id = String(highestId + 1), task = { id, ...taskData }, path16 = getTaskPath(taskListId, id);
    return await writeFile16(path16, jsonStringify(task, null, 2)), notifyTasksUpdated(), id;
  } finally {
    if (release)
      await release();
  }
}
async function getTask(taskListId, taskId) {
  let path16 = getTaskPath(taskListId, taskId);
  try {
    let content = await readFile19(path16, "utf-8"), data = jsonParse(content), parsed = TaskSchema2().safeParse(data);
    if (!parsed.success)
      return logForDebugging(`[Tasks] Task ${taskId} failed schema validation: ${parsed.error.message}`), null;
    return parsed.data;
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return null;
    return logForDebugging(`[Tasks] Failed to read task ${taskId}: ${errorMessage(e)}`), logError2(e), null;
  }
}
async function updateTaskUnsafe(taskListId, taskId, updates) {
  let existing = await getTask(taskListId, taskId);
  if (!existing)
    return null;
  let updated = { ...existing, ...updates, id: taskId }, path16 = getTaskPath(taskListId, taskId);
  return await writeFile16(path16, jsonStringify(updated, null, 2)), notifyTasksUpdated(), updated;
}
async function updateTask(taskListId, taskId, updates) {
  let path16 = getTaskPath(taskListId, taskId);
  if (!await getTask(taskListId, taskId))
    return null;
  let release;
  try {
    return release = await lock(path16, LOCK_OPTIONS), await updateTaskUnsafe(taskListId, taskId, updates);
  } finally {
    await release?.();
  }
}
async function deleteTask(taskListId, taskId) {
  let path16 = getTaskPath(taskListId, taskId);
  try {
    let numericId = parseInt(taskId, 10);
    if (!isNaN(numericId)) {
      let currentMark = await readHighWaterMark(taskListId);
      if (numericId > currentMark)
        await writeHighWaterMark(taskListId, numericId);
    }
    try {
      await unlink7(path16);
    } catch (e) {
      if (getErrnoCode(e) === "ENOENT")
        return !1;
      throw e;
    }
    let allTasks = await listTasks(taskListId);
    for (let task of allTasks) {
      let newBlocks = task.blocks.filter((id) => id !== taskId), newBlockedBy = task.blockedBy.filter((id) => id !== taskId);
      if (newBlocks.length !== task.blocks.length || newBlockedBy.length !== task.blockedBy.length)
        await updateTask(taskListId, task.id, {
          blocks: newBlocks,
          blockedBy: newBlockedBy
        });
    }
    return notifyTasksUpdated(), !0;
  } catch {
    return !1;
  }
}
async function listTasks(taskListId) {
  let dir = getTasksDir(taskListId), files2;
  try {
    files2 = await readdir9(dir);
  } catch {
    return [];
  }
  let taskIds = files2.filter((f) => f.endsWith(".json")).map((f) => f.replace(".json", ""));
  return (await Promise.all(taskIds.map((id) => getTask(taskListId, id)))).filter((t2) => t2 !== null);
}
async function blockTask(taskListId, fromTaskId, toTaskId) {
  let [fromTask, toTask] = await Promise.all([
    getTask(taskListId, fromTaskId),
    getTask(taskListId, toTaskId)
  ]);
  if (!fromTask || !toTask)
    return !1;
  if (!fromTask.blocks.includes(toTaskId))
    await updateTask(taskListId, fromTaskId, {
      blocks: [...fromTask.blocks, toTaskId]
    });
  if (!toTask.blockedBy.includes(fromTaskId))
    await updateTask(taskListId, toTaskId, {
      blockedBy: [...toTask.blockedBy, fromTaskId]
    });
  return !0;
}
function getTaskListLockPath(taskListId) {
  return join70(getTasksDir(taskListId), ".lock");
}
async function ensureTaskListLockFile(taskListId) {
  await ensureTasksDir(taskListId);
  let lockPath = getTaskListLockPath(taskListId);
  try {
    await writeFile16(lockPath, "", { flag: "wx" });
  } catch {}
  return lockPath;
}
async function claimTask(taskListId, taskId, claimantAgentId, options2 = {}) {
  let taskPath = getTaskPath(taskListId, taskId);
  if (!await getTask(taskListId, taskId))
    return { success: !1, reason: "task_not_found" };
  if (options2.checkAgentBusy)
    return claimTaskWithBusyCheck(taskListId, taskId, claimantAgentId);
  let release;
  try {
    release = await lock(taskPath, LOCK_OPTIONS);
    let task = await getTask(taskListId, taskId);
    if (!task)
      return { success: !1, reason: "task_not_found" };
    if (task.owner && task.owner !== claimantAgentId)
      return { success: !1, reason: "already_claimed", task };
    if (task.status === "completed")
      return { success: !1, reason: "already_resolved", task };
    let allTasks = await listTasks(taskListId), unresolvedTaskIds = new Set(allTasks.filter((t2) => t2.status !== "completed").map((t2) => t2.id)), blockedByTasks = task.blockedBy.filter((id) => unresolvedTaskIds.has(id));
    if (blockedByTasks.length > 0)
      return { success: !1, reason: "blocked", task, blockedByTasks };
    return { success: !0, task: await updateTaskUnsafe(taskListId, taskId, {
      owner: claimantAgentId
    }) };
  } catch (error44) {
    return logForDebugging(`[Tasks] Failed to claim task ${taskId}: ${errorMessage(error44)}`), logError2(error44), { success: !1, reason: "task_not_found" };
  } finally {
    if (release)
      await release();
  }
}
async function claimTaskWithBusyCheck(taskListId, taskId, claimantAgentId) {
  let lockPath = await ensureTaskListLockFile(taskListId), release;
  try {
    release = await lock(lockPath, LOCK_OPTIONS);
    let allTasks = await listTasks(taskListId), task = allTasks.find((t2) => t2.id === taskId);
    if (!task)
      return { success: !1, reason: "task_not_found" };
    if (task.owner && task.owner !== claimantAgentId)
      return { success: !1, reason: "already_claimed", task };
    if (task.status === "completed")
      return { success: !1, reason: "already_resolved", task };
    let unresolvedTaskIds = new Set(allTasks.filter((t2) => t2.status !== "completed").map((t2) => t2.id)), blockedByTasks = task.blockedBy.filter((id) => unresolvedTaskIds.has(id));
    if (blockedByTasks.length > 0)
      return { success: !1, reason: "blocked", task, blockedByTasks };
    let agentOpenTasks = allTasks.filter((t2) => t2.status !== "completed" && t2.owner === claimantAgentId && t2.id !== taskId);
    if (agentOpenTasks.length > 0)
      return {
        success: !1,
        reason: "agent_busy",
        task,
        busyWithTasks: agentOpenTasks.map((t2) => t2.id)
      };
    return { success: !0, task: await updateTask(taskListId, taskId, {
      owner: claimantAgentId
    }) };
  } catch (error44) {
    return logForDebugging(`[Tasks] Failed to claim task ${taskId} with busy check: ${errorMessage(error44)}`), logError2(error44), { success: !1, reason: "task_not_found" };
  } finally {
    if (release)
      await release();
  }
}
async function unassignTeammateTasks(teamName, teammateId, teammateName, reason) {
  let unresolvedAssignedTasks = (await listTasks(teamName)).filter((t2) => t2.status !== "completed" && (t2.owner === teammateId || t2.owner === teammateName));
  for (let task of unresolvedAssignedTasks)
    await updateTask(teamName, task.id, { owner: void 0, status: "pending" });
  if (unresolvedAssignedTasks.length > 0)
    logForDebugging(`[Tasks] Unassigned ${unresolvedAssignedTasks.length} task(s) from ${teammateName}`);
  let notificationMessage = `${teammateName} ${reason === "terminated" ? "was terminated" : "has shut down"}.`;
  if (unresolvedAssignedTasks.length > 0) {
    let taskList = unresolvedAssignedTasks.map((t2) => `#${t2.id} "${t2.subject}"`).join(", ");
    notificationMessage += ` ${unresolvedAssignedTasks.length} task(s) were unassigned: ${taskList}. Use TaskList to check availability and TaskUpdate with owner to reassign them to idle teammates.`;
  }
  return {
    unassignedTasks: unresolvedAssignedTasks.map((t2) => ({
      id: t2.id,
      subject: t2.subject
    })),
    notificationMessage
  };
}
var tasksUpdated, leaderTeamName, onTasksUpdated, TaskStatusSchema2, TaskSchema2, HIGH_WATER_MARK_FILE = ".highwatermark", LOCK_OPTIONS, DEFAULT_TASKS_MODE_TASK_LIST_ID = "tasklist";
var init_tasks = __esm(() => {
  init_v4();
  init_state();
  init_debug();
  init_envUtils();
  init_errors();
  init_log3();
  init_slowOperations();
  init_teammate();
  init_teammateContext();
  tasksUpdated = createSignal();
  onTasksUpdated = tasksUpdated.subscribe;
  TaskStatusSchema2 = lazySchema(() => exports_external.enum(["pending", "in_progress", "completed"])), TaskSchema2 = lazySchema(() => exports_external.object({
    id: exports_external.string(),
    subject: exports_external.string(),
    description: exports_external.string(),
    activeForm: exports_external.string().optional(),
    owner: exports_external.string().optional(),
    status: TaskStatusSchema2(),
    blocks: exports_external.array(exports_external.string()),
    blockedBy: exports_external.array(exports_external.string()),
    metadata: exports_external.record(exports_external.string(), exports_external.unknown()).optional()
  })), LOCK_OPTIONS = {
    retries: {
      retries: 30,
      minTimeout: 5,
      maxTimeout: 100
    }
  };
});
