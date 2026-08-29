// Shared module state and imports
// Original: src/tools/FileReadTool/FileReadTool.ts
import { readdir as readdir14, readFile as readFileAsync } from "fs/promises";
import * as path20 from "path";
import { posix as posix6, win32 as win323 } from "path";
var BLOCKED_DEVICE_PATHS, THIN_SPACE, fileReadListeners, MaxFileReadTokenExceededError, IMAGE_EXTENSIONS, inputSchema40, outputSchema32, FileReadTool, CYBER_RISK_MITIGATION_REMINDER, MITIGATION_EXEMPT_MODELS, memoryFileMtimes;

