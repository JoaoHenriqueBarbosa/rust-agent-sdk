// var: init_BashTool
var init_BashTool = __esm(() => {
  init_v4();
  init_vscodeSdkMcp();
  init_Tool();
  init_LocalShellTask();
  init_ast();
  init_commands4();
  init_claudeCodeHints();
  init_codeIndexing();
  init_envUtils();
  init_errors();
  init_file();
  init_fileHistory();
  init_format();
  init_fsOperations();
  init_path2();
  init_hintRecommendation();
  init_Shell();
  init_sandbox_adapter();
  init_semanticBoolean();
  init_semanticNumber();
  init_diskOutput();
  init_TaskOutput();
  init_terminal2();
  init_toolResultStorage();
  init_UI8();
  init_gitOperationTracking();
  init_bashPermissions();
  init_commandSemantics2();
  init_prompt19();
  init_readOnlyValidation();
  init_sedEditParser();
  init_shouldUseSandbox();
  init_UI6();
  init_utils12();
  jsx_dev_runtime153 = __toESM(require_react_jsx_dev_runtime_development(), 1), BASH_SEARCH_COMMANDS = /* @__PURE__ */ new Set(["find", "grep", "rg", "ag", "ack", "locate", "which", "whereis"]), BASH_READ_COMMANDS = /* @__PURE__ */ new Set([
    "cat",
    "head",
    "tail",
    "less",
    "more",
    "wc",
    "stat",
    "file",
    "strings",
    "jq",
    "awk",
    "cut",
    "sort",
    "uniq",
    "tr"
  ]), BASH_LIST_COMMANDS = /* @__PURE__ */ new Set(["ls", "tree", "du"]), BASH_SEMANTIC_NEUTRAL_COMMANDS = /* @__PURE__ */ new Set([
    "echo",
    "printf",
    "true",
    "false",
    ":"
  ]), BASH_SILENT_COMMANDS = /* @__PURE__ */ new Set(["mv", "cp", "rm", "mkdir", "rmdir", "chmod", "chown", "chgrp", "touch", "ln", "cd", "export", "unset", "wait"]);
  DISALLOWED_AUTO_BACKGROUND_COMMANDS2 = [
    "sleep"
  ], isBackgroundTasksDisabled3 = isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), fullInputSchema3 = lazySchema(() => exports_external.strictObject({
    command: exports_external.string().describe("The command to execute"),
    timeout: semanticNumber(exports_external.number().optional()).describe(`Optional timeout in milliseconds (max ${getMaxTimeoutMs2()})`),
    description: exports_external.string().optional().describe(`Clear, concise description of what this command does in active voice. Never use words like "complex" or "risk" in the description - just describe what it does.

For simple commands (git, npm, standard CLI tools), keep it brief (5-10 words):
- ls \u2192 "List files in current directory"
- git status \u2192 "Show working tree status"
- npm install \u2192 "Install package dependencies"

For commands that are harder to parse at a glance (piped commands, obscure flags, etc.), add enough context to clarify what it does:
- find . -name "*.tmp" -exec rm {} \\; \u2192 "Find and delete all .tmp files recursively"
- git reset --hard origin/main \u2192 "Discard all local changes and match remote main"
- curl -s url | jq '.data[]' \u2192 "Fetch JSON from URL and extract data array elements"`),
    run_in_background: semanticBoolean(exports_external.boolean().optional()).describe("Set to true to run this command in the background. Use Read to read the output later."),
    dangerouslyDisableSandbox: semanticBoolean(exports_external.boolean().optional()).describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing."),
    _simulatedSedEdit: exports_external.object({
      filePath: exports_external.string(),
      newContent: exports_external.string()
    }).optional().describe("Internal: pre-computed sed edit result from preview")
  })), inputSchema39 = lazySchema(() => isBackgroundTasksDisabled3 ? fullInputSchema3().omit({
    run_in_background: !0,
    _simulatedSedEdit: !0
  }) : fullInputSchema3().omit({
    _simulatedSedEdit: !0
  })), COMMON_BACKGROUND_COMMANDS2 = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "wget", "build", "test", "serve", "watch", "dev"];
  outputSchema31 = lazySchema(() => exports_external.object({
    stdout: exports_external.string().describe("The standard output of the command"),
    stderr: exports_external.string().describe("The standard error output of the command"),
    rawOutputPath: exports_external.string().optional().describe("Path to raw output file for large MCP tool outputs"),
    interrupted: exports_external.boolean().describe("Whether the command was interrupted"),
    isImage: exports_external.boolean().optional().describe("Flag to indicate if stdout contains image data"),
    backgroundTaskId: exports_external.string().optional().describe("ID of the background task if command is running in background"),
    backgroundedByUser: exports_external.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
    assistantAutoBackgrounded: exports_external.boolean().optional().describe("True if assistant-mode auto-backgrounded a long-running blocking command"),
    dangerouslyDisableSandbox: exports_external.boolean().optional().describe("Flag to indicate if sandbox mode was overridden"),
    returnCodeInterpretation: exports_external.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
    noOutputExpected: exports_external.boolean().optional().describe("Whether the command is expected to produce no output on success"),
    structuredContent: exports_external.array(exports_external.any()).optional().describe("Structured content blocks"),
    persistedOutputPath: exports_external.string().optional().describe("Path to the persisted full output in tool-results dir (set when output is too large for inline)"),
    persistedOutputSize: exports_external.number().optional().describe("Total size of the output in bytes (set when output is too large for inline)")
  }));
  BashTool = buildTool({
    name: BASH_TOOL_NAME,
    searchHint: "execute shell commands",
    maxResultSizeChars: 30000,
    strict: !0,
    async description({
      description
    }) {
      return description || "Run shell command";
    },
    async prompt() {
      return getSimplePrompt();
    },
    isConcurrencySafe(input) {
      return this.isReadOnly?.(input) ?? !1;
    },
    isReadOnly(input) {
      let compoundCommandHasCd = commandHasAnyCd(input.command);
      return checkReadOnlyConstraints(input, compoundCommandHasCd).behavior === "allow";
    },
    toAutoClassifierInput(input) {
      return input.command;
    },
    async preparePermissionMatcher({
      command: command12
    }) {
      let parsed = await parseForSecurity(command12);
      if (parsed.kind !== "simple")
        return () => !0;
      let subcommands = parsed.commands.map((c3) => c3.argv.join(" "));
      return (pattern) => {
        let prefix = permissionRuleExtractPrefix3(pattern);
        return subcommands.some((cmd) => {
          if (prefix !== null)
            return cmd === prefix || cmd.startsWith(`${prefix} `);
          return matchWildcardPattern2(pattern, cmd);
        });
      };
    },
    isSearchOrReadCommand(input) {
      let parsed = inputSchema39().safeParse(input);
      if (!parsed.success)
        return {
          isSearch: !1,
          isRead: !1,
          isList: !1
        };
      return isSearchOrReadBashCommand(parsed.data.command);
    },
    get inputSchema() {
      return inputSchema39();
    },
    get outputSchema() {
      return outputSchema31();
    },
    userFacingName(input) {
      if (!input)
        return "Bash";
      if (input.command) {
        let sedInfo = parseSedEditCommand(input.command);
        if (sedInfo)
          return userFacingName3({
            file_path: sedInfo.filePath,
            old_string: "x"
          });
      }
      return isEnvTruthy(process.env.CLAUDE_CODE_BASH_SANDBOX_SHOW_INDICATOR) && shouldUseSandbox(input) ? "SandboxedBash" : "Bash";
    },
    getToolUseSummary(input) {
      if (!input?.command)
        return null;
      let {
        command: command12,
        description
      } = input;
      if (description)
        return description;
      return truncate(command12, TOOL_SUMMARY_MAX_LENGTH);
    },
    getActivityDescription(input) {
      if (!input?.command)
        return "Running command";
      return `Running ${input.description ?? truncate(input.command, TOOL_SUMMARY_MAX_LENGTH)}`;
    },
    async validateInput(input) {
      return {
        result: !0
      };
    },
    async checkPermissions(input, context6) {
      return bashToolHasPermission(input, context6);
    },
    renderToolUseMessage: renderToolUseMessage7,
    renderToolUseProgressMessage: renderToolUseProgressMessage5,
    renderToolUseQueuedMessage: renderToolUseQueuedMessage2,
    renderToolResultMessage: renderToolResultMessage6,
    extractSearchText({
      stdout,
      stderr
    }) {
      return stderr ? `${stdout}
${stderr}` : stdout;
    },
    mapToolResultToToolResultBlockParam({
      interrupted,
      stdout,
      stderr,
      isImage,
      backgroundTaskId,
      backgroundedByUser,
      assistantAutoBackgrounded,
      structuredContent,
      persistedOutputPath,
      persistedOutputSize
    }, toolUseID) {
      if (structuredContent && structuredContent.length > 0)
        return {
          tool_use_id: toolUseID,
          type: "tool_result",
          content: structuredContent
        };
      if (isImage) {
        let block2 = buildImageToolResult(stdout, toolUseID);
        if (block2)
          return block2;
      }
      let processedStdout = stdout;
      if (stdout)
        processedStdout = stdout.replace(/^(\s*\n)+/, ""), processedStdout = processedStdout.trimEnd();
      if (persistedOutputPath) {
        let preview = generatePreview(processedStdout, PREVIEW_SIZE_BYTES);
        processedStdout = buildLargeToolResultMessage({
          filepath: persistedOutputPath,
          originalSize: persistedOutputSize ?? 0,
          isJson: !1,
          preview: preview.preview,
          hasMore: preview.hasMore
        });
      }
      let errorMessage2 = stderr.trim();
      if (interrupted) {
        if (stderr)
          errorMessage2 += EOL6;
        errorMessage2 += "<error>Command was aborted before completion</error>";
      }
      let backgroundInfo = "";
      if (backgroundTaskId) {
        let outputPath = getTaskOutputPath(backgroundTaskId);
        if (assistantAutoBackgrounded)
          backgroundInfo = `Command exceeded the assistant-mode blocking budget (${ASSISTANT_BLOCKING_BUDGET_MS2 / 1000}s) and was moved to the background with ID: ${backgroundTaskId}. It is still running \u2014 you will be notified when it completes. Output is being written to: ${outputPath}. In assistant mode, delegate long-running work to a subagent or use run_in_background to keep this conversation responsive.`;
        else if (backgroundedByUser)
          backgroundInfo = `Command was manually backgrounded by user with ID: ${backgroundTaskId}. Output is being written to: ${outputPath}`;
        else
          backgroundInfo = `Command running in background with ID: ${backgroundTaskId}. Output is being written to: ${outputPath}`;
      }
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: [processedStdout, errorMessage2, backgroundInfo].filter(Boolean).join(`
`),
        is_error: interrupted
      };
    },
    async call(input, toolUseContext, _canUseTool, parentMessage, onProgress) {
      if (input._simulatedSedEdit)
        return applySedEdit(input._simulatedSedEdit, toolUseContext, parentMessage);
      let {
        abortController,
        getAppState,
        setAppState,
        setToolJSX
      } = toolUseContext, stdoutAccumulator = new EndTruncatingAccumulator, stderrForShellReset = "", interpretationResult, progressCounter = 0, wasInterrupted = !1, result, isMainThread = !toolUseContext.agentId, preventCwdChanges = !isMainThread;
      try {
        let commandGenerator = runShellCommand({
          input,
          abortController,
          setAppState: toolUseContext.setAppStateForTasks ?? setAppState,
          setToolJSX,
          preventCwdChanges,
          isMainThread,
          toolUseId: toolUseContext.toolUseId,
          agentId: toolUseContext.agentId
        }), generatorResult;
        do
          if (generatorResult = await commandGenerator.next(), !generatorResult.done && onProgress) {
            let progress = generatorResult.value;
            onProgress({
              toolUseID: `bash-progress-${progressCounter++}`,
              data: {
                type: "bash_progress",
                output: progress.output,
                fullOutput: progress.fullOutput,
                elapsedTimeSeconds: progress.elapsedTimeSeconds,
                totalLines: progress.totalLines,
                totalBytes: progress.totalBytes,
                taskId: progress.taskId,
                timeoutMs: progress.timeoutMs
              }
            });
          }
        while (!generatorResult.done);
        result = generatorResult.value, trackGitOperations(input.command, result.code, result.stdout);
        let isInterrupt = result.interrupted && abortController.signal.reason === "interrupt";
        if (stdoutAccumulator.append((result.stdout || "").trimEnd() + EOL6), interpretationResult = interpretCommandResult2(input.command, result.code, result.stdout || "", ""), result.stdout && result.stdout.includes(".git/index.lock': File exists"))
          logEvent("tengu_git_index_lock_error", {});
        if (interpretationResult.isError && !isInterrupt) {
          if (result.code !== 0)
            stdoutAccumulator.append(`Exit code ${result.code}`);
        }
        if (!preventCwdChanges) {
          let appState = getAppState();
          if (resetCwdIfOutsideProject(appState.toolPermissionContext))
            stderrForShellReset = stdErrAppendShellResetMessage("");
        }
        let outputWithSbFailures = SandboxManager2.annotateStderrWithSandboxFailures(input.command, result.stdout || "");
        if (result.preSpawnError)
          throw Error(result.preSpawnError);
        if (interpretationResult.isError && !isInterrupt)
          throw new ShellError("", outputWithSbFailures, result.code, result.interrupted);
        wasInterrupted = result.interrupted;
      } finally {
        if (setToolJSX)
          setToolJSX(null);
      }
      let stdout = stdoutAccumulator.toString(), MAX_PERSISTED_SIZE = 67108864, persistedOutputPath, persistedOutputSize;
      if (result.outputFilePath && result.outputTaskId)
        try {
          let fileStat = await fsStat2(result.outputFilePath);
          persistedOutputSize = fileStat.size, await ensureToolResultsDir();
          let dest = getToolResultPath(result.outputTaskId, !1);
          if (fileStat.size > MAX_PERSISTED_SIZE)
            await fsTruncate2(result.outputFilePath, MAX_PERSISTED_SIZE);
          try {
            await link5(result.outputFilePath, dest);
          } catch {
            await copyFile6(result.outputFilePath, dest);
          }
          persistedOutputPath = dest;
        } catch {}
      let commandType = input.command.split(" ")[0];
      logEvent("tengu_bash_tool_command_executed", {
        command_type: commandType,
        stdout_length: stdout.length,
        stderr_length: 0,
        exit_code: result.code,
        interrupted: wasInterrupted
      });
      let codeIndexingTool = detectCodeIndexingFromCommand(input.command);
      if (codeIndexingTool)
        logEvent("tengu_code_indexing_tool_used", {
          tool: codeIndexingTool,
          source: "cli",
          success: result.code === 0
        });
      let strippedStdout = stripEmptyLines(stdout), extracted = extractClaudeCodeHints(strippedStdout, input.command);
      if (strippedStdout = extracted.stripped, isMainThread && extracted.hints.length > 0)
        for (let hint of extracted.hints)
          maybeRecordPluginHint(hint);
      let isImage = isImageOutput(strippedStdout), compressedStdout = strippedStdout;
      if (isImage) {
        let resized = await resizeShellImageOutput(strippedStdout, result.outputFilePath, persistedOutputSize);
        if (resized)
          compressedStdout = resized;
        else
          isImage = !1;
      }
      return {
        data: {
          stdout: compressedStdout,
          stderr: stderrForShellReset,
          interrupted: wasInterrupted,
          isImage,
          returnCodeInterpretation: interpretationResult?.message,
          noOutputExpected: isSilentBashCommand(input.command),
          backgroundTaskId: result.backgroundTaskId,
          backgroundedByUser: result.backgroundedByUser,
          assistantAutoBackgrounded: result.assistantAutoBackgrounded,
          dangerouslyDisableSandbox: "dangerouslyDisableSandbox" in input ? input.dangerouslyDisableSandbox : void 0,
          persistedOutputPath,
          persistedOutputSize
        }
      };
    },
    renderToolUseErrorMessage: renderToolUseErrorMessage3,
    isResultTruncated(output) {
      return isOutputLineTruncated(output.stdout) || isOutputLineTruncated(output.stderr);
    }
  });
});
