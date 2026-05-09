// Original: src/tools/FileEditTool/FileEditTool.ts
import { dirname as dirname34, isAbsolute as isAbsolute19, sep as sep16 } from "path";
function readFileForEdit(absoluteFilePath) {
  try {
    let meta = readFileSyncWithMetadata(absoluteFilePath);
    return {
      content: meta.content,
      fileExists: !0,
      encoding: meta.encoding,
      lineEndings: meta.lineEndings
    };
  } catch (e) {
    if (isENOENT(e))
      return {
        content: "",
        fileExists: !1,
        encoding: "utf8",
        lineEndings: "LF"
      };
    throw e;
  }
}
var MAX_EDIT_FILE_SIZE = 1073741824, FileEditTool;
var init_FileEditTool = __esm(() => {
  init_diagnosticTracking();
  init_LSPDiagnosticRegistry();
  init_manager7();
  init_vscodeSdkMcp();
  init_loadSkillsDir();
  init_Tool();
  init_cwd2();
  init_debug();
  init_diff2();
  init_envUtils();
  init_errors();
  init_file();
  init_fileHistory();
  init_fileRead();
  init_format();
  init_fsOperations();
  init_log3();
  init_path2();
  init_filesystem();
  init_shellRuleMatching();
  init_validateEditTool();
  init_prompt13();
  init_types20();
  init_UI8();
  init_utils13();
  FileEditTool = buildTool({
    name: FILE_EDIT_TOOL_NAME,
    searchHint: "modify file contents in place",
    maxResultSizeChars: 1e5,
    strict: !0,
    async description() {
      return "A tool for editing files";
    },
    async prompt() {
      return getEditToolDescription();
    },
    userFacingName: userFacingName3,
    getToolUseSummary,
    getActivityDescription(input) {
      let summary = getToolUseSummary(input);
      return summary ? `Editing ${summary}` : "Editing file";
    },
    get inputSchema() {
      return inputSchema12();
    },
    get outputSchema() {
      return outputSchema9();
    },
    toAutoClassifierInput(input) {
      return `${input.file_path}: ${input.new_string}`;
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
      return checkWritePermissionForTool(FileEditTool, input, appState.toolPermissionContext);
    },
    renderToolUseMessage: renderToolUseMessage9,
    renderToolResultMessage: renderToolResultMessage8,
    renderToolUseRejectedMessage: renderToolUseRejectedMessage3,
    renderToolUseErrorMessage: renderToolUseErrorMessage5,
    async validateInput(input, toolUseContext) {
      let { file_path, old_string, new_string, replace_all = !1 } = input, fullFilePath = expandPath(file_path), secretError = checkTeamMemSecrets(fullFilePath, new_string);
      if (secretError)
        return { result: !1, message: secretError, errorCode: 0 };
      if (old_string === new_string)
        return {
          result: !1,
          behavior: "ask",
          message: "No changes to make: old_string and new_string are exactly the same.",
          errorCode: 1
        };
      let appState = toolUseContext.getAppState();
      if (matchingRuleForInput(fullFilePath, appState.toolPermissionContext, "edit", "deny") !== null)
        return {
          result: !1,
          behavior: "ask",
          message: "File is in a directory that is denied by your permission settings.",
          errorCode: 2
        };
      if (fullFilePath.startsWith("\\\\") || fullFilePath.startsWith("//"))
        return { result: !0 };
      let fs17 = getFsImplementation();
      try {
        let { size } = await fs17.stat(fullFilePath);
        if (size > MAX_EDIT_FILE_SIZE)
          return {
            result: !1,
            behavior: "ask",
            message: `File is too large to edit (${formatFileSize(size)}). Maximum editable file size is ${formatFileSize(MAX_EDIT_FILE_SIZE)}.`,
            errorCode: 10
          };
      } catch (e) {
        if (!isENOENT(e))
          throw e;
      }
      let fileContent;
      try {
        let fileBuffer = await fs17.readFileBytes(fullFilePath), encoding = fileBuffer.length >= 2 && fileBuffer[0] === 255 && fileBuffer[1] === 254 ? "utf16le" : "utf8";
        fileContent = fileBuffer.toString(encoding).replaceAll(`\r
`, `
`);
      } catch (e) {
        if (isENOENT(e))
          fileContent = null;
        else
          throw e;
      }
      if (fileContent === null) {
        if (old_string === "")
          return { result: !0 };
        let similarFilename = findSimilarFile(fullFilePath), cwdSuggestion = await suggestPathUnderCwd(fullFilePath), message = `File does not exist. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
        if (cwdSuggestion)
          message += ` Did you mean ${cwdSuggestion}?`;
        else if (similarFilename)
          message += ` Did you mean ${similarFilename}?`;
        return {
          result: !1,
          behavior: "ask",
          message,
          errorCode: 4
        };
      }
      if (old_string === "") {
        if (fileContent.trim() !== "")
          return {
            result: !1,
            behavior: "ask",
            message: "Cannot create new file - file already exists.",
            errorCode: 3
          };
        return {
          result: !0
        };
      }
      if (fullFilePath.endsWith(".ipynb"))
        return {
          result: !1,
          behavior: "ask",
          message: `File is a Jupyter Notebook. Use the ${NOTEBOOK_EDIT_TOOL_NAME} to edit this file.`,
          errorCode: 5
        };
      let readTimestamp = toolUseContext.readFileState.get(fullFilePath);
      if (!readTimestamp || readTimestamp.isPartialView)
        return {
          result: !1,
          behavior: "ask",
          message: "File has not been read yet. Read it first before writing to it.",
          meta: {
            isFilePathAbsolute: String(isAbsolute19(file_path))
          },
          errorCode: 6
        };
      if (readTimestamp) {
        if (getFileModificationTime(fullFilePath) > readTimestamp.timestamp)
          if (readTimestamp.offset === void 0 && readTimestamp.limit === void 0 && fileContent === readTimestamp.content)
            ;
          else
            return {
              result: !1,
              behavior: "ask",
              message: "File has been modified since read, either by the user or by a linter. Read it again before attempting to write it.",
              errorCode: 7
            };
      }
      let file2 = fileContent, actualOldString = findActualString(file2, old_string);
      if (!actualOldString)
        return {
          result: !1,
          behavior: "ask",
          message: `String to replace not found in file.
String: ${old_string}`,
          meta: {
            isFilePathAbsolute: String(isAbsolute19(file_path))
          },
          errorCode: 8
        };
      let matches = file2.split(actualOldString).length - 1;
      if (matches > 1 && !replace_all)
        return {
          result: !1,
          behavior: "ask",
          message: `Found ${matches} matches of the string to replace, but replace_all is false. To replace all occurrences, set replace_all to true. To replace only one occurrence, please provide more context to uniquely identify the instance.
String: ${old_string}`,
          meta: {
            isFilePathAbsolute: String(isAbsolute19(file_path)),
            actualOldString
          },
          errorCode: 9
        };
      let settingsValidationResult = validateInputForSettingsFileEdit(fullFilePath, file2, () => {
        return replace_all ? file2.replaceAll(actualOldString, new_string) : file2.replace(actualOldString, new_string);
      });
      if (settingsValidationResult !== null)
        return settingsValidationResult;
      return { result: !0, meta: { actualOldString } };
    },
    inputsEquivalent(input1, input2) {
      return areFileEditsInputsEquivalent({
        file_path: input1.file_path,
        edits: [
          {
            old_string: input1.old_string,
            new_string: input1.new_string,
            replace_all: input1.replace_all ?? !1
          }
        ]
      }, {
        file_path: input2.file_path,
        edits: [
          {
            old_string: input2.old_string,
            new_string: input2.new_string,
            replace_all: input2.replace_all ?? !1
          }
        ]
      });
    },
    async call(input, {
      readFileState,
      userModified,
      updateFileHistoryState,
      dynamicSkillDirTriggers
    }, _, parentMessage) {
      let { file_path, old_string, new_string, replace_all = !1 } = input, fs17 = getFsImplementation(), absoluteFilePath = expandPath(file_path), cwd2 = getCwd();
      if (!isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
        let newSkillDirs = await discoverSkillDirsForPaths([absoluteFilePath], cwd2);
        if (newSkillDirs.length > 0) {
          for (let dir of newSkillDirs)
            dynamicSkillDirTriggers?.add(dir);
          addSkillDirectories(newSkillDirs).catch(() => {});
        }
        activateConditionalSkillsForPaths([absoluteFilePath], cwd2);
      }
      if (await diagnosticTracker.beforeFileEdited(absoluteFilePath), await fs17.mkdir(dirname34(absoluteFilePath)), fileHistoryEnabled())
        await fileHistoryTrackEdit(updateFileHistoryState, absoluteFilePath, parentMessage.uuid);
      let {
        content: originalFileContents,
        fileExists,
        encoding,
        lineEndings: endings
      } = readFileForEdit(absoluteFilePath);
      if (fileExists) {
        let lastWriteTime = getFileModificationTime(absoluteFilePath), lastRead = readFileState.get(absoluteFilePath);
        if (!lastRead || lastWriteTime > lastRead.timestamp) {
          if (!(lastRead && lastRead.offset === void 0 && lastRead.limit === void 0 && originalFileContents === lastRead.content))
            throw Error(FILE_UNEXPECTEDLY_MODIFIED_ERROR);
        }
      }
      let actualOldString = findActualString(originalFileContents, old_string) || old_string, actualNewString = preserveQuoteStyle(old_string, actualOldString, new_string), { patch, updatedFile } = getPatchForEdit({
        filePath: absoluteFilePath,
        fileContents: originalFileContents,
        oldString: actualOldString,
        newString: actualNewString,
        replaceAll: replace_all
      });
      writeTextContent(absoluteFilePath, updatedFile, encoding, endings);
      let lspManager = getLspServerManager();
      if (lspManager)
        clearDeliveredDiagnosticsForFile(`file://${absoluteFilePath}`), lspManager.changeFile(absoluteFilePath, updatedFile).catch((err2) => {
          logForDebugging(`LSP: Failed to notify server of file change for ${absoluteFilePath}: ${err2.message}`), logError2(err2);
        }), lspManager.saveFile(absoluteFilePath).catch((err2) => {
          logForDebugging(`LSP: Failed to notify server of file save for ${absoluteFilePath}: ${err2.message}`), logError2(err2);
        });
      if (notifyVscodeFileUpdated(absoluteFilePath, originalFileContents, updatedFile), readFileState.set(absoluteFilePath, {
        content: updatedFile,
        timestamp: getFileModificationTime(absoluteFilePath),
        offset: void 0,
        limit: void 0
      }), absoluteFilePath.endsWith(`${sep16}CLAUDE.md`))
        logEvent("tengu_write_claudemd", {});
      return countLinesChanged(patch), logFileOperation({
        operation: "edit",
        tool: "FileEditTool",
        filePath: absoluteFilePath
      }), logEvent("tengu_edit_string_lengths", {
        oldStringBytes: Buffer.byteLength(old_string, "utf8"),
        newStringBytes: Buffer.byteLength(new_string, "utf8"),
        replaceAll: replace_all
      }), {
        data: {
          filePath: file_path,
          oldString: actualOldString,
          newString: new_string,
          originalFile: originalFileContents,
          structuredPatch: patch,
          userModified: userModified ?? !1,
          replaceAll: replace_all
        }
      };
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      let { filePath, userModified, replaceAll: replaceAll2 } = data, modifiedNote = userModified ? ".  The user modified your proposed changes before accepting them. " : "";
      if (replaceAll2)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: `The file ${filePath} has been updated${modifiedNote}. All occurrences were successfully replaced.`
        };
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: `The file ${filePath} has been updated successfully${modifiedNote}.`
      };
    }
  });
});
