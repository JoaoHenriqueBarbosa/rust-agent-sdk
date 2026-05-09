// Original: src/dialogLaunchers.tsx
async function launchInvalidSettingsDialog(root3, props) {
  let {
    InvalidSettingsDialog: InvalidSettingsDialog2
  } = await Promise.resolve().then(() => (init_InvalidSettingsDialog(), exports_InvalidSettingsDialog));
  return showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime479.jsxDEV(InvalidSettingsDialog2, {
    settingsErrors: props.settingsErrors,
    onContinue: done,
    onExit: props.onExit
  }, void 0, !1, void 0, this));
}
async function launchTeleportResumeWrapper(root3) {
  let {
    TeleportResumeWrapper: TeleportResumeWrapper2
  } = await Promise.resolve().then(() => (init_TeleportResumeWrapper(), exports_TeleportResumeWrapper));
  return showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime479.jsxDEV(TeleportResumeWrapper2, {
    onComplete: done,
    onCancel: () => done(null),
    source: "cliArg"
  }, void 0, !1, void 0, this));
}
async function launchTeleportRepoMismatchDialog(root3, props) {
  let {
    TeleportRepoMismatchDialog: TeleportRepoMismatchDialog2
  } = await Promise.resolve().then(() => (init_TeleportRepoMismatchDialog(), exports_TeleportRepoMismatchDialog));
  return showSetupDialog(root3, (done) => /* @__PURE__ */ jsx_dev_runtime479.jsxDEV(TeleportRepoMismatchDialog2, {
    targetRepo: props.targetRepo,
    initialPaths: props.initialPaths,
    onSelectPath: done,
    onCancel: () => done(null)
  }, void 0, !1, void 0, this));
}
async function launchResumeChooser(root3, appProps, worktreePathsPromise, resumeProps) {
  let [worktreePaths, {
    ResumeConversation: ResumeConversation2
  }, {
    App: App3
  }] = await Promise.all([worktreePathsPromise, Promise.resolve().then(() => (init_ResumeConversation(), exports_ResumeConversation)), Promise.resolve().then(() => (init_App2(), exports_App))]);
  await renderAndRun(root3, /* @__PURE__ */ jsx_dev_runtime479.jsxDEV(App3, {
    getFpsMetrics: appProps.getFpsMetrics,
    stats: appProps.stats,
    initialState: appProps.initialState,
    children: /* @__PURE__ */ jsx_dev_runtime479.jsxDEV(KeybindingSetup, {
      children: /* @__PURE__ */ jsx_dev_runtime479.jsxDEV(ResumeConversation2, {
        ...resumeProps,
        worktreePaths
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this));
}
var jsx_dev_runtime479;
var init_dialogLaunchers = __esm(() => {
  init_interactiveHelpers();
  init_KeybindingProviderSetup();
  jsx_dev_runtime479 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
