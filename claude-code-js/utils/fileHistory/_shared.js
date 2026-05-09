// Shared module state and imports
// Original: src/utils/fileHistory.ts
import { createHash as createHash15 } from "crypto";
import {
  chmod as chmod6,
  copyFile as copyFile4,
  link as link3,
  mkdir as mkdir14,
  readFile as readFile22,
  stat as stat20,
  unlink as unlink8
} from "fs/promises";
import { dirname as dirname31, isAbsolute as isAbsolute14, join as join74, relative as relative10 } from "path";
import { inspect as inspect4 } from "util";

