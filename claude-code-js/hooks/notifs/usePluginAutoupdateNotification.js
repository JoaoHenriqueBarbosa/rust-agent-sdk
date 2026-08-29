// Original: src/hooks/notifs/usePluginAutoupdateNotification.tsx
function usePluginAutoupdateNotification() {
  let $3 = import_compiler_runtime351.c(7), {
    addNotification
  } = useNotifications(), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = [], $3[0] = t0;
  else
    t0 = $3[0];
  let [updatedPlugins, setUpdatedPlugins] = import_react289.useState(t0), t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      if (getIsRemoteMode())
        return;
      return onPluginsAutoUpdated((plugins) => {
        logForDebugging(`Plugin autoupdate notification: ${plugins.length} plugin(s) updated`), setUpdatedPlugins(plugins);
      });
    }, t2 = [], $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react289.useEffect(t1, t2);
  let t3, t4;
  if ($3[3] !== addNotification || $3[4] !== updatedPlugins)
    t3 = () => {
      if (getIsRemoteMode())
        return;
      if (updatedPlugins.length === 0)
        return;
      let pluginNames = updatedPlugins.map(_temp254), displayNames = pluginNames.length <= 2 ? pluginNames.join(" and ") : `${pluginNames.length} plugins`;
      addNotification({
        key: "plugin-autoupdate-restart",
        jsx: /* @__PURE__ */ jsx_dev_runtime450.jsxDEV(jsx_dev_runtime450.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime450.jsxDEV(ThemedText, {
              color: "success",
              children: [
                pluginNames.length === 1 ? "Plugin" : "Plugins",
                " updated:",
                " ",
                displayNames
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime450.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " \xB7 Run /reload-plugins to apply"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        priority: "low",
        timeoutMs: 1e4
      }), logForDebugging(`Showing plugin autoupdate notification for: ${pluginNames.join(", ")}`);
    }, t4 = [updatedPlugins, addNotification], $3[3] = addNotification, $3[4] = updatedPlugins, $3[5] = t3, $3[6] = t4;
  else
    t3 = $3[5], t4 = $3[6];
  import_react289.useEffect(t3, t4);
}
function _temp254(id) {
  let atIndex = id.indexOf("@");
  return atIndex > 0 ? id.substring(0, atIndex) : id;
}
var import_compiler_runtime351, import_react289, jsx_dev_runtime450;
var init_usePluginAutoupdateNotification = __esm(() => {
  init_state();
  init_notifications();
  init_ink2();
  init_debug();
  init_pluginAutoupdate();
  import_compiler_runtime351 = __toESM(require_react_compiler_runtime_development(), 1), import_react289 = __toESM(require_react_development(), 1), jsx_dev_runtime450 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
