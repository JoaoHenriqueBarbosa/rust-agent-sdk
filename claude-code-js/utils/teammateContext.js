// Original: src/utils/teammateContext.ts
import { AsyncLocalStorage as AsyncLocalStorage4 } from "async_hooks";
function getTeammateContext() {
  return teammateContextStorage.getStore();
}
function runWithTeammateContext(context3, fn) {
  return teammateContextStorage.run(context3, fn);
}
function isInProcessTeammate() {
  return teammateContextStorage.getStore() !== void 0;
}
function createTeammateContext(config10) {
  return {
    ...config10,
    isInProcess: !0
  };
}
var teammateContextStorage;
var init_teammateContext = __esm(() => {
  teammateContextStorage = new AsyncLocalStorage4;
});
