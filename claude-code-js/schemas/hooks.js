// Original: src/schemas/hooks.ts
function buildHookSchemas() {
  let BashCommandHookSchema = exports_external.object({
    type: exports_external.literal("command").describe("Shell command hook type"),
    command: exports_external.string().describe("Shell command to execute"),
    if: IfConditionSchema(),
    shell: exports_external.enum(SHELL_TYPES).optional().describe("Shell interpreter. 'bash' uses your $SHELL (bash/zsh/sh); 'powershell' uses pwsh. Defaults to bash."),
    timeout: exports_external.number().positive().optional().describe("Timeout in seconds for this specific command"),
    statusMessage: exports_external.string().optional().describe("Custom status message to display in spinner while hook runs"),
    once: exports_external.boolean().optional().describe("If true, hook runs once and is removed after execution"),
    async: exports_external.boolean().optional().describe("If true, hook runs in background without blocking"),
    asyncRewake: exports_external.boolean().optional().describe("If true, hook runs in background and wakes the model on exit code 2 (blocking error). Implies async.")
  }), PromptHookSchema = exports_external.object({
    type: exports_external.literal("prompt").describe("LLM prompt hook type"),
    prompt: exports_external.string().describe("Prompt to evaluate with LLM. Use $ARGUMENTS placeholder for hook input JSON."),
    if: IfConditionSchema(),
    timeout: exports_external.number().positive().optional().describe("Timeout in seconds for this specific prompt evaluation"),
    model: exports_external.string().optional().describe('Model to use for this prompt hook (e.g., "claude-sonnet-4-6"). If not specified, uses the default small fast model.'),
    statusMessage: exports_external.string().optional().describe("Custom status message to display in spinner while hook runs"),
    once: exports_external.boolean().optional().describe("If true, hook runs once and is removed after execution")
  }), HttpHookSchema = exports_external.object({
    type: exports_external.literal("http").describe("HTTP hook type"),
    url: exports_external.string().url().describe("URL to POST the hook input JSON to"),
    if: IfConditionSchema(),
    timeout: exports_external.number().positive().optional().describe("Timeout in seconds for this specific request"),
    headers: exports_external.record(exports_external.string(), exports_external.string()).optional().describe('Additional headers to include in the request. Values may reference environment variables using $VAR_NAME or ${VAR_NAME} syntax (e.g., "Authorization": "Bearer $MY_TOKEN"). Only variables listed in allowedEnvVars will be interpolated.'),
    allowedEnvVars: exports_external.array(exports_external.string()).optional().describe("Explicit list of environment variable names that may be interpolated in header values. Only variables listed here will be resolved; all other $VAR references are left as empty strings. Required for env var interpolation to work."),
    statusMessage: exports_external.string().optional().describe("Custom status message to display in spinner while hook runs"),
    once: exports_external.boolean().optional().describe("If true, hook runs once and is removed after execution")
  }), AgentHookSchema = exports_external.object({
    type: exports_external.literal("agent").describe("Agentic verifier hook type"),
    prompt: exports_external.string().describe('Prompt describing what to verify (e.g. "Verify that unit tests ran and passed."). Use $ARGUMENTS placeholder for hook input JSON.'),
    if: IfConditionSchema(),
    timeout: exports_external.number().positive().optional().describe("Timeout in seconds for agent execution (default 60)"),
    model: exports_external.string().optional().describe('Model to use for this agent hook (e.g., "claude-sonnet-4-6"). If not specified, uses Haiku.'),
    statusMessage: exports_external.string().optional().describe("Custom status message to display in spinner while hook runs"),
    once: exports_external.boolean().optional().describe("If true, hook runs once and is removed after execution")
  });
  return {
    BashCommandHookSchema,
    PromptHookSchema,
    HttpHookSchema,
    AgentHookSchema
  };
}
var IfConditionSchema, HookCommandSchema, HookMatcherSchema, HooksSchema;
var init_hooks = __esm(() => {
  init_agentSdkTypes();
  init_v4();
  init_shellProvider();
  IfConditionSchema = lazySchema(() => exports_external.string().optional().describe('Permission rule syntax to filter when this hook runs (e.g., "Bash(git *)"). Only runs if the tool call matches the pattern. Avoids spawning hooks for non-matching commands.'));
  HookCommandSchema = lazySchema(() => {
    let {
      BashCommandHookSchema,
      PromptHookSchema,
      AgentHookSchema,
      HttpHookSchema
    } = buildHookSchemas();
    return exports_external.discriminatedUnion("type", [
      BashCommandHookSchema,
      PromptHookSchema,
      AgentHookSchema,
      HttpHookSchema
    ]);
  }), HookMatcherSchema = lazySchema(() => exports_external.object({
    matcher: exports_external.string().optional().describe('String pattern to match (e.g. tool names like "Write")'),
    hooks: exports_external.array(HookCommandSchema()).describe("List of hooks to execute when the matcher matches")
  })), HooksSchema = lazySchema(() => exports_external.partialRecord(exports_external.enum(HOOK_EVENTS), exports_external.array(HookMatcherSchema())));
});
