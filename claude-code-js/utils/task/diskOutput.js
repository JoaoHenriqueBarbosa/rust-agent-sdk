// Original: src/utils/task/diskOutput.ts
import { constants as fsConstants8 } from "fs";
import {
  mkdir as mkdir38,
  open as open16,
  stat as stat39,
  symlink as symlink4,
  unlink as unlink21
} from "fs/promises";
import { join as join137 } from "path";
function getTaskOutputDir() {
  if (_taskOutputDir === void 0)
    _taskOutputDir = join137(getProjectTempDir(), getSessionId(), "tasks");
  return _taskOutputDir;
}
async function ensureOutputDir() {
  await mkdir38(getTaskOutputDir(), { recursive: !0 });
}
function getTaskOutputPath(taskId) {
  return join137(getTaskOutputDir(), `${taskId}.output`);
}
function track(p4) {
  return _pendingOps.add(p4), p4.finally(() => _pendingOps.delete(p4)).catch(() => {}), p4;
}

class DiskTaskOutput {
  #path;
  #fileHandle = null;
  #queue = [];
  #bytesWritten = 0;
  #capped = !1;
  #flushPromise = null;
  #flushResolve = null;
  constructor(taskId) {
    this.#path = getTaskOutputPath(taskId);
  }
  append(content) {
    if (this.#capped)
      return;
    if (this.#bytesWritten += content.length, this.#bytesWritten > MAX_TASK_OUTPUT_BYTES)
      this.#capped = !0, this.#queue.push(`
[output truncated: exceeded ${MAX_TASK_OUTPUT_BYTES_DISPLAY} disk cap]
`);
    else
      this.#queue.push(content);
    if (!this.#flushPromise)
      this.#flushPromise = new Promise((resolve45) => {
        this.#flushResolve = resolve45;
      }), track(this.#drain());
  }
  flush() {
    return this.#flushPromise ?? Promise.resolve();
  }
  cancel() {
    this.#queue.length = 0;
  }
  async#drainAllChunks() {
    while (!0) {
      try {
        if (!this.#fileHandle)
          await ensureOutputDir(), this.#fileHandle = await open16(this.#path, process.platform === "win32" ? "a" : fsConstants8.O_WRONLY | fsConstants8.O_APPEND | fsConstants8.O_CREAT | O_NOFOLLOW2);
        while (!0)
          if (await this.#writeAllChunks(), this.#queue.length === 0)
            break;
      } finally {
        if (this.#fileHandle) {
          let fileHandle = this.#fileHandle;
          this.#fileHandle = null, await fileHandle.close();
        }
      }
      if (this.#queue.length)
        continue;
      break;
    }
  }
  #writeAllChunks() {
    return this.#fileHandle.appendFile(this.#queueToBuffers());
  }
  #queueToBuffers() {
    let queue2 = this.#queue.splice(0, this.#queue.length), totalLength = 0;
    for (let str2 of queue2)
      totalLength += Buffer.byteLength(str2, "utf8");
    let buffer = Buffer.allocUnsafe(totalLength), offset = 0;
    for (let str2 of queue2)
      offset += buffer.write(str2, offset, "utf8");
    return buffer;
  }
  async#drain() {
    try {
      await this.#drainAllChunks();
    } catch (e) {
      if (logError2(e), this.#queue.length > 0)
        try {
          await this.#drainAllChunks();
        } catch (e2) {
          logError2(e2);
        }
    } finally {
      let resolve45 = this.#flushResolve;
      this.#flushPromise = null, this.#flushResolve = null, resolve45();
    }
  }
}
function getOrCreateOutput(taskId) {
  let output = outputs.get(taskId);
  if (!output)
    output = new DiskTaskOutput(taskId), outputs.set(taskId, output);
  return output;
}
function appendTaskOutput(taskId, content) {
  getOrCreateOutput(taskId).append(content);
}
function evictTaskOutput(taskId) {
  return track((async () => {
    let output = outputs.get(taskId);
    if (output)
      await output.flush(), outputs.delete(taskId);
  })());
}
async function getTaskOutputDelta(taskId, fromOffset, maxBytes = DEFAULT_MAX_READ_BYTES) {
  try {
    let result = await readFileRange(getTaskOutputPath(taskId), fromOffset, maxBytes);
    if (!result)
      return { content: "", newOffset: fromOffset };
    return {
      content: result.content,
      newOffset: fromOffset + result.bytesRead
    };
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return { content: "", newOffset: fromOffset };
    return logError2(e), { content: "", newOffset: fromOffset };
  }
}
async function getTaskOutput(taskId, maxBytes = DEFAULT_MAX_READ_BYTES) {
  try {
    let { content, bytesTotal, bytesRead } = await tailFile(getTaskOutputPath(taskId), maxBytes);
    if (bytesTotal > bytesRead)
      return `[${Math.round((bytesTotal - bytesRead) / 1024)}KB of earlier output omitted]
${content}`;
    return content;
  } catch (e) {
    if (getErrnoCode(e) === "ENOENT")
      return "";
    return logError2(e), "";
  }
}
function initTaskOutput(taskId) {
  return track((async () => {
    await ensureOutputDir();
    let outputPath = getTaskOutputPath(taskId);
    return await (await open16(outputPath, process.platform === "win32" ? "wx" : fsConstants8.O_WRONLY | fsConstants8.O_CREAT | fsConstants8.O_EXCL | O_NOFOLLOW2)).close(), outputPath;
  })());
}
function initTaskOutputAsSymlink(taskId, targetPath) {
  return track((async () => {
    try {
      await ensureOutputDir();
      let outputPath = getTaskOutputPath(taskId);
      try {
        await symlink4(targetPath, outputPath);
      } catch {
        await unlink21(outputPath), await symlink4(targetPath, outputPath);
      }
      return outputPath;
    } catch (error44) {
      return logError2(error44), initTaskOutput(taskId);
    }
  })());
}
var O_NOFOLLOW2, DEFAULT_MAX_READ_BYTES = 8388608, MAX_TASK_OUTPUT_BYTES = 5368709120, MAX_TASK_OUTPUT_BYTES_DISPLAY = "5GB", _taskOutputDir, _pendingOps, outputs;
var init_diskOutput = __esm(() => {
  init_state();
  init_errors();
  init_fsOperations();
  init_log3();
  init_filesystem();
  O_NOFOLLOW2 = fsConstants8.O_NOFOLLOW ?? 0;
  _pendingOps = /* @__PURE__ */ new Set;
  outputs = /* @__PURE__ */ new Map;
});
