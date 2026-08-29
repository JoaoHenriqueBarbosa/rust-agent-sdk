// Original: src/interactiveHelpers.tsx
import { appendFileSync as appendFileSync4 } from "fs";
function completeOnboarding() {
  saveGlobalConfig((current) => ({
    ...current,
    hasCompletedOnboarding: !0,
    lastOnboardingVersion: "2.1.90"
  }));
}
function showDialog(root3, renderer) {
  return new Promise((resolve47) => {
    let done = (result) => void resolve47(result);
    root3.render(renderer(done));
  });
}
async function exitWithError2(root3, message, beforeExit) {
  return exitWithMessage(root3, message, {
    color: "error",
    beforeExit
  });
}
async function exitWithMessage(root3, message, options2) {
  let {
    Text: Text7
  } = await Promise.resolve().then(() => (init_ink2(), exports_ink)), color3 = options2?.color, exitCode = options2?.exitCode ?? 1;
  root3.render(color3 ? /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(Text7, {
    color: color3,
    children: message
  }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(Text7, {
    children: message
  }, void 0, !1, void 0, this)), root3.unmount(), await options2?.beforeExit?.(), process.exit(exitCode);
}
function showSetupDialog(root3, renderer, options2) {
  return showDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(AppStateProvider, {
    onChangeAppState: options2?.onChangeAppState,
    children: /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(KeybindingSetup, {
      children: renderer(done)
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this));
}
async function renderAndRun(root3, element) {
  root3.render(element), startDeferredPrefetches(), await root3.waitUntilExit(), await gracefulShutdown(0);
}
async function showSetupScreens(root3, permissionMode, allowDangerouslySkipPermissions, commands7, claudeInChrome, devChannels) {
  if (isEnvTruthy(!1) || process.env.IS_DEMO)
    return !1;
  let config11 = getGlobalConfig(), onboardingShown = !1;
  if (!config11.theme || !config11.hasCompletedOnboarding) {
    onboardingShown = !0;
    let {
      Onboarding: Onboarding2
    } = await Promise.resolve().then(() => (init_Onboarding(), exports_Onboarding));
    await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(Onboarding2, {
      onDone: () => {
        completeOnboarding(), done();
      }
    }, void 0, !1, void 0, this), {
      onChangeAppState
    });
  }
  if (!isEnvTruthy(process.env.CLAUBBIT)) {
    setSessionTrustAccepted(!0), getSystemContext();
    let {
      errors: allErrors
    } = getSettingsWithAllErrors();
    if (allErrors.length === 0)
      await handleMcpjsonServerApprovals(root3);
    if (await shouldShowClaudeMdExternalIncludesWarning()) {
      let externalIncludes = getExternalClaudeMdIncludes(await getMemoryFiles(!0)), {
        ClaudeMdExternalIncludesDialog: ClaudeMdExternalIncludesDialog2
      } = await Promise.resolve().then(() => (init_ClaudeMdExternalIncludesDialog(), exports_ClaudeMdExternalIncludesDialog));
      await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(ClaudeMdExternalIncludesDialog2, {
        onDone: done,
        isStandaloneDialog: !0,
        externalIncludes
      }, void 0, !1, void 0, this));
    }
  }
  if (updateGithubRepoPathMapping(), applyConfigEnvironmentVariables(), setImmediate(() => initializeTelemetryAfterTrust()), await isQualifiedForGrove()) {
    let {
      GroveDialog: GroveDialog2
    } = await Promise.resolve().then(() => (init_Grove(), exports_Grove));
    if (await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(GroveDialog2, {
      showIfAlreadyViewed: !1,
      location: onboardingShown ? "onboarding" : "policy_update_modal",
      onDone: done
    }, void 0, !1, void 0, this)) === "escape")
      return logEvent("tengu_grove_policy_exited", {}), gracefulShutdownSync(0), !1;
  }
  if (process.env.ANTHROPIC_API_KEY && !isRunningOnHomespace()) {
    let customApiKeyTruncated = normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY);
    if (getCustomApiKeyStatus(customApiKeyTruncated) === "new") {
      let {
        ApproveApiKey: ApproveApiKey2
      } = await Promise.resolve().then(() => (init_ApproveApiKey(), exports_ApproveApiKey));
      await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(ApproveApiKey2, {
        customApiKeyTruncated,
        onDone: done
      }, void 0, !1, void 0, this), {
        onChangeAppState
      });
    }
  }
  if ((permissionMode === "bypassPermissions" || allowDangerouslySkipPermissions) && !hasSkipDangerousModePermissionPrompt()) {
    let {
      BypassPermissionsModeDialog: BypassPermissionsModeDialog2
    } = await Promise.resolve().then(() => (init_BypassPermissionsModeDialog(), exports_BypassPermissionsModeDialog));
    await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(BypassPermissionsModeDialog2, {
      onAccept: done
    }, void 0, !1, void 0, this));
  }
  if (devChannels && devChannels.length > 0) {
    let [{
      isChannelsEnabled: isChannelsEnabled2
    }, {
      getClaudeAIOAuthTokens: getClaudeAIOAuthTokens2
    }] = await Promise.all([Promise.resolve().then(() => (init_channelAllowlist(), exports_channelAllowlist)), Promise.resolve().then(() => (init_auth14(), exports_auth))]);
    if (!isChannelsEnabled2() || !getClaudeAIOAuthTokens2()?.accessToken)
      setAllowedChannels([...getAllowedChannels(), ...devChannels.map((c3) => ({
        ...c3,
        dev: !0
      }))]), setHasDevChannels(!0);
    else {
      let {
        DevChannelsDialog: DevChannelsDialog2
      } = await Promise.resolve().then(() => (init_DevChannelsDialog(), exports_DevChannelsDialog));
      await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(DevChannelsDialog2, {
        channels: devChannels,
        onAccept: () => {
          setAllowedChannels([...getAllowedChannels(), ...devChannels.map((c3) => ({
            ...c3,
            dev: !0
          }))]), setHasDevChannels(!0), done();
        }
      }, void 0, !1, void 0, this));
    }
  }
  if (claudeInChrome && !getGlobalConfig().hasCompletedClaudeInChromeOnboarding) {
    let {
      ClaudeInChromeOnboarding: ClaudeInChromeOnboarding2
    } = await Promise.resolve().then(() => (init_ClaudeInChromeOnboarding(), exports_ClaudeInChromeOnboarding));
    await showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime473.jsxDEV(ClaudeInChromeOnboarding2, {
      onDone: done
    }, void 0, !1, void 0, this));
  }
  return onboardingShown;
}
function getRenderContext(exitOnCtrlC) {
  let lastFlickerTime = 0, baseOptions = getBaseRenderOptions(exitOnCtrlC);
  if (baseOptions.stdin)
    logEvent("tengu_stdin_interactive", {});
  let fpsTracker = new FpsTracker, stats2 = createStatsStore();
  setStatsStore(stats2);
  let frameTimingLogPath = process.env.CLAUDE_CODE_FRAME_TIMING_LOG;
  return {
    getFpsMetrics: () => fpsTracker.getMetrics(),
    stats: stats2,
    renderOptions: {
      ...baseOptions,
      onFrame: (event) => {
        if (fpsTracker.record(event.durationMs), stats2.observe("frame_duration_ms", event.durationMs), frameTimingLogPath && event.phases) {
          let line = JSON.stringify({
            total: event.durationMs,
            ...event.phases,
            rss: process.memoryUsage.rss(),
            cpu: process.cpuUsage()
          }) + `
`;
          appendFileSync4(frameTimingLogPath, line);
        }
        if (isSynchronizedOutputSupported())
          return;
        for (let flicker of event.flickers) {
          if (flicker.reason === "resize")
            continue;
          let now2 = Date.now();
          if (now2 - lastFlickerTime < 1000)
            logEvent("tengu_flicker", {
              desiredHeight: flicker.desiredHeight,
              actualHeight: flicker.availableHeight,
              reason: flicker.reason
            });
          lastFlickerTime = now2;
        }
      }
    }
  };
}
var jsx_dev_runtime473;
var init_interactiveHelpers = __esm(() => {
  init_gracefulShutdown();
  init_state();
  init_stats4();
  init_context2();
  init_init3();
  init_terminal();
  init_KeybindingProviderSetup();
  init_main3();
  init_grove();
  init_mcpServerApproval();
  init_AppState();
  init_onChangeAppState();
  init_authPortable();
  init_claudemd();
  init_config4();
  init_envUtils();
  init_githubRepoPathMapping();
  init_managedEnv();
  init_renderOptions();
  init_allErrors();
  init_settings2();
  jsx_dev_runtime473 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
