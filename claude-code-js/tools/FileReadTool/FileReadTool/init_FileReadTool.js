// var: init_FileReadTool
var init_FileReadTool = __esm(() => {
  init_v4();
  init_files2();
  init_metadata();
  init_tokenEstimation();
  init_loadSkillsDir();
  init_Tool();
  init_cwd2();
  init_envUtils();
  init_errors();
  init_file();
  init_format();
  init_fsOperations();
  init_imageResizer();
  init_log3();
  init_memoryFileDetection();
  init_messages3();
  init_model();
  init_notebook();
  init_path2();
  init_pdf();
  init_pdfUtils();
  init_filesystem();
  init_shellRuleMatching();
  init_readFileInRange();
  init_semanticNumber();
  init_slowOperations();
  init_limits();
  init_prompt2();
  init_UI25();
  init_promptOverrides();
  BLOCKED_DEVICE_PATHS = /* @__PURE__ */ new Set([
    "/dev/zero",
    "/dev/random",
    "/dev/urandom",
    "/dev/full",
    "/dev/stdin",
    "/dev/tty",
    "/dev/console",
    "/dev/stdout",
    "/dev/stderr",
    "/dev/fd/0",
    "/dev/fd/1",
    "/dev/fd/2"
  ]);
  THIN_SPACE = String.fromCharCode(8239);
  fileReadListeners = [];
  MaxFileReadTokenExceededError = class MaxFileReadTokenExceededError extends Error {
    tokenCount;
    maxTokens;
    constructor(tokenCount, maxTokens) {
      super(`File content (${tokenCount} tokens) exceeds maximum allowed tokens (${maxTokens}). Use offset and limit parameters to read specific portions of the file, or search for specific content instead of reading the whole file.`);
      this.tokenCount = tokenCount;
      this.maxTokens = maxTokens;
      this.name = "MaxFileReadTokenExceededError";
    }
  };
  IMAGE_EXTENSIONS = /* @__PURE__ */ new Set(["png", "jpg", "jpeg", "gif", "webp"]);
  inputSchema40 = lazySchema(() => exports_external.strictObject({
    file_path: exports_external.string().describe("The absolute path to the file to read"),
    offset: semanticNumber(exports_external.number().int().nonnegative().optional()).describe("The line number to start reading from. Only provide if the file is too large to read at once"),
    limit: semanticNumber(exports_external.number().int().positive().optional()).describe("The number of lines to read. Only provide if the file is too large to read at once."),
    pages: exports_external.string().optional().describe(`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum ${PDF_MAX_PAGES_PER_READ} pages per request.`)
  })), outputSchema32 = lazySchema(() => {
    let imageMediaTypes = exports_external.enum([
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp"
    ]);
    return exports_external.discriminatedUnion("type", [
      exports_external.object({
        type: exports_external.literal("text"),
        file: exports_external.object({
          filePath: exports_external.string().describe("The path to the file that was read"),
          content: exports_external.string().describe("The content of the file"),
          numLines: exports_external.number().describe("Number of lines in the returned content"),
          startLine: exports_external.number().describe("The starting line number"),
          totalLines: exports_external.number().describe("Total number of lines in the file")
        })
      }),
      exports_external.object({
        type: exports_external.literal("image"),
        file: exports_external.object({
          base64: exports_external.string().describe("Base64-encoded image data"),
          type: imageMediaTypes.describe("The MIME type of the image"),
          originalSize: exports_external.number().describe("Original file size in bytes"),
          dimensions: exports_external.object({
            originalWidth: exports_external.number().optional().describe("Original image width in pixels"),
            originalHeight: exports_external.number().optional().describe("Original image height in pixels"),
            displayWidth: exports_external.number().optional().describe("Displayed image width in pixels (after resizing)"),
            displayHeight: exports_external.number().optional().describe("Displayed image height in pixels (after resizing)")
          }).optional().describe("Image dimension info for coordinate mapping")
        })
      }),
      exports_external.object({
        type: exports_external.literal("notebook"),
        file: exports_external.object({
          filePath: exports_external.string().describe("The path to the notebook file"),
          cells: exports_external.array(exports_external.any()).describe("Array of notebook cells")
        })
      }),
      exports_external.object({
        type: exports_external.literal("pdf"),
        file: exports_external.object({
          filePath: exports_external.string().describe("The path to the PDF file"),
          base64: exports_external.string().describe("Base64-encoded PDF data"),
          originalSize: exports_external.number().describe("Original file size in bytes")
        })
      }),
      exports_external.object({
        type: exports_external.literal("parts"),
        file: exports_external.object({
          filePath: exports_external.string().describe("The path to the PDF file"),
          originalSize: exports_external.number().describe("Original file size in bytes"),
          count: exports_external.number().describe("Number of pages extracted"),
          outputDir: exports_external.string().describe("Directory containing extracted page images")
        })
      }),
      exports_external.object({
        type: exports_external.literal("file_unchanged"),
        file: exports_external.object({
          filePath: exports_external.string().describe("The path to the file")
        })
      })
    ]);
  }), FileReadTool = buildTool({
    name: FILE_READ_TOOL_NAME,
    searchHint: "read files, images, PDFs, notebooks",
    maxResultSizeChars: 1 / 0,
    strict: !0,
    async description() {
      return DESCRIPTION3;
    },
    async prompt() {
      let limits = getDefaultFileReadingLimits(), maxSizeInstruction = limits.includeMaxSizeInPrompt ? `. Files larger than ${formatFileSize(limits.maxSizeBytes)} will return an error; use offset and limit for larger files` : "", offsetInstruction = limits.targetedRangeNudge ? OFFSET_INSTRUCTION_TARGETED : OFFSET_INSTRUCTION_DEFAULT;
      return renderPromptTemplate(pickLineFormatInstruction(), maxSizeInstruction, offsetInstruction);
    },
    get inputSchema() {
      return inputSchema40();
    },
    get outputSchema() {
      return outputSchema32();
    },
    userFacingName: userFacingName7,
    getToolUseSummary: getToolUseSummary8,
    getActivityDescription(input) {
      let summary = getToolUseSummary8(input);
      return summary ? `Reading ${summary}` : "Reading file";
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.file_path;
    },
    isSearchOrReadCommand() {
      return { isSearch: !1, isRead: !0 };
    },
    getPath({ file_path }) {
      return file_path || getCwd();
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
      return checkReadPermissionForTool(FileReadTool, input, appState.toolPermissionContext);
    },
    renderToolUseMessage: renderToolUseMessage27,
    renderToolUseTag: renderToolUseTag2,
    renderToolResultMessage: renderToolResultMessage25,
    extractSearchText() {
      return "";
    },
    renderToolUseErrorMessage: renderToolUseErrorMessage11,
    async validateInput({ file_path, pages }, toolUseContext) {
      if (pages !== void 0) {
        let parsed = parsePDFPageRange(pages);
        if (!parsed)
          return {
            result: !1,
            message: `Invalid pages parameter: "${pages}". Use formats like "1-5", "3", or "10-20". Pages are 1-indexed.`,
            errorCode: 7
          };
        if ((parsed.lastPage === 1 / 0 ? PDF_MAX_PAGES_PER_READ + 1 : parsed.lastPage - parsed.firstPage + 1) > PDF_MAX_PAGES_PER_READ)
          return {
            result: !1,
            message: `Page range "${pages}" exceeds maximum of ${PDF_MAX_PAGES_PER_READ} pages per request. Please use a smaller range.`,
            errorCode: 8
          };
      }
      let fullFilePath = expandPath(file_path), appState = toolUseContext.getAppState();
      if (matchingRuleForInput(fullFilePath, appState.toolPermissionContext, "read", "deny") !== null)
        return {
          result: !1,
          message: "File is in a directory that is denied by your permission settings.",
          errorCode: 1
        };
      if (fullFilePath.startsWith("\\\\") || fullFilePath.startsWith("//"))
        return { result: !0 };
      let ext = path20.extname(fullFilePath).toLowerCase();
      if (hasBinaryExtension(fullFilePath) && !isPDFExtension(ext) && !IMAGE_EXTENSIONS.has(ext.slice(1)))
        return {
          result: !1,
          message: `This tool cannot read binary files. The file appears to be a binary ${ext} file. Please use appropriate tools for binary file analysis.`,
          errorCode: 4
        };
      if (isBlockedDevicePath(fullFilePath))
        return {
          result: !1,
          message: `Cannot read '${file_path}': this device file would block or produce infinite output.`,
          errorCode: 9
        };
      return { result: !0 };
    },
    async call({ file_path, offset = 1, limit = void 0, pages }, context6, _canUseTool, parentMessage) {
      let { readFileState, fileReadingLimits } = context6, defaults2 = getDefaultFileReadingLimits(), maxSizeBytes = fileReadingLimits?.maxSizeBytes ?? defaults2.maxSizeBytes, maxTokens = fileReadingLimits?.maxTokens ?? defaults2.maxTokens;
      if (fileReadingLimits !== void 0)
        logEvent("tengu_file_read_limits_override", {
          hasMaxTokens: fileReadingLimits.maxTokens !== void 0,
          hasMaxSizeBytes: fileReadingLimits.maxSizeBytes !== void 0
        });
      let ext = path20.extname(file_path).toLowerCase().slice(1), fullFilePath = expandPath(file_path), existingState = readFileState.get(fullFilePath);
      if (existingState && !existingState.isPartialView && existingState.offset !== void 0) {
        if (existingState.offset === offset && existingState.limit === limit)
          try {
            if (await getFileModificationTimeAsync(fullFilePath) === existingState.timestamp) {
              let analyticsExt = getFileExtensionForAnalytics(fullFilePath);
              return logEvent("tengu_file_read_dedup", {
                ...analyticsExt !== void 0 && { ext: analyticsExt }
              }), {
                data: {
                  type: "file_unchanged",
                  file: { filePath: file_path }
                }
              };
            }
          } catch {}
      }
      let cwd2 = getCwd();
      if (!isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
        let newSkillDirs = await discoverSkillDirsForPaths([fullFilePath], cwd2);
        if (newSkillDirs.length > 0) {
          for (let dir of newSkillDirs)
            context6.dynamicSkillDirTriggers?.add(dir);
          addSkillDirectories(newSkillDirs).catch(() => {});
        }
        activateConditionalSkillsForPaths([fullFilePath], cwd2);
      }
      try {
        return await callInner(file_path, fullFilePath, fullFilePath, ext, offset, limit, pages, maxSizeBytes, maxTokens, readFileState, context6, parentMessage?.message.id);
      } catch (error44) {
        if (getErrnoCode(error44) === "ENOENT") {
          let altPath = getAlternateScreenshotPath(fullFilePath);
          if (altPath)
            try {
              return await callInner(file_path, fullFilePath, altPath, ext, offset, limit, pages, maxSizeBytes, maxTokens, readFileState, context6, parentMessage?.message.id);
            } catch (altError) {
              if (!isENOENT(altError))
                throw altError;
            }
          let similarFilename = findSimilarFile(fullFilePath), cwdSuggestion = await suggestPathUnderCwd(fullFilePath), message = `File does not exist. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
          if (cwdSuggestion)
            message += ` Did you mean ${cwdSuggestion}?`;
          else if (similarFilename)
            message += ` Did you mean ${similarFilename}?`;
          throw Error(message);
        }
        throw error44;
      }
    },
    mapToolResultToToolResultBlockParam(data, toolUseID) {
      switch (data.type) {
        case "image":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  data: data.file.base64,
                  media_type: data.file.type
                }
              }
            ]
          };
        case "notebook":
          return mapNotebookCellsToToolResult(data.file.cells, toolUseID);
        case "pdf":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `PDF file read: ${data.file.filePath} (${formatFileSize(data.file.originalSize)})`
          };
        case "parts":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: `PDF pages extracted: ${data.file.count} page(s) from ${data.file.filePath} (${formatFileSize(data.file.originalSize)})`
          };
        case "file_unchanged":
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content: FILE_UNCHANGED_STUB
          };
        case "text": {
          let content;
          if (data.file.content)
            content = memoryFileFreshnessPrefix(data) + formatFileLines(data.file) + (shouldIncludeFileReadMitigation() ? CYBER_RISK_MITIGATION_REMINDER : "");
          else
            content = data.file.totalLines === 0 ? "<system-reminder>Warning: the file exists but the contents are empty.</system-reminder>" : `<system-reminder>Warning: the file exists but is shorter than the provided offset (${data.file.startLine}). The file has ${data.file.totalLines} lines.</system-reminder>`;
          return {
            tool_use_id: toolUseID,
            type: "tool_result",
            content
          };
        }
      }
    }
  });
  CYBER_RISK_MITIGATION_REMINDER = promptToggle("fileReadMalware", `

<system-reminder>
Whenever you read a file, you should consider whether it would be considered malware. You CAN and SHOULD provide analysis of malware, what it is doing. But you MUST refuse to improve or augment the code. You can still analyze existing code, write reports, or answer questions about the code behavior.
</system-reminder>
`), MITIGATION_EXEMPT_MODELS = /* @__PURE__ */ new Set(["claude-opus-4-6"]);
  memoryFileMtimes = /* @__PURE__ */ new WeakMap;
});
