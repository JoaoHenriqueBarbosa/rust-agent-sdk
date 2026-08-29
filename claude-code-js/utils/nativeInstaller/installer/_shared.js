// Shared module state and imports
// Original: src/utils/nativeInstaller/installer.ts
import { constants as fsConstants5 } from "fs";
import {
  access as access3,
  chmod as chmod5,
  copyFile as copyFile3,
  lstat as lstat4,
  mkdir as mkdir10,
  readdir as readdir8,
  readlink,
  realpath as realpath6,
  rename as rename2,
  rm as rm5,
  rmdir,
  stat as stat19,
  symlink as symlink2,
  unlink as unlink6,
  writeFile as writeFile15
} from "fs/promises";
import { homedir as homedir23 } from "os";
import { basename as basename15, delimiter as delimiter3, dirname as dirname30, join as join69, resolve as resolve26 } from "path";

