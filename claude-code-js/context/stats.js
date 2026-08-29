// Original: src/context/stats.tsx
function percentile(sorted, p4) {
  let index2 = p4 / 100 * (sorted.length - 1), lower = Math.floor(index2), upper = Math.ceil(index2);
  if (lower === upper)
    return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index2 - lower);
}
function createStatsStore() {
  let metrics = /* @__PURE__ */ new Map, histograms = /* @__PURE__ */ new Map, sets = /* @__PURE__ */ new Map;
  return {
    increment(name3, value = 1) {
      metrics.set(name3, (metrics.get(name3) ?? 0) + value);
    },
    set(name3, value) {
      metrics.set(name3, value);
    },
    observe(name3, value) {
      let h4 = histograms.get(name3);
      if (!h4)
        h4 = {
          reservoir: [],
          count: 0,
          sum: 0,
          min: value,
          max: value
        }, histograms.set(name3, h4);
      if (h4.count++, h4.sum += value, value < h4.min)
        h4.min = value;
      if (value > h4.max)
        h4.max = value;
      if (h4.reservoir.length < RESERVOIR_SIZE)
        h4.reservoir.push(value);
      else {
        let j4 = Math.floor(Math.random() * h4.count);
        if (j4 < RESERVOIR_SIZE)
          h4.reservoir[j4] = value;
      }
    },
    add(name3, value) {
      let s2 = sets.get(name3);
      if (!s2)
        s2 = /* @__PURE__ */ new Set, sets.set(name3, s2);
      s2.add(value);
    },
    getAll() {
      let result = Object.fromEntries(metrics);
      for (let [name3, h4] of histograms) {
        if (h4.count === 0)
          continue;
        result[`${name3}_count`] = h4.count, result[`${name3}_min`] = h4.min, result[`${name3}_max`] = h4.max, result[`${name3}_avg`] = h4.sum / h4.count;
        let sorted = [...h4.reservoir].sort((a2, b) => a2 - b);
        result[`${name3}_p50`] = percentile(sorted, 50), result[`${name3}_p95`] = percentile(sorted, 95), result[`${name3}_p99`] = percentile(sorted, 99);
      }
      for (let [name3, s2] of sets)
        result[name3] = s2.size;
      return result;
    }
  };
}
function StatsProvider(t0) {
  let $3 = import_compiler_runtime281.c(7), {
    store: externalStore,
    children
  } = t0, t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = createStatsStore(), $3[0] = t1;
  else
    t1 = $3[0];
  let store = externalStore ?? t1, t2, t3;
  if ($3[1] !== store)
    t2 = () => {
      let flush = () => {
        let metrics = store.getAll();
        if (Object.keys(metrics).length > 0)
          saveCurrentProjectConfig((current) => ({
            ...current,
            lastSessionMetrics: metrics
          }));
      };
      return process.on("exit", flush), () => {
        process.off("exit", flush);
      };
    }, t3 = [store], $3[1] = store, $3[2] = t2, $3[3] = t3;
  else
    t2 = $3[2], t3 = $3[3];
  import_react196.useEffect(t2, t3);
  let t4;
  if ($3[4] !== children || $3[5] !== store)
    t4 = /* @__PURE__ */ jsx_dev_runtime364.jsxDEV(StatsContext.Provider, {
      value: store,
      children
    }, void 0, !1, void 0, this), $3[4] = children, $3[5] = store, $3[6] = t4;
  else
    t4 = $3[6];
  return t4;
}
var import_compiler_runtime281, import_react196, jsx_dev_runtime364, RESERVOIR_SIZE = 1024, StatsContext;
var init_stats4 = __esm(() => {
  init_config4();
  import_compiler_runtime281 = __toESM(require_react_compiler_runtime_development(), 1), import_react196 = __toESM(require_react_development(), 1), jsx_dev_runtime364 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  StatsContext = import_react196.createContext(null);
});
