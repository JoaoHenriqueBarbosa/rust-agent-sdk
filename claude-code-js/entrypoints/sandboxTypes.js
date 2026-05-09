// Original: src/entrypoints/sandboxTypes.ts
var SandboxNetworkConfigSchema, SandboxFilesystemConfigSchema, SandboxSettingsSchema;
var init_sandboxTypes = __esm(() => {
  init_v4();
  SandboxNetworkConfigSchema = lazySchema(() => exports_external.object({
    allowedDomains: exports_external.array(exports_external.string()).optional(),
    allowManagedDomainsOnly: exports_external.boolean().optional().describe("When true (and set in managed settings), only allowedDomains and WebFetch(domain:...) allow rules from managed settings are respected. User, project, local, and flag settings domains are ignored. Denied domains are still respected from all sources."),
    allowUnixSockets: exports_external.array(exports_external.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
    allowAllUnixSockets: exports_external.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
    allowLocalBinding: exports_external.boolean().optional(),
    httpProxyPort: exports_external.number().optional(),
    socksProxyPort: exports_external.number().optional()
  }).optional()), SandboxFilesystemConfigSchema = lazySchema(() => exports_external.object({
    allowWrite: exports_external.array(exports_external.string()).optional().describe("Additional paths to allow writing within the sandbox. Merged with paths from Edit(...) allow permission rules."),
    denyWrite: exports_external.array(exports_external.string()).optional().describe("Additional paths to deny writing within the sandbox. Merged with paths from Edit(...) deny permission rules."),
    denyRead: exports_external.array(exports_external.string()).optional().describe("Additional paths to deny reading within the sandbox. Merged with paths from Read(...) deny permission rules."),
    allowRead: exports_external.array(exports_external.string()).optional().describe("Paths to re-allow reading within denyRead regions. Takes precedence over denyRead for matching paths."),
    allowManagedReadPathsOnly: exports_external.boolean().optional().describe("When true (set in managed settings), only allowRead paths from policySettings are used.")
  }).optional()), SandboxSettingsSchema = lazySchema(() => exports_external.object({
    enabled: exports_external.boolean().optional(),
    failIfUnavailable: exports_external.boolean().optional().describe("Exit with an error at startup if sandbox.enabled is true but the sandbox cannot start (missing dependencies, unsupported platform, or platform not in enabledPlatforms). When false (default), a warning is shown and commands run unsandboxed. Intended for managed-settings deployments that require sandboxing as a hard gate."),
    autoAllowBashIfSandboxed: exports_external.boolean().optional(),
    allowUnsandboxedCommands: exports_external.boolean().optional().describe("Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter. When false, the dangerouslyDisableSandbox parameter is completely ignored and all commands must run sandboxed. Default: true."),
    network: SandboxNetworkConfigSchema(),
    filesystem: SandboxFilesystemConfigSchema(),
    ignoreViolations: exports_external.record(exports_external.string(), exports_external.array(exports_external.string())).optional(),
    enableWeakerNestedSandbox: exports_external.boolean().optional(),
    enableWeakerNetworkIsolation: exports_external.boolean().optional().describe("macOS only: Allow access to com.apple.trustd.agent in the sandbox. Needed for Go-based CLI tools (gh, gcloud, terraform, etc.) to verify TLS certificates when using httpProxyPort with a MITM proxy and custom CA. " + "**Reduces security** \u2014 opens a potential data exfiltration vector through the trustd service. Default: false"),
    excludedCommands: exports_external.array(exports_external.string()).optional(),
    ripgrep: exports_external.object({
      command: exports_external.string(),
      args: exports_external.array(exports_external.string()).optional()
    }).optional().describe("Custom ripgrep configuration for bundled ripgrep support")
  }).passthrough());
});
