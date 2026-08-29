// var: init_sandbox_config
var init_sandbox_config = __esm(() => {
  init_zod();
  domainPatternSchema = exports_external2.string().refine((val) => {
    if (val.includes("://") || val.includes("/") || val.includes(":"))
      return !1;
    if (val === "localhost")
      return !0;
    if (val.startsWith("*.")) {
      let domain2 = val.slice(2);
      if (!domain2.includes(".") || domain2.startsWith(".") || domain2.endsWith("."))
        return !1;
      let parts = domain2.split(".");
      return parts.length >= 2 && parts.every((p4) => p4.length > 0);
    }
    if (val.includes("*"))
      return !1;
    return val.includes(".") && !val.startsWith(".") && !val.endsWith(".");
  }, {
    message: 'Invalid domain pattern. Must be a valid domain (e.g., "example.com") or wildcard (e.g., "*.example.com"). Overly broad patterns like "*.com" or "*" are not allowed for security reasons.'
  }), filesystemPathSchema = exports_external2.string().min(1, "Path cannot be empty"), MitmProxyConfigSchema = exports_external2.object({
    socketPath: exports_external2.string().min(1).describe("Unix socket path to the MITM proxy"),
    domains: exports_external2.array(domainPatternSchema).min(1).describe('Domains to route through the MITM proxy (e.g., ["api.example.com", "*.internal.org"])')
  }), ParentProxyConfigSchema = exports_external2.object({
    http: exports_external2.string().url().optional().describe("Upstream proxy URL for plain HTTP traffic"),
    https: exports_external2.string().url().optional().describe("Upstream proxy URL for HTTPS/CONNECT traffic (falls back to http if unset)"),
    noProxy: exports_external2.string().optional().describe("Comma-separated NO_PROXY list (hostname suffixes and CIDR ranges). Matching destinations connect directly instead of via the parent proxy.")
  }), NetworkConfigSchema = exports_external2.object({
    allowedDomains: exports_external2.array(domainPatternSchema).describe('List of allowed domains (e.g., ["github.com", "*.npmjs.org"])'),
    deniedDomains: exports_external2.array(domainPatternSchema).describe("List of denied domains"),
    allowUnixSockets: exports_external2.array(exports_external2.string()).optional().describe("macOS only: Unix socket paths to allow. Ignored on Linux (seccomp cannot filter by path)."),
    allowAllUnixSockets: exports_external2.boolean().optional().describe("If true, allow all Unix sockets (disables blocking on both platforms)."),
    allowLocalBinding: exports_external2.boolean().optional().describe("Whether to allow binding to local ports (default: false)"),
    allowMachLookup: exports_external2.array(exports_external2.string().refine((val) => {
      return !(val.endsWith("*") ? val.slice(0, -1) : val).includes("*");
    }, {
      message: 'Wildcards are only allowed as a single trailing "*" (e.g., "com.example.*" or "*" for all services).'
    })).optional().describe('macOS only: Additional XPC/Mach service names to allow looking up. Supports trailing-wildcard prefix matching (e.g., "2BUA8C4S2C.com.1password.*"). Needed for tools like 1Password CLI, Playwright, or the iOS Simulator that communicate via XPC.'),
    httpProxyPort: exports_external2.number().int().min(1).max(65535).optional().describe("Port of an external HTTP proxy to use instead of starting a local one. When provided, the library will skip starting its own HTTP proxy and use this port. The external proxy must handle domain filtering."),
    socksProxyPort: exports_external2.number().int().min(1).max(65535).optional().describe("Port of an external SOCKS proxy to use instead of starting a local one. When provided, the library will skip starting its own SOCKS proxy and use this port. The external proxy must handle domain filtering."),
    mitmProxy: MitmProxyConfigSchema.optional().describe("Optional MITM proxy configuration. Routes matching domains through an upstream proxy via Unix socket while SRT still handles allow/deny filtering."),
    parentProxy: ParentProxyConfigSchema.optional().describe("Upstream HTTP proxy for outbound connections. When set, SRT's proxy tunnels non-mitmProxy traffic through this parent instead of connecting directly. Falls back to HTTP_PROXY/HTTPS_PROXY/NO_PROXY env vars if unset.")
  }), FilesystemConfigSchema = exports_external2.object({
    denyRead: exports_external2.array(filesystemPathSchema).describe("Paths denied for reading"),
    allowRead: exports_external2.array(filesystemPathSchema).optional().describe("Paths to re-allow reading within denied regions (takes precedence over denyRead). Use with denyRead to deny a broad region then allow back specific subdirectories."),
    allowWrite: exports_external2.array(filesystemPathSchema).describe("Paths allowed for writing"),
    denyWrite: exports_external2.array(filesystemPathSchema).describe("Paths denied for writing (takes precedence over allowWrite)"),
    allowGitConfig: exports_external2.boolean().optional().describe("Allow writes to .git/config files (default: false). Enables git remote URL updates while keeping .git/hooks protected.")
  }), IgnoreViolationsConfigSchema = exports_external2.record(exports_external2.string(), exports_external2.array(exports_external2.string())).describe('Map of command patterns to filesystem paths to ignore violations for. Use "*" to match all commands'), RipgrepConfigSchema = exports_external2.object({
    command: exports_external2.string().describe("The ripgrep command to execute"),
    args: exports_external2.array(exports_external2.string()).optional().describe("Additional arguments to pass before ripgrep args"),
    argv0: exports_external2.string().optional().describe("Override argv[0] when spawning (for multicall binaries that dispatch on argv[0])")
  }), SeccompConfigSchema = exports_external2.object({
    applyPath: exports_external2.string().optional().describe("Path to the apply-seccomp binary"),
    argv0: exports_external2.string().optional().describe("Invoke apply-seccomp as a multicall binary that dispatches on the ARGV0 environment variable. When set, applyPath is used verbatim (no existence check) and the invocation inside bwrap is prefixed with ARGV0=<this value>. The caller is responsible for ensuring applyPath resolves inside the bwrap namespace and that the target binary implements the apply-seccomp interface when ARGV0 matches.")
  }), SandboxRuntimeConfigSchema = exports_external2.object({
    network: NetworkConfigSchema.describe("Network restrictions configuration"),
    filesystem: FilesystemConfigSchema.describe("Filesystem restrictions configuration"),
    ignoreViolations: IgnoreViolationsConfigSchema.optional().describe("Optional configuration for ignoring specific violations"),
    enableWeakerNestedSandbox: exports_external2.boolean().optional().describe("Enable weaker nested sandbox mode (for Docker environments)"),
    enableWeakerNetworkIsolation: exports_external2.boolean().optional().describe("Enable weaker network isolation to allow access to com.apple.trustd.agent (macOS only). This is needed for Go programs (gh, gcloud, terraform, kubectl, etc.) to verify TLS certificates when using httpProxyPort with a MITM proxy and custom CA. Enabling this opens a potential data exfiltration vector through the trustd service. Only enable if you need Go TLS verification."),
    ripgrep: RipgrepConfigSchema.optional().describe('Custom ripgrep configuration (default: { command: "rg" })'),
    mandatoryDenySearchDepth: exports_external2.number().int().min(1).max(10).optional().describe("Maximum directory depth to search for dangerous files on Linux (default: 3). Higher values provide more protection but slower performance."),
    allowPty: exports_external2.boolean().optional().describe("Allow pseudo-terminal (pty) operations (macOS only)"),
    seccomp: SeccompConfigSchema.optional().describe("Custom seccomp binary paths (Linux only).")
  });
});
