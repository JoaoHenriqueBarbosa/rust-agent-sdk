// Original: src/components/memory/MemoryUpdateNotification.tsx
import { homedir as homedir30 } from "os";
import { relative as relative24 } from "path";
function getRelativeMemoryPath(path22) {
  let homeDir = homedir30(), cwd2 = getCwd(), relativeToHome = path22.startsWith(homeDir) ? "~" + path22.slice(homeDir.length) : null, relativeToCwd = path22.startsWith(cwd2) ? "./" + relative24(cwd2, path22) : null;
  if (relativeToHome && relativeToCwd)
    return relativeToHome.length <= relativeToCwd.length ? relativeToHome : relativeToCwd;
  return relativeToHome || relativeToCwd || path22;
}
var import_compiler_runtime161, jsx_dev_runtime201;
var init_MemoryUpdateNotification = __esm(() => {
  init_ink2();
  init_cwd2();
  import_compiler_runtime161 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime201 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
