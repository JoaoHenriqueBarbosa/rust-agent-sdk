// Shared module state and imports
// Original: src/services/mcp/config.ts
import { chmod as chmod2, open as open5, rename, stat as stat17, unlink as unlink2 } from "fs/promises";
import { dirname as dirname28, join as join51, parse as parse12 } from "path";
var CCR_PROXY_PATH_MARKERS, doesEnterpriseMcpConfigExist, DEFAULT_DISABLED_BUILTIN = null;

