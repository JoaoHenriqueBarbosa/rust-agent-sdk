// Original: src/utils/plugins/schemas.ts
function isMarketplaceAutoUpdate(marketplaceName, entry) {
  let normalizedName = marketplaceName.toLowerCase();
  return entry.autoUpdate ?? (ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(normalizedName) && !NO_AUTO_UPDATE_OFFICIAL_MARKETPLACES.has(normalizedName));
}
function isBlockedOfficialName(name) {
  if (ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(name.toLowerCase()))
    return !1;
  if (NON_ASCII_PATTERN.test(name))
    return !0;
  return BLOCKED_OFFICIAL_NAME_PATTERN.test(name);
}
function validateOfficialNameSource(name, source) {
  let normalizedName = name.toLowerCase();
  if (!ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(normalizedName))
    return null;
  if (source.source === "github") {
    if (!(source.repo || "").toLowerCase().startsWith(`${OFFICIAL_GITHUB_ORG}/`))
      return `The name '${name}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${OFFICIAL_GITHUB_ORG}/' can use this name.`;
    return null;
  }
  if (source.source === "git" && source.url) {
    let url3 = source.url.toLowerCase(), isHttpsAnthropics = url3.includes("github.com/anthropics/"), isSshAnthropics = url3.includes("git@github.com:anthropics/");
    if (isHttpsAnthropics || isSshAnthropics)
      return null;
    return `The name '${name}' is reserved for official Anthropic marketplaces. Only repositories from 'github.com/${OFFICIAL_GITHUB_ORG}/' can use this name.`;
  }
  return `The name '${name}' is reserved for official Anthropic marketplaces and can only be used with GitHub sources from the '${OFFICIAL_GITHUB_ORG}' organization.`;
}
function isLocalPluginSource(source) {
  return typeof source === "string" && source.startsWith("./");
}
function isLocalMarketplaceSource(source) {
  return source.source === "file" || source.source === "directory";
}
var ALLOWED_OFFICIAL_MARKETPLACE_NAMES, NO_AUTO_UPDATE_OFFICIAL_MARKETPLACES, BLOCKED_OFFICIAL_NAME_PATTERN, NON_ASCII_PATTERN, OFFICIAL_GITHUB_ORG = "anthropics", RelativePath, RelativeJSONPath, McpbPath, RelativeMarkdownPath, RelativeCommandPath, MarketplaceNameSchema, PluginAuthorSchema, PluginManifestMetadataSchema, PluginHooksSchema, PluginManifestHooksSchema, CommandMetadataSchema, PluginManifestCommandsSchema, PluginManifestAgentsSchema, PluginManifestSkillsSchema, PluginManifestOutputStylesSchema, nonEmptyString, fileExtension, PluginManifestMcpServerSchema, PluginUserConfigOptionSchema, PluginManifestUserConfigSchema, PluginManifestChannelsSchema, LspServerConfigSchema, PluginManifestLspServerSchema, NpmPackageNameSchema, PluginManifestSettingsSchema, PluginManifestSchema, MarketplaceSourceSchema, gitSha, PluginSourceSchema, SettingsMarketplacePluginSchema, PluginMarketplaceEntrySchema, PluginMarketplaceSchema, PluginIdSchema, DEP_REF_REGEX, DependencyRefSchema, SettingsPluginEntrySchema, InstalledPluginSchema, InstalledPluginsFileSchemaV1, PluginScopeSchema, PluginInstallationEntrySchema, InstalledPluginsFileSchemaV2, InstalledPluginsFileSchema, KnownMarketplaceSchema, KnownMarketplacesFileSchema;
var init_schemas3 = __esm(() => {
  init_v4();
  init_hooks();
  init_types2();
  ALLOWED_OFFICIAL_MARKETPLACE_NAMES = /* @__PURE__ */ new Set([
    "claude-code-marketplace",
    "claude-code-plugins",
    "claude-plugins-official",
    "anthropic-marketplace",
    "anthropic-plugins",
    "agent-skills",
    "life-sciences",
    "knowledge-work-plugins"
  ]), NO_AUTO_UPDATE_OFFICIAL_MARKETPLACES = /* @__PURE__ */ new Set(["knowledge-work-plugins"]);
  BLOCKED_OFFICIAL_NAME_PATTERN = /(?:official[^a-z0-9]*(anthropic|claude)|(?:anthropic|claude)[^a-z0-9]*official|^(?:anthropic|claude)[^a-z0-9]*(marketplace|plugins|official))/i, NON_ASCII_PATTERN = /[^\u0020-\u007E]/;
  RelativePath = lazySchema(() => exports_external.string().startsWith("./")), RelativeJSONPath = lazySchema(() => RelativePath().endsWith(".json")), McpbPath = lazySchema(() => exports_external.union([
    RelativePath().refine((path9) => path9.endsWith(".mcpb") || path9.endsWith(".dxt"), {
      message: "MCPB file path must end with .mcpb or .dxt"
    }).describe("Path to MCPB file relative to plugin root"),
    exports_external.string().url().refine((url3) => url3.endsWith(".mcpb") || url3.endsWith(".dxt"), {
      message: "MCPB URL must end with .mcpb or .dxt"
    }).describe("URL to MCPB file")
  ])), RelativeMarkdownPath = lazySchema(() => RelativePath().endsWith(".md")), RelativeCommandPath = lazySchema(() => exports_external.union([
    RelativeMarkdownPath(),
    RelativePath()
  ])), MarketplaceNameSchema = lazySchema(() => exports_external.string().min(1, "Marketplace must have a name").refine((name) => !name.includes(" "), {
    message: 'Marketplace name cannot contain spaces. Use kebab-case (e.g., "my-marketplace")'
  }).refine((name) => !name.includes("/") && !name.includes("\\") && !name.includes("..") && name !== ".", {
    message: 'Marketplace name cannot contain path separators (/ or \\), ".." sequences, or be "."'
  }).refine((name) => !isBlockedOfficialName(name), {
    message: "Marketplace name impersonates an official Anthropic/Claude marketplace"
  }).refine((name) => name.toLowerCase() !== "inline", {
    message: 'Marketplace name "inline" is reserved for --plugin-dir session plugins'
  }).refine((name) => name.toLowerCase() !== "builtin", {
    message: 'Marketplace name "builtin" is reserved for built-in plugins'
  })), PluginAuthorSchema = lazySchema(() => exports_external.object({
    name: exports_external.string().min(1, "Author name cannot be empty").describe("Display name of the plugin author or organization"),
    email: exports_external.string().optional().describe("Contact email for support or feedback"),
    url: exports_external.string().optional().describe("Website, GitHub profile, or organization URL")
  })), PluginManifestMetadataSchema = lazySchema(() => exports_external.object({
    name: exports_external.string().min(1, "Plugin name cannot be empty").refine((name) => !name.includes(" "), {
      message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
    }).describe("Unique identifier for the plugin, used for namespacing (prefer kebab-case)"),
    version: exports_external.string().optional().describe("Semantic version (e.g., 1.2.3) following semver.org specification"),
    description: exports_external.string().optional().describe("Brief, user-facing explanation of what the plugin provides"),
    author: PluginAuthorSchema().optional().describe("Information about the plugin creator or maintainer"),
    homepage: exports_external.string().url().optional().describe("Plugin homepage or documentation URL"),
    repository: exports_external.string().optional().describe("Source code repository URL"),
    license: exports_external.string().optional().describe("SPDX license identifier (e.g., MIT, Apache-2.0)"),
    keywords: exports_external.array(exports_external.string()).optional().describe("Tags for plugin discovery and categorization"),
    dependencies: exports_external.array(DependencyRefSchema()).optional().describe(`Plugins that must be enabled for this plugin to function. Bare names (no "@marketplace") are resolved against the declaring plugin's own marketplace.`)
  })), PluginHooksSchema = lazySchema(() => exports_external.object({
    description: exports_external.string().optional().describe("Brief, user-facing explanation of what these hooks provide"),
    hooks: exports_external.lazy(() => HooksSchema()).describe("The hooks provided by the plugin, in the same format as the one used for settings")
  })), PluginManifestHooksSchema = lazySchema(() => exports_external.object({
    hooks: exports_external.union([
      RelativeJSONPath().describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"),
      exports_external.lazy(() => HooksSchema()).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)"),
      exports_external.array(exports_external.union([
        RelativeJSONPath().describe("Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"),
        exports_external.lazy(() => HooksSchema()).describe("Additional hooks (in addition to those in hooks/hooks.json, if it exists)")
      ]))
    ])
  })), CommandMetadataSchema = lazySchema(() => exports_external.object({
    source: RelativeCommandPath().optional().describe("Path to command markdown file, relative to plugin root"),
    content: exports_external.string().optional().describe("Inline markdown content for the command"),
    description: exports_external.string().optional().describe("Command description override"),
    argumentHint: exports_external.string().optional().describe('Hint for command arguments (e.g., "[file]")'),
    model: exports_external.string().optional().describe("Default model for this command"),
    allowedTools: exports_external.array(exports_external.string()).optional().describe("Tools allowed when command runs")
  }).refine((data) => data.source && !data.content || !data.source && data.content, {
    message: 'Command must have either "source" (file path) or "content" (inline markdown), but not both'
  })), PluginManifestCommandsSchema = lazySchema(() => exports_external.object({
    commands: exports_external.union([
      RelativeCommandPath().describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root"),
      exports_external.array(RelativeCommandPath().describe("Path to additional command file or skill directory (in addition to those in the commands/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional command files or skill directories"),
      exports_external.record(exports_external.string(), CommandMetadataSchema()).describe('Object mapping of command names to their metadata and source files. Command name becomes the slash command name (e.g., "about" \u2192 "/plugin:about")')
    ])
  })), PluginManifestAgentsSchema = lazySchema(() => exports_external.object({
    agents: exports_external.union([
      RelativeMarkdownPath().describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root"),
      exports_external.array(RelativeMarkdownPath().describe("Path to additional agent file (in addition to those in the agents/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional agent files")
    ])
  })), PluginManifestSkillsSchema = lazySchema(() => exports_external.object({
    skills: exports_external.union([
      RelativePath().describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root"),
      exports_external.array(RelativePath().describe("Path to additional skill directory (in addition to those in the skills/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional skill directories")
    ])
  })), PluginManifestOutputStylesSchema = lazySchema(() => exports_external.object({
    outputStyles: exports_external.union([
      RelativePath().describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root"),
      exports_external.array(RelativePath().describe("Path to additional output styles directory or file (in addition to those in the output-styles/ directory, if it exists), relative to the plugin root")).describe("List of paths to additional output styles directories or files")
    ])
  })), nonEmptyString = lazySchema(() => exports_external.string().min(1)), fileExtension = lazySchema(() => exports_external.string().min(2).refine((ext) => ext.startsWith("."), {
    message: 'File extensions must start with dot (e.g., ".ts", not "ts")'
  })), PluginManifestMcpServerSchema = lazySchema(() => exports_external.object({
    mcpServers: exports_external.union([
      RelativeJSONPath().describe("MCP servers to include in the plugin (in addition to those in the .mcp.json file, if it exists)"),
      McpbPath().describe("Path or URL to MCPB file containing MCP server configuration"),
      exports_external.record(exports_external.string(), McpServerConfigSchema()).describe("MCP server configurations keyed by server name"),
      exports_external.array(exports_external.union([
        RelativeJSONPath().describe("Path to MCP servers configuration file"),
        McpbPath().describe("Path or URL to MCPB file"),
        exports_external.record(exports_external.string(), McpServerConfigSchema()).describe("Inline MCP server configurations")
      ])).describe("Array of MCP server configurations (paths, MCPB files, or inline definitions)")
    ])
  })), PluginUserConfigOptionSchema = lazySchema(() => exports_external.object({
    type: exports_external.enum(["string", "number", "boolean", "directory", "file"]).describe("Type of the configuration value"),
    title: exports_external.string().describe("Human-readable label shown in the config dialog"),
    description: exports_external.string().describe("Help text shown beneath the field in the config dialog"),
    required: exports_external.boolean().optional().describe("If true, validation fails when this field is empty"),
    default: exports_external.union([exports_external.string(), exports_external.number(), exports_external.boolean(), exports_external.array(exports_external.string())]).optional().describe("Default value used when the user provides nothing"),
    multiple: exports_external.boolean().optional().describe("For string type: allow an array of strings"),
    sensitive: exports_external.boolean().optional().describe("If true, masks dialog input and stores value in secure storage (keychain/credentials file) instead of settings.json"),
    min: exports_external.number().optional().describe("Minimum value (number type only)"),
    max: exports_external.number().optional().describe("Maximum value (number type only)")
  }).strict()), PluginManifestUserConfigSchema = lazySchema(() => exports_external.object({
    userConfig: exports_external.record(exports_external.string().regex(/^[A-Za-z_]\w*$/, "Option keys must be valid identifiers (letters, digits, underscore; no leading digit) \u2014 they become CLAUDE_PLUGIN_OPTION_<KEY> env vars in hooks"), PluginUserConfigOptionSchema()).optional().describe("User-configurable values this plugin needs. Prompted at enable time. Non-sensitive values saved to settings.json; sensitive values to secure storage (macOS keychain or .credentials.json). Available as ${user_config.KEY} in MCP/LSP server config, hook commands, and (non-sensitive only) skill/agent content. " + "Note: sensitive values share a single keychain entry with OAuth tokens \u2014 keep " + "secret counts small to stay under the ~2KB stdin-safe limit (see INC-3028).")
  })), PluginManifestChannelsSchema = lazySchema(() => exports_external.object({
    channels: exports_external.array(exports_external.object({
      server: exports_external.string().min(1).describe("Name of the MCP server this channel binds to. Must match a key in this plugin's mcpServers."),
      displayName: exports_external.string().optional().describe('Human-readable name shown in the config dialog title (e.g., "Telegram"). Defaults to the server name.'),
      userConfig: exports_external.record(exports_external.string(), PluginUserConfigOptionSchema()).optional().describe("Fields to prompt the user for when enabling this plugin in assistant mode. Saved values are substituted into ${user_config.KEY} references in the mcpServers env.")
    }).strict()).describe("Channels this plugin provides. Each entry declares an MCP server as a message channel and optionally specifies user configuration to prompt for at enable time.")
  })), LspServerConfigSchema = lazySchema(() => exports_external.strictObject({
    command: exports_external.string().min(1).refine((cmd) => {
      if (cmd.includes(" ") && !cmd.startsWith("/"))
        return !1;
      return !0;
    }, {
      message: "Command should not contain spaces. Use args array for arguments."
    }).describe('Command to execute the LSP server (e.g., "typescript-language-server")'),
    args: exports_external.array(nonEmptyString()).optional().describe("Command-line arguments to pass to the server"),
    extensionToLanguage: exports_external.record(fileExtension(), nonEmptyString()).refine((record2) => Object.keys(record2).length > 0, {
      message: "extensionToLanguage must have at least one mapping"
    }).describe("Mapping from file extension to LSP language ID. File extensions and languages are derived from this mapping."),
    transport: exports_external.enum(["stdio", "socket"]).default("stdio").describe("Communication transport mechanism"),
    env: exports_external.record(exports_external.string(), exports_external.string()).optional().describe("Environment variables to set when starting the server"),
    initializationOptions: exports_external.unknown().optional().describe("Initialization options passed to the server during initialization"),
    settings: exports_external.unknown().optional().describe("Settings passed to the server via workspace/didChangeConfiguration"),
    workspaceFolder: exports_external.string().optional().describe("Workspace folder path to use for the server"),
    startupTimeout: exports_external.number().int().positive().optional().describe("Maximum time to wait for server startup (milliseconds)"),
    shutdownTimeout: exports_external.number().int().positive().optional().describe("Maximum time to wait for graceful shutdown (milliseconds)"),
    restartOnCrash: exports_external.boolean().optional().describe("Whether to restart the server if it crashes"),
    maxRestarts: exports_external.number().int().nonnegative().optional().describe("Maximum number of restart attempts before giving up")
  })), PluginManifestLspServerSchema = lazySchema(() => exports_external.object({
    lspServers: exports_external.union([
      RelativeJSONPath().describe("Path to .lsp.json configuration file relative to plugin root"),
      exports_external.record(exports_external.string(), LspServerConfigSchema()).describe("LSP server configurations keyed by server name"),
      exports_external.array(exports_external.union([
        RelativeJSONPath().describe("Path to LSP configuration file"),
        exports_external.record(exports_external.string(), LspServerConfigSchema()).describe("Inline LSP server configurations")
      ])).describe("Array of LSP server configurations (paths or inline definitions)")
    ])
  })), NpmPackageNameSchema = lazySchema(() => exports_external.string().refine((name) => !name.includes("..") && !name.includes("//"), "Package name cannot contain path traversal patterns").refine((name) => {
    let scopedPackageRegex = /^@[a-z0-9][a-z0-9-._]*\/[a-z0-9][a-z0-9-._]*$/, regularPackageRegex = /^[a-z0-9][a-z0-9-._]*$/;
    return scopedPackageRegex.test(name) || regularPackageRegex.test(name);
  }, "Invalid npm package name format")), PluginManifestSettingsSchema = lazySchema(() => exports_external.object({
    settings: exports_external.record(exports_external.string(), exports_external.unknown()).optional().describe("Settings to merge when plugin is enabled. Only allowlisted keys are kept (currently: agent)")
  })), PluginManifestSchema = lazySchema(() => exports_external.object({
    ...PluginManifestMetadataSchema().shape,
    ...PluginManifestHooksSchema().partial().shape,
    ...PluginManifestCommandsSchema().partial().shape,
    ...PluginManifestAgentsSchema().partial().shape,
    ...PluginManifestSkillsSchema().partial().shape,
    ...PluginManifestOutputStylesSchema().partial().shape,
    ...PluginManifestChannelsSchema().partial().shape,
    ...PluginManifestMcpServerSchema().partial().shape,
    ...PluginManifestLspServerSchema().partial().shape,
    ...PluginManifestSettingsSchema().partial().shape,
    ...PluginManifestUserConfigSchema().partial().shape
  })), MarketplaceSourceSchema = lazySchema(() => exports_external.discriminatedUnion("source", [
    exports_external.object({
      source: exports_external.literal("url"),
      url: exports_external.string().url().describe("Direct URL to marketplace.json file"),
      headers: exports_external.record(exports_external.string(), exports_external.string()).optional().describe("Custom HTTP headers (e.g., for authentication)")
    }),
    exports_external.object({
      source: exports_external.literal("github"),
      repo: exports_external.string().describe("GitHub repository in owner/repo format"),
      ref: exports_external.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
      path: exports_external.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)"),
      sparsePaths: exports_external.array(exports_external.string()).optional().describe('Directories to include via git sparse-checkout (cone mode). Use for monorepos where the marketplace lives in a subdirectory. Example: [".claude-plugin", "plugins"]. If omitted, the full repository is cloned.')
    }),
    exports_external.object({
      source: exports_external.literal("git"),
      url: exports_external.string().describe("Full git repository URL"),
      ref: exports_external.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
      path: exports_external.string().optional().describe("Path to marketplace.json within repo (defaults to .claude-plugin/marketplace.json)"),
      sparsePaths: exports_external.array(exports_external.string()).optional().describe('Directories to include via git sparse-checkout (cone mode). Use for monorepos where the marketplace lives in a subdirectory. Example: [".claude-plugin", "plugins"]. If omitted, the full repository is cloned.')
    }),
    exports_external.object({
      source: exports_external.literal("npm"),
      package: NpmPackageNameSchema().describe("NPM package containing marketplace.json")
    }),
    exports_external.object({
      source: exports_external.literal("file"),
      path: exports_external.string().describe("Local file path to marketplace.json")
    }),
    exports_external.object({
      source: exports_external.literal("directory"),
      path: exports_external.string().describe("Local directory containing .claude-plugin/marketplace.json")
    }),
    exports_external.object({
      source: exports_external.literal("hostPattern"),
      hostPattern: exports_external.string().describe('Regex pattern to match the host/domain extracted from any marketplace source type. For github sources, matches against "github.com". For git sources (SSH or HTTPS), extracts the hostname from the URL. Use in strictKnownMarketplaces to allow all marketplaces from a specific host (e.g., "^github\\.mycompany\\.com$").')
    }),
    exports_external.object({
      source: exports_external.literal("pathPattern"),
      pathPattern: exports_external.string().describe('Regex pattern matched against the .path field of file and directory sources. Use in strictKnownMarketplaces to allow filesystem-based marketplaces alongside hostPattern restrictions for network sources. Use ".*" to allow all filesystem paths, or a narrower pattern (e.g., "^/opt/approved/") to restrict to specific directories.')
    }),
    exports_external.object({
      source: exports_external.literal("settings"),
      name: MarketplaceNameSchema().refine((name) => !ALLOWED_OFFICIAL_MARKETPLACE_NAMES.has(name.toLowerCase()), {
        message: "Reserved official marketplace names cannot be used with settings sources. validateOfficialNameSource only accepts github/git sources from anthropics/* for these names; a settings source would be rejected after loadAndCacheMarketplace has already written to disk with cleanupNeeded=false."
      }).describe("Marketplace name. Must match the extraKnownMarketplaces key (enforced); the synthetic manifest is written under this name. Same validation " + "as PluginMarketplaceSchema plus reserved-name rejection \u2014 " + "validateOfficialNameSource runs after the disk write, too late to clean up."),
      plugins: exports_external.array(SettingsMarketplacePluginSchema()).describe("Plugin entries declared inline in settings.json"),
      owner: PluginAuthorSchema().optional()
    }).describe("Inline marketplace manifest defined directly in settings.json. The reconciler writes a synthetic marketplace.json to the cache; diffMarketplaces detects edits via isEqual on the stored source (the plugins array is inside this object, so edits surface as sourceChanged).")
  ])), gitSha = lazySchema(() => exports_external.string().length(40).regex(/^[a-f0-9]{40}$/, "Must be a full 40-character lowercase git commit SHA")), PluginSourceSchema = lazySchema(() => exports_external.union([
    RelativePath().describe("Path to the plugin root, relative to the marketplace root (the directory containing .claude-plugin/, not .claude-plugin/ itself)"),
    exports_external.object({
      source: exports_external.literal("npm"),
      package: NpmPackageNameSchema().or(exports_external.string()).describe("Package name (or url, or local path, or anything else that can be passed to `npm` as a package)"),
      version: exports_external.string().optional().describe("Specific version or version range (e.g., ^1.0.0, ~2.1.0)"),
      registry: exports_external.string().url().optional().describe("Custom NPM registry URL (defaults to using system default, likely npmjs.org)")
    }).describe("NPM package as plugin source"),
    exports_external.object({
      source: exports_external.literal("pip"),
      package: exports_external.string().describe("Python package name as it appears on PyPI"),
      version: exports_external.string().optional().describe("Version specifier (e.g., ==1.0.0, >=2.0.0, <3.0.0)"),
      registry: exports_external.string().url().optional().describe("Custom PyPI registry URL (defaults to using system default, likely pypi.org)")
    }).describe("Python package as plugin source"),
    exports_external.object({
      source: exports_external.literal("url"),
      url: exports_external.string().describe("Full git repository URL (https:// or git@)"),
      ref: exports_external.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
      sha: gitSha().optional().describe("Specific commit SHA to use")
    }),
    exports_external.object({
      source: exports_external.literal("github"),
      repo: exports_external.string().describe("GitHub repository in owner/repo format"),
      ref: exports_external.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
      sha: gitSha().optional().describe("Specific commit SHA to use")
    }),
    exports_external.object({
      source: exports_external.literal("git-subdir"),
      url: exports_external.string().describe("Git repository: GitHub owner/repo shorthand, https://, or git@ URL"),
      path: exports_external.string().min(1).describe('Subdirectory within the repo containing the plugin (e.g., "tools/claude-plugin"). Cloned sparsely using partial clone (--filter=tree:0) to minimize bandwidth for monorepos.'),
      ref: exports_external.string().optional().describe('Git branch or tag to use (e.g., "main", "v1.0.0"). Defaults to repository default branch.'),
      sha: gitSha().optional().describe("Specific commit SHA to use")
    }).describe("Plugin located in a subdirectory of a larger repository (monorepo). Only the specified subdirectory is materialized; the rest of the repo is not downloaded.")
  ])), SettingsMarketplacePluginSchema = lazySchema(() => exports_external.object({
    name: exports_external.string().min(1, "Plugin name cannot be empty").refine((name) => !name.includes(" "), {
      message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
    }).describe("Plugin name as it appears in the target repository"),
    source: PluginSourceSchema().describe("Where to fetch the plugin from. Must be a remote source \u2014 relative " + "paths have no marketplace repository to resolve against."),
    description: exports_external.string().optional(),
    version: exports_external.string().optional(),
    strict: exports_external.boolean().optional()
  }).refine((p) => typeof p.source !== "string", {
    message: 'Plugins in a settings-sourced marketplace must use remote sources (github, git-subdir, npm, url, pip). Relative-path sources like "./foo" have no marketplace repository to resolve against.'
  }));
  PluginMarketplaceEntrySchema = lazySchema(() => PluginManifestSchema().partial().extend({
    name: exports_external.string().min(1, "Plugin name cannot be empty").refine((name) => !name.includes(" "), {
      message: 'Plugin name cannot contain spaces. Use kebab-case (e.g., "my-plugin")'
    }).describe("Unique identifier matching the plugin name"),
    source: PluginSourceSchema().describe("Where to fetch the plugin from"),
    category: exports_external.string().optional().describe('Category for organizing plugins (e.g., "productivity", "development")'),
    tags: exports_external.array(exports_external.string()).optional().describe("Tags for searchability and discovery"),
    strict: exports_external.boolean().optional().default(!0).describe("Require the plugin manifest to be present in the plugin folder. If false, the marketplace entry provides the manifest.")
  })), PluginMarketplaceSchema = lazySchema(() => exports_external.object({
    name: MarketplaceNameSchema(),
    owner: PluginAuthorSchema().describe("Marketplace maintainer or curator information"),
    plugins: exports_external.array(PluginMarketplaceEntrySchema()).describe("Collection of available plugins in this marketplace"),
    forceRemoveDeletedPlugins: exports_external.boolean().optional().describe("When true, plugins removed from this marketplace will be automatically uninstalled and flagged for users"),
    metadata: exports_external.object({
      pluginRoot: exports_external.string().optional().describe("Base path for relative plugin sources"),
      version: exports_external.string().optional().describe("Marketplace version"),
      description: exports_external.string().optional().describe("Marketplace description")
    }).optional().describe("Optional marketplace metadata"),
    allowCrossMarketplaceDependenciesOn: exports_external.array(exports_external.string()).optional().describe("Marketplace names whose plugins may be auto-installed as dependencies. Only the root marketplace's allowlist applies \u2014 no transitive trust.")
  })), PluginIdSchema = lazySchema(() => exports_external.string().regex(/^[a-z0-9][-a-z0-9._]*@[a-z0-9][-a-z0-9._]*$/i, "Plugin ID must be in format: plugin@marketplace")), DEP_REF_REGEX = /^[a-z0-9][-a-z0-9._]*(@[a-z0-9][-a-z0-9._]*)?(@\^[^@]*)?$/i, DependencyRefSchema = lazySchema(() => exports_external.union([
    exports_external.string().regex(DEP_REF_REGEX, "Dependency must be a plugin name, optionally qualified with @marketplace").transform((s) => s.replace(/@\^[^@]*$/, "")),
    exports_external.object({
      name: exports_external.string().min(1).regex(/^[a-z0-9][-a-z0-9._]*$/i),
      marketplace: exports_external.string().min(1).regex(/^[a-z0-9][-a-z0-9._]*$/i).optional()
    }).loose().transform((o2) => o2.marketplace ? `${o2.name}@${o2.marketplace}` : o2.name)
  ])), SettingsPluginEntrySchema = lazySchema(() => exports_external.union([
    PluginIdSchema(),
    exports_external.object({
      id: PluginIdSchema().describe('Plugin identifier (e.g., "formatter@tools")'),
      version: exports_external.string().optional().describe('Version constraint (e.g., "^2.0.0")'),
      required: exports_external.boolean().optional().describe("If true, cannot be disabled"),
      config: exports_external.record(exports_external.string(), exports_external.unknown()).optional().describe("Plugin-specific configuration")
    })
  ])), InstalledPluginSchema = lazySchema(() => exports_external.object({
    version: exports_external.string().describe("Currently installed version"),
    installedAt: exports_external.string().describe("ISO 8601 timestamp of installation"),
    lastUpdated: exports_external.string().optional().describe("ISO 8601 timestamp of last update"),
    installPath: exports_external.string().describe("Absolute path to the installed plugin directory"),
    gitCommitSha: exports_external.string().optional().describe("Git commit SHA for git-based plugins (for version tracking)")
  })), InstalledPluginsFileSchemaV1 = lazySchema(() => exports_external.object({
    version: exports_external.literal(1).describe("Schema version 1"),
    plugins: exports_external.record(PluginIdSchema(), InstalledPluginSchema()).describe("Map of plugin IDs to their installation metadata")
  })), PluginScopeSchema = lazySchema(() => exports_external.enum(["managed", "user", "project", "local"])), PluginInstallationEntrySchema = lazySchema(() => exports_external.object({
    scope: PluginScopeSchema().describe("Installation scope"),
    projectPath: exports_external.string().optional().describe("Project path (required for project/local scopes)"),
    installPath: exports_external.string().describe("Absolute path to the versioned plugin directory"),
    version: exports_external.string().optional().describe("Currently installed version"),
    installedAt: exports_external.string().optional().describe("ISO 8601 timestamp of installation"),
    lastUpdated: exports_external.string().optional().describe("ISO 8601 timestamp of last update"),
    gitCommitSha: exports_external.string().optional().describe("Git commit SHA for git-based plugins")
  })), InstalledPluginsFileSchemaV2 = lazySchema(() => exports_external.object({
    version: exports_external.literal(2).describe("Schema version 2"),
    plugins: exports_external.record(PluginIdSchema(), exports_external.array(PluginInstallationEntrySchema())).describe("Map of plugin IDs to arrays of installation entries")
  })), InstalledPluginsFileSchema = lazySchema(() => exports_external.union([InstalledPluginsFileSchemaV1(), InstalledPluginsFileSchemaV2()])), KnownMarketplaceSchema = lazySchema(() => exports_external.object({
    source: MarketplaceSourceSchema().describe("Where to fetch the marketplace from"),
    installLocation: exports_external.string().describe("Local cache path where marketplace manifest is stored"),
    lastUpdated: exports_external.string().describe("ISO 8601 timestamp of last marketplace refresh"),
    autoUpdate: exports_external.boolean().optional().describe("Whether to automatically update this marketplace and its installed plugins on startup")
  })), KnownMarketplacesFileSchema = lazySchema(() => exports_external.record(exports_external.string(), KnownMarketplaceSchema()));
});
