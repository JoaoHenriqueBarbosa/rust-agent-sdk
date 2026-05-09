// Original: src/commands/plugin/pluginDetailsHelpers.tsx
function extractGitHubRepo(plugin) {
  if (plugin.entry.source && typeof plugin.entry.source === "object" && "source" in plugin.entry.source && plugin.entry.source.source === "github" && typeof plugin.entry.source === "object" && "repo" in plugin.entry.source)
    return plugin.entry.source.repo;
  return null;
}
function buildPluginDetailsMenuOptions(hasHomepage, githubRepo) {
  let options2 = [{
    label: "Install for you (user scope)",
    action: "install-user"
  }, {
    label: "Install for all collaborators on this repository (project scope)",
    action: "install-project"
  }, {
    label: "Install for you, in this repo only (local scope)",
    action: "install-local"
  }];
  if (hasHomepage)
    options2.push({
      label: "Open homepage",
      action: "homepage"
    });
  if (githubRepo)
    options2.push({
      label: "View on GitHub",
      action: "github"
    });
  return options2.push({
    label: "Back to plugin list",
    action: "back"
  }), options2;
}
function PluginSelectionKeyHint(t0) {
  let $3 = import_compiler_runtime188.c(7), {
    hasSelection: hasSelection2
  } = t0, t1;
  if ($3[0] !== hasSelection2)
    t1 = hasSelection2 && /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(ConfigurableShortcutHint, {
      action: "plugin:install",
      context: "Plugin",
      fallback: "i",
      description: "install",
      bold: !0
    }, void 0, !1, void 0, this), $3[0] = hasSelection2, $3[1] = t1;
  else
    t1 = $3[1];
  let t2, t3, t4;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(ConfigurableShortcutHint, {
      action: "plugin:toggle",
      context: "Plugin",
      fallback: "Space",
      description: "toggle"
    }, void 0, !1, void 0, this), t3 = /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(ConfigurableShortcutHint, {
      action: "select:accept",
      context: "Select",
      fallback: "Enter",
      description: "details"
    }, void 0, !1, void 0, this), t4 = /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(ConfigurableShortcutHint, {
      action: "confirm:no",
      context: "Confirmation",
      fallback: "Esc",
      description: "back"
    }, void 0, !1, void 0, this), $3[2] = t2, $3[3] = t3, $3[4] = t4;
  else
    t2 = $3[2], t3 = $3[3], t4 = $3[4];
  let t5;
  if ($3[5] !== t1)
    t5 = /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: /* @__PURE__ */ jsx_dev_runtime237.jsxDEV(Byline, {
          children: [
            t1,
            t2,
            t3,
            t4
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t1, $3[6] = t5;
  else
    t5 = $3[6];
  return t5;
}
var import_compiler_runtime188, jsx_dev_runtime237;
var init_pluginDetailsHelpers = __esm(() => {
  init_ConfigurableShortcutHint();
  init_Byline();
  init_ink2();
  import_compiler_runtime188 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime237 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
