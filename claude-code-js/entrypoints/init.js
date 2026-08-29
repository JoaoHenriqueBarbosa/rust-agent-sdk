// Original: src/entrypoints/init.ts
function initializeTelemetryAfterTrust() {
  if (isEligibleForRemoteManagedSettings()) {
    if (getIsNonInteractiveSession() && isBetaTracingEnabled())
      doInitializeTelemetry().catch((error44) => {
        logForDebugging(`[3P telemetry] Eager telemetry init failed (beta tracing): ${errorMessage(error44)}`, { level: "error" });
      });
    logForDebugging("[3P telemetry] Waiting for remote managed settings before telemetry init"), waitForRemoteManagedSettingsToLoad().then(async () => {
      logForDebugging("[3P telemetry] Remote managed settings loaded, initializing telemetry"), applyConfigEnvironmentVariables(), await doInitializeTelemetry();
    }).catch((error44) => {
      logForDebugging(`[3P telemetry] Telemetry init failed (remote settings path): ${errorMessage(error44)}`, { level: "error" });
    });
  } else
    doInitializeTelemetry().catch((error44) => {
      logForDebugging(`[3P telemetry] Telemetry init failed: ${errorMessage(error44)}`, { level: "error" });
    });
}
async function doInitializeTelemetry() {
  if (telemetryInitialized)
    return;
  telemetryInitialized = !0;
  try {
    await setMeterState();
  } catch (error44) {
    throw telemetryInitialized = !1, error44;
  }
}
async function setMeterState() {
  let { initializeTelemetry: initializeTelemetry2 } = await Promise.resolve().then(() => (init_instrumentation(), exports_instrumentation)), meter = await initializeTelemetry2();
  if (meter)
    setMeter(meter, (name3, options2) => {
      let counter = meter?.createCounter(name3, options2);
      return {
        add(value, additionalAttributes = {}) {
          let mergedAttributes = {
            ...getTelemetryAttributes(),
            ...additionalAttributes
          };
          counter?.add(value, mergedAttributes);
        }
      };
    }), getSessionCounter()?.add(1);
}
var telemetryInitialized = !1, init2;
var init_init3 = __esm(() => {
  init_startupProfiler();
  init_state();
  init_config4();
  init_memoize();
  init_state();
  init_state();
  init_manager7();
  init_client8();
  init_policyLimits();
  init_remoteManagedSettings();
  init_apiPreconnect();
  init_caCertsConfig();
  init_cleanupRegistry();
  init_config4();
  init_debug();
  init_detectRepository();
  init_diagLogs();
  init_envDynamic();
  init_envUtils();
  init_errors();
  init_gracefulShutdown();
  init_managedEnv();
  init_mtls();
  init_filesystem();
  init_proxy();
  init_betaSessionTracing();
  init_telemetryAttributes();
  init_windowsPaths();
  init2 = memoize_default(async () => {
    let initStartTime = Date.now();
    logForDiagnosticsNoPII("info", "init_started"), profileCheckpoint("init_function_start");
    try {
      let configsStart = Date.now();
      enableConfigs(), logForDiagnosticsNoPII("info", "init_configs_enabled", {
        duration_ms: Date.now() - configsStart
      }), profileCheckpoint("init_configs_enabled");
      let envVarsStart = Date.now();
      if (applySafeConfigEnvironmentVariables(), applyExtraCACertsFromConfig(), logForDiagnosticsNoPII("info", "init_safe_env_vars_applied", {
        duration_ms: Date.now() - envVarsStart
      }), profileCheckpoint("init_safe_env_vars_applied"), setupGracefulShutdown(), profileCheckpoint("init_after_graceful_shutdown"), Promise.all([
        Promise.resolve().then(() => exports_firstPartyEventLogger),
        Promise.resolve().then(() => (init_growthbook(), exports_growthbook))
      ]).then(([fp, gb]) => {
        fp.initialize1PEventLogging(), gb.onGrowthBookRefresh(() => {
          fp.reinitialize1PEventLoggingIfConfigChanged();
        });
      }), profileCheckpoint("init_after_1p_event_logging"), populateOAuthAccountInfoIfNeeded(), profileCheckpoint("init_after_oauth_populate"), initJetBrainsDetection(), profileCheckpoint("init_after_jetbrains_detection"), detectCurrentRepository(), isEligibleForRemoteManagedSettings())
        initializeRemoteManagedSettingsLoadingPromise();
      if (isPolicyLimitsEligible())
        initializePolicyLimitsLoadingPromise();
      profileCheckpoint("init_after_remote_settings_check"), recordFirstStartTime();
      let mtlsStart = Date.now();
      logForDebugging("[init] configureGlobalMTLS starting"), configureGlobalMTLS(), logForDiagnosticsNoPII("info", "init_mtls_configured", {
        duration_ms: Date.now() - mtlsStart
      }), logForDebugging("[init] configureGlobalMTLS complete");
      let proxyStart = Date.now();
      if (logForDebugging("[init] configureGlobalAgents starting"), configureGlobalAgents(), logForDiagnosticsNoPII("info", "init_proxy_configured", {
        duration_ms: Date.now() - proxyStart
      }), logForDebugging("[init] configureGlobalAgents complete"), profileCheckpoint("init_network_configured"), preconnectAnthropicApi(), isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
        try {
          let { initUpstreamProxy: initUpstreamProxy2, getUpstreamProxyEnv: getUpstreamProxyEnv2 } = await Promise.resolve().then(() => (init_upstreamproxy(), exports_upstreamproxy)), { registerUpstreamProxyEnvFn: registerUpstreamProxyEnvFn2 } = await Promise.resolve().then(() => (init_subprocessEnv(), exports_subprocessEnv));
          registerUpstreamProxyEnvFn2(getUpstreamProxyEnv2), await initUpstreamProxy2();
        } catch (err2) {
          logForDebugging(`[init] upstreamproxy init failed: ${err2 instanceof Error ? err2.message : String(err2)}; continuing without proxy`, { level: "warn" });
        }
      if (setShellIfWindows(), registerCleanup(shutdownLspServerManager), registerCleanup(async () => {
        let { cleanupSessionTeams: cleanupSessionTeams2 } = await Promise.resolve().then(() => (init_teamHelpers(), exports_teamHelpers));
        await cleanupSessionTeams2();
      }), isScratchpadEnabled()) {
        let scratchpadStart = Date.now();
        await ensureScratchpadDir(), logForDiagnosticsNoPII("info", "init_scratchpad_created", {
          duration_ms: Date.now() - scratchpadStart
        });
      }
      logForDiagnosticsNoPII("info", "init_completed", {
        duration_ms: Date.now() - initStartTime
      }), profileCheckpoint("init_function_end");
    } catch (error44) {
      if (error44 instanceof ConfigParseError) {
        if (getIsNonInteractiveSession()) {
          process.stderr.write(`Configuration error in ${error44.filePath}: ${error44.message}
`), gracefulShutdownSync(1);
          return;
        }
        return Promise.resolve().then(() => (init_InvalidConfigDialog(), exports_InvalidConfigDialog)).then((m4) => m4.showInvalidConfigDialog({ error: error44 }));
      } else
        throw error44;
    }
  });
});
