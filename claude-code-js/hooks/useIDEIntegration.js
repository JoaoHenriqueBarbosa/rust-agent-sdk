// Original: src/hooks/useIDEIntegration.tsx
function useIDEIntegration(t0) {
  let $3 = import_compiler_runtime339.c(7), {
    autoConnectIdeFlag,
    ideToInstallExtension,
    setDynamicMcpConfig,
    setShowIdeOnboarding,
    setIDEInstallationState
  } = t0, t1, t2;
  if ($3[0] !== autoConnectIdeFlag || $3[1] !== ideToInstallExtension || $3[2] !== setDynamicMcpConfig || $3[3] !== setIDEInstallationState || $3[4] !== setShowIdeOnboarding)
    t1 = () => {
      initializeIdeIntegration(function(ide2) {
        if (!ide2)
          return;
        if (!((getGlobalConfig().autoConnectIde || autoConnectIdeFlag || isSupportedTerminal() || process.env.CLAUDE_CODE_SSE_PORT || ideToInstallExtension || isEnvTruthy(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)) && !isEnvDefinedFalsy(process.env.CLAUDE_CODE_AUTO_CONNECT_IDE)))
          return;
        setDynamicMcpConfig((prev) => {
          if (prev?.ide)
            return prev;
          return {
            ...prev,
            ide: {
              type: ide2.url.startsWith("ws:") ? "ws-ide" : "sse-ide",
              url: ide2.url,
              ideName: ide2.name,
              authToken: ide2.authToken,
              ideRunningInWindows: ide2.ideRunningInWindows,
              scope: "dynamic"
            }
          };
        });
      }, ideToInstallExtension, () => setShowIdeOnboarding(!0), (status2) => setIDEInstallationState(status2));
    }, t2 = [autoConnectIdeFlag, ideToInstallExtension, setDynamicMcpConfig, setShowIdeOnboarding, setIDEInstallationState], $3[0] = autoConnectIdeFlag, $3[1] = ideToInstallExtension, $3[2] = setDynamicMcpConfig, $3[3] = setIDEInstallationState, $3[4] = setShowIdeOnboarding, $3[5] = t1, $3[6] = t2;
  else
    t1 = $3[5], t2 = $3[6];
  import_react278.useEffect(t1, t2);
}
var import_compiler_runtime339, import_react278;
var init_useIDEIntegration = __esm(() => {
  init_config4();
  init_envUtils();
  init_ide();
  import_compiler_runtime339 = __toESM(require_react_compiler_runtime_development(), 1), import_react278 = __toESM(require_react_development(), 1);
});
