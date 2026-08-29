// Original: src/utils/settings/types.ts
function isMcpServerNameEntry(entry) {
  return "serverName" in entry && entry.serverName !== void 0;
}
function isMcpServerCommandEntry(entry) {
  return "serverCommand" in entry && entry.serverCommand !== void 0;
}
function isMcpServerUrlEntry(entry) {
  return "serverUrl" in entry && entry.serverUrl !== void 0;
}
var EnvironmentVariablesSchema, PermissionsSchema, ExtraKnownMarketplaceSchema, AllowedMcpServerEntrySchema, DeniedMcpServerEntrySchema, CUSTOMIZATION_SURFACES, SettingsSchema;
var init_types3 = __esm(() => {
  init_v4();
  init_sandboxTypes();
  init_envUtils();
  init_PermissionMode();
  init_schemas3();
  init_constants2();
  init_permissionValidation();
  init_hooks();
  init_hooks();
  EnvironmentVariablesSchema = lazySchema(() => exports_external.record(exports_external.string(), exports_external.coerce.string())), PermissionsSchema = lazySchema(() => exports_external.object({
    allow: exports_external.array(PermissionRuleSchema()).optional().describe("List of permission rules for allowed operations"),
    deny: exports_external.array(PermissionRuleSchema()).optional().describe("List of permission rules for denied operations"),
    ask: exports_external.array(PermissionRuleSchema()).optional().describe("List of permission rules that should always prompt for confirmation"),
    defaultMode: exports_external.enum(EXTERNAL_PERMISSION_MODES).optional().describe("Default permission mode when Claude Code needs access"),
    disableBypassPermissionsMode: exports_external.enum(["disable"]).optional().describe("Disable the ability to bypass permission prompts"),
    ...{},
    additionalDirectories: exports_external.array(exports_external.string()).optional().describe("Additional directories to include in the permission scope")
  }).passthrough()), ExtraKnownMarketplaceSchema = lazySchema(() => exports_external.object({
    source: MarketplaceSourceSchema().describe("Where to fetch the marketplace from"),
    installLocation: exports_external.string().optional().describe("Local cache path where marketplace manifest is stored (auto-generated if not provided)"),
    autoUpdate: exports_external.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
  })), AllowedMcpServerEntrySchema = lazySchema(() => exports_external.object({
    serverName: exports_external.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that users are allowed to configure"),
    serverCommand: exports_external.array(exports_external.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for allowed stdio servers"),
    serverUrl: exports_external.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for allowed remote MCP servers')
  }).refine((data) => {
    return count2([
      data.serverName !== void 0,
      data.serverCommand !== void 0,
      data.serverUrl !== void 0
    ], Boolean) === 1;
  }, {
    message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
  })), DeniedMcpServerEntrySchema = lazySchema(() => exports_external.object({
    serverName: exports_external.string().regex(/^[a-zA-Z0-9_-]+$/, "Server name can only contain letters, numbers, hyphens, and underscores").optional().describe("Name of the MCP server that is explicitly blocked"),
    serverCommand: exports_external.array(exports_external.string()).min(1, "Server command must have at least one element (the command)").optional().describe("Command array [command, ...args] to match exactly for blocked stdio servers"),
    serverUrl: exports_external.string().optional().describe('URL pattern with wildcard support (e.g., "https://*.example.com/*") for blocked remote MCP servers')
  }).refine((data) => {
    return count2([
      data.serverName !== void 0,
      data.serverCommand !== void 0,
      data.serverUrl !== void 0
    ], Boolean) === 1;
  }, {
    message: 'Entry must have exactly one of "serverName", "serverCommand", or "serverUrl"'
  })), CUSTOMIZATION_SURFACES = [
    "skills",
    "agents",
    "hooks",
    "mcp"
  ], SettingsSchema = lazySchema(() => exports_external.object({
    $schema: exports_external.literal(CLAUDE_CODE_SETTINGS_SCHEMA_URL).optional().describe("JSON Schema reference for Claude Code settings"),
    apiKeyHelper: exports_external.string().optional().describe("Path to a script that outputs authentication values"),
    awsCredentialExport: exports_external.string().optional().describe("Path to a script that exports AWS credentials"),
    awsAuthRefresh: exports_external.string().optional().describe("Path to a script that refreshes AWS authentication"),
    gcpAuthRefresh: exports_external.string().optional().describe("Command to refresh GCP authentication (e.g., gcloud auth application-default login)"),
    ...isEnvTruthy(process.env.CLAUDE_CODE_ENABLE_XAA) ? {
      xaaIdp: exports_external.object({
        issuer: exports_external.string().url().describe("IdP issuer URL for OIDC discovery"),
        clientId: exports_external.string().describe("Claude Code's client_id registered at the IdP"),
        callbackPort: exports_external.number().int().positive().optional().describe("Fixed loopback callback port for the IdP OIDC login. Only needed if the IdP does not honor RFC 8252 port-any matching.")
      }).optional().describe("XAA (SEP-990) IdP connection. Configure once; all XAA-enabled MCP servers reuse this.")
    } : {},
    fileSuggestion: exports_external.object({
      type: exports_external.literal("command"),
      command: exports_external.string()
    }).optional().describe("Custom file suggestion configuration for @ mentions"),
    respectGitignore: exports_external.boolean().optional().describe("Whether file picker should respect .gitignore files (default: true). Note: .ignore files are always respected."),
    cleanupPeriodDays: exports_external.number().nonnegative().int().optional().describe("Number of days to retain chat transcripts (default: 30). Setting to 0 disables session persistence entirely: no transcripts are written and existing transcripts are deleted at startup."),
    env: EnvironmentVariablesSchema().optional().describe("Environment variables to set for Claude Code sessions"),
    attribution: exports_external.object({
      commit: exports_external.string().optional().describe("Attribution text for git commits, including any trailers. Empty string hides attribution."),
      pr: exports_external.string().optional().describe("Attribution text for pull request descriptions. Empty string hides attribution.")
    }).optional().describe("Customize attribution text for commits and PRs. Each field defaults to the standard Claude Code attribution if not set."),
    includeCoAuthoredBy: exports_external.boolean().optional().describe("Deprecated: Use attribution instead. Whether to include Claude's co-authored by attribution in commits and PRs (defaults to true)"),
    includeGitInstructions: exports_external.boolean().optional().describe("Include built-in commit and PR workflow instructions in Claude's system prompt (default: true)"),
    permissions: PermissionsSchema().optional().describe("Tool usage permissions configuration"),
    model: exports_external.string().optional().describe("Override the default model used by Claude Code"),
    availableModels: exports_external.array(exports_external.string()).optional().describe('Allowlist of models that users can select. Accepts family aliases ("opus" allows any opus version), version prefixes ("opus-4-5" allows only that version), and full model IDs. If undefined, all models are available. If empty array, only the default model is available. Typically set in managed settings by enterprise administrators.'),
    modelOverrides: exports_external.record(exports_external.string(), exports_external.string()).optional().describe('Override mapping from Anthropic model ID (e.g. "claude-opus-4-6") to provider-specific model ID (e.g. a Bedrock inference profile ARN). Typically set in managed settings by enterprise administrators.'),
    enableAllProjectMcpServers: exports_external.boolean().optional().describe("Whether to automatically approve all MCP servers in the project"),
    enabledMcpjsonServers: exports_external.array(exports_external.string()).optional().describe("List of approved MCP servers from .mcp.json"),
    disabledMcpjsonServers: exports_external.array(exports_external.string()).optional().describe("List of rejected MCP servers from .mcp.json"),
    allowedMcpServers: exports_external.array(AllowedMcpServerEntrySchema()).optional().describe("Enterprise allowlist of MCP servers that can be used. Applies to all scopes including enterprise servers from managed-mcp.json. If undefined, all servers are allowed. If empty array, no servers are allowed. Denylist takes precedence - if a server is on both lists, it is denied."),
    deniedMcpServers: exports_external.array(DeniedMcpServerEntrySchema()).optional().describe("Enterprise denylist of MCP servers that are explicitly blocked. If a server is on the denylist, it will be blocked across all scopes including enterprise. Denylist takes precedence over allowlist - if a server is on both lists, it is denied."),
    hooks: HooksSchema().optional().describe("Custom commands to run before/after tool executions"),
    worktree: exports_external.object({
      symlinkDirectories: exports_external.array(exports_external.string()).optional().describe('Directories to symlink from main repository to worktrees to avoid disk bloat. Must be explicitly configured - no directories are symlinked by default. Common examples: "node_modules", ".cache", ".bin"'),
      sparsePaths: exports_external.array(exports_external.string()).optional().describe("Directories to include when creating worktrees, via git sparse-checkout (cone mode). " + "Dramatically faster in large monorepos \u2014 only the listed paths are written to disk.")
    }).optional().describe("Git worktree configuration for --worktree flag."),
    disableAllHooks: exports_external.boolean().optional().describe("Disable all hooks and statusLine execution"),
    defaultShell: exports_external.enum(["bash", "powershell"]).optional().describe("Default shell for input-box ! commands. Defaults to 'bash' on all platforms (no Windows auto-flip)."),
    allowManagedHooksOnly: exports_external.boolean().optional().describe("When true (and set in managed settings), only hooks from managed settings run. User, project, and local hooks are ignored."),
    allowedHttpHookUrls: exports_external.array(exports_external.string()).optional().describe('Allowlist of URL patterns that HTTP hooks may target. Supports * as a wildcard (e.g. "https://hooks.example.com/*"). When set, HTTP hooks with non-matching URLs are blocked. If undefined, all URLs are allowed. If empty array, no HTTP hooks are allowed. Arrays merge across settings sources (same semantics as allowedMcpServers).'),
    httpHookAllowedEnvVars: exports_external.array(exports_external.string()).optional().describe("Allowlist of environment variable names HTTP hooks may interpolate into headers. When set, each hook's effective allowedEnvVars is the intersection with this list. If undefined, no restriction is applied. Arrays merge across settings sources (same semantics as allowedMcpServers)."),
    allowManagedPermissionRulesOnly: exports_external.boolean().optional().describe("When true (and set in managed settings), only permission rules (allow/deny/ask) from managed settings are respected. User, project, local, and CLI argument permission rules are ignored."),
    allowManagedMcpServersOnly: exports_external.boolean().optional().describe("When true (and set in managed settings), allowedMcpServers is only read from managed settings. deniedMcpServers still merges from all sources, so users can deny servers for themselves. Users can still add their own MCP servers, but only the admin-defined allowlist applies."),
    strictPluginOnlyCustomization: exports_external.preprocess((v) => Array.isArray(v) ? v.filter((x2) => CUSTOMIZATION_SURFACES.includes(x2)) : v, exports_external.union([exports_external.boolean(), exports_external.array(exports_external.enum(CUSTOMIZATION_SURFACES))])).optional().catch(void 0).describe('When set in managed settings, blocks non-plugin customization sources for the listed surfaces. Array form locks specific surfaces (e.g. ["skills", "hooks"]); `true` locks all four; `false` is an explicit no-op. Blocked: ~/.claude/{surface}/, .claude/{surface}/ (project), settings.json hooks, .mcp.json. NOT blocked: managed (policySettings) sources, plugin-provided customizations. ' + "Composes with strictKnownMarketplaces for end-to-end admin control \u2014 plugins gated by " + "marketplace allowlist, everything else blocked here."),
    statusLine: exports_external.object({
      type: exports_external.literal("command"),
      command: exports_external.string(),
      padding: exports_external.number().optional()
    }).optional().describe("Custom status line display configuration"),
    enabledPlugins: exports_external.record(exports_external.string(), exports_external.union([exports_external.array(exports_external.string()), exports_external.boolean(), exports_external.undefined()])).optional().describe('Enabled plugins using plugin-id@marketplace-id format. Example: { "formatter@anthropic-tools": true }. Also supports extended format with version constraints.'),
    extraKnownMarketplaces: exports_external.record(exports_external.string(), ExtraKnownMarketplaceSchema()).check((ctx) => {
      for (let [key, entry] of Object.entries(ctx.value))
        if (entry.source.source === "settings" && entry.source.name !== key)
          ctx.issues.push({
            code: "custom",
            input: entry.source.name,
            path: [key, "source", "name"],
            message: `Settings-sourced marketplace name must match its extraKnownMarketplaces key (got key "${key}" but source.name "${entry.source.name}")`
          });
    }).optional().describe("Additional marketplaces to make available for this repository. Typically used in repository .claude/settings.json to ensure team members have required plugin sources."),
    strictKnownMarketplaces: exports_external.array(MarketplaceSourceSchema()).optional().describe("Enterprise strict list of allowed marketplace sources. When set in managed settings, ONLY these exact sources can be added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem. " + "Note: this is a policy gate only \u2014 it does NOT register marketplaces. " + "To pre-register allowed marketplaces for users, also set extraKnownMarketplaces."),
    blockedMarketplaces: exports_external.array(MarketplaceSourceSchema()).optional().describe("Enterprise blocklist of marketplace sources. When set in managed settings, these exact sources are blocked from being added as marketplaces. The check happens BEFORE downloading, so blocked sources never touch the filesystem."),
    forceLoginMethod: exports_external.enum(["claudeai", "console"]).optional().describe('Force a specific login method: "claudeai" for Claude Pro/Max, "console" for Console billing'),
    forceLoginOrgUUID: exports_external.string().optional().describe("Organization UUID to use for OAuth login"),
    otelHeadersHelper: exports_external.string().optional().describe("Path to a script that outputs OpenTelemetry headers"),
    outputStyle: exports_external.string().optional().describe("Controls the output style for assistant responses"),
    language: exports_external.string().optional().describe('Preferred language for Claude responses and voice dictation (e.g., "japanese", "spanish")'),
    skipWebFetchPreflight: exports_external.boolean().optional().describe("Skip the WebFetch blocklist check for enterprise environments with restrictive security policies"),
    sandbox: SandboxSettingsSchema().optional(),
    feedbackSurveyRate: exports_external.number().min(0).max(1).optional().describe("Probability (0\u20131) that the session quality survey appears when eligible. 0.05 is a reasonable starting point."),
    spinnerTipsEnabled: exports_external.boolean().optional().describe("Whether to show tips in the spinner"),
    spinnerVerbs: exports_external.object({
      mode: exports_external.enum(["append", "replace"]),
      verbs: exports_external.array(exports_external.string())
    }).optional().describe('Customize spinner verbs. mode: "append" adds verbs to defaults, "replace" uses only your verbs.'),
    spinnerTipsOverride: exports_external.object({
      excludeDefault: exports_external.boolean().optional(),
      tips: exports_external.array(exports_external.string())
    }).optional().describe("Override spinner tips. tips: array of tip strings. excludeDefault: if true, only show custom tips (default: false)."),
    syntaxHighlightingDisabled: exports_external.boolean().optional().describe("Whether to disable syntax highlighting in diffs"),
    terminalTitleFromRename: exports_external.boolean().optional().describe("Whether /rename updates the terminal tab title (defaults to true). Set to false to keep auto-generated topic titles."),
    alwaysThinkingEnabled: exports_external.boolean().optional().describe("When false, thinking is disabled. When absent or true, thinking is enabled automatically for supported models."),
    effortLevel: exports_external.enum(["low", "medium", "high"]).optional().catch(void 0).describe("Persisted effort level for supported models."),
    advisorModel: exports_external.string().optional().describe("Advisor model for the server-side advisor tool."),
    fastMode: exports_external.boolean().optional().describe("When true, fast mode is enabled. When absent or false, fast mode is off."),
    fastModePerSessionOptIn: exports_external.boolean().optional().describe("When true, fast mode does not persist across sessions. Each session starts with fast mode off."),
    promptSuggestionEnabled: exports_external.boolean().optional().describe("When false, prompt suggestions are disabled. When absent or true, prompt suggestions are enabled."),
    showClearContextOnPlanAccept: exports_external.boolean().optional().describe('When true, the plan-approval dialog offers a "clear context" option. Defaults to false.'),
    agent: exports_external.string().optional().describe("Name of an agent (built-in or custom) to use for the main thread. Applies the agent's system prompt, tool restrictions, and model."),
    companyAnnouncements: exports_external.array(exports_external.string()).optional().describe("Company announcements to display at startup (one will be randomly selected if multiple are provided)"),
    pluginConfigs: exports_external.record(exports_external.string(), exports_external.object({
      mcpServers: exports_external.record(exports_external.string(), exports_external.record(exports_external.string(), exports_external.union([
        exports_external.string(),
        exports_external.number(),
        exports_external.boolean(),
        exports_external.array(exports_external.string())
      ]))).optional().describe("User configuration values for MCP servers keyed by server name"),
      options: exports_external.record(exports_external.string(), exports_external.union([
        exports_external.string(),
        exports_external.number(),
        exports_external.boolean(),
        exports_external.array(exports_external.string())
      ])).optional().describe("Non-sensitive option values from plugin manifest userConfig, keyed by option name. Sensitive values go to secure storage instead.")
    })).optional().describe("Per-plugin configuration including MCP server user configs, keyed by plugin ID (plugin@marketplace format)"),
    remote: exports_external.object({
      defaultEnvironmentId: exports_external.string().optional().describe("Default environment ID to use for remote sessions")
    }).optional().describe("Remote session configuration"),
    autoUpdatesChannel: exports_external.enum(["latest", "stable"]).optional().describe("Release channel for auto-updates (latest or stable)"),
    ...{},
    minimumVersion: exports_external.string().optional().describe("Minimum version to stay on - prevents downgrades when switching to stable channel"),
    plansDirectory: exports_external.string().optional().describe("Custom directory for plan files, relative to project root. If not set, defaults to ~/.claude/plans/"),
    ...{},
    ...{
      minSleepDurationMs: exports_external.number().nonnegative().int().optional().describe("Minimum duration in milliseconds that the Sleep tool must sleep for. Useful for throttling proactive tick frequency."),
      maxSleepDurationMs: exports_external.number().int().min(-1).optional().describe("Maximum duration in milliseconds that the Sleep tool can sleep for. Set to -1 for indefinite sleep (waits for user input). Useful for limiting idle time in remote/managed environments.")
    },
    ...{},
    ...{},
    channelsEnabled: exports_external.boolean().optional().describe("Teams/Enterprise opt-in for channel notifications (MCP servers with the claude/channel capability pushing inbound messages). Default off. Set true to allow; users then select servers via --channels."),
    allowedChannelPlugins: exports_external.array(exports_external.object({
      marketplace: exports_external.string(),
      plugin: exports_external.string()
    })).optional().describe("Teams/Enterprise allowlist of channel plugins. When set, " + "replaces the default Anthropic allowlist \u2014 admins decide which " + "plugins may push inbound messages. Undefined falls back to the default. Requires channelsEnabled: true."),
    ...{
      defaultView: exports_external.enum(["chat", "transcript"]).optional().describe("Default transcript view: chat (SendUserMessage checkpoints only) or transcript (full)")
    },
    prefersReducedMotion: exports_external.boolean().optional().describe("Reduce or disable animations for accessibility (spinner shimmer, flash effects, etc.)"),
    autoMemoryEnabled: exports_external.boolean().optional().describe("Enable auto-memory for this project. When false, Claude will not read from or write to the auto-memory directory."),
    autoMemoryDirectory: exports_external.string().optional().describe("Custom directory path for auto-memory storage. Supports ~/ prefix for home directory expansion. Ignored if set in projectSettings (checked-in .claude/settings.json) for security. When unset, defaults to ~/.claude/projects/<sanitized-cwd>/memory/."),
    autoDreamEnabled: exports_external.boolean().optional().describe("Enable background memory consolidation (auto-dream). When set, overrides the server-side default."),
    showThinkingSummaries: exports_external.boolean().optional().describe("Show thinking summaries in the transcript view (ctrl+o). Default: false."),
    skipDangerousModePermissionPrompt: exports_external.boolean().optional().describe("Whether the user has accepted the bypass permissions mode dialog"),
    ...{},
    disableAutoMode: exports_external.enum(["disable"]).optional().describe("Disable auto mode"),
    sshConfigs: exports_external.array(exports_external.object({
      id: exports_external.string().describe("Unique identifier for this SSH config. Used to match configs across settings sources."),
      name: exports_external.string().describe("Display name for the SSH connection"),
      sshHost: exports_external.string().describe('SSH host in format "user@hostname" or "hostname", or a host alias from ~/.ssh/config'),
      sshPort: exports_external.number().int().optional().describe("SSH port (default: 22)"),
      sshIdentityFile: exports_external.string().optional().describe("Path to SSH identity file (private key)"),
      startDirectory: exports_external.string().optional().describe("Default working directory on the remote host. Supports tilde expansion (e.g. ~/projects). If not specified, defaults to the remote user home directory. Can be overridden by the [dir] positional argument in `claude ssh <config> [dir]`.")
    })).optional().describe("SSH connection configurations for remote environments. Typically set in managed settings by enterprise administrators to pre-configure SSH connections for team members."),
    claudeMdExcludes: exports_external.array(exports_external.string()).optional().describe('Glob patterns or absolute paths of CLAUDE.md files to exclude from loading. Patterns are matched against absolute file paths using picomatch. Only applies to User, Project, and Local memory types (Managed/policy files cannot be excluded). Examples: "/home/user/monorepo/CLAUDE.md", "**/code/CLAUDE.md", "**/some-dir/.claude/rules/**"'),
    pluginTrustMessage: exports_external.string().optional().describe('Custom message to append to the plugin trust warning shown before installation. Only read from policy settings (managed-settings.json / MDM). Useful for enterprise administrators to add organization-specific context (e.g., "All plugins from our internal marketplace are vetted and approved.").')
  }).passthrough());
});
