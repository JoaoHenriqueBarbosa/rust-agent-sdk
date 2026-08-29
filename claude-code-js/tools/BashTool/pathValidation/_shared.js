// Shared module state and imports
// Original: src/tools/BashTool/pathValidation.ts
import { homedir as homedir18 } from "os";
import { isAbsolute as isAbsolute11, resolve as resolve23 } from "path";
var PATH_EXTRACTORS, SUPPORTED_PATH_COMMANDS, ACTION_VERBS, COMMAND_OPERATION_TYPE, COMMAND_VALIDATOR, TIMEOUT_FLAG_VALUE_RE;

