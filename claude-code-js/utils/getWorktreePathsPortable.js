// Original: src/utils/getWorktreePathsPortable.ts
import { execFile as execFileCb } from "child_process";
import { promisify as promisify3 } from "util";
var execFileAsync;
var init_getWorktreePathsPortable = __esm(() => {
  execFileAsync = promisify3(execFileCb);
});
