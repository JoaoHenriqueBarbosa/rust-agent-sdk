// Original: src/utils/workloadContext.ts
import { AsyncLocalStorage as AsyncLocalStorage2 } from "async_hooks";
function getWorkload() {
  return workloadStorage.getStore()?.workload;
}
function runWithWorkload(workload, fn) {
  return workloadStorage.run({ workload }, fn);
}
var workloadStorage;
var init_workloadContext = __esm(() => {
  workloadStorage = new AsyncLocalStorage2;
});
