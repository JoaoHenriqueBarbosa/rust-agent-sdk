// var: init_PowerShellTool
var init_PowerShellTool = __esm(() => {
  init_v4();
  init_state();
  init_Tool();
  init_LocalShellTask();
  init_claudeCodeHints();
  init_envUtils();
  init_errors();
  init_format();
  init_log3();
  init_platform();
  init_hintRecommendation();
  init_Shell();
  init_sandbox_adapter();
  init_semanticBoolean();
  init_semanticNumber();
  init_powershellDetection();
  init_diskOutput();
  init_TaskOutput();
  init_terminal2();
  init_toolResultStorage();
  init_shouldUseSandbox();
  init_UI6();
  init_utils12();
  init_gitOperationTracking();
  init_commandSemantics();
  init_powershellPermissions();
  init_prompt12();
  init_readOnlyValidation2();
  init_UI7();
  jsx_dev_runtime124 = __toESM(require_react_jsx_dev_runtime_development(), 1), PS_SEARCH_COMMANDS = /* @__PURE__ */ new Set([
    "select-string",
    "get-childitem",
    "findstr",
    "where.exe"
  ]), PS_READ_COMMANDS = /* @__PURE__ */ new Set([
    "get-content",
    "get-item",
    "test-path",
    "resolve-path",
    "get-process",
    "get-service",
    "get-childitem",
    "get-location",
    "get-filehash",
    "get-acl",
    "format-hex"
  ]), PS_SEMANTIC_NEUTRAL_COMMANDS = /* @__PURE__ */ new Set([
    "write-output",
    "write-host"
  ]);
  DISALLOWED_AUTO_BACKGROUND_COMMANDS = [
    "start-sleep",
    "sleep"
  ];
  isBackgroundTasksDisabled = isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS), fullInputSchema = lazySchema(() => exports_external.strictObject({
    command: exports_external.string().describe("The PowerShell command to execute"),
    timeout: semanticNumber(exports_external.number().optional()).describe(`Optional timeout in milliseconds (max ${getMaxTimeoutMs()})`),
    description: exports_external.string().optional().describe("Clear, concise description of what this command does in active voice."),
    run_in_background: semanticBoolean(exports_external.boolean().optional()).describe("Set to true to run this command in the background. Use Read to read the output later."),
    dangerouslyDisableSandbox: semanticBoolean(exports_external.boolean().optional()).describe("Set this to true to dangerously override sandbox mode and run commands without sandboxing.")
  })), inputSchema11 = lazySchema(() => isBackgroundTasksDisabled ? fullInputSchema().omit({
    run_in_background: !0
  }) : fullInputSchema()), outputSchema8 = lazySchema(() => exports_external.object({
    stdout: exports_external.string().describe("The standard output of the command"),
    stderr: exports_external.string().describe("The standard error output of the command"),
    interrupted: exports_external.boolean().describe("Whether the command was interrupted"),
    returnCodeInterpretation: exports_external.string().optional().describe("Semantic interpretation for non-error exit codes with special meaning"),
    isImage: exports_external.boolean().optional().describe("Flag to indicate if stdout contains image data"),
    persistedOutputPath: exports_external.string().optional().describe("Path to persisted full output when too large for inline"),
    persistedOutputSize: exports_external.number().optional().describe("Total output size in bytes when persisted"),
    backgroundTaskId: exports_external.string().optional().describe("ID of the background task if command is running in background"),
    backgroundedByUser: exports_external.boolean().optional().describe("True if the user manually backgrounded the command with Ctrl+B"),
    assistantAutoBackgrounded: exports_external.boolean().optional().describe("True if the command was auto-backgrounded by the assistant-mode blocking budget")
  })), COMMON_BACKGROUND_COMMANDS = ["npm", "yarn", "pnpm", "node", "python", "python3", "go", "cargo", "make", "docker", "terraform", "webpack", "vite", "jest", "pytest", "curl", "Invoke-WebRequest", "build", "test", "serve", "watch", "dev"];
  PowerShellTool = buildTool({
    name: POWERSHELL_TOOL_NAME,
    searchHint: "execute Windows PowerShell commands",
    maxResultSizeChars: 30000,
    strict: !0,
    async description({
      description
    }) {
      return description || "Run PowerShell command";
    },
    async prompt() {
      return getPrompt3();
    },
    isConcurrencySafe(input) {
      return this.isReadOnly?.(input) ?? !1;
    },
    isSearchOrReadCommand(input) {
      if (!input.command)
        return {
          isSearch: !1,
          isRead: !1
        };
      return isSearchOrReadPowerShellCommand(input.command);
    },
    isReadOnly(input) {
      if (hasSyncSecurityConcerns(input.command))
        return !1;
      return isReadOnlyCommand(input.command);
    },
    toAutoClassifierInput(input) {
      return input.command;
    },
    get inputSchema() {
      return inputSchema11();
    },
    get outputSchema() {
      return outputSchema8();
    },
    userFacingName() {
      return "PowerShell";
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
    isEnabled() {
      return !0;
    },
    async validateInput(input) {
      if (isWindowsSandboxPolicyViolation())
        return {
          result: !1,
          message: WINDOWS_SANDBOX_POLICY_REFUSAL,
          errorCode: 11
        };
      return {
        result: !0
      };
    },
    async checkPermissions(input, context6) {
      return await powershellToolHasPermission(input, context6);
    },
    renderToolUseMessage: renderToolUseMessage8,
    renderToolUseProgressMessage: renderToolUseProgressMessage6,
    renderToolUseQueuedMessage: renderToolUseQueuedMessage3,
    renderToolResultMessage: renderToolResultMessage7,
    renderToolUseErrorMessage: renderToolUseErrorMessage4,
    mapToolResultToToolResultBlockParam({
      interrupted,
      stdout,
      stderr,
      isImage,
      persistedOutputPath,
      persistedOutputSize,
      backgroundTaskId,
      backgroundedByUser,
      assistantAutoBackgrounded
    }, toolUseID) {
      if (isImage) {
        let block2 = buildImageToolResult(stdout, toolUseID);
        if (block2)
          return block2;
      }
      let processedStdout = stdout;
      if (persistedOutputPath) {
        let trimmed = stdout ? stdout.replace(/^(\s*\n)+/, "").trimEnd() : "", preview = generatePreview(trimmed, PREVIEW_SIZE_BYTES);
        processedStdout = buildLargeToolResultMessage({
          filepath: persistedOutputPath,
          originalSize: persistedOutputSize ?? 0,
          isJson: !1,
          preview: preview.preview,
          hasMore: preview.hasMore
        });
      } else if (stdout)
        processedStdout = stdout.replace(/^(\s*\n)+/, ""), processedStdout = processedStdout.trimEnd();
      let errorMessage2 = stderr.trim();
      if (interrupted) {
        if (stderr)
          errorMessage2 += EOL4;
        errorMessage2 += "<error>Command was aborted before completion</error>";
      }
      let backgroundInfo = "";
      if (backgroundTaskId) {
        let outputPath = getTaskOutputPath(backgroundTaskId);
        if (assistantAutoBackgrounded)
          backgroundInfo = `Command exceeded the assistant-mode blocking budget (${ASSISTANT_BLOCKING_BUDGET_MS / 1000}s) and was moved to the background with ID: ${backgroundTaskId}. It is still running \u2014 you will be notified when it completes. Output is being written to: ${outputPath}. In assistant mode, delegate long-running work to a subagent or use run_in_background to keep this conversation responsive.`;
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
    async call(input, toolUseContext, _canUseTool, _parentMessage, onProgress) {
      if (isWindowsSandboxPolicyViolation())
        throw Error(WINDOWS_SANDBOX_POLICY_REFUSAL);
      let {
        abortController,
        setAppState,
        setToolJSX
      } = toolUseContext, isMainThread = !toolUseContext.agentId, progressCounter = 0;
      try {
        let commandGenerator = runPowerShellCommand({
          input,
          abortController,
          setAppState: toolUseContext.setAppStateForTasks ?? setAppState,
          setToolJSX,
          preventCwdChanges: !isMainThread,
          isMainThread,
          toolUseId: toolUseContext.toolUseId,
          agentId: toolUseContext.agentId
        }), generatorResult;
        do
          if (generatorResult = await commandGenerator.next(), !generatorResult.done && onProgress) {
            let progress = generatorResult.value;
            onProgress({
              toolUseID: `ps-progress-${progressCounter++}`,
              data: {
                type: "powershell_progress",
                output: progress.output,
                fullOutput: progress.fullOutput,
                elapsedTimeSeconds: progress.elapsedTimeSeconds,
                totalLines: progress.totalLines,
                totalBytes: progress.totalBytes,
                timeoutMs: progress.timeoutMs,
                taskId: progress.taskId
              }
            });
          }
        while (!generatorResult.done);
        let result = generatorResult.value;
        if (!(result.code === 0 && !result.stdout && result.stderr && !result.backgroundTaskId))
          trackGitOperations(input.command, result.code, result.stdout);
        let isInterrupt = result.interrupted && abortController.signal.reason === "interrupt", stderrForShellReset = "";
        if (isMainThread) {
          let appState = toolUseContext.getAppState();
          if (resetCwdIfOutsideProject(appState.toolPermissionContext))
            stderrForShellReset = stdErrAppendShellResetMessage("");
        }
        if (result.backgroundTaskId) {
          let bgExtracted = extractClaudeCodeHints(result.stdout || "", input.command);
          if (isMainThread && bgExtracted.hints.length > 0)
            for (let hint of bgExtracted.hints)
              maybeRecordPluginHint(hint);
          return {
            data: {
              stdout: bgExtracted.stripped,
              stderr: [result.stderr || "", stderrForShellReset].filter(Boolean).join(`
`),
              interrupted: !1,
              backgroundTaskId: result.backgroundTaskId,
              backgroundedByUser: result.backgroundedByUser,
              assistantAutoBackgrounded: result.assistantAutoBackgrounded
            }
          };
        }
        let stdoutAccumulator = new EndTruncatingAccumulator, processedStdout = (result.stdout || "").trimEnd();
        stdoutAccumulator.append(processedStdout + EOL4);
        let interpretation = interpretCommandResult(input.command, result.code, processedStdout, result.stderr || ""), stdout = stripEmptyLines(stdoutAccumulator.toString()), extracted = extractClaudeCodeHints(stdout, input.command);
        if (stdout = extracted.stripped, isMainThread && extracted.hints.length > 0)
          for (let hint of extracted.hints)
            maybeRecordPluginHint(hint);
        if (result.preSpawnError)
          throw Error(result.preSpawnError);
        if (interpretation.isError && !isInterrupt)
          throw new ShellError(stdout, result.stderr || "", result.code, result.interrupted);
        let MAX_PERSISTED_SIZE = 67108864, persistedOutputPath, persistedOutputSize;
        if (result.outputFilePath && result.outputTaskId)
          try {
            let fileStat = await fsStat(result.outputFilePath);
            persistedOutputSize = fileStat.size, await ensureToolResultsDir();
            let dest = getToolResultPath(result.outputTaskId, !1);
            if (fileStat.size > MAX_PERSISTED_SIZE)
              await fsTruncate(result.outputFilePath, MAX_PERSISTED_SIZE);
            try {
              await link4(result.outputFilePath, dest);
            } catch {
              await copyFile5(result.outputFilePath, dest);
            }
            persistedOutputPath = dest;
          } catch {}
        let isImage = isImageOutput(stdout), compressedStdout = stdout;
        if (isImage) {
          let resized = await resizeShellImageOutput(stdout, result.outputFilePath, persistedOutputSize);
          if (resized)
            compressedStdout = resized;
          else
            isImage = !1;
        }
        let finalStderr = [result.stderr || "", stderrForShellReset].filter(Boolean).join(`
`);
        return logEvent("tengu_powershell_tool_command_executed", {
          command_type: getCommandTypeForLogging(input.command),
          stdout_length: compressedStdout.length,
          stderr_length: finalStderr.length,
          exit_code: result.code,
          interrupted: result.interrupted
        }), {
          data: {
            stdout: compressedStdout,
            stderr: finalStderr,
            interrupted: result.interrupted,
            returnCodeInterpretation: interpretation.message,
            isImage,
            persistedOutputPath,
            persistedOutputSize
          }
        };
      } finally {
        if (setToolJSX)
          setToolJSX(null);
      }
    },
    isResultTruncated(output) {
      return isOutputLineTruncated(output.stdout) || isOutputLineTruncated(output.stderr);
    }
  });
});
