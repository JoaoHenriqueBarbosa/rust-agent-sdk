// Original: src/tools/GlobTool/GlobTool.ts
var inputSchema15, outputSchema12, GlobTool;
var init_GlobTool = __esm(() => {
  init_v4();
  init_Tool();
  init_cwd2();
  init_errors();
  init_file();
  init_fsOperations();
  init_glob();
  init_path2();
  init_filesystem();
  init_shellRuleMatching();
  init_UI11();
  inputSchema15 = lazySchema(() => exports_external.strictObject({
    pattern: exports_external.string().describe("The glob pattern to match files against"),
    path: exports_external.string().optional().describe('The directory to search in. If not specified, the current working directory will be used. IMPORTANT: Omit this field to use the default directory. DO NOT enter "undefined" or "null" - simply omit it for the default behavior. Must be a valid directory path if provided.')
  })), outputSchema12 = lazySchema(() => exports_external.object({
    durationMs: exports_external.number().describe("Time taken to execute the search in milliseconds"),
    numFiles: exports_external.number().describe("Total number of files found"),
    filenames: exports_external.array(exports_external.string()).describe("Array of file paths that match the pattern"),
    truncated: exports_external.boolean().describe("Whether results were truncated (limited to 100 files)")
  })), GlobTool = buildTool({
    name: GLOB_TOOL_NAME,
    searchHint: "find files by name pattern or wildcard",
    maxResultSizeChars: 1e5,
    async description() {
      return DESCRIPTION5;
    },
    userFacingName: userFacingName5,
    getToolUseSummary: getToolUseSummary4,
    getActivityDescription(input) {
      let summary = getToolUseSummary4(input);
      return summary ? `Finding ${summary}` : "Finding files";
    },
    get inputSchema() {
      return inputSchema15();
    },
    get outputSchema() {
      return outputSchema12();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.pattern;
    },
    isSearchOrReadCommand() {
      return { isSearch: !0, isRead: !1 };
    },
    getPath({ path: path19 }) {
      return path19 ? expandPath(path19) : getCwd();
    },
    async preparePermissionMatcher({ pattern }) {
      return (rulePattern) => matchWildcardPattern(rulePattern, pattern);
    },
    async validateInput({ path: path19 }) {
      if (path19) {
        let fs17 = getFsImplementation(), absolutePath = expandPath(path19);
        if (absolutePath.startsWith("\\\\") || absolutePath.startsWith("//"))
          return { result: !0 };
        let stats;
        try {
          stats = await fs17.stat(absolutePath);
        } catch (e) {
          if (isENOENT(e)) {
            let cwdSuggestion = await suggestPathUnderCwd(absolutePath), message = `Directory does not exist: ${path19}. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
            if (cwdSuggestion)
              message += ` Did you mean ${cwdSuggestion}?`;
            return {
              result: !1,
              message,
              errorCode: 1
            };
          }
          throw e;
        }
        if (!stats.isDirectory())
          return {
            result: !1,
            message: `Path is not a directory: ${path19}`,
            errorCode: 2
          };
      }
      return { result: !0 };
    },
    async checkPermissions(input, context6) {
      let appState = context6.getAppState();
      return checkReadPermissionForTool(GlobTool, input, appState.toolPermissionContext);
    },
    async prompt() {
      return DESCRIPTION5;
    },
    renderToolUseMessage: renderToolUseMessage12,
    renderToolUseErrorMessage: renderToolUseErrorMessage8,
    renderToolResultMessage: renderToolResultMessage11,
    extractSearchText({ filenames }) {
      return filenames.join(`
`);
    },
    async call(input, { abortController, getAppState, globLimits }) {
      let start = Date.now(), appState = getAppState(), limit = globLimits?.maxResults ?? 100, { files: files2, truncated } = await glob(input.pattern, GlobTool.getPath(input), { limit, offset: 0 }, abortController.signal, appState.toolPermissionContext), filenames = files2.map(toRelativePath);
      return {
        data: {
          filenames,
          durationMs: Date.now() - start,
          numFiles: filenames.length,
          truncated
        }
      };
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      if (output.filenames.length === 0)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: "No files found"
        };
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: [
          ...output.filenames,
          ...output.truncated ? [
            "(Results are truncated. Consider using a more specific path or pattern.)"
          ] : []
        ].join(`
`)
      };
    }
  });
});
