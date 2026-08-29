// Original: src/tools/GrepTool/GrepTool.ts
function applyHeadLimit(items, limit, offset = 0) {
  if (limit === 0)
    return { items: items.slice(offset), appliedLimit: void 0 };
  let effectiveLimit = limit ?? DEFAULT_HEAD_LIMIT, sliced = items.slice(offset, offset + effectiveLimit), wasTruncated = items.length - offset > effectiveLimit;
  return {
    items: sliced,
    appliedLimit: wasTruncated ? effectiveLimit : void 0
  };
}
function formatLimitInfo(appliedLimit, appliedOffset) {
  let parts = [];
  if (appliedLimit !== void 0)
    parts.push(`limit: ${appliedLimit}`);
  if (appliedOffset)
    parts.push(`offset: ${appliedOffset}`);
  return parts.join(", ");
}
var inputSchema14, VCS_DIRECTORIES_TO_EXCLUDE2, DEFAULT_HEAD_LIMIT = 250, outputSchema11, GrepTool;
var init_GrepTool = __esm(() => {
  init_v4();
  init_Tool();
  init_cwd2();
  init_errors();
  init_file();
  init_fsOperations();
  init_path2();
  init_filesystem();
  init_shellRuleMatching();
  init_orphanedPluginFilter();
  init_ripgrep();
  init_semanticBoolean();
  init_semanticNumber();
  init_prompt5();
  init_UI10();
  inputSchema14 = lazySchema(() => exports_external.strictObject({
    pattern: exports_external.string().describe("The regular expression pattern to search for in file contents"),
    path: exports_external.string().optional().describe("File or directory to search in (rg PATH). Defaults to current working directory."),
    glob: exports_external.string().optional().describe('Glob pattern to filter files (e.g. "*.js", "*.{ts,tsx}") - maps to rg --glob'),
    output_mode: exports_external.enum(["content", "files_with_matches", "count"]).optional().describe('Output mode: "content" shows matching lines (supports -A/-B/-C context, -n line numbers, head_limit), "files_with_matches" shows file paths (supports head_limit), "count" shows match counts (supports head_limit). Defaults to "files_with_matches".'),
    "-B": semanticNumber(exports_external.number().optional()).describe('Number of lines to show before each match (rg -B). Requires output_mode: "content", ignored otherwise.'),
    "-A": semanticNumber(exports_external.number().optional()).describe('Number of lines to show after each match (rg -A). Requires output_mode: "content", ignored otherwise.'),
    "-C": semanticNumber(exports_external.number().optional()).describe("Alias for context."),
    context: semanticNumber(exports_external.number().optional()).describe('Number of lines to show before and after each match (rg -C). Requires output_mode: "content", ignored otherwise.'),
    "-n": semanticBoolean(exports_external.boolean().optional()).describe('Show line numbers in output (rg -n). Requires output_mode: "content", ignored otherwise. Defaults to true.'),
    "-i": semanticBoolean(exports_external.boolean().optional()).describe("Case insensitive search (rg -i)"),
    type: exports_external.string().optional().describe("File type to search (rg --type). Common types: js, py, rust, go, java, etc. More efficient than include for standard file types."),
    head_limit: semanticNumber(exports_external.number().optional()).describe('Limit output to first N lines/entries, equivalent to "| head -N". Works across all output modes: content (limits output lines), files_with_matches (limits file paths), count (limits count entries). Defaults to 250 when unspecified. Pass 0 for unlimited (use sparingly \u2014 large result sets waste context).'),
    offset: semanticNumber(exports_external.number().optional()).describe('Skip first N lines/entries before applying head_limit, equivalent to "| tail -n +N | head -N". Works across all output modes. Defaults to 0.'),
    multiline: semanticBoolean(exports_external.boolean().optional()).describe("Enable multiline mode where . matches newlines and patterns can span lines (rg -U --multiline-dotall). Default: false.")
  })), VCS_DIRECTORIES_TO_EXCLUDE2 = [
    ".git",
    ".svn",
    ".hg",
    ".bzr",
    ".jj",
    ".sl"
  ];
  outputSchema11 = lazySchema(() => exports_external.object({
    mode: exports_external.enum(["content", "files_with_matches", "count"]).optional(),
    numFiles: exports_external.number(),
    filenames: exports_external.array(exports_external.string()),
    content: exports_external.string().optional(),
    numLines: exports_external.number().optional(),
    numMatches: exports_external.number().optional(),
    appliedLimit: exports_external.number().optional(),
    appliedOffset: exports_external.number().optional()
  })), GrepTool = buildTool({
    name: GREP_TOOL_NAME,
    searchHint: "search file contents with regex (ripgrep)",
    maxResultSizeChars: 20000,
    strict: !0,
    async description() {
      return getDescription();
    },
    userFacingName() {
      return "Search";
    },
    getToolUseSummary: getToolUseSummary3,
    getActivityDescription(input) {
      let summary = getToolUseSummary3(input);
      return summary ? `Searching for ${summary}` : "Searching";
    },
    get inputSchema() {
      return inputSchema14();
    },
    get outputSchema() {
      return outputSchema11();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.path ? `${input.pattern} in ${input.path}` : input.pattern;
    },
    isSearchOrReadCommand() {
      return { isSearch: !0, isRead: !1 };
    },
    getPath({ path: path19 }) {
      return path19 || getCwd();
    },
    async preparePermissionMatcher({ pattern }) {
      return (rulePattern) => matchWildcardPattern(rulePattern, pattern);
    },
    async validateInput({ path: path19 }) {
      if (path19) {
        let fs17 = getFsImplementation(), absolutePath = expandPath(path19);
        if (absolutePath.startsWith("\\\\") || absolutePath.startsWith("//"))
          return { result: !0 };
        try {
          await fs17.stat(absolutePath);
        } catch (e) {
          if (isENOENT(e)) {
            let cwdSuggestion = await suggestPathUnderCwd(absolutePath), message = `Path does not exist: ${path19}. ${FILE_NOT_FOUND_CWD_NOTE} ${getCwd()}.`;
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
      }
      return { result: !0 };
    },
    async checkPermissions(input, context6) {
      let appState = context6.getAppState();
      return checkReadPermissionForTool(GrepTool, input, appState.toolPermissionContext);
    },
    async prompt() {
      return getDescription();
    },
    renderToolUseMessage: renderToolUseMessage11,
    renderToolUseErrorMessage: renderToolUseErrorMessage7,
    renderToolResultMessage: renderToolResultMessage10,
    extractSearchText({ mode, content, filenames }) {
      if (mode === "content" && content)
        return content;
      return filenames.join(`
`);
    },
    mapToolResultToToolResultBlockParam({
      mode = "files_with_matches",
      numFiles,
      filenames,
      content,
      numLines: _numLines,
      numMatches,
      appliedLimit,
      appliedOffset
    }, toolUseID) {
      if (mode === "content") {
        let limitInfo2 = formatLimitInfo(appliedLimit, appliedOffset), resultContent = content || "No matches found", finalContent = limitInfo2 ? `${resultContent}

[Showing results with pagination = ${limitInfo2}]` : resultContent;
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: finalContent
        };
      }
      if (mode === "count") {
        let limitInfo2 = formatLimitInfo(appliedLimit, appliedOffset), rawContent2 = content || "No matches found", matches = numMatches ?? 0, files2 = numFiles ?? 0, summary = `

Found ${matches} total ${matches === 1 ? "occurrence" : "occurrences"} across ${files2} ${files2 === 1 ? "file" : "files"}.${limitInfo2 ? ` with pagination = ${limitInfo2}` : ""}`;
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: rawContent2 + summary
        };
      }
      let limitInfo = formatLimitInfo(appliedLimit, appliedOffset);
      if (numFiles === 0)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: "No files found"
        };
      let result = `Found ${numFiles} ${plural(numFiles, "file")}${limitInfo ? ` ${limitInfo}` : ""}
${filenames.join(`
`)}`;
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: result
      };
    },
    async call({
      pattern,
      path: path19,
      glob: glob2,
      type,
      output_mode = "files_with_matches",
      "-B": context_before,
      "-A": context_after,
      "-C": context_c,
      context: context6,
      "-n": show_line_numbers = !0,
      "-i": case_insensitive = !1,
      head_limit,
      offset = 0,
      multiline = !1
    }, { abortController, getAppState }) {
      let absolutePath = path19 ? expandPath(path19) : getCwd(), args = ["--hidden"];
      for (let dir of VCS_DIRECTORIES_TO_EXCLUDE2)
        args.push("--glob", `!${dir}`);
      if (args.push("--max-columns", "500"), multiline)
        args.push("-U", "--multiline-dotall");
      if (case_insensitive)
        args.push("-i");
      if (output_mode === "files_with_matches")
        args.push("-l");
      else if (output_mode === "count")
        args.push("-c");
      if (show_line_numbers && output_mode === "content")
        args.push("-n");
      if (output_mode === "content")
        if (context6 !== void 0)
          args.push("-C", context6.toString());
        else if (context_c !== void 0)
          args.push("-C", context_c.toString());
        else {
          if (context_before !== void 0)
            args.push("-B", context_before.toString());
          if (context_after !== void 0)
            args.push("-A", context_after.toString());
        }
      if (pattern.startsWith("-"))
        args.push("-e", pattern);
      else
        args.push(pattern);
      if (type)
        args.push("--type", type);
      if (glob2) {
        let globPatterns = [], rawPatterns = glob2.split(/\s+/);
        for (let rawPattern of rawPatterns)
          if (rawPattern.includes("{") && rawPattern.includes("}"))
            globPatterns.push(rawPattern);
          else
            globPatterns.push(...rawPattern.split(",").filter(Boolean));
        for (let globPattern of globPatterns.filter(Boolean))
          args.push("--glob", globPattern);
      }
      let appState = getAppState(), ignorePatterns = normalizePatternsToPath(getFileReadIgnorePatterns(appState.toolPermissionContext), getCwd());
      for (let ignorePattern of ignorePatterns) {
        let rgIgnorePattern = ignorePattern.startsWith("/") ? `!${ignorePattern}` : `!**/${ignorePattern}`;
        args.push("--glob", rgIgnorePattern);
      }
      for (let exclusion of await getGlobExclusionsForPluginCache(absolutePath))
        args.push("--glob", exclusion);
      let results = await ripGrep(args, absolutePath, abortController.signal);
      if (output_mode === "content") {
        let { items: limitedResults, appliedLimit: appliedLimit2 } = applyHeadLimit(results, head_limit, offset), finalLines = limitedResults.map((line) => {
          let colonIndex = line.indexOf(":");
          if (colonIndex > 0) {
            let filePath = line.substring(0, colonIndex), rest = line.substring(colonIndex);
            return toRelativePath(filePath) + rest;
          }
          return line;
        });
        return { data: {
          mode: "content",
          numFiles: 0,
          filenames: [],
          content: finalLines.join(`
`),
          numLines: finalLines.length,
          ...appliedLimit2 !== void 0 && { appliedLimit: appliedLimit2 },
          ...offset > 0 && { appliedOffset: offset }
        } };
      }
      if (output_mode === "count") {
        let { items: limitedResults, appliedLimit: appliedLimit2 } = applyHeadLimit(results, head_limit, offset), finalCountLines = limitedResults.map((line) => {
          let colonIndex = line.lastIndexOf(":");
          if (colonIndex > 0) {
            let filePath = line.substring(0, colonIndex), count3 = line.substring(colonIndex);
            return toRelativePath(filePath) + count3;
          }
          return line;
        }), totalMatches = 0, fileCount = 0;
        for (let line of finalCountLines) {
          let colonIndex = line.lastIndexOf(":");
          if (colonIndex > 0) {
            let countStr = line.substring(colonIndex + 1), count3 = parseInt(countStr, 10);
            if (!isNaN(count3))
              totalMatches += count3, fileCount += 1;
          }
        }
        return { data: {
          mode: "count",
          numFiles: fileCount,
          filenames: [],
          content: finalCountLines.join(`
`),
          numMatches: totalMatches,
          ...appliedLimit2 !== void 0 && { appliedLimit: appliedLimit2 },
          ...offset > 0 && { appliedOffset: offset }
        } };
      }
      let stats = await Promise.allSettled(results.map((_) => getFsImplementation().stat(_))), sortedMatches = results.map((_, i5) => {
        let r4 = stats[i5];
        return [
          _,
          r4.status === "fulfilled" ? r4.value.mtimeMs ?? 0 : 0
        ];
      }).sort((a2, b) => {
        let timeComparison = b[1] - a2[1];
        if (timeComparison === 0)
          return a2[0].localeCompare(b[0]);
        return timeComparison;
      }).map((_) => _[0]), { items: finalMatches, appliedLimit } = applyHeadLimit(sortedMatches, head_limit, offset), relativeMatches = finalMatches.map(toRelativePath);
      return {
        data: {
          mode: "files_with_matches",
          filenames: relativeMatches,
          numFiles: relativeMatches.length,
          ...appliedLimit !== void 0 && { appliedLimit },
          ...offset > 0 && { appliedOffset: offset }
        }
      };
    }
  });
});
