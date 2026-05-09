// Original: src/hooks/useClaudeCodeHintRecommendation.tsx
function useClaudeCodeHintRecommendation() {
  let $3 = import_compiler_runtime349.c(11), pendingHint2 = React145.useSyncExternalStore(subscribeToPendingHint, getPendingHintSnapshot), {
    addNotification
  } = useNotifications(), {
    recommendation,
    clearRecommendation,
    tryResolve
  } = usePluginRecommendationBase(), t0, t1;
  if ($3[0] !== pendingHint2 || $3[1] !== tryResolve)
    t0 = () => {
      if (!pendingHint2)
        return;
      tryResolve(async () => {
        let resolved = await resolvePluginHint(pendingHint2);
        if (resolved)
          logForDebugging(`[useClaudeCodeHintRecommendation] surfacing ${resolved.pluginId} from ${resolved.sourceCommand}`), markShownThisSession();
        if (getPendingHintSnapshot() === pendingHint2)
          clearPendingHint();
        return resolved;
      });
    }, t1 = [pendingHint2, tryResolve], $3[0] = pendingHint2, $3[1] = tryResolve, $3[2] = t0, $3[3] = t1;
  else
    t0 = $3[2], t1 = $3[3];
  React145.useEffect(t0, t1);
  let t2;
  if ($3[4] !== addNotification || $3[5] !== clearRecommendation || $3[6] !== recommendation)
    t2 = (response7) => {
      if (!recommendation)
        return;
      markHintPluginShown(recommendation.pluginId), logEvent("tengu_plugin_hint_response", {
        _PROTO_plugin_name: recommendation.pluginName,
        _PROTO_marketplace_name: recommendation.marketplaceName,
        response: response7
      });
      bb15:
        switch (response7) {
          case "yes": {
            let {
              pluginId,
              pluginName,
              marketplaceName
            } = recommendation;
            installPluginAndNotify(pluginId, pluginName, "hint-plugin", addNotification, async (pluginData) => {
              let result = await installPluginFromMarketplace({
                pluginId,
                entry: pluginData.entry,
                marketplaceName,
                scope: "user",
                trigger: "hint"
              });
              if (!result.success)
                throw Error(result.error);
            });
            break bb15;
          }
          case "disable": {
            disableHintRecommendations();
            break bb15;
          }
          case "no":
        }
      clearRecommendation();
    }, $3[4] = addNotification, $3[5] = clearRecommendation, $3[6] = recommendation, $3[7] = t2;
  else
    t2 = $3[7];
  let handleResponse = t2, t3;
  if ($3[8] !== handleResponse || $3[9] !== recommendation)
    t3 = {
      recommendation,
      handleResponse
    }, $3[8] = handleResponse, $3[9] = recommendation, $3[10] = t3;
  else
    t3 = $3[10];
  return t3;
}
var import_compiler_runtime349, React145;
var init_useClaudeCodeHintRecommendation = __esm(() => {
  init_notifications();
  init_claudeCodeHints();
  init_debug();
  init_hintRecommendation();
  init_pluginInstallationHelpers();
  init_usePluginRecommendationBase();
  import_compiler_runtime349 = __toESM(require_react_compiler_runtime_development(), 1), React145 = __toESM(require_react_development(), 1);
});
