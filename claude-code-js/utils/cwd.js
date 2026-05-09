// Original: src/utils/cwd.ts
import { AsyncLocalStorage } from "async_hooks";
function runWithCwdOverride(cwd2, fn) {
  return cwdOverrideStorage.run(cwd2, fn);
}
function pwd() {
  return cwdOverrideStorage.getStore() ?? getCwdState();
}
function getCwd() {
  try {
    return pwd();
  } catch {
    return getOriginalCwd();
  }
}
var cwdOverrideStorage;
var init_cwd2 = __esm(() => {
  init_state();
  cwdOverrideStorage = new AsyncLocalStorage;
});
