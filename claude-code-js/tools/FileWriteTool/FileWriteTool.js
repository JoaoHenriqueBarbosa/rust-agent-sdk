// Original: src/tools/FileWriteTool/FileWriteTool.ts
import { dirname as dirname35, sep as sep17 } from "path";
var inputSchema13, outputSchema10, FileWriteTool;
var init_FileWriteTool = __esm(() => {
  init_v4();
  init_diagnosticTracking();
  init_LSPDiagnosticRegistry();
  init_manager7();
  init_vscodeSdkMcp();
  init_loadSkillsDir();
  init_Tool();
  init_cwd2();
  init_debug();
  init_diff2();
  init_errors();
  init_file();
  init_fileHistory();
  init_fileRead();
  init_fsOperations();
  init_log3();
  init_path2();
  init_filesystem();
  init_shellRuleMatching();
  init_types20();
  init_prompt4();
  init_UI9();
  inputSchema13 = lazySchema(() => exports_external.strictObject({
    file_path: exports_external.string().describe("The absolute path to the file to write (must be absolute, not relative)"),
    content: exports_external.string().describe("The content to write to the file")
  })), outputSchema10 = lazySchema(() => exports_external.object({
    type: exports_external.enum(["create", "update"]).describe("Whether a new file was created or an existing file was updated"),
    filePath: exports_external.string().describe("The path to the file that was written"),
    content: exports_external.string().describe("The content that was written to the file"),
    structuredPatch: exports_external.array(hunkSchema()).describe("Diff patch showing the changes"),
    originalFile: exports_external.string().nullable().describe("The original file content before the write (null for new files)"),
    gitDiff: gitDiffSchema().optional()
  })), FileWriteTool = buildTool({
    name: FILE_WRITE_TOOL_NAME,
    searchHint: "create or overwrite files",
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() {
      return "Write a file to the local filesystem.";
    },
    userFacingName: userFacingName4,
    getToolUseSummary: getToolUseSummary2,
    getActivityDescription(input) {
      let summary = getToolUseSummary2(input);
      return summary ? `Writing ${summary}` : "Writing file";
    },
    async prompt() {
      return getWriteToolDescription();
    },
    renderToolUseMessage: renderToolUseMessage10,
    isResultTruncated,
    get inputSchema() {
      return inputSchema13();
    },
    get outputSchema() {
      return outputSchema10();
    },
    toAutoClassifierInput(input) {
      return `${input.file_path}: ${input.content}`;
    },
    getPath(input) {
      return input.file_path;
    },
    backfillObservableInput(input) {
      if (typeof input.file_path === "string")
        input.file_path = expandPath(input.file_path);
    },
    async preparePermissionMatcher({ file_path }) {
      return (pattern) => matchWildcardPattern(pattern, file_path);
    },
    async checkPermissions(input, context6) {
      let appState = context6.getAppState();
      return checkWritePermissionForTool(FileWriteTool, input, appState.toolPermissionContext);
    },
    renderToolUseRejectedMessage: renderToolUseRejectedMessage4,
    renderToolUseErrorMessage: renderToolUseErrorMessage6,
    renderToolResultMessage: renderToolResultMessage9,
    extractSearchText() {
      return "";
    },
    async validateInput({ file_path, content }, toolUseContext) {
      let fullFilePath = expandPath(file_path), secretError = checkTeamMemSecrets(fullFilePath, content);
      if (secretError)
        return { result: !1, message: secretError, errorCode: 0 };
      let appState = toolUseContext.getAppState();
      if (matchingRuleForInput(fullFilePath, appState.toolPermissionContext, "edit", "deny") !== null)
        return {
          result: !1,
          message: "File is in a directory that is denied by your permission settings.",
          errorCode: 1
        };
      if (fullFilePath.startsWith("\\\\") || fullFilePath.startsWith("//"))
        return { result: !0 };
      let fs17 = getFsImplementation(), fileMtimeMs;
      try {
        fileMtimeMs = (await fs17.stat(fullFilePath)).mtimeMs;
      } catch (e) {
        if (isENOENT(e))
          return { result: !0 };
        throw e;
      }
      let readTimestamp = toolUseContext.readFileState.get(fullFilePath);
      if (!readTimestamp || readTimestamp.isPartialView)
        return {
          result: !1,
          message: "File has not been read yet. Read it first before writing to it.",
          errorCode: 2
        };
      if (Math.floor(fileMtimeMs) > readTimestamp.timestamp)
        return {
          result: !1,
          message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
          errorCode: 3
        };
      return { result: !0 };
    },
    async call({ file_path, content }, { readFileState, updateFileHistoryState, dynamicSkillDirTriggers }, _, parentMessage) {
      let fullFilePath = expandPath(file_path), dir = dirname35(fullFilePath), cwd2 = getCwd(), newSkillDirs = await discoverSkillDirsForPaths([fullFilePath], cwd2);
      if (newSkillDirs.length > 0) {
        for (let dir2 of newSkillDirs)
          dynamicSkillDirTriggers?.add(dir2);
        addSkillDirectories(newSkillDirs).catch(() => {});
      }
      if (activateConditionalSkillsForPaths([fullFilePath], cwd2), await diagnosticTracker.beforeFileEdited(fullFilePath), await getFsImplementation().mkdir(dir), fileHistoryEnabled())
        await fileHistoryTrackEdit(updateFileHistoryState, fullFilePath, parentMessage.uuid);
      let meta;
      try {
        meta = readFileSyncWithMetadata(fullFilePath);
      } catch (e) {
        if (isENOENT(e))
          meta = null;
        else
          throw e;
      }
      if (meta !== null) {
        let lastWriteTime = getFileModificationTime(fullFilePath), lastRead = readFileState.get(fullFilePath);
        if (!lastRead || lastWriteTime > lastRead.timestamp) {
          if (!(lastRead && lastRead.offset === void 0 && lastRead.limit === void 0) || meta.content !== lastRead.content)
            throw Error(FILE_UNEXPECTEDLY_MODIFIED_ERROR);
        }
      }
      let enc = meta?.encoding ?? "utf8", oldContent = meta?.content ?? null;
      writeTextContent(fullFilePath, content, enc, "LF");
      let lspManager = getLspServerManager();
      if (lspManager)
        clearDeliveredDiagnosticsForFile(`file://${fullFilePath}`), lspManager.changeFile(fullFilePath, content).catch((err2) => {
          logForDebugging(`LSP: Failed to notify server of file change for ${fullFilePath}: ${err2.message}`), logError2(err2);
        }), lspManager.saveFile(fullFilePath).catch((err2) => {
          logForDebugging(`LSP: Failed to notify server of file save for ${fullFilePath}: ${err2.message}`), logError2(err2);
        });
      if (notifyVscodeFileUpdated(fullFilePath, oldContent, content), readFileState.set(fullFilePath, {
        content,
        timestamp: getFileModificationTime(fullFilePath),
        offset: void 0,
        limit: void 0
      }), fullFilePath.endsWith(`${sep17}CLAUDE.md`))
        logEvent("tengu_write_claudemd", {});
      if (oldContent) {
        let patch = getPatchForDisplay({
          filePath: file_path,
          fileContents: oldContent,
          edits: [
            {
              old_string: oldContent,
              new_string: content,
              replace_all: !1
            }
          ]
        }), data2 = {
          type: "update",
          filePath: file_path,
          content,
          structuredPatch: patch,
          originalFile: oldContent
        };
        return countLinesChanged(patch), logFileOperation({
          operation: "write",
          tool: "FileWriteTool",
          filePath: fullFilePath,
          type: "update"
        }), {
          data: data2
        };
      }
      let data = {
        type: "create",
        filePath: file_path,
        content,
        structuredPatch: [],
        originalFile: null
      };
      return countLinesChanged([], content), logFileOperation({
        operation: "write",
        tool: "FileWriteTool",
        filePath: fullFilePath,
        type: "create"
      }), {
        data
      };
    },
    mapToolResultToToolResultBlockParam({ filePath, type }, toolUseID) {
      switch (type) {
        case "create":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `File created successfully at: ${filePath}`
          };
        case "update":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `The file ${filePath} has been updated successfully.`
          };
      }
    }
  });
});
