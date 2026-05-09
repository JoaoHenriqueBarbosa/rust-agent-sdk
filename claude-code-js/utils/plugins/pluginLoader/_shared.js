// Shared module state and imports
// Original: src/utils/plugins/pluginLoader.ts
import {
  copyFile as copyFile7,
  readdir as readdir18,
  readFile as readFile35,
  readlink as readlink2,
  realpath as realpath10,
  rename as rename6,
  rm as rm11,
  rmdir as rmdir2,
  stat as stat32,
  symlink as symlink3
} from "fs/promises";
import { basename as basename30, dirname as dirname46, join as join100, relative as relative20, resolve as resolve39, sep as sep23 } from "path";
var PluginSettingsSchema, loadAllPlugins, loadAllPluginsCacheOnly;

