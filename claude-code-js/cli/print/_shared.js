// Shared module state and imports
// Original: src/cli/print.ts
__export(exports_print, {
  runHeadless: () => runHeadless,
  removeInterruptedMessage: () => removeInterruptedMessage,
  reconcileMcpServers: () => reconcileMcpServers,
  joinPromptValues: () => joinPromptValues,
  handleOrphanedPermissionResponse: () => handleOrphanedPermissionResponse,
  handleMcpSetServers: () => handleMcpSetServers,
  getCanUseToolFn: () => getCanUseToolFn,
  createCanUseToolWithPermissionPrompt: () => createCanUseToolWithPermissionPrompt,
  canBatchWith: () => canBatchWith
});
import { readFile as readFile55, stat as stat45 } from "fs/promises";
import { dirname as dirname65 } from "path";
import { cwd as cwd2 } from "process";
import { randomUUID as randomUUID48 } from "crypto";

