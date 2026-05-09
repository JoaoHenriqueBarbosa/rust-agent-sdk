// function: run
async function run() {
  profileCheckpoint("run_function_start");
  function createSortedHelpConfig() {
    let getOptionSortKey = (opt) => opt.long?.replace(/^--/, "") ?? opt.short?.replace(/^-/, "") ?? "";
    return Object.assign({
      sortSubcommands: !0,
      sortOptions: !0
    }, {
      compareOptions: (a2, b) => getOptionSortKey(a2).localeCompare(getOptionSortKey(b))
    });
  }
  let program2 = new Command5().configureHelp(createSortedHelpConfig()).enablePositionalOptions();
  if (profileCheckpoint("run_commander_initialized"), program2.hook("preAction", async (thisCommand) => {
    if (profileCheckpoint("preAction_start"), await Promise.all([ensureMdmSettingsLoaded(), ensureKeychainPrefetchCompleted()]), profileCheckpoint("preAction_after_mdm"), await init2(), profileCheckpoint("preAction_after_init"), !isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_TERMINAL_TITLE))
      process.title = "claude";
    let {
      initSinks: initSinks2
    } = await Promise.resolve().then(() => (init_sinks(), exports_sinks));
    initSinks2(), profileCheckpoint("preAction_after_sinks");
    let pluginDir = thisCommand.getOptionValue("pluginDir");
    if (Array.isArray(pluginDir) && pluginDir.length > 0 && pluginDir.every((p4) => typeof p4 === "string"))
      setInlinePlugins(pluginDir), clearPluginCache("preAction: --plugin-dir inline plugins");
    runMigrations(), profileCheckpoint("preAction_after_migrations"), loadRemoteManagedSettings(), loadPolicyLimits(), profileCheckpoint("preAction_after_remote_settings"), profileCheckpoint("preAction_after_settings_sync");
  }), program2.name("claude").description("Claude Code - starts an interactive session by default, use -p/--print for non-interactive output").argument("[prompt]", "Your prompt", String).helpOption("-h, --help", "Display help for command").option("-d, --debug [filter]", 'Enable debug mode with optional category filtering (e.g., "api,hooks" or "!1p,!file")', (_value) => {
    return !0;
  }).addOption(new Option("--debug-to-stderr", "Enable debug mode (to stderr)").argParser(Boolean).hideHelp()).option("--debug-file <path>", "Write debug logs to a specific file path (implicitly enables debug mode)", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).option("-p, --print", "Print response and exit (useful for pipes). Note: The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust.", () => !0).option("--bare", "Minimal mode: skip hooks, LSP, plugin sync, attribution, auto-memory, background prefetches, keychain reads, and CLAUDE.md auto-discovery. Sets CLAUDE_CODE_SIMPLE=1. Anthropic auth is strictly ANTHROPIC_API_KEY or apiKeyHelper via --settings (OAuth and keychain are never read). 3P providers (Bedrock/Vertex/Foundry) use their own credentials. Skills still resolve via /skill-name. Explicitly provide context via: --system-prompt[-file], --append-system-prompt[-file], --add-dir (CLAUDE.md dirs), --mcp-config, --settings, --agents, --plugin-dir.", () => !0).addOption(new Option("--init", "Run Setup hooks with init trigger, then continue").hideHelp()).addOption(new Option("--init-only", "Run Setup and SessionStart:startup hooks, then exit").hideHelp()).addOption(new Option("--maintenance", "Run Setup hooks with maintenance trigger, then continue").hideHelp()).addOption(new Option("--output-format <format>", 'Output format (only works with --print): "text" (default), "json" (single result), or "stream-json" (realtime streaming)').choices(["text", "json", "stream-json"])).addOption(new Option("--json-schema <schema>", 'JSON Schema for structured output validation. Example: {"type":"object","properties":{"name":{"type":"string"}},"required":["name"]}').argParser(String)).option("--include-hook-events", "Include all hook lifecycle events in the output stream (only works with --output-format=stream-json)", () => !0).option("--include-partial-messages", "Include partial message chunks as they arrive (only works with --print and --output-format=stream-json)", () => !0).addOption(new Option("--input-format <format>", 'Input format (only works with --print): "text" (default), or "stream-json" (realtime streaming input)').choices(["text", "stream-json"])).option("--mcp-debug", "[DEPRECATED. Use --debug instead] Enable MCP debug mode (shows MCP server errors)", () => !0).option("--dangerously-skip-permissions", "Bypass all permission checks. Recommended only for sandboxes with no internet access.", () => !0).option("--allow-dangerously-skip-permissions", "Enable bypassing all permission checks as an option, without it being enabled by default. Recommended only for sandboxes with no internet access.", () => !0).addOption(new Option("--thinking <mode>", "Thinking mode: enabled (equivalent to adaptive), disabled").choices(["enabled", "adaptive", "disabled"]).hideHelp()).addOption(new Option("--max-thinking-tokens <tokens>", "[DEPRECATED. Use --thinking instead for newer models] Maximum number of thinking tokens (only works with --print)").argParser(Number).hideHelp()).addOption(new Option("--max-turns <turns>", "Maximum number of agentic turns in non-interactive mode. This will early exit the conversation after the specified number of turns. (only works with --print)").argParser(Number).hideHelp()).addOption(new Option("--max-budget-usd <amount>", "Maximum dollar amount to spend on API calls (only works with --print)").argParser((value) => {
    let amount = Number(value);
    if (isNaN(amount) || amount <= 0)
      throw Error("--max-budget-usd must be a positive number greater than 0");
    return amount;
  })).addOption(new Option("--task-budget <tokens>", "API-side task budget in tokens (output_config.task_budget)").argParser((value) => {
    let tokens = Number(value);
    if (isNaN(tokens) || tokens <= 0 || !Number.isInteger(tokens))
      throw Error("--task-budget must be a positive integer");
    return tokens;
  }).hideHelp()).option("--replay-user-messages", "Re-emit user messages from stdin back on stdout for acknowledgment (only works with --input-format=stream-json and --output-format=stream-json)", () => !0).addOption(new Option("--enable-auth-status", "Enable auth status messages in SDK mode").default(!1).hideHelp()).option("--allowedTools, --allowed-tools <tools...>", 'Comma or space-separated list of tool names to allow (e.g. "Bash(git:*) Edit")').option("--tools <tools...>", 'Specify the list of available tools from the built-in set. Use "" to disable all tools, "default" to use all tools, or specify tool names (e.g. "Bash,Edit,Read").').option("--disallowedTools, --disallowed-tools <tools...>", 'Comma or space-separated list of tool names to deny (e.g. "Bash(git:*) Edit")').option("--mcp-config <configs...>", "Load MCP servers from JSON files or strings (space-separated)").addOption(new Option("--permission-prompt-tool <tool>", "MCP tool to use for permission prompts (only works with --print)").argParser(String).hideHelp()).addOption(new Option("--system-prompt <prompt>", "System prompt to use for the session").argParser(String)).addOption(new Option("--system-prompt-file <file>", "Read system prompt from a file").argParser(String).hideHelp()).addOption(new Option("--append-system-prompt <prompt>", "Append a system prompt to the default system prompt").argParser(String)).addOption(new Option("--append-system-prompt-file <file>", "Read system prompt from a file and append to the default system prompt").argParser(String).hideHelp()).addOption(new Option("--permission-mode <mode>", "Permission mode to use for the session").argParser(String).choices(PERMISSION_MODES)).option("-c, --continue", "Continue the most recent conversation in the current directory", () => !0).option("-r, --resume [value]", "Resume a conversation by session ID, or open interactive picker with optional search term", (value) => value || !0).option("--fork-session", "When resuming, create a new session ID instead of reusing the original (use with --resume or --continue)", () => !0).addOption(new Option("--prefill <text>", "Pre-fill the prompt input with text without submitting it").hideHelp()).addOption(new Option("--deep-link-origin", "Signal that this session was launched from a deep link").hideHelp()).addOption(new Option("--deep-link-repo <slug>", "Repo slug the deep link ?repo= parameter resolved to the current cwd").hideHelp()).addOption(new Option("--deep-link-last-fetch <ms>", "FETCH_HEAD mtime in epoch ms, precomputed by the deep link trampoline").argParser((v2) => {
    let n6 = Number(v2);
    return Number.isFinite(n6) ? n6 : void 0;
  }).hideHelp()).option("--from-pr [value]", "Resume a session linked to a PR by PR number/URL, or open interactive picker with optional search term", (value) => value || !0).option("--no-session-persistence", "Disable session persistence - sessions will not be saved to disk and cannot be resumed (only works with --print)").addOption(new Option("--resume-session-at <message id>", "When resuming, only messages up to and including the assistant message with <message.id> (use with --resume in print mode)").argParser(String).hideHelp()).addOption(new Option("--rewind-files <user-message-id>", "Restore files to state at the specified user message and exit (requires --resume)").hideHelp()).option("--model <model>", "Model for the current session. Provide an alias for the latest model (e.g. 'sonnet' or 'opus') or a model's full name (e.g. 'claude-sonnet-4-6').").addOption(new Option("--effort <level>", "Effort level for the current session (low, medium, high, max)").argParser((rawValue) => {
    let value = rawValue.toLowerCase(), allowed = ["low", "medium", "high", "max"];
    if (!allowed.includes(value))
      throw new InvalidArgumentError(`It must be one of: ${allowed.join(", ")}`);
    return value;
  })).option("--agent <agent>", "Agent for the current session. Overrides the 'agent' setting.").option("--betas <betas...>", "Beta headers to include in API requests (API key users only)").option("--fallback-model <model>", "Enable automatic fallback to specified model when default model is overloaded (only works with --print)").addOption(new Option("--workload <tag>", "Workload tag for billing-header attribution (cc_workload). Process-scoped; set by SDK daemon callers that spawn subprocesses for cron work. (only works with --print)").hideHelp()).option("--settings <file-or-json>", "Path to a settings JSON file or a JSON string to load additional settings from").option("--add-dir <directories...>", "Additional directories to allow tool access to").option("--ide", "Automatically connect to IDE on startup if exactly one valid IDE is available", () => !0).option("--strict-mcp-config", "Only use MCP servers from --mcp-config, ignoring all other MCP configurations", () => !0).option("--session-id <uuid>", "Use a specific session ID for the conversation (must be a valid UUID)").option("-n, --name <name>", "Set a display name for this session (shown in /resume and terminal title)").option("--agents <json>", `JSON object defining custom agents (e.g. '{"reviewer": {"description": "Reviews code", "prompt": "You are a code reviewer"}}')`).option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").option("--plugin-dir <path>", "Load plugins from a directory for this session only (repeatable: --plugin-dir A --plugin-dir B)", (val, prev) => [...prev, val], []).option("--disable-slash-commands", "Disable all skills", () => !0).option("--chrome", "Enable Claude in Chrome integration").option("--no-chrome", "Disable Claude in Chrome integration").option("--file <specs...>", "File resources to download at startup. Format: file_id:relative_path (e.g., --file file_abc:doc.txt file_def:img.png)").action(async (prompt, options2) => {
    if (profileCheckpoint("action_handler_start"), options2.bare)
      process.env.CLAUDE_CODE_SIMPLE = "1";
    if (prompt === "code")
      logEvent("tengu_code_prompt_ignored", {}), console.warn(source_default.yellow("Tip: You can launch Claude Code with just `claude`")), prompt = void 0;
    if (prompt && typeof prompt === "string" && !/\s/.test(prompt) && prompt.length > 0)
      logEvent("tengu_single_word_prompt", {
        length: prompt.length
      });
    let kairosEnabled = !1, assistantTeamContext, {
      debug = !1,
      debugToStderr = !1,
      dangerouslySkipPermissions,
      allowDangerouslySkipPermissions = !1,
      tools: baseTools = [],
      allowedTools = [],
      disallowedTools = [],
      mcpConfig = [],
      permissionMode: permissionModeCli,
      addDir: addDir2 = [],
      fallbackModel,
      betas = [],
      ide: ide2 = !1,
      sessionId,
      includeHookEvents,
      includePartialMessages
    } = options2;
    if (options2.prefill)
      seedEarlyInput(options2.prefill);
    let fileDownloadPromise, agentsJson = options2.agents, agentCli = options2.agent, outputFormat = options2.outputFormat, inputFormat = options2.inputFormat, verbose = options2.verbose ?? getGlobalConfig().verbose, print = options2.print, init3 = options2.init ?? !1, initOnly = options2.initOnly ?? !1, maintenance = options2.maintenance ?? !1, disableSlashCommands = options2.disableSlashCommands || !1, tasksOption = !1, taskListId = tasksOption ? typeof tasksOption === "string" ? tasksOption : DEFAULT_TASKS_MODE_TASK_LIST_ID : void 0, worktreeOption = isWorktreeModeEnabled() ? options2.worktree : void 0, worktreeName = typeof worktreeOption === "string" ? worktreeOption : void 0, worktreeEnabled = worktreeOption !== void 0, worktreePRNumber;
    if (worktreeName) {
      let prNum = parsePRReference(worktreeName);
      if (prNum !== null)
        worktreePRNumber = prNum, worktreeName = void 0;
    }
    let tmuxEnabled = isWorktreeModeEnabled() && options2.tmux === !0;
    if (tmuxEnabled) {
      if (!worktreeEnabled)
        process.stderr.write(source_default.red(`Error: --tmux requires --worktree
`)), process.exit(1);
      if (getPlatform() === "windows")
        process.stderr.write(source_default.red(`Error: --tmux is not supported on Windows
`)), process.exit(1);
      if (!await isTmuxAvailable2())
        process.stderr.write(source_default.red(`Error: tmux is not installed.
${getTmuxInstallInstructions2()}
`)), process.exit(1);
    }
    let storedTeammateOpts;
    if (isAgentSwarmsEnabled()) {
      let teammateOpts = extractTeammateOptions(options2);
      storedTeammateOpts = teammateOpts;
      let hasAnyTeammateOpt = teammateOpts.agentId || teammateOpts.agentName || teammateOpts.teamName, hasAllRequiredTeammateOpts = teammateOpts.agentId && teammateOpts.agentName && teammateOpts.teamName;
      if (hasAnyTeammateOpt && !hasAllRequiredTeammateOpts)
        process.stderr.write(source_default.red(`Error: --agent-id, --agent-name, and --team-name must all be provided together
`)), process.exit(1);
      if (teammateOpts.agentId && teammateOpts.agentName && teammateOpts.teamName)
        getTeammateUtils().setDynamicTeamContext?.({
          agentId: teammateOpts.agentId,
          agentName: teammateOpts.agentName,
          teamName: teammateOpts.teamName,
          color: teammateOpts.agentColor,
          planModeRequired: teammateOpts.planModeRequired ?? !1,
          parentSessionId: teammateOpts.parentSessionId
        });
      if (teammateOpts.teammateMode)
        getTeammateModeSnapshot().setCliTeammateModeOverride?.(teammateOpts.teammateMode);
    }
    let sdkUrl = options2.sdkUrl ?? void 0, effectiveIncludePartialMessages = includePartialMessages || isEnvTruthy(process.env.CLAUDE_CODE_INCLUDE_PARTIAL_MESSAGES);
    if (includeHookEvents || isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
      setAllHookEventsEnabled(!0);
    if (sdkUrl) {
      if (!inputFormat)
        inputFormat = "stream-json";
      if (!outputFormat)
        outputFormat = "stream-json";
      if (options2.verbose === void 0)
        verbose = !0;
      if (!options2.print)
        print = !0;
    }
    let teleport = options2.teleport ?? null, remoteOption = options2.remote, remote = remoteOption === !0 ? "" : remoteOption ?? null, remoteControlOption = options2.remoteControl ?? options2.rc, remoteControl = !1, remoteControlName = typeof remoteControlOption === "string" && remoteControlOption.length > 0 ? remoteControlOption : void 0;
    if (sessionId) {
      if ((options2.continue || options2.resume) && !options2.forkSession)
        process.stderr.write(source_default.red(`Error: --session-id can only be used with --continue or --resume if --fork-session is also specified.
`)), process.exit(1);
      if (!sdkUrl) {
        let validatedSessionId = validateUuid2(sessionId);
        if (!validatedSessionId)
          process.stderr.write(source_default.red(`Error: Invalid session ID. Must be a valid UUID.
`)), process.exit(1);
        if (sessionIdExists(validatedSessionId))
          process.stderr.write(source_default.red(`Error: Session ID ${validatedSessionId} is already in use.
`)), process.exit(1);
      }
    }
    let fileSpecs = options2.file;
    if (fileSpecs && fileSpecs.length > 0) {
      let sessionToken = getSessionIngressAuthToken();
      if (!sessionToken)
        process.stderr.write(source_default.red(`Error: Session token required for file downloads. CLAUDE_CODE_SESSION_ACCESS_TOKEN must be set.
`)), process.exit(1);
      let fileSessionId = process.env.CLAUDE_CODE_REMOTE_SESSION_ID || getSessionId(), files3 = parseFileSpecs(fileSpecs);
      if (files3.length > 0) {
        let config11 = {
          baseUrl: process.env.ANTHROPIC_BASE_URL || getOauthConfig().BASE_API_URL,
          oauthToken: sessionToken,
          sessionId: fileSessionId
        };
        fileDownloadPromise = downloadSessionFiles(files3, config11);
      }
    }
    let isNonInteractiveSession = getIsNonInteractiveSession();
    if (fallbackModel && options2.model && fallbackModel === options2.model)
      process.stderr.write(source_default.red(`Error: Fallback model cannot be the same as the main model. Please specify a different model for --fallback-model.
`)), process.exit(1);
    let systemPrompt = options2.systemPrompt;
    if (options2.systemPromptFile) {
      if (options2.systemPrompt)
        process.stderr.write(source_default.red(`Error: Cannot use both --system-prompt and --system-prompt-file. Please use only one.
`)), process.exit(1);
      try {
        let filePath = resolve47(options2.systemPromptFile);
        systemPrompt = readFileSync21(filePath, "utf8");
      } catch (error44) {
        if (getErrnoCode(error44) === "ENOENT")
          process.stderr.write(source_default.red(`Error: System prompt file not found: ${resolve47(options2.systemPromptFile)}
`)), process.exit(1);
        process.stderr.write(source_default.red(`Error reading system prompt file: ${errorMessage(error44)}
`)), process.exit(1);
      }
    }
    let appendSystemPrompt = options2.appendSystemPrompt;
    if (options2.appendSystemPromptFile) {
      if (options2.appendSystemPrompt)
        process.stderr.write(source_default.red(`Error: Cannot use both --append-system-prompt and --append-system-prompt-file. Please use only one.
`)), process.exit(1);
      try {
        let filePath = resolve47(options2.appendSystemPromptFile);
        appendSystemPrompt = readFileSync21(filePath, "utf8");
      } catch (error44) {
        if (getErrnoCode(error44) === "ENOENT")
          process.stderr.write(source_default.red(`Error: Append system prompt file not found: ${resolve47(options2.appendSystemPromptFile)}
`)), process.exit(1);
        process.stderr.write(source_default.red(`Error reading append system prompt file: ${errorMessage(error44)}
`)), process.exit(1);
      }
    }
    if (isAgentSwarmsEnabled() && storedTeammateOpts?.agentId && storedTeammateOpts?.agentName && storedTeammateOpts?.teamName) {
      let addendum = getTeammatePromptAddendum().TEAMMATE_SYSTEM_PROMPT_ADDENDUM;
      appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}

${addendum}` : addendum;
    }
    let {
      mode: permissionMode,
      notification: permissionModeNotification
    } = initialPermissionModeFromCLI({
      permissionModeCli,
      dangerouslySkipPermissions
    });
    setSessionBypassPermissionsMode(permissionMode === "bypassPermissions");
    let dynamicMcpConfig = {};
    if (mcpConfig && mcpConfig.length > 0) {
      let processedConfigs = mcpConfig.map((config11) => config11.trim()).filter((config11) => config11.length > 0), allConfigs = {}, allErrors = [];
      for (let configItem of processedConfigs) {
        let configs = null, errors8 = [], parsedJson = safeParseJSON(configItem);
        if (parsedJson) {
          let result = parseMcpConfig({
            configObject: parsedJson,
            filePath: "command line",
            expandVars: !0,
            scope: "dynamic"
          });
          if (result.config)
            configs = result.config.mcpServers;
          else
            errors8 = result.errors;
        } else {
          let configPath = resolve47(configItem), result = parseMcpConfigFromFilePath({
            filePath: configPath,
            expandVars: !0,
            scope: "dynamic"
          });
          if (result.config)
            configs = result.config.mcpServers;
          else
            errors8 = result.errors;
        }
        if (errors8.length > 0)
          allErrors.push(...errors8);
        else if (configs)
          allConfigs = {
            ...allConfigs,
            ...configs
          };
      }
      if (allErrors.length > 0) {
        let formattedErrors = allErrors.map((err2) => `${err2.path ? err2.path + ": " : ""}${err2.message}`).join(`
`);
        logForDebugging(`--mcp-config validation failed (${allErrors.length} errors): ${formattedErrors}`, {
          level: "error"
        }), process.stderr.write(`Error: Invalid MCP configuration:
${formattedErrors}
`), process.exit(1);
      }
      if (Object.keys(allConfigs).length > 0) {
        let nonSdkConfigNames = Object.entries(allConfigs).filter(([, config11]) => config11.type !== "sdk").map(([name3]) => name3), reservedNameError = null;
        if (nonSdkConfigNames.some(isClaudeInChromeMCPServer)) {
          if (reservedNameError = `Invalid MCP configuration: "${CLAUDE_IN_CHROME_MCP_SERVER_NAME}" is a reserved MCP name.`, reservedNameError)
            process.stderr.write(`Error: ${reservedNameError}
`), process.exit(1);
          let scopedConfigs = mapValues_default(allConfigs, (config11) => ({
            ...config11,
            scope: "dynamic"
          })), {
            allowed,
            blocked
          } = filterMcpServersByPolicy(scopedConfigs);
          if (blocked.length > 0)
            process.stderr.write(`Warning: MCP ${plural(blocked.length, "server")} blocked by enterprise policy: ${blocked.join(", ")}
`);
          dynamicMcpConfig = {
            ...dynamicMcpConfig,
            ...allowed
          };
        }
      }
      let chromeOpts = options2;
      setChromeFlagOverride(chromeOpts.chrome);
      let enableClaudeInChrome = shouldEnableClaudeInChrome(chromeOpts.chrome) && isClaudeAISubscriber(), autoEnableClaudeInChrome = !enableClaudeInChrome && shouldAutoEnableClaudeInChrome();
      if (enableClaudeInChrome) {
        let platform7 = getPlatform();
        try {
          logEvent("tengu_claude_in_chrome_setup", {
            platform: platform7
          });
          let {
            mcpConfig: chromeMcpConfig,
            allowedTools: chromeMcpTools,
            systemPrompt: chromeSystemPrompt
          } = setupClaudeInChrome();
          if (dynamicMcpConfig = {
            ...dynamicMcpConfig,
            ...chromeMcpConfig
          }, allowedTools.push(...chromeMcpTools), chromeSystemPrompt)
            appendSystemPrompt = appendSystemPrompt ? `${chromeSystemPrompt}

${appendSystemPrompt}` : chromeSystemPrompt;
        } catch (error44) {
          logEvent("tengu_claude_in_chrome_setup_failed", {
            platform: platform7
          }), logForDebugging(`[Claude in Chrome] Error: ${error44}`), logError2(error44), console.error("Error: Failed to run with Claude in Chrome."), process.exit(1);
        }
      } else if (autoEnableClaudeInChrome)
        try {
          let {
            mcpConfig: chromeMcpConfig
          } = setupClaudeInChrome();
          dynamicMcpConfig = {
            ...dynamicMcpConfig,
            ...chromeMcpConfig
          };
          let hint = CLAUDE_IN_CHROME_SKILL_HINT;
          appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}

${hint}` : hint;
        } catch (error44) {
          logForDebugging(`[Claude in Chrome] Error (auto-enable): ${error44}`);
        }
      let strictMcpConfig = options2.strictMcpConfig || !1;
      if (doesEnterpriseMcpConfigExist()) {
        if (strictMcpConfig)
          process.stderr.write(source_default.red("You cannot use --strict-mcp-config when an enterprise MCP config is present")), process.exit(1);
        if (dynamicMcpConfig && !areMcpConfigsAllowedWithEnterpriseMcpConfig(dynamicMcpConfig))
          process.stderr.write(source_default.red("You cannot dynamically configure MCP servers when an enterprise MCP config is present")), process.exit(1);
      }
      setAdditionalDirectoriesForClaudeMd(addDir2);
      let devChannels;
      {
        let parseChannelEntries = (raw, flag) => {
          let entries2 = [], bad = [];
          for (let c3 of raw)
            if (c3.startsWith("plugin:")) {
              let rest = c3.slice(7), at = rest.indexOf("@");
              if (at <= 0 || at === rest.length - 1)
                bad.push(c3);
              else
                entries2.push({
                  kind: "plugin",
                  name: rest.slice(0, at),
                  marketplace: rest.slice(at + 1)
                });
            } else if (c3.startsWith("server:") && c3.length > 7)
              entries2.push({
                kind: "server",
                name: c3.slice(7)
              });
            else
              bad.push(c3);
          if (bad.length > 0)
            process.stderr.write(source_default.red(`${flag} entries must be tagged: ${bad.join(", ")}
` + `  plugin:<name>@<marketplace>  \u2014 plugin-provided channel (allowlist enforced)
` + `  server:<name>                \u2014 manually configured MCP server
`)), process.exit(1);
          return entries2;
        }, channelOpts = options2, rawChannels = channelOpts.channels, rawDev = channelOpts.dangerouslyLoadDevelopmentChannels, channelEntries = [];
        if (rawChannels && rawChannels.length > 0)
          channelEntries = parseChannelEntries(rawChannels, "--channels"), setAllowedChannels(channelEntries);
        if (!isNonInteractiveSession) {
          if (rawDev && rawDev.length > 0)
            devChannels = parseChannelEntries(rawDev, "--dangerously-load-development-channels");
        }
        if (channelEntries.length > 0 || (devChannels?.length ?? 0) > 0) {
          let joinPluginIds = (entries2) => {
            let ids = entries2.flatMap((e) => e.kind === "plugin" ? [`${e.name}@${e.marketplace}`] : []);
            return ids.length > 0 ? ids.sort().join(",") : void 0;
          };
          logEvent("tengu_mcp_channel_flags", {
            channels_count: channelEntries.length,
            dev_count: devChannels?.length ?? 0,
            plugins: joinPluginIds(channelEntries),
            dev_plugins: joinPluginIds(devChannels ?? [])
          });
        }
      }
      if (baseTools.length > 0) {
        let {
          BRIEF_TOOL_NAME: BRIEF_TOOL_NAME7,
          LEGACY_BRIEF_TOOL_NAME: LEGACY_BRIEF_TOOL_NAME3
        } = (init_prompt(), __toCommonJS(exports_prompt)), {
          isBriefEntitled: isBriefEntitled2
        } = (init_BriefTool(), __toCommonJS(exports_BriefTool)), parsed = parseToolListFromCLI(baseTools);
        if ((parsed.includes(BRIEF_TOOL_NAME7) || parsed.includes(LEGACY_BRIEF_TOOL_NAME3)) && isBriefEntitled2())
          setUserMsgOptIn(!0);
      }
      let initResult = await initializeToolPermissionContext({
        allowedToolsCli: allowedTools,
        disallowedToolsCli: disallowedTools,
        baseToolsCli: baseTools,
        permissionMode,
        allowDangerouslySkipPermissions,
        addDirs: addDir2
      }), toolPermissionContext = initResult.toolPermissionContext, {
        warnings,
        dangerousPermissions,
        overlyBroadBashPermissions
      } = initResult;
      warnings.forEach((warning) => {
        console.error(warning);
      }), assertMinVersion();
      let claudeaiConfigPromise = isNonInteractiveSession && !strictMcpConfig && !doesEnterpriseMcpConfigExist() && !isBareMode() ? fetchClaudeAIMcpConfigsIfEligible().then((configs) => {
        let {
          allowed,
          blocked
        } = filterMcpServersByPolicy(configs);
        if (blocked.length > 0)
          process.stderr.write(`Warning: claude.ai MCP ${plural(blocked.length, "server")} blocked by enterprise policy: ${blocked.join(", ")}
`);
        return allowed;
      }) : Promise.resolve({});
      logForDebugging("[STARTUP] Loading MCP configs...");
      let mcpConfigStart = Date.now(), mcpConfigResolvedMs, mcpConfigPromise = (strictMcpConfig || isBareMode() ? Promise.resolve({
        servers: {}
      }) : getClaudeCodeMcpConfigs(dynamicMcpConfig)).then((result) => {
        return mcpConfigResolvedMs = Date.now() - mcpConfigStart, result;
      });
      if (inputFormat && inputFormat !== "text" && inputFormat !== "stream-json")
        console.error(`Error: Invalid input format "${inputFormat}".`), process.exit(1);
      if (inputFormat === "stream-json" && outputFormat !== "stream-json")
        console.error("Error: --input-format=stream-json requires output-format=stream-json."), process.exit(1);
      if (sdkUrl) {
        if (inputFormat !== "stream-json" || outputFormat !== "stream-json")
          console.error("Error: --sdk-url requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1);
      }
      if (options2.replayUserMessages) {
        if (inputFormat !== "stream-json" || outputFormat !== "stream-json")
          console.error("Error: --replay-user-messages requires both --input-format=stream-json and --output-format=stream-json."), process.exit(1);
      }
      if (effectiveIncludePartialMessages) {
        if (!isNonInteractiveSession || outputFormat !== "stream-json")
          writeToStderr("Error: --include-partial-messages requires --print and --output-format=stream-json."), process.exit(1);
      }
      if (options2.sessionPersistence === !1 && !isNonInteractiveSession)
        writeToStderr("Error: --no-session-persistence can only be used with --print mode."), process.exit(1);
      let inputPrompt = await getInputPrompt(prompt || "", inputFormat ?? "text");
      profileCheckpoint("action_after_input_prompt"), maybeActivateProactive(options2);
      let tools = getTools(toolPermissionContext);
      profileCheckpoint("action_tools_loaded");
      let jsonSchema;
      if (isSyntheticOutputToolEnabled({
        isNonInteractiveSession
      }) && options2.jsonSchema)
        jsonSchema = jsonParse(options2.jsonSchema);
      if (jsonSchema) {
        let syntheticOutputResult = createSyntheticOutputTool(jsonSchema);
        if ("tool" in syntheticOutputResult)
          tools = [...tools, syntheticOutputResult.tool], logEvent("tengu_structured_output_enabled", {
            schema_property_count: Object.keys(jsonSchema.properties || {}).length,
            has_required_fields: Boolean(jsonSchema.required)
          });
        else
          logEvent("tengu_structured_output_failure", {
            error: "Invalid JSON schema"
          });
      }
      profileCheckpoint("action_before_setup"), logForDebugging("[STARTUP] Running setup()...");
      let setupStart = Date.now(), {
        setup: setup2
      } = await Promise.resolve().then(() => (init_setup3(), exports_setup)), messagingSocketPath = void 0, preSetupCwd = getCwd();
      if (process.env.CLAUDE_CODE_ENTRYPOINT !== "local-agent")
        initBuiltinPlugins(), initBundledSkills();
      let setupPromise = setup2(preSetupCwd, permissionMode, allowDangerouslySkipPermissions, worktreeEnabled, worktreeName, tmuxEnabled, sessionId ? validateUuid2(sessionId) : void 0, worktreePRNumber, messagingSocketPath), commandsPromise = worktreeEnabled ? null : getCommands(preSetupCwd), agentDefsPromise = worktreeEnabled ? null : getAgentDefinitionsWithOverrides(preSetupCwd);
      commandsPromise?.catch(() => {}), agentDefsPromise?.catch(() => {}), await setupPromise, logForDebugging(`[STARTUP] setup() completed in ${Date.now() - setupStart}ms`), profileCheckpoint("action_after_setup");
      let effectiveReplayUserMessages = !!options2.replayUserMessages;
      if (getIsNonInteractiveSession())
        applyConfigEnvironmentVariables(), getSystemContext(), getUserContext(), ensureModelStringsInitialized();
      let sessionNameArg = options2.name?.trim();
      if (sessionNameArg)
        cacheSessionTitle(sessionNameArg);
      let userSpecifiedModel = options2.model === "default" ? getDefaultMainLoopModel() : options2.model, userSpecifiedFallbackModel = fallbackModel === "default" ? getDefaultMainLoopModel() : fallbackModel, currentCwd2 = worktreeEnabled ? getCwd() : preSetupCwd;
      logForDebugging("[STARTUP] Loading commands and agents...");
      let commandsStart = Date.now(), [commands7, agentDefinitionsResult] = await Promise.all([commandsPromise ?? getCommands(currentCwd2), agentDefsPromise ?? getAgentDefinitionsWithOverrides(currentCwd2)]);
      logForDebugging(`[STARTUP] Commands and agents loaded in ${Date.now() - commandsStart}ms`), profileCheckpoint("action_commands_loaded");
      let cliAgents = [];
      if (agentsJson)
        try {
          let parsedAgents = safeParseJSON(agentsJson);
          if (parsedAgents)
            cliAgents = parseAgentsFromJson(parsedAgents, "flagSettings");
        } catch (error44) {
          logError2(error44);
        }
      let allAgents = [...agentDefinitionsResult.allAgents, ...cliAgents], agentDefinitions = {
        ...agentDefinitionsResult,
        allAgents,
        activeAgents: getActiveAgentsFromList(allAgents)
      }, agentSetting = agentCli ?? getInitialSettings().agent, mainThreadAgentDefinition;
      if (agentSetting) {
        if (mainThreadAgentDefinition = agentDefinitions.activeAgents.find((agent) => agent.agentType === agentSetting), !mainThreadAgentDefinition)
          logForDebugging(`Warning: agent "${agentSetting}" not found. Available agents: ${agentDefinitions.activeAgents.map((a2) => a2.agentType).join(", ")}. Using default behavior.`);
      }
      if (setMainThreadAgentType(mainThreadAgentDefinition?.agentType), mainThreadAgentDefinition)
        logEvent("tengu_agent_flag", {
          agentType: isBuiltInAgent(mainThreadAgentDefinition) ? mainThreadAgentDefinition.agentType : "custom",
          ...agentCli && {
            source: "cli"
          }
        });
      if (mainThreadAgentDefinition?.agentType)
        saveAgentSetting(mainThreadAgentDefinition.agentType);
      if (isNonInteractiveSession && mainThreadAgentDefinition && !systemPrompt && !isBuiltInAgent(mainThreadAgentDefinition)) {
        let agentSystemPrompt = mainThreadAgentDefinition.getSystemPrompt();
        if (agentSystemPrompt)
          systemPrompt = agentSystemPrompt;
      }
      if (mainThreadAgentDefinition?.initialPrompt) {
        if (typeof inputPrompt === "string")
          inputPrompt = inputPrompt ? `${mainThreadAgentDefinition.initialPrompt}

${inputPrompt}` : mainThreadAgentDefinition.initialPrompt;
        else if (!inputPrompt)
          inputPrompt = mainThreadAgentDefinition.initialPrompt;
      }
      let effectiveModel = userSpecifiedModel;
      if (!effectiveModel && mainThreadAgentDefinition?.model && mainThreadAgentDefinition.model !== "inherit")
        effectiveModel = parseUserSpecifiedModel(mainThreadAgentDefinition.model);
      setMainLoopModelOverride(effectiveModel), setInitialMainLoopModel(getUserSpecifiedModelSetting() || null);
      let initialMainLoopModel = getInitialMainLoopModel(), resolvedInitialModel = parseUserSpecifiedModel(initialMainLoopModel ?? getDefaultMainLoopModel()), advisorModel;
      if (isAdvisorEnabled()) {
        let advisorOption = canUserConfigureAdvisor() ? options2.advisor : void 0;
        if (advisorOption) {
          if (logForDebugging(`[AdvisorTool] --advisor ${advisorOption}`), !modelSupportsAdvisor(resolvedInitialModel))
            process.stderr.write(source_default.red(`Error: The model "${resolvedInitialModel}" does not support the advisor tool.
`)), process.exit(1);
          let normalizedAdvisorModel = normalizeModelStringForAPI(parseUserSpecifiedModel(advisorOption));
          if (!isValidAdvisorModel(normalizedAdvisorModel))
            process.stderr.write(source_default.red(`Error: The model "${advisorOption}" cannot be used as an advisor.
`)), process.exit(1);
        }
        if (advisorModel = canUserConfigureAdvisor() ? advisorOption ?? getInitialAdvisorSetting() : advisorOption, advisorModel)
          logForDebugging(`[AdvisorTool] Advisor model: ${advisorModel}`);
      }
      if (isAgentSwarmsEnabled() && storedTeammateOpts?.agentId && storedTeammateOpts?.agentName && storedTeammateOpts?.teamName && storedTeammateOpts?.agentType) {
        let customAgent = agentDefinitions.activeAgents.find((a2) => a2.agentType === storedTeammateOpts.agentType);
        if (customAgent) {
          let customPrompt;
          if (customAgent.source === "built-in")
            logForDebugging(`[teammate] Built-in agent ${storedTeammateOpts.agentType} - skipping custom prompt (not supported)`);
          else
            customPrompt = customAgent.getSystemPrompt();
          if (customAgent.memory)
            logEvent("tengu_agent_memory_loaded", {
              ...!1,
              scope: customAgent.memory,
              source: "teammate"
            });
          if (customPrompt) {
            let customInstructions = `
# Custom Agent Instructions
${customPrompt}`;
            appendSystemPrompt = appendSystemPrompt ? `${appendSystemPrompt}

${customInstructions}` : customInstructions;
          }
        } else
          logForDebugging(`[teammate] Custom agent ${storedTeammateOpts.agentType} not found in available agents`);
      }
      if (maybeActivateBrief(options2), !getIsNonInteractiveSession() && !getUserMsgOptIn() && getInitialSettings().defaultView === "chat") {
        let {
          isBriefEntitled: isBriefEntitled2
        } = (init_BriefTool(), __toCommonJS(exports_BriefTool));
        if (isBriefEntitled2())
          setUserMsgOptIn(!0);
      }
      let root3, getFpsMetrics, stats2;
      if (!isNonInteractiveSession) {
        let ctx = getRenderContext(!1);
        getFpsMetrics = ctx.getFpsMetrics, stats2 = ctx.stats;
        let {
          createRoot: createRoot3
        } = await Promise.resolve().then(() => (init_ink2(), exports_ink));
        root3 = await createRoot3(ctx.renderOptions), logEvent("tengu_timer", {
          event: "startup",
          durationMs: Math.round(process.uptime() * 1000)
        }), logForDebugging("[STARTUP] Running showSetupScreens()...");
        let setupScreensStart = Date.now(), onboardingShown = await showSetupScreens(root3, permissionMode, allowDangerouslySkipPermissions, commands7, enableClaudeInChrome, devChannels);
        if (logForDebugging(`[STARTUP] showSetupScreens() completed in ${Date.now() - setupScreensStart}ms`), remoteControlOption !== void 0)
          remoteControl = !1;
        if (onboardingShown && prompt?.trim().toLowerCase() === "/login")
          prompt = "";
        if (onboardingShown)
          refreshRemoteManagedSettings(), refreshPolicyLimits(), resetUserCache();
        let orgValidation = await validateForceLoginOrg();
        if (!orgValidation.valid)
          await exitWithError2(root3, orgValidation.message);
      }
      if (process.exitCode !== void 0) {
        logForDebugging("Graceful shutdown initiated, skipping further initialization");
        return;
      }
      if (initializeLspServerManager(), !isNonInteractiveSession) {
        let {
          errors: errors8
        } = getSettingsWithErrors(), nonMcpErrors = errors8.filter((e) => !e.mcpErrorMetadata);
        if (nonMcpErrors.length > 0)
          await launchInvalidSettingsDialog(root3, {
            settingsErrors: nonMcpErrors,
            onExit: () => gracefulShutdownSync(1)
          });
      }
      let bgRefreshThrottleMs = 0, lastPrefetched = getGlobalConfig().startupPrefetchedAt ?? 0;
      if (!(isBareMode() || bgRefreshThrottleMs > 0 && Date.now() - lastPrefetched < bgRefreshThrottleMs)) {
        let lastPrefetchedInfo = lastPrefetched > 0 ? ` last ran ${Math.round((Date.now() - lastPrefetched) / 1000)}s ago` : "";
        if (logForDebugging(`Starting background startup prefetches${lastPrefetchedInfo}`), checkQuotaStatus().catch((error44) => logError2(error44)), fetchBootstrapData(), prefetchPassesEligibility(), prefetchFastModeStatus(), bgRefreshThrottleMs > 0)
          saveGlobalConfig((current) => ({
            ...current,
            startupPrefetchedAt: Date.now()
          }));
      } else
        logForDebugging(`Skipping startup prefetches, last ran ${Math.round((Date.now() - lastPrefetched) / 1000)}s ago`), resolveFastModeStatusFromCache();
      if (!isNonInteractiveSession)
        refreshExampleCommands();
      let {
        servers: existingMcpConfigs
      } = await mcpConfigPromise;
      logForDebugging(`[STARTUP] MCP configs resolved in ${mcpConfigResolvedMs}ms (awaited at +${Date.now() - mcpConfigStart}ms)`);
      let allMcpConfigs = {
        ...existingMcpConfigs,
        ...dynamicMcpConfig
      }, sdkMcpConfigs = {}, regularMcpConfigs = {};
      for (let [name3, config11] of Object.entries(allMcpConfigs)) {
        let typedConfig = config11;
        if (typedConfig.type === "sdk")
          sdkMcpConfigs[name3] = typedConfig;
        else
          regularMcpConfigs[name3] = typedConfig;
      }
      profileCheckpoint("action_mcp_configs_loaded");
      let localMcpPromise = isNonInteractiveSession ? Promise.resolve({
        clients: [],
        tools: [],
        commands: []
      }) : prefetchAllMcpResources(regularMcpConfigs), claudeaiMcpPromise = isNonInteractiveSession ? Promise.resolve({
        clients: [],
        tools: [],
        commands: []
      }) : claudeaiConfigPromise.then((configs) => Object.keys(configs).length > 0 ? prefetchAllMcpResources(configs) : {
        clients: [],
        tools: [],
        commands: []
      }), mcpPromise = Promise.all([localMcpPromise, claudeaiMcpPromise]).then(([local, claudeai]) => ({
        clients: [...local.clients, ...claudeai.clients],
        tools: uniqBy_default([...local.tools, ...claudeai.tools], "name"),
        commands: uniqBy_default([...local.commands, ...claudeai.commands], "name")
      })), hooksPromise = initOnly || init3 || maintenance || isNonInteractiveSession || options2.continue || options2.resume ? null : processSessionStartHooks("startup", {
        agentType: mainThreadAgentDefinition?.agentType,
        model: resolvedInitialModel
      }), hookMessages = [];
      mcpPromise.catch(() => {});
      let mcpClients = [], mcpTools = [], mcpCommands = [], thinkingEnabled = shouldEnableThinkingByDefault(), thinkingConfig = thinkingEnabled !== !1 ? {
        type: "adaptive"
      } : {
        type: "disabled"
      };
      if (options2.thinking === "adaptive" || options2.thinking === "enabled")
        thinkingEnabled = !0, thinkingConfig = {
          type: "adaptive"
        };
      else if (options2.thinking === "disabled")
        thinkingEnabled = !1, thinkingConfig = {
          type: "disabled"
        };
      else {
        let maxThinkingTokens = process.env.MAX_THINKING_TOKENS ? parseInt(process.env.MAX_THINKING_TOKENS, 10) : options2.maxThinkingTokens;
        if (maxThinkingTokens !== void 0) {
          if (maxThinkingTokens > 0)
            thinkingEnabled = !0, thinkingConfig = {
              type: "enabled",
              budgetTokens: maxThinkingTokens
            };
          else if (maxThinkingTokens === 0)
            thinkingEnabled = !1, thinkingConfig = {
              type: "disabled"
            };
        }
      }
      if (logForDiagnosticsNoPII("info", "started", {
        version: "2.1.90",
        is_native_binary: isInBundledMode()
      }), registerCleanup(async () => {
        logForDiagnosticsNoPII("info", "exited");
      }), logTenguInit({
        hasInitialPrompt: Boolean(prompt),
        hasStdin: Boolean(inputPrompt),
        verbose,
        debug,
        debugToStderr,
        print: print ?? !1,
        outputFormat: outputFormat ?? "text",
        inputFormat: inputFormat ?? "text",
        numAllowedTools: allowedTools.length,
        numDisallowedTools: disallowedTools.length,
        mcpClientCount: Object.keys(allMcpConfigs).length,
        worktreeEnabled,
        skipWebFetchPreflight: getInitialSettings().skipWebFetchPreflight,
        githubActionInputs: process.env.GITHUB_ACTION_INPUTS,
        dangerouslySkipPermissionsPassed: dangerouslySkipPermissions ?? !1,
        permissionMode,
        modeIsBypass: permissionMode === "bypassPermissions",
        allowDangerouslySkipPermissionsPassed: allowDangerouslySkipPermissions,
        systemPromptFlag: systemPrompt ? options2.systemPromptFile ? "file" : "flag" : void 0,
        appendSystemPromptFlag: appendSystemPrompt ? options2.appendSystemPromptFile ? "file" : "flag" : void 0,
        thinkingConfig,
        assistantActivationPath: void 0
      }), logContextMetrics(regularMcpConfigs, toolPermissionContext), logPermissionContextForAnts(null, "initialization"), logManagedSettings(), registerSession().then((registered) => {
        if (!registered)
          return;
        if (sessionNameArg)
          updateSessionName(sessionNameArg);
        countConcurrentSessions().then((count4) => {
          if (count4 >= 2)
            logEvent("tengu_concurrent_sessions", {
              num_sessions: count4
            });
        });
      }), isBareMode())
        ;
      else if (isNonInteractiveSession)
        await initializeVersionedPlugins(), profileCheckpoint("action_after_plugins_init"), cleanupOrphanedPluginVersionsInBackground().then(() => getGlobExclusionsForPluginCache());
      else
        initializeVersionedPlugins().then(async () => {
          profileCheckpoint("action_after_plugins_init"), await cleanupOrphanedPluginVersionsInBackground(), getGlobExclusionsForPluginCache();
        });
      let setupTrigger = initOnly || init3 ? "init" : maintenance ? "maintenance" : null;
      if (initOnly) {
        applyConfigEnvironmentVariables(), await processSetupHooks("init", {
          forceSyncExecution: !0
        }), await processSessionStartHooks("startup", {
          forceSyncExecution: !0
        }), gracefulShutdownSync(0);
        return;
      }
      if (isNonInteractiveSession) {
        if (outputFormat === "stream-json" || outputFormat === "json")
          setHasFormattedOutput(!0);
        applyConfigEnvironmentVariables(), initializeTelemetryAfterTrust();
        let sessionStartHooksPromise = options2.continue || options2.resume || teleport || setupTrigger ? void 0 : processSessionStartHooks("startup");
        sessionStartHooksPromise?.catch(() => {}), profileCheckpoint("before_validateForceLoginOrg");
        let orgValidation = await validateForceLoginOrg();
        if (!orgValidation.valid)
          process.stderr.write(orgValidation.message + `
`), process.exit(1);
        let commandsHeadless = disableSlashCommands ? [] : commands7.filter((command19) => command19.type === "prompt" && !command19.disableNonInteractive || command19.type === "local" && command19.supportsNonInteractive), defaultState = getDefaultAppState(), headlessInitialState = {
          ...defaultState,
          mcp: {
            ...defaultState.mcp,
            clients: mcpClients,
            commands: mcpCommands,
            tools: mcpTools
          },
          toolPermissionContext,
          effortValue: parseEffortValue(options2.effort) ?? getInitialEffortSetting(),
          ...isFastModeEnabled() && {
            fastMode: getInitialFastModeSetting(effectiveModel ?? null)
          },
          ...isAdvisorEnabled() && advisorModel && {
            advisorModel
          },
          ...{}
        }, headlessStore = createStore(headlessInitialState, onChangeAppState);
        if (toolPermissionContext.mode === "bypassPermissions" || allowDangerouslySkipPermissions)
          checkAndDisableBypassPermissions(toolPermissionContext);
        if (options2.sessionPersistence === !1)
          setSessionPersistenceDisabled(!0);
        setSdkBetas(filterAllowedSdkBetas(betas));
        let connectMcpBatch = (configs, label) => {
          if (Object.keys(configs).length === 0)
            return Promise.resolve();
          return headlessStore.setState((prev) => ({
            ...prev,
            mcp: {
              ...prev.mcp,
              clients: [...prev.mcp.clients, ...Object.entries(configs).map(([name3, config11]) => ({
                name: name3,
                type: "pending",
                config: config11
              }))]
            }
          })), getMcpToolsCommandsAndResources(({
            client: client16,
            tools: tools2,
            commands: commands8
          }) => {
            headlessStore.setState((prev) => ({
              ...prev,
              mcp: {
                ...prev.mcp,
                clients: prev.mcp.clients.some((c3) => c3.name === client16.name) ? prev.mcp.clients.map((c3) => c3.name === client16.name ? client16 : c3) : [...prev.mcp.clients, client16],
                tools: uniqBy_default([...prev.mcp.tools, ...tools2], "name"),
                commands: uniqBy_default([...prev.mcp.commands, ...commands8], "name")
              }
            }));
          }, configs).catch((err2) => logForDebugging(`[MCP] ${label} connect error: ${err2}`));
        };
        profileCheckpoint("before_connectMcp"), await connectMcpBatch(regularMcpConfigs, "regular"), profileCheckpoint("after_connectMcp");
        let CLAUDE_AI_MCP_TIMEOUT_MS = 5000, claudeaiConnect = claudeaiConfigPromise.then((claudeaiConfigs) => {
          if (Object.keys(claudeaiConfigs).length > 0) {
            let claudeaiSigs = /* @__PURE__ */ new Set;
            for (let config11 of Object.values(claudeaiConfigs)) {
              let sig = getMcpServerSignature(config11);
              if (sig)
                claudeaiSigs.add(sig);
            }
            let suppressed = /* @__PURE__ */ new Set;
            for (let [name3, config11] of Object.entries(regularMcpConfigs)) {
              if (!name3.startsWith("plugin:"))
                continue;
              let sig = getMcpServerSignature(config11);
              if (sig && claudeaiSigs.has(sig))
                suppressed.add(name3);
            }
            if (suppressed.size > 0) {
              logForDebugging(`[MCP] Lazy dedup: suppressing ${suppressed.size} plugin server(s) that duplicate claude.ai connectors: ${[...suppressed].join(", ")}`);
              for (let c3 of headlessStore.getState().mcp.clients) {
                if (!suppressed.has(c3.name) || c3.type !== "connected")
                  continue;
                c3.client.onclose = void 0, clearServerCache(c3.name, c3.config).catch(() => {});
              }
              headlessStore.setState((prev) => {
                let {
                  clients,
                  tools: tools2,
                  commands: commands8,
                  resources
                } = prev.mcp;
                clients = clients.filter((c3) => !suppressed.has(c3.name)), tools2 = tools2.filter((t2) => !t2.mcpInfo || !suppressed.has(t2.mcpInfo.serverName));
                for (let name3 of suppressed)
                  commands8 = excludeCommandsByServer(commands8, name3), resources = excludeResourcesByServer(resources, name3);
                return {
                  ...prev,
                  mcp: {
                    ...prev.mcp,
                    clients,
                    tools: tools2,
                    commands: commands8,
                    resources
                  }
                };
              });
            }
          }
          let nonPluginConfigs = pickBy_default(regularMcpConfigs, (_, n6) => !n6.startsWith("plugin:")), {
            servers: dedupedClaudeAi
          } = dedupClaudeAiMcpServers(claudeaiConfigs, nonPluginConfigs);
          return connectMcpBatch(dedupedClaudeAi, "claudeai");
        }), claudeaiTimer, claudeaiTimedOut = await Promise.race([claudeaiConnect.then(() => !1), new Promise((resolve48) => {
          claudeaiTimer = setTimeout((r4) => r4(!0), CLAUDE_AI_MCP_TIMEOUT_MS, resolve48);
        })]);
        if (claudeaiTimer)
          clearTimeout(claudeaiTimer);
        if (claudeaiTimedOut)
          logForDebugging(`[MCP] claude.ai connectors not ready after ${CLAUDE_AI_MCP_TIMEOUT_MS}ms \u2014 proceeding; background connection continues`);
        if (profileCheckpoint("after_connectMcp_claudeai"), !isBareMode())
          startDeferredPrefetches(), Promise.resolve().then(() => (init_backgroundHousekeeping(), exports_backgroundHousekeeping)).then((m4) => m4.startBackgroundHousekeeping());
        logSessionTelemetry(), profileCheckpoint("before_print_import");
        let {
          runHeadless: runHeadless2
        } = await Promise.resolve().then(() => (init_print(), exports_print));
        profileCheckpoint("after_print_import"), runHeadless2(inputPrompt, () => headlessStore.getState(), headlessStore.setState, commandsHeadless, tools, sdkMcpConfigs, agentDefinitions.activeAgents, {
          continue: options2.continue,
          resume: options2.resume,
          verbose,
          outputFormat,
          jsonSchema,
          permissionPromptToolName: options2.permissionPromptTool,
          allowedTools,
          thinkingConfig,
          maxTurns: options2.maxTurns,
          maxBudgetUsd: options2.maxBudgetUsd,
          taskBudget: options2.taskBudget ? {
            total: options2.taskBudget
          } : void 0,
          systemPrompt,
          appendSystemPrompt,
          userSpecifiedModel: effectiveModel,
          fallbackModel: userSpecifiedFallbackModel,
          teleport,
          sdkUrl,
          replayUserMessages: effectiveReplayUserMessages,
          includePartialMessages: effectiveIncludePartialMessages,
          forkSession: options2.forkSession || !1,
          resumeSessionAt: options2.resumeSessionAt || void 0,
          rewindFiles: options2.rewindFiles,
          enableAuthStatus: options2.enableAuthStatus,
          agent: agentCli,
          workload: options2.workload,
          setupTrigger: setupTrigger ?? void 0,
          sessionStartHooksPromise
        });
        return;
      }
      logEvent("tengu_startup_manual_model_config", {
        cli_flag: options2.model,
        env_var: process.env.ANTHROPIC_MODEL,
        settings_file: (getInitialSettings() || {}).model,
        subscriptionType: getSubscriptionType(),
        agent: agentSetting
      });
      let deprecationWarning = getModelDeprecationWarning(resolvedInitialModel), initialNotifications = [];
      if (permissionModeNotification)
        initialNotifications.push({
          key: "permission-mode-notification",
          text: permissionModeNotification,
          priority: "high"
        });
      if (deprecationWarning)
        initialNotifications.push({
          key: "model-deprecation-warning",
          text: deprecationWarning,
          color: "warning",
          priority: "high"
        });
      if (overlyBroadBashPermissions.length > 0) {
        let displayList = uniq(overlyBroadBashPermissions.map((p4) => p4.ruleDisplay)), displays = displayList.join(", "), sources = uniq(overlyBroadBashPermissions.map((p4) => p4.sourceDisplay)).join(", "), n6 = displayList.length;
        initialNotifications.push({
          key: "overly-broad-bash-notification",
          text: `${displays} allow ${plural(n6, "rule")} from ${sources} ${plural(n6, "was", "were")} ignored \u2014 not available for Ants, please use auto-mode instead`,
          color: "warning",
          priority: "high"
        });
      }
      let effectiveToolPermissionContext = {
        ...toolPermissionContext,
        mode: isAgentSwarmsEnabled() && getTeammateUtils().isPlanModeRequired() ? "plan" : toolPermissionContext.mode
      }, initialIsBriefOnly = getUserMsgOptIn(), fullRemoteControl = remoteControl || getRemoteControlAtStartup() || kairosEnabled, ccrMirrorEnabled = !1, initialState = {
        settings: getInitialSettings(),
        tasks: {},
        agentNameRegistry: /* @__PURE__ */ new Map,
        verbose: verbose ?? getGlobalConfig().verbose ?? !1,
        mainLoopModel: initialMainLoopModel,
        mainLoopModelForSession: null,
        isBriefOnly: initialIsBriefOnly,
        expandedView: getGlobalConfig().showSpinnerTree ? "teammates" : getGlobalConfig().showExpandedTodos ? "tasks" : "none",
        showTeammateMessagePreview: isAgentSwarmsEnabled() ? !1 : void 0,
        selectedIPAgentIndex: -1,
        coordinatorTaskIndex: -1,
        viewSelectionMode: "none",
        footerSelection: null,
        toolPermissionContext: effectiveToolPermissionContext,
        agent: mainThreadAgentDefinition?.agentType,
        agentDefinitions,
        mcp: {
          clients: [],
          tools: [],
          commands: [],
          resources: {},
          pluginReconnectKey: 0
        },
        plugins: {
          enabled: [],
          disabled: [],
          commands: [],
          errors: [],
          installationStatus: {
            marketplaces: [],
            plugins: []
          },
          needsRefresh: !1
        },
        statusLineText: void 0,
        kairosEnabled,
        remoteSessionUrl: void 0,
        remoteConnectionStatus: "connecting",
        remoteBackgroundTaskCount: 0,
        replBridgeEnabled: fullRemoteControl || ccrMirrorEnabled,
        replBridgeExplicit: remoteControl,
        replBridgeOutboundOnly: ccrMirrorEnabled,
        replBridgeConnected: !1,
        replBridgeSessionActive: !1,
        replBridgeReconnecting: !1,
        replBridgeConnectUrl: void 0,
        replBridgeSessionUrl: void 0,
        replBridgeEnvironmentId: void 0,
        replBridgeSessionId: void 0,
        replBridgeError: void 0,
        replBridgeInitialName: remoteControlName,
        showRemoteCallout: !1,
        notifications: {
          current: null,
          queue: initialNotifications
        },
        elicitation: {
          queue: []
        },
        todos: {},
        remoteAgentTaskSuggestions: [],
        fileHistory: {
          snapshots: [],
          trackedFiles: /* @__PURE__ */ new Set,
          snapshotSequence: 0
        },
        attribution: createEmptyAttributionState(),
        thinkingEnabled,
        promptSuggestionEnabled: shouldEnablePromptSuggestion(),
        sessionHooks: /* @__PURE__ */ new Map,
        inbox: {
          messages: []
        },
        promptSuggestion: {
          text: null,
          promptId: null,
          shownAt: 0,
          acceptedAt: 0,
          generationRequestId: null
        },
        speculation: IDLE_SPECULATION_STATE,
        speculationSessionTimeSavedMs: 0,
        skillImprovement: {
          suggestion: null
        },
        workerSandboxPermissions: {
          queue: [],
          selectedIndex: 0
        },
        pendingWorkerRequest: null,
        pendingSandboxRequest: null,
        authVersion: 0,
        initialMessage: inputPrompt ? {
          message: createUserMessage({
            content: String(inputPrompt)
          })
        } : null,
        effortValue: parseEffortValue(options2.effort) ?? getInitialEffortSetting(),
        activeOverlays: /* @__PURE__ */ new Set,
        fastMode: getInitialFastModeSetting(resolvedInitialModel),
        ...isAdvisorEnabled() && advisorModel && {
          advisorModel
        },
        teamContext: computeInitialTeamContext?.()
      };
      if (inputPrompt)
        addToHistory(String(inputPrompt));
      let initialTools = mcpTools;
      saveGlobalConfig((current) => ({
        ...current,
        numStartups: (current.numStartups ?? 0) + 1
      })), setImmediate(() => {
        logStartupTelemetry(), logSessionTelemetry();
      });
      let sessionUploaderPromise = null, uploaderReady = sessionUploaderPromise ? sessionUploaderPromise.then((mod) => mod.createSessionTurnUploader()).catch(() => null) : null, sessionConfig = {
        debug: debug || debugToStderr,
        commands: [...commands7, ...mcpCommands],
        initialTools,
        mcpClients,
        autoConnectIdeFlag: ide2,
        mainThreadAgentDefinition,
        disableSlashCommands,
        dynamicMcpConfig,
        strictMcpConfig,
        systemPrompt,
        appendSystemPrompt,
        taskListId,
        thinkingConfig,
        ...uploaderReady && {
          onTurnComplete: (messages) => {
            uploaderReady.then((uploader) => uploader?.(messages));
          }
        }
      }, resumeContext = {
        modeApi: coordinatorModeModule,
        mainThreadAgentDefinition,
        agentDefinitions,
        currentCwd: currentCwd2,
        cliAgents,
        initialState
      };
      if (options2.continue) {
        let resumeSucceeded = !1;
        try {
          let resumeStart = performance.now(), {
            clearSessionCaches: clearSessionCaches2
          } = await Promise.resolve().then(() => (init_caches(), exports_caches));
          clearSessionCaches2();
          let result = await loadConversationForResume(void 0, void 0);
          if (!result)
            return logEvent("tengu_continue", {
              success: !1
            }), await exitWithError2(root3, "No conversation found to continue");
          let loaded = await processResumedConversation(result, {
            forkSession: !!options2.forkSession,
            includeAttribution: !0,
            transcriptPath: result.fullPath
          }, resumeContext);
          if (loaded.restoredAgentDef)
            mainThreadAgentDefinition = loaded.restoredAgentDef;
          maybeActivateProactive(options2), maybeActivateBrief(options2), logEvent("tengu_continue", {
            success: !0,
            resume_duration_ms: Math.round(performance.now() - resumeStart)
          }), resumeSucceeded = !0, await launchRepl(root3, {
            getFpsMetrics,
            stats: stats2,
            initialState: loaded.initialState
          }, {
            ...sessionConfig,
            mainThreadAgentDefinition: loaded.restoredAgentDef ?? mainThreadAgentDefinition,
            initialMessages: loaded.messages,
            initialFileHistorySnapshots: loaded.fileHistorySnapshots,
            initialContentReplacements: loaded.contentReplacements,
            initialAgentName: loaded.agentName,
            initialAgentColor: loaded.agentColor
          }, renderAndRun);
        } catch (error44) {
          if (!resumeSucceeded)
            logEvent("tengu_continue", {
              success: !1
            });
          logError2(error44), process.exit(1);
        }
      } else if (options2.resume || options2.fromPr || teleport || remote !== null) {
        let {
          clearSessionCaches: clearSessionCaches2
        } = await Promise.resolve().then(() => (init_caches(), exports_caches));
        clearSessionCaches2();
        let messages = null, processedResume = void 0, maybeSessionId = validateUuid2(options2.resume), searchTerm = void 0, matchedLog = null, filterByPr = void 0;
        if (options2.fromPr) {
          if (options2.fromPr === !0)
            filterByPr = !0;
          else if (typeof options2.fromPr === "string")
            filterByPr = options2.fromPr;
        }
        if (options2.resume && typeof options2.resume === "string" && !maybeSessionId) {
          let trimmedValue = options2.resume.trim();
          if (trimmedValue) {
            let matches2 = await searchSessionsByCustomTitle(trimmedValue, {
              exact: !0
            });
            if (matches2.length === 1)
              matchedLog = matches2[0], maybeSessionId = getSessionIdFromLog(matchedLog) ?? null;
            else
              searchTerm = trimmedValue;
          }
        }
        if (remote !== null || teleport) {
          if (await waitForPolicyLimitsToLoad(), !isPolicyAllowed("allow_remote_sessions"))
            return await exitWithError2(root3, "Error: Remote sessions are disabled by your organization's policy.", () => gracefulShutdown(1));
        }
        if (remote !== null) {
          let hasInitialPrompt = remote.length > 0;
          if (!hasInitialPrompt)
            return await exitWithError2(root3, `Error: --remote requires a description.
Usage: claude --remote "your task description"`, () => gracefulShutdown(1));
          logEvent("tengu_remote_create_session", {
            has_initial_prompt: String(hasInitialPrompt)
          });
          let currentBranch = await getBranch(), createdSession = await teleportToRemoteWithErrorHandling(root3, hasInitialPrompt ? remote : null, new AbortController().signal, currentBranch || void 0);
          if (!createdSession)
            return logEvent("tengu_remote_create_session_error", {
              error: "unable_to_create_session"
            }), await exitWithError2(root3, "Error: Unable to create remote session", () => gracefulShutdown(1));
          if (logEvent("tengu_remote_create_session_success", {
            session_id: createdSession.id
          }), !isRemoteTuiEnabled)
            process.stdout.write(`Created remote session: ${createdSession.title}
`), process.stdout.write(`View: ${getRemoteSessionUrl(createdSession.id)}?m=0
`), process.stdout.write(`Resume with: claude --teleport ${createdSession.id}
`), await gracefulShutdown(0), process.exit(0);
          setIsRemoteMode(!0), switchSession(asSessionId(createdSession.id));
          let apiCreds;
          try {
            apiCreds = await prepareApiRequest();
          } catch (error44) {
            return logError2(toError(error44)), await exitWithError2(root3, `Error: ${errorMessage(error44) || "Failed to authenticate"}`, () => gracefulShutdown(1));
          }
          let {
            getClaudeAIOAuthTokens: getTokensForRemote
          } = await Promise.resolve().then(() => (init_auth14(), exports_auth)), getAccessTokenForRemote = () => getTokensForRemote()?.accessToken ?? apiCreds.accessToken, remoteSessionConfig = createRemoteSessionConfig(createdSession.id, getAccessTokenForRemote, apiCreds.orgUUID, hasInitialPrompt), remoteSessionUrl = `${getRemoteSessionUrl(createdSession.id)}?m=0`, remoteInfoMessage = createSystemMessage(`/remote-control is active. Code in CLI or at ${remoteSessionUrl}`, "info"), initialUserMessage = hasInitialPrompt ? createUserMessage({
            content: remote
          }) : null, remoteInitialState = {
            ...initialState,
            remoteSessionUrl
          }, remoteCommands = filterCommandsForRemoteMode(commands7);
          await launchRepl(root3, {
            getFpsMetrics,
            stats: stats2,
            initialState: remoteInitialState
          }, {
            debug: debug || debugToStderr,
            commands: remoteCommands,
            initialTools: [],
            initialMessages: initialUserMessage ? [remoteInfoMessage, initialUserMessage] : [remoteInfoMessage],
            mcpClients: [],
            autoConnectIdeFlag: ide2,
            mainThreadAgentDefinition,
            disableSlashCommands,
            remoteSessionConfig,
            thinkingConfig
          }, renderAndRun);
          return;
        } else if (teleport) {
          if (teleport === !0 || teleport === "") {
            logEvent("tengu_teleport_interactive_mode", {}), logForDebugging("selectAndResumeTeleportTask: Starting teleport flow...");
            let teleportResult = await launchTeleportResumeWrapper(root3);
            if (!teleportResult)
              await gracefulShutdown(0), process.exit(0);
            let {
              branchError
            } = await checkOutTeleportedSessionBranch(teleportResult.branch);
            messages = processMessagesForTeleportResume(teleportResult.log, branchError);
          } else if (typeof teleport === "string") {
            logEvent("tengu_teleport_resume_session", {
              mode: "direct"
            });
            try {
              let sessionData = await fetchSession(teleport), repoValidation = await validateSessionRepository(sessionData);
              if (repoValidation.status === "mismatch" || repoValidation.status === "not_in_repo") {
                let sessionRepo = repoValidation.sessionRepo;
                if (sessionRepo) {
                  let knownPaths = getKnownPathsForRepo(sessionRepo), existingPaths = await filterExistingPaths(knownPaths);
                  if (existingPaths.length > 0) {
                    let selectedPath = await launchTeleportRepoMismatchDialog(root3, {
                      targetRepo: sessionRepo,
                      initialPaths: existingPaths
                    });
                    if (selectedPath)
                      process.chdir(selectedPath), setCwd(selectedPath), setOriginalCwd(selectedPath);
                    else
                      await gracefulShutdown(0);
                  } else
                    throw new TeleportOperationError(`You must run claude --teleport ${teleport} from a checkout of ${sessionRepo}.`, source_default.red(`You must run claude --teleport ${teleport} from a checkout of ${source_default.bold(sessionRepo)}.
`));
                }
              } else if (repoValidation.status === "error")
                throw new TeleportOperationError(repoValidation.errorMessage || "Failed to validate session", source_default.red(`Error: ${repoValidation.errorMessage || "Failed to validate session"}
`));
              await validateGitState();
              let {
                teleportWithProgress: teleportWithProgress2
              } = await Promise.resolve().then(() => (init_TeleportProgress(), exports_TeleportProgress)), result = await teleportWithProgress2(root3, teleport);
              setTeleportedSessionInfo({
                sessionId: teleport
              }), messages = result.messages;
            } catch (error44) {
              if (error44 instanceof TeleportOperationError)
                process.stderr.write(error44.formattedMessage + `
`);
              else
                logError2(error44), process.stderr.write(source_default.red(`Error: ${errorMessage(error44)}
`));
              await gracefulShutdown(1);
            }
          }
        }
        if (maybeSessionId) {
          let sessionId2 = maybeSessionId;
          try {
            let resumeStart = performance.now(), result = await loadConversationForResume(matchedLog ?? sessionId2, void 0);
            if (!result)
              return logEvent("tengu_session_resumed", {
                entrypoint: "cli_flag",
                success: !1
              }), await exitWithError2(root3, `No conversation found with session ID: ${sessionId2}`);
            let fullPath = matchedLog?.fullPath ?? result.fullPath;
            if (processedResume = await processResumedConversation(result, {
              forkSession: !!options2.forkSession,
              sessionIdOverride: sessionId2,
              transcriptPath: fullPath
            }, resumeContext), processedResume.restoredAgentDef)
              mainThreadAgentDefinition = processedResume.restoredAgentDef;
            logEvent("tengu_session_resumed", {
              entrypoint: "cli_flag",
              success: !0,
              resume_duration_ms: Math.round(performance.now() - resumeStart)
            });
          } catch (error44) {
            logEvent("tengu_session_resumed", {
              entrypoint: "cli_flag",
              success: !1
            }), logError2(error44), await exitWithError2(root3, `Failed to resume session ${sessionId2}`);
          }
        }
        if (fileDownloadPromise)
          try {
            let results = await fileDownloadPromise, failedCount = count2(results, (r4) => !r4.success);
            if (failedCount > 0)
              process.stderr.write(source_default.yellow(`Warning: ${failedCount}/${results.length} file(s) failed to download.
`));
          } catch (error44) {
            return await exitWithError2(root3, `Error downloading files: ${errorMessage(error44)}`);
          }
        let resumeData = processedResume ?? (Array.isArray(messages) ? {
          messages,
          fileHistorySnapshots: void 0,
          agentName: void 0,
          agentColor: void 0,
          restoredAgentDef: mainThreadAgentDefinition,
          initialState,
          contentReplacements: void 0
        } : void 0);
        if (resumeData)
          maybeActivateProactive(options2), maybeActivateBrief(options2), await launchRepl(root3, {
            getFpsMetrics,
            stats: stats2,
            initialState: resumeData.initialState
          }, {
            ...sessionConfig,
            mainThreadAgentDefinition: resumeData.restoredAgentDef ?? mainThreadAgentDefinition,
            initialMessages: resumeData.messages,
            initialFileHistorySnapshots: resumeData.fileHistorySnapshots,
            initialContentReplacements: resumeData.contentReplacements,
            initialAgentName: resumeData.agentName,
            initialAgentColor: resumeData.agentColor
          }, renderAndRun);
        else
          await launchResumeChooser(root3, {
            getFpsMetrics,
            stats: stats2,
            initialState
          }, getWorktreePaths(getOriginalCwd()), {
            ...sessionConfig,
            initialSearchQuery: searchTerm,
            forkSession: options2.forkSession,
            filterByPr
          });
      } else {
        let pendingHookMessages = hooksPromise && hookMessages.length === 0 ? hooksPromise : void 0;
        profileCheckpoint("action_after_hooks"), maybeActivateProactive(options2), maybeActivateBrief(options2);
        let deepLinkBanner = null, initialMessages = deepLinkBanner ? [deepLinkBanner, ...hookMessages] : hookMessages.length > 0 ? hookMessages : void 0;
        await launchRepl(root3, {
          getFpsMetrics,
          stats: stats2,
          initialState
        }, {
          ...sessionConfig,
          initialMessages,
          pendingHookMessages
        }, renderAndRun);
      }
    }
  }).version("2.1.90 (Claude Code)", "-v, --version", "Output the version number"), program2.option("-w, --worktree [name]", "Create a new git worktree for this session (optionally specify a name)"), program2.option("--tmux", "Create a tmux session for the worktree (requires --worktree). Uses iTerm2 native panes when available; use --tmux=classic for traditional tmux."), canUserConfigureAdvisor())
    program2.addOption(new Option("--advisor <model>", "Enable the server-side advisor tool with the specified model (alias or full ID).").hideHelp());
  program2.addOption(new Option("--brief", "Enable SendUserMessage tool for agent-to-user communication")), program2.addOption(new Option("--channels <servers...>", "MCP servers whose channel notifications (inbound push) should register this session. Space-separated server names.").hideHelp()), program2.addOption(new Option("--dangerously-load-development-channels <servers...>", "Load channel servers not on the approved allowlist. For local channel development only. Shows a confirmation dialog at startup.").hideHelp()), program2.addOption(new Option("--agent-id <id>", "Teammate agent ID").hideHelp()), program2.addOption(new Option("--agent-name <name>", "Teammate display name").hideHelp()), program2.addOption(new Option("--team-name <name>", "Team name for swarm coordination").hideHelp()), program2.addOption(new Option("--agent-color <color>", "Teammate UI color").hideHelp()), program2.addOption(new Option("--plan-mode-required", "Require plan mode before implementation").hideHelp()), program2.addOption(new Option("--parent-session-id <id>", "Parent session ID for analytics correlation").hideHelp()), program2.addOption(new Option("--teammate-mode <mode>", 'How to spawn teammates: "tmux", "in-process", or "auto"').choices(["auto", "tmux", "in-process"]).hideHelp()), program2.addOption(new Option("--agent-type <type>", "Custom agent type for this teammate").hideHelp()), program2.addOption(new Option("--sdk-url <url>", "Use remote WebSocket endpoint for SDK I/O streaming (only with -p and stream-json format)").hideHelp()), program2.addOption(new Option("--teleport [session]", "Resume a teleport session, optionally specify session ID").hideHelp()), program2.addOption(new Option("--remote [description]", "Create a remote session with the given description").hideHelp()), profileCheckpoint("run_main_options_built");
  let isPrintMode = process.argv.includes("-p") || process.argv.includes("--print"), isCcUrl = process.argv.some((a2) => a2.startsWith("cc://") || a2.startsWith("cc+unix://"));
  if (isPrintMode && !isCcUrl)
    return profileCheckpoint("run_before_parse"), await program2.parseAsync(process.argv), profileCheckpoint("run_after_parse"), program2;
  let mcp2 = program2.command("mcp").description("Configure and manage MCP servers").configureHelp(createSortedHelpConfig()).enablePositionalOptions();
  if (mcp2.command("serve").description("Start the Claude Code MCP server").option("-d, --debug", "Enable debug mode", () => !0).option("--verbose", "Override verbose mode setting from config", () => !0).action(async ({
    debug,
    verbose
  }) => {
    let {
      mcpServeHandler: mcpServeHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpServeHandler2({
      debug,
      verbose
    });
  }), registerMcpAddCommand(mcp2), isXaaEnabled())
    registerMcpXaaIdpCommand(mcp2);
  mcp2.command("remove <name>").description("Remove an MCP server").option("-s, --scope <scope>", "Configuration scope (local, user, or project) - if not specified, removes from whichever scope it exists in").action(async (name3, options2) => {
    let {
      mcpRemoveHandler: mcpRemoveHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpRemoveHandler2(name3, options2);
  }), mcp2.command("list").description("List configured MCP servers. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.").action(async () => {
    let {
      mcpListHandler: mcpListHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpListHandler2();
  }), mcp2.command("get <name>").description("Get details about an MCP server. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.").action(async (name3) => {
    let {
      mcpGetHandler: mcpGetHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpGetHandler2(name3);
  }), mcp2.command("add-json <name> <json>").description("Add an MCP server (stdio or SSE) with a JSON string").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").option("--client-secret", "Prompt for OAuth client secret (or set MCP_CLIENT_SECRET env var)").action(async (name3, json2, options2) => {
    let {
      mcpAddJsonHandler: mcpAddJsonHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpAddJsonHandler2(name3, json2, options2);
  }), mcp2.command("add-from-claude-desktop").description("Import MCP servers from Claude Desktop (Mac and WSL only)").option("-s, --scope <scope>", "Configuration scope (local, user, or project)", "local").action(async (options2) => {
    let {
      mcpAddFromDesktopHandler: mcpAddFromDesktopHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpAddFromDesktopHandler2(options2);
  }), mcp2.command("reset-project-choices").description("Reset all approved and rejected project-scoped (.mcp.json) servers within this project").action(async () => {
    let {
      mcpResetChoicesHandler: mcpResetChoicesHandler2
    } = await Promise.resolve().then(() => (init_mcp5(), exports_mcp3));
    await mcpResetChoicesHandler2();
  });
  let auth14 = program2.command("auth").description("Manage authentication").configureHelp(createSortedHelpConfig());
  auth14.command("login").description("Sign in to your Anthropic account").option("--email <email>", "Pre-populate email address on the login page").option("--sso", "Force SSO login flow").option("--console", "Use Anthropic Console (API usage billing) instead of Claude subscription").option("--claudeai", "Use Claude subscription (default)").action(async ({
    email: email3,
    sso,
    console: useConsole,
    claudeai
  }) => {
    let {
      authLogin: authLogin2
    } = await Promise.resolve().then(() => (init_auth18(), exports_auth2));
    await authLogin2({
      email: email3,
      sso,
      console: useConsole,
      claudeai
    });
  }), auth14.command("status").description("Show authentication status").option("--json", "Output as JSON (default)").option("--text", "Output as human-readable text").action(async (opts) => {
    let {
      authStatus: authStatus2
    } = await Promise.resolve().then(() => (init_auth18(), exports_auth2));
    await authStatus2(opts);
  }), auth14.command("logout").description("Log out from your Anthropic account").action(async () => {
    let {
      authLogout: authLogout2
    } = await Promise.resolve().then(() => (init_auth18(), exports_auth2));
    await authLogout2();
  });
  let coworkOption = () => new Option("--cowork", "Use cowork_plugins directory").hideHelp(), pluginCmd = program2.command("plugin").alias("plugins").description("Manage Claude Code plugins").configureHelp(createSortedHelpConfig());
  pluginCmd.command("validate <path>").description("Validate a plugin or marketplace manifest").addOption(coworkOption()).action(async (manifestPath, options2) => {
    let {
      pluginValidateHandler: pluginValidateHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginValidateHandler2(manifestPath, options2);
  }), pluginCmd.command("list").description("List installed plugins").option("--json", "Output as JSON").option("--available", "Include available plugins from marketplaces (requires --json)").addOption(coworkOption()).action(async (options2) => {
    let {
      pluginListHandler: pluginListHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginListHandler2(options2);
  });
  let marketplaceCmd = pluginCmd.command("marketplace").description("Manage Claude Code marketplaces").configureHelp(createSortedHelpConfig());
  return marketplaceCmd.command("add <source>").description("Add a marketplace from a URL, path, or GitHub repo").addOption(coworkOption()).option("--sparse <paths...>", "Limit checkout to specific directories via git sparse-checkout (for monorepos). Example: --sparse .claude-plugin plugins").option("--scope <scope>", "Where to declare the marketplace: user (default), project, or local").action(async (source, options2) => {
    let {
      marketplaceAddHandler: marketplaceAddHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await marketplaceAddHandler2(source, options2);
  }), marketplaceCmd.command("list").description("List all configured marketplaces").option("--json", "Output as JSON").addOption(coworkOption()).action(async (options2) => {
    let {
      marketplaceListHandler: marketplaceListHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await marketplaceListHandler2(options2);
  }), marketplaceCmd.command("remove <name>").alias("rm").description("Remove a configured marketplace").addOption(coworkOption()).action(async (name3, options2) => {
    let {
      marketplaceRemoveHandler: marketplaceRemoveHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await marketplaceRemoveHandler2(name3, options2);
  }), marketplaceCmd.command("update [name]").description("Update marketplace(s) from their source - updates all if no name specified").addOption(coworkOption()).action(async (name3, options2) => {
    let {
      marketplaceUpdateHandler: marketplaceUpdateHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await marketplaceUpdateHandler2(name3, options2);
  }), pluginCmd.command("install <plugin>").alias("i").description("Install a plugin from available marketplaces (use plugin@marketplace for specific marketplace)").option("-s, --scope <scope>", "Installation scope: user, project, or local", "user").addOption(coworkOption()).action(async (plugin2, options2) => {
    let {
      pluginInstallHandler: pluginInstallHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginInstallHandler2(plugin2, options2);
  }), pluginCmd.command("uninstall <plugin>").alias("remove").alias("rm").description("Uninstall an installed plugin").option("-s, --scope <scope>", "Uninstall from scope: user, project, or local", "user").option("--keep-data", "Preserve the plugin's persistent data directory (~/.claude/plugins/data/{id}/)").addOption(coworkOption()).action(async (plugin2, options2) => {
    let {
      pluginUninstallHandler: pluginUninstallHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginUninstallHandler2(plugin2, options2);
  }), pluginCmd.command("enable <plugin>").description("Enable a disabled plugin").option("-s, --scope <scope>", `Installation scope: ${VALID_INSTALLABLE_SCOPES.join(", ")} (default: auto-detect)`).addOption(coworkOption()).action(async (plugin2, options2) => {
    let {
      pluginEnableHandler: pluginEnableHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginEnableHandler2(plugin2, options2);
  }), pluginCmd.command("disable [plugin]").description("Disable an enabled plugin").option("-a, --all", "Disable all enabled plugins").option("-s, --scope <scope>", `Installation scope: ${VALID_INSTALLABLE_SCOPES.join(", ")} (default: auto-detect)`).addOption(coworkOption()).action(async (plugin2, options2) => {
    let {
      pluginDisableHandler: pluginDisableHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginDisableHandler2(plugin2, options2);
  }), pluginCmd.command("update <plugin>").description("Update a plugin to the latest version (restart required to apply)").option("-s, --scope <scope>", `Installation scope: ${VALID_UPDATE_SCOPES.join(", ")} (default: user)`).addOption(coworkOption()).action(async (plugin2, options2) => {
    let {
      pluginUpdateHandler: pluginUpdateHandler2
    } = await Promise.resolve().then(() => (init_plugins(), exports_plugins));
    await pluginUpdateHandler2(plugin2, options2);
  }), program2.command("setup-token").description("Set up a long-lived authentication token (requires Claude subscription)").action(async () => {
    let [{
      setupTokenHandler: setupTokenHandler2
    }, {
      createRoot: createRoot3
    }] = await Promise.all([Promise.resolve().then(() => (init_util10(), exports_util2)), Promise.resolve().then(() => (init_ink2(), exports_ink))]), root3 = await createRoot3(getBaseRenderOptions(!1));
    await setupTokenHandler2(root3);
  }), program2.command("agents").description("List configured agents").option("--setting-sources <sources>", "Comma-separated list of setting sources to load (user, project, local).").action(async () => {
    let {
      agentsHandler: agentsHandler2
    } = await Promise.resolve().then(() => (init_agents3(), exports_agents2));
    await agentsHandler2(), process.exit(0);
  }), program2.command("doctor").description("Check the health of your Claude Code auto-updater. Note: The workspace trust dialog is skipped and stdio servers from .mcp.json are spawned for health checks. Only use this command in directories you trust.").action(async () => {
    let [{
      doctorHandler: doctorHandler2
    }, {
      createRoot: createRoot3
    }] = await Promise.all([Promise.resolve().then(() => (init_util10(), exports_util2)), Promise.resolve().then(() => (init_ink2(), exports_ink))]), root3 = await createRoot3(getBaseRenderOptions(!1));
    await doctorHandler2(root3);
  }), program2.command("update").alias("upgrade").description("Check for updates and install if available").action(async () => {
    let {
      update: update3
    } = await Promise.resolve().then(() => (init_update(), exports_update));
    await update3();
  }), program2.command("install [target]").description("Install Claude Code native build. Use [target] to specify version (stable, latest, or specific version)").option("--force", "Force installation even if already installed").action(async (target, options2) => {
    let {
      installHandler: installHandler2
    } = await Promise.resolve().then(() => (init_util10(), exports_util2));
    await installHandler2(target, options2);
  }), profileCheckpoint("run_before_parse"), await program2.parseAsync(process.argv), profileCheckpoint("run_after_parse"), profileCheckpoint("main_after_run"), profileReport(), program2;
}
