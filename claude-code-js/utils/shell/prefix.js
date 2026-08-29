// Original: src/utils/shell/prefix.ts
function createCommandPrefixExtractor(config10) {
  let { toolName, policySpec, eventName, querySource, preCheck } = config10, memoized = memoizeWithLRU((command12, abortSignal, isNonInteractiveSession) => {
    let promise3 = getCommandPrefixImpl(command12, abortSignal, isNonInteractiveSession, toolName, policySpec, eventName, querySource, preCheck);
    return promise3.catch(() => {
      if (memoized.cache.get(command12) === promise3)
        memoized.cache.delete(command12);
    }), promise3;
  }, (command12) => command12, 200);
  return memoized;
}
function createSubcommandPrefixExtractor(getPrefix, splitCommand2) {
  let memoized = memoizeWithLRU((command12, abortSignal, isNonInteractiveSession) => {
    let promise3 = getCommandSubcommandPrefixImpl(command12, abortSignal, isNonInteractiveSession, getPrefix, splitCommand2);
    return promise3.catch(() => {
      if (memoized.cache.get(command12) === promise3)
        memoized.cache.delete(command12);
    }), promise3;
  }, (command12) => command12, 200);
  return memoized;
}
async function getCommandPrefixImpl(command12, abortSignal, isNonInteractiveSession, toolName, policySpec, eventName, querySource, preCheck) {
  if (preCheck) {
    let preCheckResult = preCheck(command12);
    if (preCheckResult !== null)
      return preCheckResult;
  }
  let preflightCheckTimeoutId, startTime = Date.now(), result = null;
  try {
    preflightCheckTimeoutId = setTimeout((tn, nonInteractive) => {
      let message = `[${tn}Tool] Pre-flight check is taking longer than expected. Run with ANTHROPIC_LOG=debug to check for failed or slow API requests.`;
      if (nonInteractive)
        process.stderr.write(jsonStringify({ level: "warn", message }) + `
`);
      else
        console.warn(source_default.yellow(`\u26A0\uFE0F  ${message}`));
    }, 1e4, toolName, isNonInteractiveSession);
    let response7 = await queryHaiku({
      systemPrompt: asSystemPrompt([
        `Your task is to process ${toolName} commands that an AI coding agent wants to run.

This policy spec defines how to determine the prefix of a ${toolName} command:`
      ]),
      userPrompt: `${policySpec}

Command: ${command12}`,
      signal: abortSignal,
      options: {
        enablePromptCaching: !1,
        querySource,
        agents: [],
        isNonInteractiveSession,
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    });
    clearTimeout(preflightCheckTimeoutId);
    let durationMs = Date.now() - startTime, prefix = typeof response7.message.content === "string" ? response7.message.content : Array.isArray(response7.message.content) ? response7.message.content.find((_) => _.type === "text")?.text ?? "none" : "none";
    if (startsWithApiErrorPrefix(prefix))
      logEvent(eventName, {
        success: !1,
        error: "API error",
        durationMs
      }), result = null;
    else if (prefix === "command_injection_detected")
      logEvent(eventName, {
        success: !1,
        error: "command_injection_detected",
        durationMs
      }), result = {
        commandPrefix: null
      };
    else if (prefix === "git" || DANGEROUS_SHELL_PREFIXES.has(prefix.toLowerCase()))
      logEvent(eventName, {
        success: !1,
        error: "dangerous_shell_prefix",
        durationMs
      }), result = {
        commandPrefix: null
      };
    else if (prefix === "none")
      logEvent(eventName, {
        success: !1,
        error: 'prefix "none"',
        durationMs
      }), result = {
        commandPrefix: null
      };
    else if (!command12.startsWith(prefix))
      logEvent(eventName, {
        success: !1,
        error: "command did not start with prefix",
        durationMs
      }), result = {
        commandPrefix: null
      };
    else
      logEvent(eventName, {
        success: !0,
        durationMs
      }), result = {
        commandPrefix: prefix
      };
    return result;
  } catch (error44) {
    throw clearTimeout(preflightCheckTimeoutId), error44;
  }
}
async function getCommandSubcommandPrefixImpl(command12, abortSignal, isNonInteractiveSession, getPrefix, splitCommandFn) {
  let subcommands = await splitCommandFn(command12), [fullCommandPrefix, ...subcommandPrefixesResults] = await Promise.all([
    getPrefix(command12, abortSignal, isNonInteractiveSession),
    ...subcommands.map(async (subcommand) => ({
      subcommand,
      prefix: await getPrefix(subcommand, abortSignal, isNonInteractiveSession)
    }))
  ]);
  if (!fullCommandPrefix)
    return null;
  let subcommandPrefixes = subcommandPrefixesResults.reduce((acc, { subcommand, prefix }) => {
    if (prefix)
      acc.set(subcommand, prefix);
    return acc;
  }, /* @__PURE__ */ new Map);
  return {
    ...fullCommandPrefix,
    subcommandPrefixes
  };
}
var DANGEROUS_SHELL_PREFIXES;
var init_prefix = __esm(() => {
  init_source();
  init_claude();
  init_errors11();
  init_memoize2();
  init_slowOperations();
  DANGEROUS_SHELL_PREFIXES = /* @__PURE__ */ new Set([
    "sh",
    "bash",
    "zsh",
    "fish",
    "csh",
    "tcsh",
    "ksh",
    "dash",
    "cmd",
    "cmd.exe",
    "powershell",
    "powershell.exe",
    "pwsh",
    "pwsh.exe",
    "bash.exe"
  ]);
});
