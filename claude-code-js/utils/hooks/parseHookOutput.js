// function: parseHookOutput
function parseHookOutput(stdout) {
  let trimmed = stdout.trim();
  if (!trimmed.startsWith("{"))
    return logForDebugging("Hook output does not start with {, treating as plain text"), { plainText: stdout };
  try {
    let result = validateHookJson(trimmed);
    if ("json" in result)
      return result;
    let errorMessage4 = `${result.validationError}

Expected schema:
${jsonStringify({
      continue: "boolean (optional)",
      suppressOutput: "boolean (optional)",
      stopReason: "string (optional)",
      decision: '"approve" | "block" (optional)',
      reason: "string (optional)",
      systemMessage: "string (optional)",
      permissionDecision: '"allow" | "deny" | "ask" (optional)',
      hookSpecificOutput: {
        "for PreToolUse": {
          hookEventName: '"PreToolUse"',
          permissionDecision: '"allow" | "deny" | "ask" (optional)',
          permissionDecisionReason: "string (optional)",
          updatedInput: "object (optional) - Modified tool input to use"
        },
        "for UserPromptSubmit": {
          hookEventName: '"UserPromptSubmit"',
          additionalContext: "string (required)"
        },
        "for PostToolUse": {
          hookEventName: '"PostToolUse"',
          additionalContext: "string (optional)"
        }
      }
    }, null, 2)}`;
    return logForDebugging(errorMessage4), { plainText: stdout, validationError: errorMessage4 };
  } catch (e) {
    return logForDebugging(`Failed to parse hook output as JSON: ${e}`), { plainText: stdout };
  }
}
function parseHttpHookOutput(body) {
  let trimmed = body.trim();
  if (trimmed === "") {
    let validation = hookJSONOutputSchema().safeParse({});
    if (validation.success)
      return logForDebugging("HTTP hook returned empty body, treating as empty JSON object"), { json: validation.data };
  }
  if (!trimmed.startsWith("{")) {
    let validationError = `HTTP hook must return JSON, but got non-JSON response body: ${trimmed.length > 200 ? trimmed.slice(0, 200) + "\u2026" : trimmed}`;
    return logForDebugging(validationError), { validationError };
  }
  try {
    let result = validateHookJson(trimmed);
    if ("json" in result)
      return result;
    return logForDebugging(result.validationError), result;
  } catch (e) {
    let validationError = `HTTP hook must return valid JSON, but parsing failed: ${e}`;
    return logForDebugging(validationError), { validationError };
  }
}
function processHookJSONOutput({
  json: json2,
  command: command19,
  hookName,
  toolUseID,
  hookEvent,
  expectedHookEvent,
  stdout,
  stderr,
  exitCode,
  durationMs
}) {
  let result = {}, syncJson = json2;
  if (syncJson.continue === !1) {
    if (result.preventContinuation = !0, syncJson.stopReason)
      result.stopReason = syncJson.stopReason;
  }
  if (json2.decision)
    switch (json2.decision) {
      case "approve":
        result.permissionBehavior = "allow";
        break;
      case "block":
        result.permissionBehavior = "deny", result.blockingError = {
          blockingError: json2.reason || "Blocked by hook",
          command: command19
        };
        break;
      default:
        throw Error(`Unknown hook decision type: ${json2.decision}. Valid types are: approve, block`);
    }
  if (json2.systemMessage)
    result.systemMessage = json2.systemMessage;
  if (json2.hookSpecificOutput?.hookEventName === "PreToolUse" && json2.hookSpecificOutput.permissionDecision)
    switch (json2.hookSpecificOutput.permissionDecision) {
      case "allow":
        result.permissionBehavior = "allow";
        break;
      case "deny":
        result.permissionBehavior = "deny", result.blockingError = {
          blockingError: json2.reason || "Blocked by hook",
          command: command19
        };
        break;
      case "ask":
        result.permissionBehavior = "ask";
        break;
      default:
        throw Error(`Unknown hook permissionDecision type: ${json2.hookSpecificOutput.permissionDecision}. Valid types are: allow, deny, ask`);
    }
  if (result.permissionBehavior !== void 0 && json2.reason !== void 0)
    result.hookPermissionDecisionReason = json2.reason;
  if (json2.hookSpecificOutput) {
    if (expectedHookEvent && json2.hookSpecificOutput.hookEventName !== expectedHookEvent)
      throw Error(`Hook returned incorrect event name: expected '${expectedHookEvent}' but got '${json2.hookSpecificOutput.hookEventName}'. Full stdout: ${jsonStringify(json2, null, 2)}`);
    switch (json2.hookSpecificOutput.hookEventName) {
      case "PreToolUse":
        if (json2.hookSpecificOutput.permissionDecision)
          switch (json2.hookSpecificOutput.permissionDecision) {
            case "allow":
              result.permissionBehavior = "allow";
              break;
            case "deny":
              result.permissionBehavior = "deny", result.blockingError = {
                blockingError: json2.hookSpecificOutput.permissionDecisionReason || json2.reason || "Blocked by hook",
                command: command19
              };
              break;
            case "ask":
              result.permissionBehavior = "ask";
              break;
          }
        if (result.hookPermissionDecisionReason = json2.hookSpecificOutput.permissionDecisionReason, json2.hookSpecificOutput.updatedInput)
          result.updatedInput = json2.hookSpecificOutput.updatedInput;
        result.additionalContext = json2.hookSpecificOutput.additionalContext;
        break;
      case "UserPromptSubmit":
        result.additionalContext = json2.hookSpecificOutput.additionalContext;
        break;
      case "SessionStart":
        if (result.additionalContext = json2.hookSpecificOutput.additionalContext, result.initialUserMessage = json2.hookSpecificOutput.initialUserMessage, "watchPaths" in json2.hookSpecificOutput && json2.hookSpecificOutput.watchPaths)
          result.watchPaths = json2.hookSpecificOutput.watchPaths;
        break;
      case "Setup":
        result.additionalContext = json2.hookSpecificOutput.additionalContext;
        break;
      case "SubagentStart":
        result.additionalContext = json2.hookSpecificOutput.additionalContext;
        break;
      case "PostToolUse":
        if (result.additionalContext = json2.hookSpecificOutput.additionalContext, json2.hookSpecificOutput.updatedMCPToolOutput)
          result.updatedMCPToolOutput = json2.hookSpecificOutput.updatedMCPToolOutput;
        break;
      case "PostToolUseFailure":
        result.additionalContext = json2.hookSpecificOutput.additionalContext;
        break;
      case "PermissionDenied":
        result.retry = json2.hookSpecificOutput.retry;
        break;
      case "PermissionRequest":
        if (json2.hookSpecificOutput.decision) {
          if (result.permissionRequestResult = json2.hookSpecificOutput.decision, result.permissionBehavior = json2.hookSpecificOutput.decision.behavior === "allow" ? "allow" : "deny", json2.hookSpecificOutput.decision.behavior === "allow" && json2.hookSpecificOutput.decision.updatedInput)
            result.updatedInput = json2.hookSpecificOutput.decision.updatedInput;
        }
        break;
      case "Elicitation":
        if (json2.hookSpecificOutput.action) {
          if (result.elicitationResponse = {
            action: json2.hookSpecificOutput.action,
            content: json2.hookSpecificOutput.content
          }, json2.hookSpecificOutput.action === "decline")
            result.blockingError = {
              blockingError: json2.reason || "Elicitation denied by hook",
              command: command19
            };
        }
        break;
      case "ElicitationResult":
        if (json2.hookSpecificOutput.action) {
          if (result.elicitationResultResponse = {
            action: json2.hookSpecificOutput.action,
            content: json2.hookSpecificOutput.content
          }, json2.hookSpecificOutput.action === "decline")
            result.blockingError = {
              blockingError: json2.reason || "Elicitation result blocked by hook",
              command: command19
            };
        }
        break;
    }
  }
  return {
    ...result,
    message: result.blockingError ? createAttachmentMessage({
      type: "hook_blocking_error",
      hookName,
      toolUseID,
      hookEvent,
      blockingError: result.blockingError
    }) : createAttachmentMessage({
      type: "hook_success",
      hookName,
      toolUseID,
      hookEvent,
      content: "",
      stdout,
      stderr,
      exitCode,
      command: command19,
      durationMs
    })
  };
}
async function execCommandHook(hook, hookEvent, hookName, jsonInput, signal, hookId, hookIndex, pluginRoot, pluginId, skillRoot, forceSyncExecution, requestPrompt) {
  let shouldEmitDiag = hookEvent === "SessionStart" || hookEvent === "Setup" || hookEvent === "SessionEnd", diagStartMs = Date.now(), diagExitCode, diagAborted = !1, isWindows3 = getPlatform() === "windows", shellType = hook.shell ?? DEFAULT_HOOK_SHELL, isPowerShell = shellType === "powershell", toHookPath = isWindows3 && !isPowerShell ? (p4) => windowsPathToPosixPath(p4) : (p4) => p4, projectDir = getProjectRoot(), command19 = hook.command, pluginOpts;
  if (pluginRoot) {
    if (!await pathExists(pluginRoot))
      throw Error(`Plugin directory does not exist: ${pluginRoot}` + (pluginId ? ` (${pluginId} \u2014 run /plugin to reinstall)` : ""));
    let rootPath = toHookPath(pluginRoot);
    if (command19 = command19.replace(/\$\{CLAUDE_PLUGIN_ROOT\}/g, () => rootPath), pluginId) {
      let dataPath = toHookPath(getPluginDataDir(pluginId));
      command19 = command19.replace(/\$\{CLAUDE_PLUGIN_DATA\}/g, () => dataPath);
    }
    if (pluginId)
      pluginOpts = loadPluginOptions(pluginId), command19 = substituteUserConfigVariables(command19, pluginOpts);
  }
  if (isWindows3 && !isPowerShell && command19.trim().match(/\.sh(\s|$|")/)) {
    if (!command19.trim().startsWith("bash "))
      command19 = `bash ${command19}`;
  }
  let finalCommand = !isPowerShell && process.env.CLAUDE_CODE_SHELL_PREFIX ? formatShellPrefixCommand(process.env.CLAUDE_CODE_SHELL_PREFIX, command19) : command19, hookTimeoutMs = hook.timeout ? hook.timeout * 1000 : TOOL_HOOK_EXECUTION_TIMEOUT_MS, envVars = {
    ...subprocessEnv(),
    CLAUDE_PROJECT_DIR: toHookPath(projectDir)
  };
  if (pluginRoot) {
    if (envVars.CLAUDE_PLUGIN_ROOT = toHookPath(pluginRoot), pluginId)
      envVars.CLAUDE_PLUGIN_DATA = toHookPath(getPluginDataDir(pluginId));
  }
  if (pluginOpts)
    for (let [key3, value] of Object.entries(pluginOpts)) {
      let envKey = key3.replace(/[^A-Za-z0-9_]/g, "_").toUpperCase();
      envVars[`CLAUDE_PLUGIN_OPTION_${envKey}`] = String(value);
    }
  if (skillRoot)
    envVars.CLAUDE_PLUGIN_ROOT = toHookPath(skillRoot);
  if (!isPowerShell && (hookEvent === "SessionStart" || hookEvent === "Setup" || hookEvent === "CwdChanged" || hookEvent === "FileChanged") && hookIndex !== void 0)
    envVars.CLAUDE_ENV_FILE = await getHookEnvFilePath(hookEvent, hookIndex);
  let hookCwd = getCwd(), safeCwd = await pathExists(hookCwd) ? hookCwd : getOriginalCwd();
  if (safeCwd !== hookCwd)
    logForDebugging(`Hooks: cwd ${hookCwd} not found, falling back to original cwd`, { level: "warn" });
  let child;
  if (shellType === "powershell") {
    let pwshPath = await getCachedPowerShellPath();
    if (!pwshPath)
      throw Error(`Hook "${hook.command}" has shell: 'powershell' but no PowerShell executable (pwsh or powershell) was found on PATH. Install PowerShell, or remove "shell": "powershell" to use bash.`);
    child = spawn11(pwshPath, buildPowerShellArgs(finalCommand), {
      env: envVars,
      cwd: safeCwd,
      windowsHide: !0
    });
  } else {
    let shell = isWindows3 ? findGitBashPath() : !0;
    child = spawn11(finalCommand, [], {
      env: envVars,
      cwd: safeCwd,
      shell,
      windowsHide: !0
    });
  }
  let hookTaskOutput = new TaskOutput(`hook_${child.pid}`, null), shellCommand = wrapSpawn(child, signal, hookTimeoutMs, hookTaskOutput), shellCommandTransferred = !1, stdinWritten = !1;
  if ((hook.async || hook.asyncRewake) && !forceSyncExecution) {
    let processId = `async_hook_${child.pid}`;
    if (logForDebugging(`Hooks: Config-based async hook, backgrounding process ${processId}`), child.stdin.write(jsonInput + `
`, "utf8"), child.stdin.end(), stdinWritten = !0, executeInBackground({
      processId,
      hookId,
      shellCommand,
      asyncResponse: { async: !0, asyncTimeout: hookTimeoutMs },
      hookEvent,
      hookName,
      command: hook.command,
      asyncRewake: hook.asyncRewake,
      pluginId
    }))
      return {
        stdout: "",
        stderr: "",
        output: "",
        status: 0,
        backgrounded: !0
      };
  }
  let stdout = "", stderr = "", output = "";
  child.stdout.setEncoding("utf8"), child.stderr.setEncoding("utf8");
  let initialResponseChecked = !1, asyncResolve = null, childIsAsyncPromise = new Promise((resolve45) => {
    asyncResolve = resolve45;
  }), processedPromptLines = /* @__PURE__ */ new Set, promptChain = Promise.resolve(), lineBuffer = "";
  child.stdout.on("data", (data) => {
    if (stdout += data, output += data, requestPrompt) {
      lineBuffer += data;
      let lines2 = lineBuffer.split(`
`);
      lineBuffer = lines2.pop() ?? "";
      for (let line of lines2) {
        let trimmed = line.trim();
        if (!trimmed)
          continue;
        try {
          let parsed = jsonParse(trimmed), validation = promptRequestSchema().safeParse(parsed);
          if (validation.success) {
            processedPromptLines.add(trimmed), logForDebugging(`Hooks: Detected prompt request from hook: ${trimmed}`);
            let promptReq = validation.data, reqPrompt = requestPrompt;
            promptChain = promptChain.then(async () => {
              try {
                let response7 = await reqPrompt(promptReq);
                child.stdin.write(jsonStringify(response7) + `
`, "utf8");
              } catch (err2) {
                logForDebugging(`Hooks: Prompt request handling failed: ${err2}`), child.stdin.destroy();
              }
            });
            continue;
          }
        } catch {}
      }
    }
    if (!initialResponseChecked) {
      let firstLine = firstLineOf(stdout).trim();
      if (!firstLine.includes("}"))
        return;
      initialResponseChecked = !0, logForDebugging(`Hooks: Checking first line for async: ${firstLine}`);
      try {
        let parsed = jsonParse(firstLine);
        if (logForDebugging(`Hooks: Parsed initial response: ${jsonStringify(parsed)}`), isAsyncHookJSONOutput(parsed) && !forceSyncExecution) {
          let processId = `async_hook_${child.pid}`;
          if (logForDebugging(`Hooks: Detected async hook, backgrounding process ${processId}`), executeInBackground({
            processId,
            hookId,
            shellCommand,
            asyncResponse: parsed,
            hookEvent,
            hookName,
            command: hook.command,
            pluginId
          }))
            shellCommandTransferred = !0, asyncResolve?.({
              stdout,
              stderr,
              output,
              status: 0
            });
        } else if (isAsyncHookJSONOutput(parsed) && forceSyncExecution)
          logForDebugging("Hooks: Detected async hook but forceSyncExecution is true, waiting for completion");
        else
          logForDebugging("Hooks: Initial response is not async, continuing normal processing");
      } catch (e) {
        logForDebugging(`Hooks: Failed to parse initial response as JSON: ${e}`);
      }
    }
  }), child.stderr.on("data", (data) => {
    stderr += data, output += data;
  });
  let stopProgressInterval = startHookProgressInterval({
    hookId,
    hookName,
    hookEvent,
    getOutput: async () => ({ stdout, stderr, output })
  }), stdoutEndPromise = new Promise((resolve45) => {
    child.stdout.on("end", () => resolve45());
  }), stderrEndPromise = new Promise((resolve45) => {
    child.stderr.on("end", () => resolve45());
  }), stdinWritePromise = stdinWritten ? Promise.resolve() : new Promise((resolve45, reject2) => {
    if (child.stdin.on("error", (err2) => {
      if (!requestPrompt)
        reject2(err2);
      else
        logForDebugging(`Hooks: stdin error during prompt flow (likely process exited): ${err2}`);
    }), child.stdin.write(jsonInput + `
`, "utf8"), !requestPrompt)
      child.stdin.end();
    resolve45();
  }), childErrorPromise = new Promise((_, reject2) => {
    child.on("error", reject2);
  }), childClosePromise = new Promise((resolve45) => {
    let exitCode = null;
    child.on("close", (code) => {
      exitCode = code ?? 1, Promise.all([stdoutEndPromise, stderrEndPromise]).then(() => {
        let finalStdout = processedPromptLines.size === 0 ? stdout : stdout.split(`
`).filter((line) => !processedPromptLines.has(line.trim())).join(`
`);
        resolve45({
          stdout: finalStdout,
          stderr,
          output,
          status: exitCode,
          aborted: signal.aborted
        });
      });
    });
  });
  try {
    if (shouldEmitDiag)
      logForDiagnosticsNoPII("info", "hook_spawn_started", {
        hook_event_name: hookEvent,
        index: hookIndex
      });
    await Promise.race([stdinWritePromise, childErrorPromise]);
    let result = await Promise.race([
      childIsAsyncPromise,
      childClosePromise,
      childErrorPromise
    ]);
    return await promptChain, diagExitCode = result.status, diagAborted = result.aborted ?? !1, result;
  } catch (error44) {
    let code = getErrnoCode(error44);
    if (diagExitCode = 1, code === "EPIPE") {
      logForDebugging("EPIPE error while writing to hook stdin (hook command likely closed early)");
      let errMsg = "Hook command closed stdin before hook input was fully written (EPIPE)";
      return {
        stdout: "",
        stderr: errMsg,
        output: errMsg,
        status: 1
      };
    } else if (code === "ABORT_ERR")
      return diagAborted = !0, {
        stdout: "",
        stderr: "Hook cancelled",
        output: "Hook cancelled",
        status: 1,
        aborted: !0
      };
    else {
      let errOutput = `Error occurred while executing hook command: ${errorMessage(error44)}`;
      return {
        stdout: "",
        stderr: errOutput,
        output: errOutput,
        status: 1
      };
    }
  } finally {
    if (shouldEmitDiag)
      logForDiagnosticsNoPII("info", "hook_spawn_completed", {
        hook_event_name: hookEvent,
        index: hookIndex,
        duration_ms: Date.now() - diagStartMs,
        exit_code: diagExitCode,
        aborted: diagAborted
      });
    if (stopProgressInterval(), !shellCommandTransferred)
      shellCommand.cleanup();
  }
}
function matchesPattern(matchQuery, matcher) {
  if (!matcher || matcher === "*")
    return !0;
  if (/^[a-zA-Z0-9_|]+$/.test(matcher)) {
    if (matcher.includes("|"))
      return matcher.split("|").map((p4) => normalizeLegacyToolName(p4.trim())).includes(matchQuery);
    return matchQuery === normalizeLegacyToolName(matcher);
  }
  try {
    let regex2 = new RegExp(matcher);
    if (regex2.test(matchQuery))
      return !0;
    for (let legacyName of getLegacyToolNames(matchQuery))
      if (regex2.test(legacyName))
        return !0;
    return !1;
  } catch {
    return logForDebugging(`Invalid regex pattern in hook matcher: ${matcher}`), !1;
  }
}
async function prepareIfConditionMatcher(hookInput, tools) {
  if (hookInput.hook_event_name !== "PreToolUse" && hookInput.hook_event_name !== "PostToolUse" && hookInput.hook_event_name !== "PostToolUseFailure" && hookInput.hook_event_name !== "PermissionRequest")
    return;
  let toolName = normalizeLegacyToolName(hookInput.tool_name), tool = tools && findToolByName(tools, hookInput.tool_name), input = tool?.inputSchema.safeParse(hookInput.tool_input), patternMatcher = input?.success && tool?.preparePermissionMatcher ? await tool.preparePermissionMatcher(input.data) : void 0;
  return (ifCondition) => {
    let parsed = permissionRuleValueFromString(ifCondition);
    if (normalizeLegacyToolName(parsed.toolName) !== toolName)
      return !1;
    if (!parsed.ruleContent)
      return !0;
    return patternMatcher ? patternMatcher(parsed.ruleContent) : !1;
  };
}
function isInternalHook(matched) {
  return matched.hook.type === "callback" && matched.hook.internal === !0;
}
function hookDedupKey(m4, payload) {
  return `${m4.pluginRoot ?? m4.skillRoot ?? ""}\x00${payload}`;
}
function getPluginHookCounts(hooks2) {
  let pluginHooks = hooks2.filter((h4) => h4.pluginId);
  if (pluginHooks.length === 0)
    return;
  let counts = {};
  for (let h4 of pluginHooks) {
    let atIndex = h4.pluginId.lastIndexOf("@"), key3 = atIndex > 0 && ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(h4.pluginId.slice(atIndex + 1)) ? h4.pluginId : "third-party";
    counts[key3] = (counts[key3] || 0) + 1;
  }
  return counts;
}
function getHookTypeCounts(hooks2) {
  let counts = {};
  for (let h4 of hooks2)
    counts[h4.hook.type] = (counts[h4.hook.type] || 0) + 1;
  return counts;
}
function getHooksConfig(appState, sessionId, hookEvent) {
  let hooks2 = [...getHooksConfigFromSnapshot()?.[hookEvent] ?? []], managedOnly = shouldAllowManagedHooksOnly(), registeredHooks = getRegisteredHooks()?.[hookEvent];
  if (registeredHooks)
    for (let matcher of registeredHooks) {
      if (managedOnly && "pluginRoot" in matcher)
        continue;
      hooks2.push(matcher);
    }
  if (!managedOnly && appState !== void 0) {
    let sessionHooks = getSessionHooks(appState, sessionId, hookEvent).get(hookEvent);
    if (sessionHooks)
      for (let matcher of sessionHooks)
        hooks2.push(matcher);
    let sessionFunctionHooks = getSessionFunctionHooks(appState, sessionId, hookEvent).get(hookEvent);
    if (sessionFunctionHooks)
      for (let matcher of sessionFunctionHooks)
        hooks2.push(matcher);
  }
  return hooks2;
}
function hasHookForEvent(hookEvent, appState, sessionId) {
  let snap = getHooksConfigFromSnapshot()?.[hookEvent];
  if (snap && snap.length > 0)
    return !0;
  let reg = getRegisteredHooks()?.[hookEvent];
  if (reg && reg.length > 0)
    return !0;
  if (appState?.sessionHooks.get(sessionId)?.hooks[hookEvent])
    return !0;
  return !1;
}
async function getMatchingHooks(appState, sessionId, hookEvent, hookInput, tools) {
  try {
    let hookMatchers = getHooksConfig(appState, sessionId, hookEvent), matchQuery = void 0;
    switch (hookInput.hook_event_name) {
      case "PreToolUse":
      case "PostToolUse":
      case "PostToolUseFailure":
      case "PermissionRequest":
      case "PermissionDenied":
        matchQuery = hookInput.tool_name;
        break;
      case "SessionStart":
        matchQuery = hookInput.source;
        break;
      case "Setup":
        matchQuery = hookInput.trigger;
        break;
      case "PreCompact":
      case "PostCompact":
        matchQuery = hookInput.trigger;
        break;
      case "Notification":
        matchQuery = hookInput.notification_type;
        break;
      case "SessionEnd":
        matchQuery = hookInput.reason;
        break;
      case "StopFailure":
        matchQuery = hookInput.error;
        break;
      case "SubagentStart":
        matchQuery = hookInput.agent_type;
        break;
      case "SubagentStop":
        matchQuery = hookInput.agent_type;
        break;
      case "TeammateIdle":
      case "TaskCreated":
      case "TaskCompleted":
        break;
      case "Elicitation":
        matchQuery = hookInput.mcp_server_name;
        break;
      case "ElicitationResult":
        matchQuery = hookInput.mcp_server_name;
        break;
      case "ConfigChange":
        matchQuery = hookInput.source;
        break;
      case "InstructionsLoaded":
        matchQuery = hookInput.load_reason;
        break;
      case "FileChanged":
        matchQuery = basename41(hookInput.file_path);
        break;
      default:
        break;
    }
    logForDebugging(`Getting matching hook commands for ${hookEvent} with query: ${matchQuery}`, { level: "verbose" }), logForDebugging(`Found ${hookMatchers.length} hook matchers in settings`, {
      level: "verbose"
    });
    let matchedHooks = (matchQuery ? hookMatchers.filter((matcher) => !matcher.matcher || matchesPattern(matchQuery, matcher.matcher)) : hookMatchers).flatMap((matcher) => {
      let pluginRoot = "pluginRoot" in matcher ? matcher.pluginRoot : void 0, pluginId = "pluginId" in matcher ? matcher.pluginId : void 0, skillRoot = "skillRoot" in matcher ? matcher.skillRoot : void 0, hookSource = pluginRoot ? "pluginName" in matcher ? `plugin:${matcher.pluginName}` : "plugin" : skillRoot ? "skillName" in matcher ? `skill:${matcher.skillName}` : "skill" : "settings";
      return matcher.hooks.map((hook) => ({
        hook,
        pluginRoot,
        pluginId,
        skillRoot,
        hookSource
      }));
    });
    if (matchedHooks.every((m4) => m4.hook.type === "callback" || m4.hook.type === "function"))
      return matchedHooks;
    let getIfCondition = (hook) => hook.if ?? "", uniqueCommandHooks = Array.from(new Map(matchedHooks.filter((m4) => m4.hook.type === "command").map((m4) => [
      hookDedupKey(m4, `${m4.hook.shell ?? DEFAULT_HOOK_SHELL}\x00${m4.hook.command}\x00${getIfCondition(m4.hook)}`),
      m4
    ])).values()), uniquePromptHooks = Array.from(new Map(matchedHooks.filter((m4) => m4.hook.type === "prompt").map((m4) => [
      hookDedupKey(m4, `${m4.hook.prompt}\x00${getIfCondition(m4.hook)}`),
      m4
    ])).values()), uniqueAgentHooks = Array.from(new Map(matchedHooks.filter((m4) => m4.hook.type === "agent").map((m4) => [
      hookDedupKey(m4, `${m4.hook.prompt}\x00${getIfCondition(m4.hook)}`),
      m4
    ])).values()), uniqueHttpHooks = Array.from(new Map(matchedHooks.filter((m4) => m4.hook.type === "http").map((m4) => [
      hookDedupKey(m4, `${m4.hook.url}\x00${getIfCondition(m4.hook)}`),
      m4
    ])).values()), callbackHooks = matchedHooks.filter((m4) => m4.hook.type === "callback"), functionHooks = matchedHooks.filter((m4) => m4.hook.type === "function"), uniqueHooks = [
      ...uniqueCommandHooks,
      ...uniquePromptHooks,
      ...uniqueAgentHooks,
      ...uniqueHttpHooks,
      ...callbackHooks,
      ...functionHooks
    ], ifMatcher = uniqueHooks.some((h4) => (h4.hook.type === "command" || h4.hook.type === "prompt" || h4.hook.type === "agent" || h4.hook.type === "http") && h4.hook.if) ? await prepareIfConditionMatcher(hookInput, tools) : void 0, ifFilteredHooks = uniqueHooks.filter((h4) => {
      if (h4.hook.type !== "command" && h4.hook.type !== "prompt" && h4.hook.type !== "agent" && h4.hook.type !== "http")
        return !0;
      let ifCondition = h4.hook.if;
      if (!ifCondition)
        return !0;
      if (!ifMatcher)
        return logForDebugging(`Hook if condition "${ifCondition}" cannot be evaluated for non-tool event ${hookInput.hook_event_name}`), !1;
      if (ifMatcher(ifCondition))
        return !0;
      return logForDebugging(`Skipping hook due to if condition "${ifCondition}" not matching`), !1;
    }), filteredHooks = hookEvent === "SessionStart" || hookEvent === "Setup" ? ifFilteredHooks.filter((h4) => {
      if (h4.hook.type === "http")
        return logForDebugging(`Skipping HTTP hook ${h4.hook.url} \u2014 HTTP hooks are not supported for ${hookEvent}`), !1;
      return !0;
    }) : ifFilteredHooks;
    return logForDebugging(`Matched ${filteredHooks.length} unique hooks for query "${matchQuery || "no match query"}" (${matchedHooks.length} before deduplication)`, { level: "verbose" }), filteredHooks;
  } catch {
    return [];
  }
}
function getPreToolHookBlockingMessage(hookName, blockingError) {
  return `${hookName} hook error: ${blockingError.blockingError}`;
}
function getStopHookMessage(blockingError) {
  return `Stop hook feedback:
${blockingError.blockingError}`;
}
function getTeammateIdleHookMessage(blockingError) {
  return `TeammateIdle hook feedback:
${blockingError.blockingError}`;
}
function getTaskCreatedHookMessage(blockingError) {
  return `TaskCreated hook feedback:
${blockingError.blockingError}`;
}
function getTaskCompletedHookMessage(blockingError) {
  return `TaskCompleted hook feedback:
${blockingError.blockingError}`;
}
function getUserPromptSubmitHookBlockingMessage(blockingError) {
  return `UserPromptSubmit operation blocked by hook:
${blockingError.blockingError}`;
}
async function* executeHooks({
  hookInput,
  toolUseID,
  matchQuery,
  signal,
  timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
  toolUseContext,
  messages,
  forceSyncExecution,
  requestPrompt,
  toolInputSummary
}) {
  if (shouldDisableAllHooksIncludingManaged())
    return;
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return;
  let hookEvent = hookInput.hook_event_name, hookName = matchQuery ? `${hookEvent}:${matchQuery}` : hookEvent, boundRequestPrompt = requestPrompt?.(hookName, toolInputSummary);
  if (shouldSkipHookDueToTrust()) {
    logForDebugging(`Skipping ${hookName} hook execution - workspace trust not accepted`);
    return;
  }
  let appState = toolUseContext ? toolUseContext.getAppState() : void 0, sessionId = toolUseContext?.agentId ?? getSessionId(), matchingHooks = await getMatchingHooks(appState, sessionId, hookEvent, hookInput, toolUseContext?.options?.tools);
  if (matchingHooks.length === 0)
    return;
  if (signal?.aborted)
    return;
  let userHooks = matchingHooks.filter((h4) => !isInternalHook(h4));
  if (userHooks.length > 0) {
    let pluginHookCounts = getPluginHookCounts(userHooks), hookTypeCounts = getHookTypeCounts(userHooks);
    logEvent("tengu_run_hook", {
      hookName,
      numCommands: userHooks.length,
      hookTypeCounts: jsonStringify(hookTypeCounts),
      ...pluginHookCounts && {
        pluginHookCounts: jsonStringify(pluginHookCounts)
      }
    });
  } else {
    let batchStartTime2 = Date.now(), context7 = toolUseContext ? {
      getAppState: toolUseContext.getAppState,
      updateAttributionState: toolUseContext.updateAttributionState
    } : void 0;
    for (let [i5, { hook }] of matchingHooks.entries())
      if (hook.type === "callback")
        await hook.callback(hookInput, toolUseID, signal, i5, context7);
    let totalDurationMs2 = Date.now() - batchStartTime2;
    getStatsStore()?.observe("hook_duration_ms", totalDurationMs2), addToTurnHookDuration(totalDurationMs2), logEvent("tengu_repl_hook_finished", {
      hookName,
      numCommands: matchingHooks.length,
      numSuccess: matchingHooks.length,
      numBlocking: 0,
      numNonBlockingError: 0,
      numCancelled: 0,
      totalDurationMs: totalDurationMs2
    });
    return;
  }
  let hookDefinitionsJson = isBetaTracingEnabled() ? jsonStringify(getHookDefinitionsForTelemetry(matchingHooks)) : "[]";
  if (isBetaTracingEnabled())
    logOTelEvent("hook_execution_start", {
      hook_event: hookEvent,
      hook_name: hookName,
      num_hooks: String(matchingHooks.length),
      managed_only: String(shouldAllowManagedHooksOnly()),
      hook_definitions: hookDefinitionsJson,
      hook_source: shouldAllowManagedHooksOnly() ? "policySettings" : "merged"
    });
  let hookSpan = startHookSpan(hookEvent, hookName, matchingHooks.length, hookDefinitionsJson);
  for (let { hook } of matchingHooks)
    yield {
      message: {
        type: "progress",
        data: {
          type: "hook_progress",
          hookEvent,
          hookName,
          command: getHookDisplayText(hook),
          ...hook.type === "prompt" && { promptText: hook.prompt },
          ..."statusMessage" in hook && hook.statusMessage != null && {
            statusMessage: hook.statusMessage
          }
        },
        parentToolUseID: toolUseID,
        toolUseID,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        uuid: randomUUID29()
      }
    };
  let batchStartTime = Date.now(), jsonInputResult;
  function getJsonInput() {
    if (jsonInputResult !== void 0)
      return jsonInputResult;
    try {
      return jsonInputResult = { ok: !0, value: jsonStringify(hookInput) };
    } catch (error44) {
      return logError2(Error(`Failed to stringify hook ${hookName} input`, { cause: error44 })), jsonInputResult = { ok: !1, error: error44 };
    }
  }
  let hookPromises = matchingHooks.map(async function* ({ hook, pluginRoot, pluginId, skillRoot }, hookIndex) {
    if (hook.type === "callback") {
      let callbackTimeoutMs = hook.timeout ? hook.timeout * 1000 : timeoutMs, { signal: abortSignal2, cleanup: cleanup2 } = createCombinedAbortSignal(signal, { timeoutMs: callbackTimeoutMs });
      yield executeHookCallback({
        toolUseID,
        hook,
        hookEvent,
        hookInput,
        signal: abortSignal2,
        hookIndex,
        toolUseContext
      }).finally(cleanup2);
      return;
    }
    if (hook.type === "function") {
      if (!messages) {
        yield {
          message: createAttachmentMessage({
            type: "hook_error_during_execution",
            hookName,
            toolUseID,
            hookEvent,
            content: "Messages not provided for function hook"
          }),
          outcome: "non_blocking_error",
          hook
        };
        return;
      }
      yield executeFunctionHook({
        hook,
        messages,
        hookName,
        toolUseID,
        hookEvent,
        timeoutMs,
        signal
      });
      return;
    }
    let commandTimeoutMs = hook.timeout ? hook.timeout * 1000 : timeoutMs, { signal: abortSignal, cleanup } = createCombinedAbortSignal(signal, {
      timeoutMs: commandTimeoutMs
    }), hookId = randomUUID29(), hookStartMs = Date.now(), hookCommand = getHookDisplayText(hook);
    try {
      let jsonInputRes = getJsonInput();
      if (!jsonInputRes.ok) {
        yield {
          message: createAttachmentMessage({
            type: "hook_error_during_execution",
            hookName,
            toolUseID,
            hookEvent,
            content: `Failed to prepare hook input: ${errorMessage(jsonInputRes.error)}`,
            command: hookCommand,
            durationMs: Date.now() - hookStartMs
          }),
          outcome: "non_blocking_error",
          hook
        }, cleanup();
        return;
      }
      let jsonInput = jsonInputRes.value;
      if (hook.type === "prompt") {
        if (!toolUseContext)
          throw Error("ToolUseContext is required for prompt hooks. This is a bug.");
        let promptResult = await execPromptHook(hook, hookName, hookEvent, jsonInput, abortSignal, toolUseContext, messages, toolUseID);
        if (promptResult.message?.type === "attachment") {
          let att = promptResult.message.attachment;
          if (att.type === "hook_success" || att.type === "hook_non_blocking_error")
            att.command = hookCommand, att.durationMs = Date.now() - hookStartMs;
        }
        yield promptResult, cleanup?.();
        return;
      }
      if (hook.type === "agent") {
        if (!toolUseContext)
          throw Error("ToolUseContext is required for agent hooks. This is a bug.");
        if (!messages)
          throw Error("Messages are required for agent hooks. This is a bug.");
        let agentResult = await execAgentHook(hook, hookName, hookEvent, jsonInput, abortSignal, toolUseContext, toolUseID, messages, "agent_type" in hookInput ? hookInput.agent_type : void 0);
        if (agentResult.message?.type === "attachment") {
          let att = agentResult.message.attachment;
          if (att.type === "hook_success" || att.type === "hook_non_blocking_error")
            att.command = hookCommand, att.durationMs = Date.now() - hookStartMs;
        }
        yield agentResult, cleanup?.();
        return;
      }
      if (hook.type === "http") {
        emitHookStarted(hookId, hookName, hookEvent);
        let httpResult = await execHttpHook(hook, hookEvent, jsonInput, signal);
        if (cleanup?.(), httpResult.aborted) {
          emitHookResponse({
            hookId,
            hookName,
            hookEvent,
            output: "Hook cancelled",
            stdout: "",
            stderr: "",
            exitCode: void 0,
            outcome: "cancelled"
          }), yield {
            message: createAttachmentMessage({
              type: "hook_cancelled",
              hookName,
              toolUseID,
              hookEvent
            }),
            outcome: "cancelled",
            hook
          };
          return;
        }
        if (httpResult.error || !httpResult.ok) {
          let stderr = httpResult.error || `HTTP ${httpResult.statusCode} from ${hook.url}`;
          emitHookResponse({
            hookId,
            hookName,
            hookEvent,
            output: stderr,
            stdout: "",
            stderr,
            exitCode: httpResult.statusCode,
            outcome: "error"
          }), yield {
            message: createAttachmentMessage({
              type: "hook_non_blocking_error",
              hookName,
              toolUseID,
              hookEvent,
              stderr,
              stdout: "",
              exitCode: httpResult.statusCode ?? 0
            }),
            outcome: "non_blocking_error",
            hook
          };
          return;
        }
        let { json: httpJson, validationError: httpValidationError } = parseHttpHookOutput(httpResult.body);
        if (httpValidationError) {
          emitHookResponse({
            hookId,
            hookName,
            hookEvent,
            output: httpResult.body,
            stdout: httpResult.body,
            stderr: `JSON validation failed: ${httpValidationError}`,
            exitCode: httpResult.statusCode,
            outcome: "error"
          }), yield {
            message: createAttachmentMessage({
              type: "hook_non_blocking_error",
              hookName,
              toolUseID,
              hookEvent,
              stderr: `JSON validation failed: ${httpValidationError}`,
              stdout: httpResult.body,
              exitCode: httpResult.statusCode ?? 0
            }),
            outcome: "non_blocking_error",
            hook
          };
          return;
        }
        if (httpJson && isAsyncHookJSONOutput(httpJson)) {
          emitHookResponse({
            hookId,
            hookName,
            hookEvent,
            output: httpResult.body,
            stdout: httpResult.body,
            stderr: "",
            exitCode: httpResult.statusCode,
            outcome: "success"
          }), yield {
            outcome: "success",
            hook
          };
          return;
        }
        if (httpJson) {
          let processed = processHookJSONOutput({
            json: httpJson,
            command: hook.url,
            hookName,
            toolUseID,
            hookEvent,
            expectedHookEvent: hookEvent,
            stdout: httpResult.body,
            stderr: "",
            exitCode: httpResult.statusCode
          });
          emitHookResponse({
            hookId,
            hookName,
            hookEvent,
            output: httpResult.body,
            stdout: httpResult.body,
            stderr: "",
            exitCode: httpResult.statusCode,
            outcome: "success"
          }), yield {
            ...processed,
            outcome: "success",
            hook
          };
          return;
        }
        return;
      }
      emitHookStarted(hookId, hookName, hookEvent);
      let result = await execCommandHook(hook, hookEvent, hookName, jsonInput, abortSignal, hookId, hookIndex, pluginRoot, pluginId, skillRoot, forceSyncExecution, boundRequestPrompt);
      cleanup?.();
      let durationMs = Date.now() - hookStartMs;
      if (result.backgrounded) {
        yield {
          outcome: "success",
          hook
        };
        return;
      }
      if (result.aborted) {
        emitHookResponse({
          hookId,
          hookName,
          hookEvent,
          output: result.output,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.status,
          outcome: "cancelled"
        }), yield {
          message: createAttachmentMessage({
            type: "hook_cancelled",
            hookName,
            toolUseID,
            hookEvent,
            command: hookCommand,
            durationMs
          }),
          outcome: "cancelled",
          hook
        };
        return;
      }
      let { json: json2, plainText, validationError } = parseHookOutput(result.stdout);
      if (validationError) {
        emitHookResponse({
          hookId,
          hookName,
          hookEvent,
          output: result.output,
          stdout: result.stdout,
          stderr: `JSON validation failed: ${validationError}`,
          exitCode: 1,
          outcome: "error"
        }), yield {
          message: createAttachmentMessage({
            type: "hook_non_blocking_error",
            hookName,
            toolUseID,
            hookEvent,
            stderr: `JSON validation failed: ${validationError}`,
            stdout: result.stdout,
            exitCode: 1,
            command: hookCommand,
            durationMs
          }),
          outcome: "non_blocking_error",
          hook
        };
        return;
      }
      if (json2) {
        if (isAsyncHookJSONOutput(json2)) {
          yield {
            outcome: "success",
            hook
          };
          return;
        }
        let processed = processHookJSONOutput({
          json: json2,
          command: hookCommand,
          hookName,
          toolUseID,
          hookEvent,
          expectedHookEvent: hookEvent,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.status,
          durationMs
        });
        if (isSyncHookJSONOutput(json2) && !json2.suppressOutput && plainText && result.status === 0) {
          let content = `${source_default.bold(hookName)} completed`;
          emitHookResponse({
            hookId,
            hookName,
            hookEvent,
            output: result.output,
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.status,
            outcome: "success"
          }), yield {
            ...processed,
            message: processed.message || createAttachmentMessage({
              type: "hook_success",
              hookName,
              toolUseID,
              hookEvent,
              content,
              stdout: result.stdout,
              stderr: result.stderr,
              exitCode: result.status,
              command: hookCommand,
              durationMs
            }),
            outcome: "success",
            hook
          };
          return;
        }
        emitHookResponse({
          hookId,
          hookName,
          hookEvent,
          output: result.output,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.status,
          outcome: result.status === 0 ? "success" : "error"
        }), yield {
          ...processed,
          outcome: "success",
          hook
        };
        return;
      }
      if (result.status === 0) {
        emitHookResponse({
          hookId,
          hookName,
          hookEvent,
          output: result.output,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.status,
          outcome: "success"
        }), yield {
          message: createAttachmentMessage({
            type: "hook_success",
            hookName,
            toolUseID,
            hookEvent,
            content: result.stdout.trim(),
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.status,
            command: hookCommand,
            durationMs
          }),
          outcome: "success",
          hook
        };
        return;
      }
      if (result.status === 2) {
        emitHookResponse({
          hookId,
          hookName,
          hookEvent,
          output: result.output,
          stdout: result.stdout,
          stderr: result.stderr,
          exitCode: result.status,
          outcome: "error"
        }), yield {
          blockingError: {
            blockingError: `[${hook.command}]: ${result.stderr || "No stderr output"}`,
            command: hook.command
          },
          outcome: "blocking",
          hook
        };
        return;
      }
      emitHookResponse({
        hookId,
        hookName,
        hookEvent,
        output: result.output,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.status,
        outcome: "error"
      }), yield {
        message: createAttachmentMessage({
          type: "hook_non_blocking_error",
          hookName,
          toolUseID,
          hookEvent,
          stderr: `Failed with non-blocking status code: ${result.stderr.trim() || "No stderr output"}`,
          stdout: result.stdout,
          exitCode: result.status,
          command: hookCommand,
          durationMs
        }),
        outcome: "non_blocking_error",
        hook
      };
      return;
    } catch (error44) {
      cleanup?.();
      let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
      emitHookResponse({
        hookId,
        hookName,
        hookEvent,
        output: `Failed to run: ${errorMessage4}`,
        stdout: "",
        stderr: `Failed to run: ${errorMessage4}`,
        exitCode: 1,
        outcome: "error"
      }), yield {
        message: createAttachmentMessage({
          type: "hook_non_blocking_error",
          hookName,
          toolUseID,
          hookEvent,
          stderr: `Failed to run: ${errorMessage4}`,
          stdout: "",
          exitCode: 1,
          command: hookCommand,
          durationMs: Date.now() - hookStartMs
        }),
        outcome: "non_blocking_error",
        hook
      };
      return;
    }
  }), outcomes = {
    success: 0,
    blocking: 0,
    non_blocking_error: 0,
    cancelled: 0
  }, permissionBehavior;
  for await (let result of all3(hookPromises)) {
    if (outcomes[result.outcome]++, result.preventContinuation)
      logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) requested preventContinuation`), yield {
        preventContinuation: !0,
        stopReason: result.stopReason
      };
    if (result.blockingError)
      yield {
        blockingError: result.blockingError
      };
    if (result.message)
      yield { message: result.message };
    if (result.systemMessage)
      yield {
        message: createAttachmentMessage({
          type: "hook_system_message",
          content: result.systemMessage,
          hookName,
          toolUseID,
          hookEvent
        })
      };
    if (result.additionalContext)
      logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) provided additionalContext (${result.additionalContext.length} chars)`), yield {
        additionalContexts: [result.additionalContext]
      };
    if (result.initialUserMessage)
      logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) provided initialUserMessage (${result.initialUserMessage.length} chars)`), yield {
        initialUserMessage: result.initialUserMessage
      };
    if (result.watchPaths && result.watchPaths.length > 0)
      logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) provided ${result.watchPaths.length} watchPaths`), yield {
        watchPaths: result.watchPaths
      };
    if (result.updatedMCPToolOutput)
      logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) replaced MCP tool output`), yield {
        updatedMCPToolOutput: result.updatedMCPToolOutput
      };
    if (result.permissionBehavior)
      switch (logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) returned permissionDecision: ${result.permissionBehavior}${result.hookPermissionDecisionReason ? ` (reason: ${result.hookPermissionDecisionReason})` : ""}`), result.permissionBehavior) {
        case "deny":
          permissionBehavior = "deny";
          break;
        case "ask":
          if (permissionBehavior !== "deny")
            permissionBehavior = "ask";
          break;
        case "allow":
          if (!permissionBehavior)
            permissionBehavior = "allow";
          break;
        case "passthrough":
          break;
      }
    if (permissionBehavior !== void 0) {
      let updatedInput = result.updatedInput && (result.permissionBehavior === "allow" || result.permissionBehavior === "ask") ? result.updatedInput : void 0;
      if (updatedInput)
        logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) modified tool input keys: [${Object.keys(updatedInput).join(", ")}]`);
      yield {
        permissionBehavior,
        hookPermissionDecisionReason: result.hookPermissionDecisionReason,
        hookSource: matchingHooks.find((m4) => m4.hook === result.hook)?.hookSource,
        updatedInput
      };
    }
    if (result.updatedInput && result.permissionBehavior === void 0)
      logForDebugging(`Hook ${hookEvent} (${getHookDisplayText(result.hook)}) modified tool input keys: [${Object.keys(result.updatedInput).join(", ")}]`), yield {
        updatedInput: result.updatedInput
      };
    if (result.permissionRequestResult)
      yield {
        permissionRequestResult: result.permissionRequestResult
      };
    if (result.retry)
      yield {
        retry: result.retry
      };
    if (result.elicitationResponse)
      yield {
        elicitationResponse: result.elicitationResponse
      };
    if (result.elicitationResultResponse)
      yield {
        elicitationResultResponse: result.elicitationResultResponse
      };
    if (appState && result.hook.type !== "callback") {
      let sessionId2 = getSessionId(), hookEntry = getSessionHookCallback(appState, sessionId2, hookEvent, matchQuery ?? "", result.hook);
      if (hookEntry?.onHookSuccess && result.outcome === "success")
        try {
          hookEntry.onHookSuccess(result.hook, result);
        } catch (error44) {
          logError2(Error("Session hook success callback failed", { cause: error44 }));
        }
    }
  }
  let totalDurationMs = Date.now() - batchStartTime;
  if (getStatsStore()?.observe("hook_duration_ms", totalDurationMs), addToTurnHookDuration(totalDurationMs), logEvent("tengu_repl_hook_finished", {
    hookName,
    numCommands: matchingHooks.length,
    numSuccess: outcomes.success,
    numBlocking: outcomes.blocking,
    numNonBlockingError: outcomes.non_blocking_error,
    numCancelled: outcomes.cancelled,
    totalDurationMs
  }), isBetaTracingEnabled()) {
    let hookDefinitionsComplete = getHookDefinitionsForTelemetry(matchingHooks);
    logOTelEvent("hook_execution_complete", {
      hook_event: hookEvent,
      hook_name: hookName,
      num_hooks: String(matchingHooks.length),
      num_success: String(outcomes.success),
      num_blocking: String(outcomes.blocking),
      num_non_blocking_error: String(outcomes.non_blocking_error),
      num_cancelled: String(outcomes.cancelled),
      managed_only: String(shouldAllowManagedHooksOnly()),
      hook_definitions: jsonStringify(hookDefinitionsComplete),
      hook_source: shouldAllowManagedHooksOnly() ? "policySettings" : "merged"
    });
  }
  endHookSpan(hookSpan, {
    numSuccess: outcomes.success,
    numBlocking: outcomes.blocking,
    numNonBlockingError: outcomes.non_blocking_error,
    numCancelled: outcomes.cancelled
  });
}
function hasBlockingResult(results) {
  return results.some((r4) => r4.blocked);
}
async function executeHooksOutsideREPL({
  getAppState,
  hookInput,
  matchQuery,
  signal,
  timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS
}) {
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE))
    return [];
  let hookEvent = hookInput.hook_event_name, hookName = matchQuery ? `${hookEvent}:${matchQuery}` : hookEvent;
  if (shouldDisableAllHooksIncludingManaged())
    return logForDebugging(`Skipping hooks for ${hookName} due to 'disableAllHooks' managed setting`), [];
  if (shouldSkipHookDueToTrust())
    return logForDebugging(`Skipping ${hookName} hook execution - workspace trust not accepted`), [];
  let appState = getAppState ? getAppState() : void 0, sessionId = getSessionId(), matchingHooks = await getMatchingHooks(appState, sessionId, hookEvent, hookInput);
  if (matchingHooks.length === 0)
    return [];
  if (signal?.aborted)
    return [];
  let userHooks = matchingHooks.filter((h4) => !isInternalHook(h4));
  if (userHooks.length > 0) {
    let pluginHookCounts = getPluginHookCounts(userHooks), hookTypeCounts = getHookTypeCounts(userHooks);
    logEvent("tengu_run_hook", {
      hookName,
      numCommands: userHooks.length,
      hookTypeCounts: jsonStringify(hookTypeCounts),
      ...pluginHookCounts && {
        pluginHookCounts: jsonStringify(pluginHookCounts)
      }
    });
  }
  let jsonInput;
  try {
    jsonInput = jsonStringify(hookInput);
  } catch (error44) {
    return logError2(error44), [];
  }
  let hookPromises = matchingHooks.map(async ({ hook, pluginRoot, pluginId }, hookIndex) => {
    if (hook.type === "callback") {
      let callbackTimeoutMs = hook.timeout ? hook.timeout * 1000 : timeoutMs, { signal: abortSignal2, cleanup: cleanup2 } = createCombinedAbortSignal(signal, { timeoutMs: callbackTimeoutMs });
      try {
        let toolUseID = randomUUID29(), json2 = await hook.callback(hookInput, toolUseID, abortSignal2, hookIndex);
        if (cleanup2?.(), isAsyncHookJSONOutput(json2))
          return logForDebugging(`${hookName} [callback] returned async response, returning empty output`), {
            command: "callback",
            succeeded: !0,
            output: "",
            blocked: !1
          };
        let output = hookEvent === "WorktreeCreate" && isSyncHookJSONOutput(json2) && json2.hookSpecificOutput?.hookEventName === "WorktreeCreate" ? json2.hookSpecificOutput.worktreePath : json2.systemMessage || "", blocked = isSyncHookJSONOutput(json2) && json2.decision === "block";
        return logForDebugging(`${hookName} [callback] completed successfully`), {
          command: "callback",
          succeeded: !0,
          output,
          blocked
        };
      } catch (error44) {
        cleanup2?.();
        let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
        return logForDebugging(`${hookName} [callback] failed to run: ${errorMessage4}`, { level: "error" }), {
          command: "callback",
          succeeded: !1,
          output: errorMessage4,
          blocked: !1
        };
      }
    }
    if (hook.type === "prompt")
      return {
        command: hook.prompt,
        succeeded: !1,
        output: "Prompt stop hooks are not yet supported outside REPL",
        blocked: !1
      };
    if (hook.type === "agent")
      return {
        command: hook.prompt,
        succeeded: !1,
        output: "Agent stop hooks are not yet supported outside REPL",
        blocked: !1
      };
    if (hook.type === "function")
      return logError2(Error(`Function hook reached executeHooksOutsideREPL for ${hookEvent}. Function hooks should only be used in REPL context (Stop hooks).`)), {
        command: "function",
        succeeded: !1,
        output: "Internal error: function hook executed outside REPL context",
        blocked: !1
      };
    if (hook.type === "http")
      try {
        let httpResult = await execHttpHook(hook, hookEvent, jsonInput, signal);
        if (httpResult.aborted)
          return logForDebugging(`${hookName} [${hook.url}] cancelled`), {
            command: hook.url,
            succeeded: !1,
            output: "Hook cancelled",
            blocked: !1
          };
        if (httpResult.error || !httpResult.ok) {
          let errMsg = httpResult.error || `HTTP ${httpResult.statusCode} from ${hook.url}`;
          return logForDebugging(`${hookName} [${hook.url}] failed: ${errMsg}`, {
            level: "error"
          }), {
            command: hook.url,
            succeeded: !1,
            output: errMsg,
            blocked: !1
          };
        }
        let { json: httpJson, validationError: httpValidationError } = parseHttpHookOutput(httpResult.body);
        if (httpValidationError)
          throw Error(httpValidationError);
        if (httpJson && !isAsyncHookJSONOutput(httpJson))
          logForDebugging(`Parsed JSON output from HTTP hook: ${jsonStringify(httpJson)}`, { level: "verbose" });
        let jsonBlocked = httpJson && !isAsyncHookJSONOutput(httpJson) && isSyncHookJSONOutput(httpJson) && httpJson.decision === "block", output = hookEvent === "WorktreeCreate" ? httpJson && isSyncHookJSONOutput(httpJson) && httpJson.hookSpecificOutput?.hookEventName === "WorktreeCreate" ? httpJson.hookSpecificOutput.worktreePath : "" : httpResult.body;
        return {
          command: hook.url,
          succeeded: !0,
          output,
          blocked: !!jsonBlocked
        };
      } catch (error44) {
        let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
        return logForDebugging(`${hookName} [${hook.url}] failed to run: ${errorMessage4}`, { level: "error" }), {
          command: hook.url,
          succeeded: !1,
          output: errorMessage4,
          blocked: !1
        };
      }
    let commandTimeoutMs = hook.timeout ? hook.timeout * 1000 : timeoutMs, { signal: abortSignal, cleanup } = createCombinedAbortSignal(signal, { timeoutMs: commandTimeoutMs });
    try {
      let result = await execCommandHook(hook, hookEvent, hookName, jsonInput, abortSignal, randomUUID29(), hookIndex, pluginRoot, pluginId);
      if (cleanup?.(), result.aborted)
        return logForDebugging(`${hookName} [${hook.command}] cancelled`), {
          command: hook.command,
          succeeded: !1,
          output: "Hook cancelled",
          blocked: !1
        };
      logForDebugging(`${hookName} [${hook.command}] completed with status ${result.status}`);
      let { json: json2, validationError } = parseHookOutput(result.stdout);
      if (validationError)
        throw Error(validationError);
      if (json2 && !isAsyncHookJSONOutput(json2))
        logForDebugging(`Parsed JSON output from hook: ${jsonStringify(json2)}`, { level: "verbose" });
      let jsonBlocked = json2 && !isAsyncHookJSONOutput(json2) && isSyncHookJSONOutput(json2) && json2.decision === "block", blocked = result.status === 2 || !!jsonBlocked, output = result.status === 0 ? result.stdout || "" : result.stderr || "", watchPaths = json2 && isSyncHookJSONOutput(json2) && json2.hookSpecificOutput && "watchPaths" in json2.hookSpecificOutput ? json2.hookSpecificOutput.watchPaths : void 0, systemMessage = json2 && isSyncHookJSONOutput(json2) ? json2.systemMessage : void 0;
      return {
        command: hook.command,
        succeeded: result.status === 0,
        output,
        blocked,
        watchPaths,
        systemMessage
      };
    } catch (error44) {
      cleanup?.();
      let errorMessage4 = error44 instanceof Error ? error44.message : String(error44);
      return logForDebugging(`${hookName} [${hook.command}] failed to run: ${errorMessage4}`, { level: "error" }), {
        command: hook.command,
        succeeded: !1,
        output: errorMessage4,
        blocked: !1
      };
    }
  });
  return await Promise.all(hookPromises);
}
async function* executePreToolHooks(toolName, toolUseID, toolInput, toolUseContext, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, requestPrompt, toolInputSummary) {
  let appState = toolUseContext.getAppState(), sessionId = toolUseContext.agentId ?? getSessionId();
  if (!hasHookForEvent("PreToolUse", appState, sessionId))
    return;
  logForDebugging(`executePreToolHooks called for tool: ${toolName}`, {
    level: "verbose"
  });
  let hookInput = {
    ...createBaseHookInput(permissionMode, void 0, toolUseContext),
    hook_event_name: "PreToolUse",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseID
  };
  yield* executeHooks({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
    requestPrompt,
    toolInputSummary
  });
}
async function* executePostToolHooks(toolName, toolUseID, toolInput, toolResponse, toolUseContext, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(permissionMode, void 0, toolUseContext),
    hook_event_name: "PostToolUse",
    tool_name: toolName,
    tool_input: toolInput,
    tool_response: toolResponse,
    tool_use_id: toolUseID
  };
  yield* executeHooks({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext
  });
}
async function* executePostToolUseFailureHooks(toolName, toolUseID, toolInput, error44, toolUseContext, isInterrupt, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let appState = toolUseContext.getAppState(), sessionId = toolUseContext.agentId ?? getSessionId();
  if (!hasHookForEvent("PostToolUseFailure", appState, sessionId))
    return;
  let hookInput = {
    ...createBaseHookInput(permissionMode, void 0, toolUseContext),
    hook_event_name: "PostToolUseFailure",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseID,
    error: error44,
    is_interrupt: isInterrupt
  };
  yield* executeHooks({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext
  });
}
async function* executePermissionDeniedHooks(toolName, toolUseID, toolInput, reason, toolUseContext, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let appState = toolUseContext.getAppState(), sessionId = toolUseContext.agentId ?? getSessionId();
  if (!hasHookForEvent("PermissionDenied", appState, sessionId))
    return;
  let hookInput = {
    ...createBaseHookInput(permissionMode, void 0, toolUseContext),
    hook_event_name: "PermissionDenied",
    tool_name: toolName,
    tool_input: toolInput,
    tool_use_id: toolUseID,
    reason
  };
  yield* executeHooks({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext
  });
}
async function executeNotificationHooks(notificationData, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let { message, title, notificationType } = notificationData, hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "Notification",
    message,
    title,
    notification_type: notificationType
  };
  await executeHooksOutsideREPL({
    hookInput,
    timeoutMs,
    matchQuery: notificationType
  });
}
async function executeStopFailureHooks(lastMessage, toolUseContext, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let appState = toolUseContext?.getAppState(), sessionId = getSessionId();
  if (!hasHookForEvent("StopFailure", appState, sessionId))
    return;
  let lastAssistantText = extractTextContent(lastMessage.message.content, `
`).trim() || void 0, error44 = lastMessage.error ?? "unknown", hookInput = {
    ...createBaseHookInput(void 0, void 0, toolUseContext),
    hook_event_name: "StopFailure",
    error: error44,
    error_details: lastMessage.errorDetails,
    last_assistant_message: lastAssistantText
  };
  await executeHooksOutsideREPL({
    getAppState: toolUseContext?.getAppState,
    hookInput,
    timeoutMs,
    matchQuery: error44
  });
}
async function* executeStopHooks(permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, stopHookActive = !1, subagentId, toolUseContext, messages, agentType, requestPrompt) {
  let hookEvent = subagentId ? "SubagentStop" : "Stop", appState = toolUseContext?.getAppState(), sessionId = toolUseContext?.agentId ?? getSessionId();
  if (!hasHookForEvent(hookEvent, appState, sessionId))
    return;
  let lastAssistantMessage = messages ? getLastAssistantMessage(messages) : void 0, lastAssistantText = lastAssistantMessage ? extractTextContent(lastAssistantMessage.message.content, `
`).trim() || void 0 : void 0, hookInput = subagentId ? {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "SubagentStop",
    stop_hook_active: stopHookActive,
    agent_id: subagentId,
    agent_transcript_path: getAgentTranscriptPath(subagentId),
    agent_type: agentType ?? "",
    last_assistant_message: lastAssistantText
  } : {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "Stop",
    stop_hook_active: stopHookActive,
    last_assistant_message: lastAssistantText
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    signal,
    timeoutMs,
    toolUseContext,
    messages,
    requestPrompt
  });
}
async function* executeTeammateIdleHooks(teammateName, teamName, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "TeammateIdle",
    teammate_name: teammateName,
    team_name: teamName
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    signal,
    timeoutMs
  });
}
async function* executeTaskCreatedHooks(taskId, taskSubject, taskDescription, teammateName, teamName, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, toolUseContext) {
  let hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "TaskCreated",
    task_id: taskId,
    task_subject: taskSubject,
    task_description: taskDescription,
    teammate_name: teammateName,
    team_name: teamName
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    signal,
    timeoutMs,
    toolUseContext
  });
}
async function* executeTaskCompletedHooks(taskId, taskSubject, taskDescription, teammateName, teamName, permissionMode, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, toolUseContext) {
  let hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "TaskCompleted",
    task_id: taskId,
    task_subject: taskSubject,
    task_description: taskDescription,
    teammate_name: teammateName,
    team_name: teamName
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    signal,
    timeoutMs,
    toolUseContext
  });
}
async function* executeUserPromptSubmitHooks(prompt, permissionMode, toolUseContext, requestPrompt) {
  let appState = toolUseContext.getAppState(), sessionId = toolUseContext.agentId ?? getSessionId();
  if (!hasHookForEvent("UserPromptSubmit", appState, sessionId))
    return;
  let hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "UserPromptSubmit",
    prompt
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    signal: toolUseContext.abortController.signal,
    timeoutMs: TOOL_HOOK_EXECUTION_TIMEOUT_MS,
    toolUseContext,
    requestPrompt
  });
}
async function* executeSessionStartHooks(source, sessionId, agentType, model, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, forceSyncExecution) {
  let hookInput = {
    ...createBaseHookInput(void 0, sessionId),
    hook_event_name: "SessionStart",
    source,
    agent_type: agentType,
    model
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    matchQuery: source,
    signal,
    timeoutMs,
    forceSyncExecution
  });
}
async function* executeSetupHooks(trigger, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, forceSyncExecution) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "Setup",
    trigger
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    matchQuery: trigger,
    signal,
    timeoutMs,
    forceSyncExecution
  });
}
async function* executeSubagentStartHooks(agentId, agentType, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "SubagentStart",
    agent_id: agentId,
    agent_type: agentType
  };
  yield* executeHooks({
    hookInput,
    toolUseID: randomUUID29(),
    matchQuery: agentType,
    signal,
    timeoutMs
  });
}
async function executePreCompactHooks(compactData, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "PreCompact",
    trigger: compactData.trigger,
    custom_instructions: compactData.customInstructions
  }, results = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: compactData.trigger,
    signal,
    timeoutMs
  });
  if (results.length === 0)
    return {};
  let successfulOutputs = results.filter((result) => result.succeeded && result.output.trim().length > 0).map((result) => result.output.trim()), displayMessages = [];
  for (let result of results)
    if (result.succeeded)
      if (result.output.trim())
        displayMessages.push(`PreCompact [${result.command}] completed successfully: ${result.output.trim()}`);
      else
        displayMessages.push(`PreCompact [${result.command}] completed successfully`);
    else if (result.output.trim())
      displayMessages.push(`PreCompact [${result.command}] failed: ${result.output.trim()}`);
    else
      displayMessages.push(`PreCompact [${result.command}] failed`);
  return {
    newCustomInstructions: successfulOutputs.length > 0 ? successfulOutputs.join(`

`) : void 0,
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join(`
`) : void 0
  };
}
async function executePostCompactHooks(compactData, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "PostCompact",
    trigger: compactData.trigger,
    compact_summary: compactData.compactSummary
  }, results = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: compactData.trigger,
    signal,
    timeoutMs
  });
  if (results.length === 0)
    return {};
  let displayMessages = [];
  for (let result of results)
    if (result.succeeded)
      if (result.output.trim())
        displayMessages.push(`PostCompact [${result.command}] completed successfully: ${result.output.trim()}`);
      else
        displayMessages.push(`PostCompact [${result.command}] completed successfully`);
    else if (result.output.trim())
      displayMessages.push(`PostCompact [${result.command}] failed: ${result.output.trim()}`);
    else
      displayMessages.push(`PostCompact [${result.command}] failed`);
  return {
    userDisplayMessage: displayMessages.length > 0 ? displayMessages.join(`
`) : void 0
  };
}
async function executeSessionEndHooks(reason, options2) {
  let {
    getAppState,
    setAppState,
    signal,
    timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS
  } = options2 || {}, hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "SessionEnd",
    reason
  }, results = await executeHooksOutsideREPL({
    getAppState,
    hookInput,
    matchQuery: reason,
    signal,
    timeoutMs
  });
  for (let result of results)
    if (!result.succeeded && result.output)
      process.stderr.write(`SessionEnd hook [${result.command}] failed: ${result.output}
`);
  if (setAppState) {
    let sessionId = getSessionId();
    clearSessionHooks(setAppState, sessionId);
  }
}
async function* executePermissionRequestHooks(toolName, toolUseID, toolInput, toolUseContext, permissionMode, permissionSuggestions, signal, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS, requestPrompt, toolInputSummary) {
  logForDebugging(`executePermissionRequestHooks called for tool: ${toolName}`);
  let hookInput = {
    ...createBaseHookInput(permissionMode, void 0, toolUseContext),
    hook_event_name: "PermissionRequest",
    tool_name: toolName,
    tool_input: toolInput,
    permission_suggestions: permissionSuggestions
  };
  yield* executeHooks({
    hookInput,
    toolUseID,
    matchQuery: toolName,
    signal,
    timeoutMs,
    toolUseContext,
    requestPrompt,
    toolInputSummary
  });
}
async function executeConfigChangeHooks(source, filePath, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "ConfigChange",
    source,
    file_path: filePath
  }, results = await executeHooksOutsideREPL({
    hookInput,
    timeoutMs,
    matchQuery: source
  });
  if (source === "policy_settings")
    return results.map((r4) => ({ ...r4, blocked: !1 }));
  return results;
}
async function executeEnvHooks(hookInput, timeoutMs) {
  let results = await executeHooksOutsideREPL({ hookInput, timeoutMs });
  if (results.length > 0)
    invalidateSessionEnvCache();
  let watchPaths = results.flatMap((r4) => r4.watchPaths ?? []), systemMessages = results.map((r4) => r4.systemMessage).filter((m4) => !!m4);
  return { results, watchPaths, systemMessages };
}
function executeCwdChangedHooks(oldCwd, newCwd, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "CwdChanged",
    old_cwd: oldCwd,
    new_cwd: newCwd
  };
  return executeEnvHooks(hookInput, timeoutMs);
}
function executeFileChangedHooks(filePath, event, timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "FileChanged",
    file_path: filePath,
    event
  };
  return executeEnvHooks(hookInput, timeoutMs);
}
function hasInstructionsLoadedHook() {
  let snapshotHooks = getHooksConfigFromSnapshot()?.InstructionsLoaded;
  if (snapshotHooks && snapshotHooks.length > 0)
    return !0;
  let registeredHooks = getRegisteredHooks()?.InstructionsLoaded;
  if (registeredHooks && registeredHooks.length > 0)
    return !0;
  return !1;
}
async function executeInstructionsLoadedHooks(filePath, memoryType, loadReason, options2) {
  let {
    globs,
    triggerFilePath,
    parentFilePath,
    timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS
  } = options2 ?? {}, hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "InstructionsLoaded",
    file_path: filePath,
    memory_type: memoryType,
    load_reason: loadReason,
    globs,
    trigger_file_path: triggerFilePath,
    parent_file_path: parentFilePath
  };
  await executeHooksOutsideREPL({
    hookInput,
    timeoutMs,
    matchQuery: loadReason
  });
}
function parseElicitationHookOutput(result, expectedEventName) {
  if (result.blocked && !result.succeeded)
    return {
      blockingError: {
        blockingError: result.output || "Elicitation blocked by hook",
        command: result.command
      }
    };
  if (!result.output.trim())
    return {};
  let trimmed = result.output.trim();
  if (!trimmed.startsWith("{"))
    return {};
  try {
    let parsed = hookJSONOutputSchema().parse(JSON.parse(trimmed));
    if (isAsyncHookJSONOutput(parsed))
      return {};
    if (!isSyncHookJSONOutput(parsed))
      return {};
    if (parsed.decision === "block" || result.blocked)
      return {
        blockingError: {
          blockingError: parsed.reason || "Elicitation blocked by hook",
          command: result.command
        }
      };
    let specific = parsed.hookSpecificOutput;
    if (!specific || specific.hookEventName !== expectedEventName)
      return {};
    if (!specific.action)
      return {};
    let out = { response: {
      action: specific.action,
      content: specific.content
    } };
    if (specific.action === "decline")
      out.blockingError = {
        blockingError: parsed.reason || (expectedEventName === "Elicitation" ? "Elicitation denied by hook" : "Elicitation result blocked by hook"),
        command: result.command
      };
    return out;
  } catch {
    return {};
  }
}
async function executeElicitationHooks({
  serverName,
  message,
  requestedSchema,
  permissionMode,
  signal,
  timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
  mode,
  url: url3,
  elicitationId
}) {
  let hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "Elicitation",
    mcp_server_name: serverName,
    message,
    mode,
    url: url3,
    elicitation_id: elicitationId,
    requested_schema: requestedSchema
  }, results = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: serverName,
    signal,
    timeoutMs
  }), elicitationResponse, blockingError;
  for (let result of results) {
    let parsed = parseElicitationHookOutput(result, "Elicitation");
    if (parsed.blockingError)
      blockingError = parsed.blockingError;
    if (parsed.response)
      elicitationResponse = parsed.response;
  }
  return { elicitationResponse, blockingError };
}
async function executeElicitationResultHooks({
  serverName,
  action: action2,
  content,
  permissionMode,
  signal,
  timeoutMs = TOOL_HOOK_EXECUTION_TIMEOUT_MS,
  mode,
  elicitationId
}) {
  let hookInput = {
    ...createBaseHookInput(permissionMode),
    hook_event_name: "ElicitationResult",
    mcp_server_name: serverName,
    elicitation_id: elicitationId,
    mode,
    action: action2,
    content
  }, results = await executeHooksOutsideREPL({
    hookInput,
    matchQuery: serverName,
    signal,
    timeoutMs
  }), elicitationResultResponse, blockingError;
  for (let result of results) {
    let parsed = parseElicitationHookOutput(result, "ElicitationResult");
    if (parsed.blockingError)
      blockingError = parsed.blockingError;
    if (parsed.response)
      elicitationResultResponse = parsed.response;
  }
  return { elicitationResultResponse, blockingError };
}
async function executeStatusLineCommand(statusLineInput, signal, timeoutMs = 5000, logResult2 = !1) {
  if (shouldDisableAllHooksIncludingManaged())
    return;
  if (shouldSkipHookDueToTrust()) {
    logForDebugging("Skipping StatusLine command execution - workspace trust not accepted");
    return;
  }
  let statusLine;
  if (shouldAllowManagedHooksOnly())
    statusLine = getSettingsForSource("policySettings")?.statusLine;
  else
    statusLine = getSettings_DEPRECATED()?.statusLine;
  if (!statusLine || statusLine.type !== "command")
    return;
  let abortSignal = signal || AbortSignal.timeout(timeoutMs);
  try {
    let jsonInput = jsonStringify(statusLineInput), result = await execCommandHook(statusLine, "StatusLine", "statusLine", jsonInput, abortSignal, randomUUID29());
    if (result.aborted)
      return;
    if (result.status === 0) {
      let output = result.stdout.trim().split(`
`).flatMap((line) => line.trim() || []).join(`
`);
      if (output) {
        if (logResult2)
          logForDebugging(`StatusLine [${statusLine.command}] completed with status ${result.status}`);
        return output;
      }
    } else if (logResult2)
      logForDebugging(`StatusLine [${statusLine.command}] completed with status ${result.status}`, { level: "warn" });
    return;
  } catch (error44) {
    logForDebugging(`Status hook failed: ${error44}`, { level: "error" });
    return;
  }
}
async function executeFileSuggestionCommand(fileSuggestionInput, signal, timeoutMs = 5000) {
  if (shouldDisableAllHooksIncludingManaged())
    return [];
  if (shouldSkipHookDueToTrust())
    return logForDebugging("Skipping FileSuggestion command execution - workspace trust not accepted"), [];
  let fileSuggestion;
  if (shouldAllowManagedHooksOnly())
    fileSuggestion = getSettingsForSource("policySettings")?.fileSuggestion;
  else
    fileSuggestion = getSettings_DEPRECATED()?.fileSuggestion;
  if (!fileSuggestion || fileSuggestion.type !== "command")
    return [];
  let abortSignal = signal || AbortSignal.timeout(timeoutMs);
  try {
    let jsonInput = jsonStringify(fileSuggestionInput), hook = { type: "command", command: fileSuggestion.command }, result = await execCommandHook(hook, "FileSuggestion", "FileSuggestion", jsonInput, abortSignal, randomUUID29());
    if (result.aborted || result.status !== 0)
      return [];
    return result.stdout.split(`
`).map((line) => line.trim()).filter(Boolean);
  } catch (error44) {
    return logForDebugging(`File suggestion helper failed: ${error44}`, {
      level: "error"
    }), [];
  }
}
async function executeFunctionHook({
  hook,
  messages,
  hookName,
  toolUseID,
  hookEvent,
  timeoutMs,
  signal
}) {
  let callbackTimeoutMs = hook.timeout ?? timeoutMs, { signal: abortSignal, cleanup } = createCombinedAbortSignal(signal, {
    timeoutMs: callbackTimeoutMs
  });
  try {
    if (abortSignal.aborted)
      return cleanup(), {
        outcome: "cancelled",
        hook
      };
    let passed = await new Promise((resolve45, reject2) => {
      let onAbort = () => reject2(Error("Function hook cancelled"));
      abortSignal.addEventListener("abort", onAbort), Promise.resolve(hook.callback(messages, abortSignal)).then((result) => {
        abortSignal.removeEventListener("abort", onAbort), resolve45(result);
      }).catch((error44) => {
        abortSignal.removeEventListener("abort", onAbort), reject2(error44);
      });
    });
    if (cleanup(), passed)
      return {
        outcome: "success",
        hook
      };
    return {
      blockingError: {
        blockingError: hook.errorMessage,
        command: "function"
      },
      outcome: "blocking",
      hook
    };
  } catch (error44) {
    if (cleanup(), error44 instanceof Error && (error44.message === "Function hook cancelled" || error44.name === "AbortError"))
      return {
        outcome: "cancelled",
        hook
      };
    return logError2(error44), {
      message: createAttachmentMessage({
        type: "hook_error_during_execution",
        hookName,
        toolUseID,
        hookEvent,
        content: error44 instanceof Error ? error44.message : "Function hook execution error"
      }),
      outcome: "non_blocking_error",
      hook
    };
  }
}
async function executeHookCallback({
  toolUseID,
  hook,
  hookEvent,
  hookInput,
  signal,
  hookIndex,
  toolUseContext
}) {
  let context7 = toolUseContext ? {
    getAppState: toolUseContext.getAppState,
    updateAttributionState: toolUseContext.updateAttributionState
  } : void 0, json2 = await hook.callback(hookInput, toolUseID, signal, hookIndex, context7);
  if (isAsyncHookJSONOutput(json2))
    return {
      outcome: "success",
      hook
    };
  return {
    ...processHookJSONOutput({
      json: json2,
      command: "callback",
      hookName: `${hookEvent}:Callback`,
      toolUseID,
      hookEvent,
      expectedHookEvent: hookEvent,
      stdout: void 0,
      stderr: void 0,
      exitCode: void 0
    }),
    outcome: "success",
    hook
  };
}
function hasWorktreeCreateHook() {
  let snapshotHooks = getHooksConfigFromSnapshot()?.WorktreeCreate;
  if (snapshotHooks && snapshotHooks.length > 0)
    return !0;
  let registeredHooks = getRegisteredHooks()?.WorktreeCreate;
  if (!registeredHooks || registeredHooks.length === 0)
    return !1;
  let managedOnly = shouldAllowManagedHooksOnly();
  return registeredHooks.some((matcher) => !(managedOnly && ("pluginRoot" in matcher)));
}
async function executeWorktreeCreateHook(name3) {
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "WorktreeCreate",
    name: name3
  }, results = await executeHooksOutsideREPL({
    hookInput,
    timeoutMs: TOOL_HOOK_EXECUTION_TIMEOUT_MS
  }), successfulResult = results.find((r4) => r4.succeeded && r4.output.trim().length > 0);
  if (!successfulResult) {
    let failedOutputs = results.filter((r4) => !r4.succeeded).map((r4) => `${r4.command}: ${r4.output.trim() || "no output"}`);
    throw Error(`WorktreeCreate hook failed: ${failedOutputs.join("; ") || "no successful output"}`);
  }
  return { worktreePath: successfulResult.output.trim() };
}
async function executeWorktreeRemoveHook(worktreePath) {
  let snapshotHooks = getHooksConfigFromSnapshot()?.WorktreeRemove, registeredHooks = getRegisteredHooks()?.WorktreeRemove, hasSnapshotHooks = snapshotHooks && snapshotHooks.length > 0, hasRegisteredHooks = registeredHooks && registeredHooks.length > 0;
  if (!hasSnapshotHooks && !hasRegisteredHooks)
    return !1;
  let hookInput = {
    ...createBaseHookInput(void 0),
    hook_event_name: "WorktreeRemove",
    worktree_path: worktreePath
  }, results = await executeHooksOutsideREPL({
    hookInput,
    timeoutMs: TOOL_HOOK_EXECUTION_TIMEOUT_MS
  });
  if (results.length === 0)
    return !1;
  for (let result of results)
    if (!result.succeeded)
      logForDebugging(`WorktreeRemove hook failed [${result.command}]: ${result.output.trim()}`, { level: "error" });
  return !0;
}
function getHookDefinitionsForTelemetry(matchedHooks) {
  return matchedHooks.map(({ hook }) => {
    if (hook.type === "command")
      return { type: "command", command: hook.command };
    else if (hook.type === "prompt")
      return { type: "prompt", prompt: hook.prompt };
    else if (hook.type === "http")
      return { type: "http", command: hook.url };
    else if (hook.type === "function")
      return { type: "function", name: "function" };
    else if (hook.type === "callback")
      return { type: "callback", name: "callback" };
    return { type: "unknown" };
  });
}
var TOOL_HOOK_EXECUTION_TIMEOUT_MS = 600000, SESSION_END_HOOK_TIMEOUT_MS_DEFAULT = 1500;
var init_hooks5 = __esm(() => {
  init_file();
  init_ShellCommand();
  init_TaskOutput();
  init_cwd2();
  init_shellPrefix();
  init_sessionEnvironment();
  init_subprocessEnv();
  init_platform();
  init_windowsPaths();
  init_powershellDetection();
  init_shellProvider();
  init_powershellProvider();
  init_pluginOptionsStorage();
  init_pluginDirectories();
  init_state();
  init_config4();
  init_hooksConfigSnapshot();
  init_sessionStorage();
  init_settings2();
  init_events();
  init_schemas3();
  init_sessionTracing();
  init_hooks4();
  init_source();
  init_hooksSettings();
  init_debug();
  init_diagLogs();
  init_permissionRuleParser();
  init_log3();
  init_combinedAbortSignal();
  init_AsyncHookRegistry();
  init_messageQueueManager();
  init_messages3();
  init_hookEvents();
  init_attachments2();
  init_generators();
  init_Tool();
  init_execPromptHook();
  init_execAgentHook();
  init_execHttpHook();
  init_sessionHooks();
  init_slowOperations();
  init_envUtils();
  init_errors();
});

