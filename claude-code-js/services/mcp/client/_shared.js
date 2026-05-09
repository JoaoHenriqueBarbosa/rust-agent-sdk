// Shared module state and imports
// Original: src/services/mcp/client.ts
import { mkdir as mkdir8, readFile as readFile15, unlink as unlink3, writeFile as writeFile10 } from "fs/promises";
import { dirname as dirname29, join as join58 } from "path";
var McpAuthError, McpSessionExpiredError, McpToolCallError_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS, DEFAULT_MCP_TOOL_TIMEOUT_MS = 1e8, MAX_MCP_DESCRIPTION_LENGTH = 2048, claudeInChromeToolRendering = () => (init_toolRendering(), __toCommonJS(exports_toolRendering)), MCP_AUTH_CACHE_TTL_MS = 900000, authCachePromise = null, writeChain, IMAGE_MIME_TYPES, MCP_REQUEST_TIMEOUT_MS = 60000, MCP_STREAMABLE_HTTP_ACCEPT = "application/json, text/event-stream", ALLOWED_IDE_TOOLS, connectToServer, MCP_FETCH_CACHE_SIZE = 20, fetchToolsForClient, fetchResourcesForClient, fetchCommandsForClient;

