// Original: src/utils/plugins/reconciler.ts
import { isAbsolute as isAbsolute26, resolve as resolve46 } from "path";
function diffMarketplaces(declared, materialized, opts) {
  let missing = [], sourceChanged = [], upToDate = [];
  for (let [name3, intent] of Object.entries(declared)) {
    let state4 = materialized[name3], normalizedIntent = normalizeSource(intent.source, opts?.projectRoot);
    if (!state4)
      missing.push(name3);
    else if (intent.sourceIsFallback)
      upToDate.push(name3);
    else if (!isEqual_default(normalizedIntent, state4.source))
      sourceChanged.push({
        name: name3,
        declaredSource: normalizedIntent,
        materializedSource: state4.source
      });
    else
      upToDate.push(name3);
  }
  return { missing, sourceChanged, upToDate };
}
async function reconcileMarketplaces(opts) {
  let declared = getDeclaredMarketplaces();
  if (Object.keys(declared).length === 0)
    return { installed: [], updated: [], failed: [], upToDate: [], skipped: [] };
  let materialized;
  try {
    materialized = await loadKnownMarketplacesConfig();
  } catch (e) {
    logError2(e), materialized = {};
  }
  let diff3 = diffMarketplaces(declared, materialized, {
    projectRoot: getOriginalCwd()
  }), work = [
    ...diff3.missing.map((name3) => ({
      name: name3,
      source: normalizeSource(declared[name3].source),
      action: "install"
    })),
    ...diff3.sourceChanged.map(({ name: name3, declaredSource }) => ({
      name: name3,
      source: declaredSource,
      action: "update"
    }))
  ], skipped = [], toProcess = [];
  for (let item of work) {
    if (opts?.skip?.(item.name, item.source)) {
      skipped.push(item.name);
      continue;
    }
    if (item.action === "update" && isLocalMarketplaceSource(item.source) && !await pathExists(item.source.path)) {
      logForDebugging(`[reconcile] '${item.name}' declared path does not exist; keeping materialized entry`), skipped.push(item.name);
      continue;
    }
    toProcess.push(item);
  }
  if (toProcess.length === 0)
    return {
      installed: [],
      updated: [],
      failed: [],
      upToDate: diff3.upToDate,
      skipped
    };
  logForDebugging(`[reconcile] ${toProcess.length} marketplace(s): ${toProcess.map((w2) => `${w2.name}(${w2.action})`).join(", ")}`);
  let installed = [], updated = [], failed = [];
  for (let i5 = 0;i5 < toProcess.length; i5++) {
    let { name: name3, source, action: action2 } = toProcess[i5];
    opts?.onProgress?.({
      type: "installing",
      name: name3,
      action: action2,
      index: i5 + 1,
      total: toProcess.length
    });
    try {
      let result = await addMarketplaceSource(source);
      if (action2 === "install")
        installed.push(name3);
      else
        updated.push(name3);
      opts?.onProgress?.({
        type: "installed",
        name: name3,
        alreadyMaterialized: result.alreadyMaterialized
      });
    } catch (e) {
      let error44 = errorMessage(e);
      failed.push({ name: name3, error: error44 }), opts?.onProgress?.({ type: "failed", name: name3, error: error44 }), logError2(e);
    }
  }
  return { installed, updated, failed, upToDate: diff3.upToDate, skipped };
}
function normalizeSource(source, projectRoot) {
  if ((source.source === "directory" || source.source === "file") && !isAbsolute26(source.path)) {
    let base2 = projectRoot ?? getOriginalCwd(), canonicalRoot = findCanonicalGitRoot(base2);
    return {
      ...source,
      path: resolve46(canonicalRoot ?? base2, source.path)
    };
  }
  return source;
}
var init_reconciler2 = __esm(() => {
  init_isEqual();
  init_state();
  init_debug();
  init_errors();
  init_file();
  init_git();
  init_log3();
  init_marketplaceManager();
  init_schemas3();
});
