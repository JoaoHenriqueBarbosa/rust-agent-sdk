// Original: src/components/IdeOnboardingDialog.tsx
var exports_IdeOnboardingDialog = {};
__export(exports_IdeOnboardingDialog, {
  hasIdeOnboardingDialogBeenShown: () => hasIdeOnboardingDialogBeenShown,
  IdeOnboardingDialog: () => IdeOnboardingDialog
});
function IdeOnboardingDialog(t0) {
  let $3 = import_compiler_runtime33.c(23), {
    onDone,
    installationStatus
  } = t0;
  markDialogAsShown();
  let t1;
  if ($3[0] !== onDone)
    t1 = {
      "confirm:yes": onDone,
      "confirm:no": onDone
    }, $3[0] = onDone, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
    t2 = {
      context: "Confirmation"
    }, $3[2] = t2;
  else
    t2 = $3[2];
  useKeybindings(t1, t2);
  let t3;
  if ($3[3] !== installationStatus?.ideType)
    t3 = installationStatus?.ideType ?? getTerminalIdeType(), $3[3] = installationStatus?.ideType, $3[4] = t3;
  else
    t3 = $3[4];
  let ideType = t3, isJetBrains = isJetBrainsIde(ideType), t4;
  if ($3[5] !== ideType)
    t4 = toIDEDisplayName(ideType), $3[5] = ideType, $3[6] = t4;
  else
    t4 = $3[6];
  let ideName = t4, installedVersion = installationStatus?.installedVersion, pluginOrExtension = isJetBrains ? "plugin" : "extension", mentionShortcut = env3.platform === "darwin" ? "Cmd+Option+K" : "Ctrl+Alt+K", t5;
  if ($3[7] === Symbol.for("react.memo_cache_sentinel"))
    t5 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
      color: "claude",
      children: "\u273B "
    }, void 0, !1, void 0, this), $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== ideName)
    t6 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(jsx_dev_runtime37.Fragment, {
      children: [
        t5,
        /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
          children: [
            "Welcome to Claude Code for ",
            ideName
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[8] = ideName, $3[9] = t6;
  else
    t6 = $3[9];
  let t7 = installedVersion ? `installed ${pluginOrExtension} v${installedVersion}` : void 0, t8;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
      color: "suggestion",
      children: "\u29C9 open files"
    }, void 0, !1, void 0, this), $3[10] = t8;
  else
    t8 = $3[10];
  let t9;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
      children: [
        "\u2022 Claude has context of ",
        t8,
        " ",
        "and ",
        /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
          color: "suggestion",
          children: "\u29C9 selected lines"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[11] = t9;
  else
    t9 = $3[11];
  let t10;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
      color: "diffAddedWord",
      children: "+11"
    }, void 0, !1, void 0, this), $3[12] = t10;
  else
    t10 = $3[12];
  let t11;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t11 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
      children: [
        "\u2022 Review Claude Code's changes",
        " ",
        t10,
        " ",
        /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
          color: "diffRemovedWord",
          children: "-22"
        }, void 0, !1, void 0, this),
        " in the comfort of your IDE"
      ]
    }, void 0, !0, void 0, this), $3[13] = t11;
  else
    t11 = $3[13];
  let t12;
  if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
    t12 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
      children: [
        "\u2022 Cmd+Esc",
        /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
          dimColor: !0,
          children: " for Quick Launch"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[14] = t12;
  else
    t12 = $3[14];
  let t13;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t13 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t9,
        t11,
        t12,
        /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
          children: [
            "\u2022 ",
            mentionShortcut,
            /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " to reference files or lines in your input"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[15] = t13;
  else
    t13 = $3[15];
  let t14;
  if ($3[16] !== onDone || $3[17] !== t6 || $3[18] !== t7)
    t14 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(Dialog, {
      title: t6,
      subtitle: t7,
      color: "ide",
      onCancel: onDone,
      hideInputGuide: !0,
      children: t13
    }, void 0, !1, void 0, this), $3[16] = onDone, $3[17] = t6, $3[18] = t7, $3[19] = t14;
  else
    t14 = $3[19];
  let t15;
  if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
    t15 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedBox_default, {
      paddingX: 1,
      children: /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(ThemedText, {
        dimColor: !0,
        italic: !0,
        children: "Press Enter to continue"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[20] = t15;
  else
    t15 = $3[20];
  let t16;
  if ($3[21] !== t14)
    t16 = /* @__PURE__ */ jsx_dev_runtime37.jsxDEV(jsx_dev_runtime37.Fragment, {
      children: [
        t14,
        t15
      ]
    }, void 0, !0, void 0, this), $3[21] = t14, $3[22] = t16;
  else
    t16 = $3[22];
  return t16;
}
function hasIdeOnboardingDialogBeenShown() {
  let config10 = getGlobalConfig(), terminal = envDynamic.terminal || "unknown";
  return config10.hasIdeOnboardingBeenShown?.[terminal] === !0;
}
function markDialogAsShown() {
  if (hasIdeOnboardingDialogBeenShown())
    return;
  let terminal = envDynamic.terminal || "unknown";
  saveGlobalConfig((current) => ({
    ...current,
    hasIdeOnboardingBeenShown: {
      ...current.hasIdeOnboardingBeenShown,
      [terminal]: !0
    }
  }));
}
var import_compiler_runtime33, jsx_dev_runtime37;
var init_IdeOnboardingDialog = __esm(() => {
  init_envDynamic();
  init_ink2();
  init_useKeybinding();
  init_config4();
  init_env();
  init_ide();
  init_Dialog();
  import_compiler_runtime33 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime37 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
