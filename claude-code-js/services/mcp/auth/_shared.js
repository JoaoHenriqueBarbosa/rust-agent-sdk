// Shared module state and imports
// Original: src/services/mcp/auth.ts
import { createHash as createHash9, randomBytes as randomBytes6, randomUUID as randomUUID7 } from "crypto";
import { mkdir as mkdir6 } from "fs/promises";
import { createServer as createServer5 } from "http";
import { join as join53 } from "path";
import { parse as parse14 } from "url";

var import_xss2, AUTH_REQUEST_TIMEOUT_MS = 30000, MAX_LOCK_RETRIES = 5, SENSITIVE_OAUTH_PARAMS, NONSTANDARD_INVALID_GRANT_ALIASES, AuthenticationCancelledError;

