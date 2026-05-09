// Original: src/utils/task/TaskOutput.ts
import { unlink as unlink10 } from "fs/promises";
var DEFAULT_MAX_MEMORY = 8388608, POLL_INTERVAL_MS = 1000, PROGRESS_TAIL_BYTES = 4096, TaskOutput;
var init_TaskOutput = __esm(() => {
  init_debug();
  init_fsOperations();
  init_outputLimits();
  init_diskOutput();
  TaskOutput = class TaskOutput {
    taskId;
    path;
    stdoutToFile;
    #stdoutBuffer = "";
    #stderrBuffer = "";
    #disk = null;
    #recentLines = new CircularBuffer(1000);
    #totalLines = 0;
    #totalBytes = 0;
    #maxMemory;
    #onProgress;
    #outputFileRedundant = !1;
    #outputFileSize = 0;
    static #registry = /* @__PURE__ */ new Map;
    static #activePolling = /* @__PURE__ */ new Map;
    static #pollInterval = null;
    constructor(taskId, onProgress, stdoutToFile = !1, maxMemory = DEFAULT_MAX_MEMORY) {
      if (this.taskId = taskId, this.path = getTaskOutputPath(taskId), this.stdoutToFile = stdoutToFile, this.#maxMemory = maxMemory, this.#onProgress = onProgress, stdoutToFile && onProgress)
        TaskOutput.#registry.set(taskId, this);
    }
    static startPolling(taskId) {
      let instance = TaskOutput.#registry.get(taskId);
      if (!instance || !instance.#onProgress)
        return;
      if (TaskOutput.#activePolling.set(taskId, instance), !TaskOutput.#pollInterval)
        TaskOutput.#pollInterval = setInterval(TaskOutput.#tick, POLL_INTERVAL_MS), TaskOutput.#pollInterval.unref();
    }
    static stopPolling(taskId) {
      if (TaskOutput.#activePolling.delete(taskId), TaskOutput.#activePolling.size === 0 && TaskOutput.#pollInterval)
        clearInterval(TaskOutput.#pollInterval), TaskOutput.#pollInterval = null;
    }
    static #tick() {
      for (let [, entry] of TaskOutput.#activePolling) {
        if (!entry.#onProgress)
          continue;
        tailFile(entry.path, PROGRESS_TAIL_BYTES).then(({ content, bytesRead, bytesTotal }) => {
          if (!entry.#onProgress)
            return;
          if (!content) {
            entry.#onProgress("", "", entry.#totalLines, bytesTotal, !1);
            return;
          }
          let pos = content.length, n5 = 0, n100 = 0, lineCount = 0;
          while (pos > 0) {
            if (pos = content.lastIndexOf(`
`, pos - 1), lineCount++, lineCount === 5)
              n5 = pos <= 0 ? 0 : pos + 1;
            if (lineCount === 100)
              n100 = pos <= 0 ? 0 : pos + 1;
          }
          let totalLines = bytesRead >= bytesTotal ? lineCount : Math.max(entry.#totalLines, Math.round(bytesTotal / bytesRead * lineCount));
          entry.#totalLines = totalLines, entry.#totalBytes = bytesTotal, entry.#onProgress(content.slice(n5), content.slice(n100), totalLines, bytesTotal, bytesRead < bytesTotal);
        }, () => {});
      }
    }
    writeStdout(data) {
      this.#writeBuffered(data, !1);
    }
    writeStderr(data) {
      this.#writeBuffered(data, !0);
    }
    #writeBuffered(data, isStderr) {
      if (this.#totalBytes += data.length, this.#updateProgress(data), this.#disk) {
        this.#disk.append(isStderr ? `[stderr] ${data}` : data);
        return;
      }
      if (this.#stdoutBuffer.length + this.#stderrBuffer.length + data.length > this.#maxMemory) {
        this.#spillToDisk(isStderr ? data : null, isStderr ? null : data);
        return;
      }
      if (isStderr)
        this.#stderrBuffer += data;
      else
        this.#stdoutBuffer += data;
    }
    #updateProgress(data) {
      let lineCount = 0, lines2 = [], extractedBytes = 0, pos = data.length;
      while (pos > 0) {
        let prev = data.lastIndexOf(`
`, pos - 1);
        if (prev === -1)
          break;
        if (lineCount++, lines2.length < 100 && extractedBytes < 4096) {
          let lineLen = pos - prev - 1;
          if (lineLen > 0 && lineLen <= 4096 - extractedBytes) {
            let line = data.slice(prev + 1, pos);
            if (line.trim())
              lines2.push(Buffer.from(line).toString()), extractedBytes += lineLen;
          }
        }
        pos = prev;
      }
      this.#totalLines += lineCount;
      for (let i5 = lines2.length - 1;i5 >= 0; i5--)
        this.#recentLines.add(lines2[i5]);
      if (this.#onProgress && lines2.length > 0) {
        let recent = this.#recentLines.getRecent(5);
        this.#onProgress(safeJoinLines(recent, `
`), safeJoinLines(this.#recentLines.getRecent(100), `
`), this.#totalLines, this.#totalBytes, this.#disk !== null);
      }
    }
    #spillToDisk(stderrChunk, stdoutChunk) {
      if (this.#disk = new DiskTaskOutput(this.taskId), this.#stdoutBuffer)
        this.#disk.append(this.#stdoutBuffer), this.#stdoutBuffer = "";
      if (this.#stderrBuffer)
        this.#disk.append(`[stderr] ${this.#stderrBuffer}`), this.#stderrBuffer = "";
      if (stdoutChunk)
        this.#disk.append(stdoutChunk);
      if (stderrChunk)
        this.#disk.append(`[stderr] ${stderrChunk}`);
    }
    async getStdout() {
      if (this.stdoutToFile)
        return this.#readStdoutFromFile();
      if (this.#disk) {
        let recent = this.#recentLines.getRecent(5), tail = safeJoinLines(recent, `
`), notice = `
Output truncated (${Math.round(this.#totalBytes / 1024)}KB total). Full output saved to: ${this.path}`;
        return tail ? tail + notice : notice.trimStart();
      }
      return this.#stdoutBuffer;
    }
    async#readStdoutFromFile() {
      let maxBytes = getMaxOutputLength();
      try {
        let result = await readFileRange(this.path, 0, maxBytes);
        if (!result)
          return this.#outputFileRedundant = !0, "";
        let { content, bytesRead, bytesTotal } = result;
        return this.#outputFileSize = bytesTotal, this.#outputFileRedundant = bytesTotal <= bytesRead, content;
      } catch (err2) {
        let code = err2 instanceof Error && "code" in err2 ? String(err2.code) : "unknown";
        return logForDebugging(`TaskOutput.#readStdoutFromFile: failed to read ${this.path} (${code}): ${err2}`), `<bash output unavailable: output file ${this.path} could not be read (${code}). This usually means another Claude Code process in the same project deleted it during startup cleanup.>`;
      }
    }
    getStderr() {
      if (this.#disk)
        return "";
      return this.#stderrBuffer;
    }
    get isOverflowed() {
      return this.#disk !== null;
    }
    get totalLines() {
      return this.#totalLines;
    }
    get totalBytes() {
      return this.#totalBytes;
    }
    get outputFileRedundant() {
      return this.#outputFileRedundant;
    }
    get outputFileSize() {
      return this.#outputFileSize;
    }
    spillToDisk() {
      if (!this.#disk)
        this.#spillToDisk(null, null);
    }
    async flush() {
      await this.#disk?.flush();
    }
    async deleteOutputFile() {
      try {
        await unlink10(this.path);
      } catch {}
    }
    clear() {
      this.#stdoutBuffer = "", this.#stderrBuffer = "", this.#recentLines.clear(), this.#onProgress = null, this.#disk?.cancel(), TaskOutput.stopPolling(this.taskId), TaskOutput.#registry.delete(this.taskId);
    }
  };
});
