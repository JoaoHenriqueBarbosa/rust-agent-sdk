// Original: src/utils/plugins/dependencyResolver.ts
function qualifyDependency(dep, declaringPluginId) {
  if (parsePluginIdentifier(dep).marketplace)
    return dep;
  let mkt = parsePluginIdentifier(declaringPluginId).marketplace;
  if (!mkt || mkt === INLINE_MARKETPLACE)
    return dep;
  return `${dep}@${mkt}`;
}
async function resolveDependencyClosure(rootId, lookup, alreadyEnabled, allowedCrossMarketplaces = /* @__PURE__ */ new Set) {
  let rootMarketplace = parsePluginIdentifier(rootId).marketplace, closure = [], visited = /* @__PURE__ */ new Set, stack = [];
  async function walk(id, requiredBy) {
    if (id !== rootId && alreadyEnabled.has(id))
      return null;
    let idMarketplace = parsePluginIdentifier(id).marketplace;
    if (idMarketplace !== rootMarketplace && !(idMarketplace && allowedCrossMarketplaces.has(idMarketplace)))
      return {
        ok: !1,
        reason: "cross-marketplace",
        dependency: id,
        requiredBy
      };
    if (stack.includes(id))
      return { ok: !1, reason: "cycle", chain: [...stack, id] };
    if (visited.has(id))
      return null;
    visited.add(id);
    let entry = await lookup(id);
    if (!entry)
      return { ok: !1, reason: "not-found", missing: id, requiredBy };
    stack.push(id);
    for (let rawDep of entry.dependencies ?? []) {
      let dep = qualifyDependency(rawDep, id), err2 = await walk(dep, id);
      if (err2)
        return err2;
    }
    return stack.pop(), closure.push(id), null;
  }
  let err = await walk(rootId, rootId);
  if (err)
    return err;
  return { ok: !0, closure };
}
function verifyAndDemote(plugins) {
  let known = new Set(plugins.map((p4) => p4.source)), enabled2 = new Set(plugins.filter((p4) => p4.enabled).map((p4) => p4.source)), knownByName = new Set(plugins.map((p4) => parsePluginIdentifier(p4.source).name)), enabledByName = /* @__PURE__ */ new Map;
  for (let id of enabled2) {
    let n5 = parsePluginIdentifier(id).name;
    enabledByName.set(n5, (enabledByName.get(n5) ?? 0) + 1);
  }
  let errors6 = [], changed = !0;
  while (changed) {
    changed = !1;
    for (let p4 of plugins) {
      if (!enabled2.has(p4.source))
        continue;
      for (let rawDep of p4.manifest.dependencies ?? []) {
        let dep = qualifyDependency(rawDep, p4.source), isBare = !parsePluginIdentifier(dep).marketplace;
        if (!(isBare ? (enabledByName.get(dep) ?? 0) > 0 : enabled2.has(dep))) {
          enabled2.delete(p4.source);
          let count3 = enabledByName.get(p4.name) ?? 0;
          if (count3 <= 1)
            enabledByName.delete(p4.name);
          else
            enabledByName.set(p4.name, count3 - 1);
          errors6.push({
            type: "dependency-unsatisfied",
            source: p4.source,
            plugin: p4.name,
            dependency: dep,
            reason: (isBare ? knownByName.has(dep) : known.has(dep)) ? "not-enabled" : "not-found"
          }), changed = !0;
          break;
        }
      }
    }
  }
  return { demoted: new Set(plugins.filter((p4) => p4.enabled && !enabled2.has(p4.source)).map((p4) => p4.source)), errors: errors6 };
}
function findReverseDependents(pluginId, plugins) {
  let { name: targetName } = parsePluginIdentifier(pluginId);
  return plugins.filter((p4) => p4.enabled && p4.source !== pluginId && (p4.manifest.dependencies ?? []).some((d) => {
    let qualified = qualifyDependency(d, p4.source);
    return parsePluginIdentifier(qualified).marketplace ? qualified === pluginId : qualified === targetName;
  })).map((p4) => p4.name);
}
function getEnabledPluginIdsForScope(settingSource) {
  return new Set(Object.entries(getSettingsForSource(settingSource)?.enabledPlugins ?? {}).filter(([, v2]) => v2 === !0 || Array.isArray(v2)).map(([k3]) => k3));
}
function formatDependencyCountSuffix(installedDeps) {
  if (installedDeps.length === 0)
    return "";
  let n5 = installedDeps.length;
  return ` (+ ${n5} ${n5 === 1 ? "dependency" : "dependencies"})`;
}
function formatReverseDependentsSuffix(rdeps) {
  if (!rdeps || rdeps.length === 0)
    return "";
  return ` \u2014 warning: required by ${rdeps.join(", ")}`;
}
var INLINE_MARKETPLACE = "inline";
var init_dependencyResolver = __esm(() => {
  init_settings2();
  init_pluginIdentifier();
});
