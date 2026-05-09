// Original: src/utils/claudeInChrome/mcpServer.ts
var exports_mcpServer = {};
__export(exports_mcpServer, {
  runClaudeInChromeMcpServer: () => runClaudeInChromeMcpServer,
  createChromeContext: () => createChromeContext
});
import { format as format4 } from "util";
function isPermissionMode(raw) {
  return PERMISSION_MODES4.some((m4) => m4 === raw);
}
function getChromeBridgeUrl() {
  return;
}
function isLocalBridge() {
  return isEnvTruthy(process.env.USE_LOCAL_OAUTH) || isEnvTruthy(process.env.LOCAL_BRIDGE);
}
function createChromeContext(env5) {
  let logger34 = new DebugLogger, chromeBridgeUrl = getChromeBridgeUrl();
  logger34.info(`Bridge URL: ${chromeBridgeUrl ?? "none (using native socket)"}`);
  let rawPermissionMode = env5?.CLAUDE_CHROME_PERMISSION_MODE ?? process.env.CLAUDE_CHROME_PERMISSION_MODE, initialPermissionMode;
  if (rawPermissionMode)
    if (isPermissionMode(rawPermissionMode))
      initialPermissionMode = rawPermissionMode;
    else
      logger34.warn(`Invalid CLAUDE_CHROME_PERMISSION_MODE "${rawPermissionMode}". Valid values: ${PERMISSION_MODES4.join(", ")}`);
  return {
    serverName: "Claude in Chrome",
    logger: logger34,
    socketPath: getSecureSocketPath(),
    getSocketPaths: getAllSocketPaths,
    clientTypeId: "claude-code",
    onAuthenticationError: () => {
      logger34.warn("Authentication error occurred. Please ensure you are logged into the Claude browser extension with the same claude.ai account as Claude Code.");
    },
    onToolCallDisconnected: () => {
      return `Browser extension is not connected. Please ensure the Claude browser extension is installed and running (${EXTENSION_DOWNLOAD_URL}), and that you are logged into claude.ai with the same account as Claude Code. If this is your first time connecting to Chrome, you may need to restart Chrome for the installation to take effect. If you continue to experience issues, please report a bug: ${BUG_REPORT_URL}`;
    },
    onExtensionPaired: (deviceId, name3) => {
      saveGlobalConfig((config11) => {
        if (config11.chromeExtension?.pairedDeviceId === deviceId && config11.chromeExtension?.pairedDeviceName === name3)
          return config11;
        return {
          ...config11,
          chromeExtension: {
            pairedDeviceId: deviceId,
            pairedDeviceName: name3
          }
        };
      }), logger34.info(`Paired with "${name3}" (${deviceId.slice(0, 8)})`);
    },
    getPersistedDeviceId: () => {
      return getGlobalConfig().chromeExtension?.pairedDeviceId;
    },
    ...chromeBridgeUrl && {
      bridgeConfig: {
        url: chromeBridgeUrl,
        getUserId: async () => {
          return getGlobalConfig().oauthAccount?.accountUuid;
        },
        getOAuthToken: async () => {
          return getClaudeAIOAuthTokens()?.accessToken ?? "";
        },
        ...isLocalBridge() && { devUserId: "dev_user_local" }
      }
    },
    ...initialPermissionMode && { initialPermissionMode },
    ...!1,
    trackEvent: (eventName, metadata) => {
      let safeMetadata = {};
      if (metadata)
        for (let [key3, value] of Object.entries(metadata)) {
          let safeKey = key3 === "status" ? "bridge_status" : key3;
          if (typeof value === "boolean" || typeof value === "number")
            safeMetadata[safeKey] = value;
          else if (typeof value === "string" && SAFE_BRIDGE_STRING_KEYS.has(safeKey))
            safeMetadata[safeKey] = value;
        }
      logEvent(eventName, safeMetadata);
    }
  };
}
async function runClaudeInChromeMcpServer() {
  enableConfigs(), initializeAnalyticsSink();
  let context7 = createChromeContext(), server = createClaudeForChromeMcpServer(context7), transport = new StdioServerTransport, exiting = !1, shutdownAndExit = async () => {
    if (exiting)
      return;
    exiting = !0, await shutdown1PEventLogging(), await shutdownDatadog(), process.exit(0);
  };
  process.stdin.on("end", () => void shutdownAndExit()), process.stdin.on("error", () => void shutdownAndExit()), logForDebugging("[Claude in Chrome] Starting MCP server"), await server.connect(transport), logForDebugging("[Claude in Chrome] MCP server started");
}

class DebugLogger {
  silly(message, ...args) {
    logForDebugging(format4(message, ...args), { level: "debug" });
  }
  debug(message, ...args) {
    logForDebugging(format4(message, ...args), { level: "debug" });
  }
  info(message, ...args) {
    logForDebugging(format4(message, ...args), { level: "info" });
  }
  warn(message, ...args) {
    logForDebugging(format4(message, ...args), { level: "warn" });
  }
  error(message, ...args) {
    logForDebugging(format4(message, ...args), { level: "error" });
  }
}
var EXTENSION_DOWNLOAD_URL = "https://claude.ai/chrome", BUG_REPORT_URL = "https://github.com/anthropics/claude-code/issues/new?labels=bug,claude-in-chrome", SAFE_BRIDGE_STRING_KEYS, PERMISSION_MODES4;
var init_mcpServer = __esm(() => {
  init_claude_for_chrome_mcp();
  init_stdio2();
  init_auth14();
  init_config4();
  init_debug();
  init_envUtils();
  init_sideQuery();
  init_common3();
  SAFE_BRIDGE_STRING_KEYS = /* @__PURE__ */ new Set([
    "bridge_status",
    "error_type",
    "tool_name"
  ]), PERMISSION_MODES4 = [
    "ask",
    "skip_all_permission_checks",
    "follow_a_plan"
  ];
});
