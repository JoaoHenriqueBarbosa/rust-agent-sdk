// Original: src/hooks/useMemoryUsage.ts
function useMemoryUsage() {
  let [memoryUsage, setMemoryUsage] = import_react229.useState(null);
  return useInterval(() => {
    let heapUsed = process.memoryUsage().heapUsed, status2 = heapUsed >= CRITICAL_MEMORY_THRESHOLD ? "critical" : heapUsed >= HIGH_MEMORY_THRESHOLD ? "high" : "normal";
    setMemoryUsage((prev) => {
      if (status2 === "normal")
        return prev === null ? prev : null;
      return { heapUsed, status: status2 };
    });
  }, 1e4), memoryUsage;
}
var import_react229, HIGH_MEMORY_THRESHOLD = 1610612736, CRITICAL_MEMORY_THRESHOLD = 2684354560;
var init_useMemoryUsage = __esm(() => {
  init_dist4();
  import_react229 = __toESM(require_react_development(), 1);
});
