// Original: src/commands/chrome/chrome.tsx
var exports_chrome = {};
__export(exports_chrome, {
  call: () => call55
});
function ClaudeInChromeMenu(t0) {
  let $3 = import_compiler_runtime271.c(41), {
    onDone,
    isExtensionInstalled: installed,
    configEnabled,
    isClaudeAISubscriber: isClaudeAISubscriber2,
    isWSL
  } = t0, mcpClients = useAppState(_temp166), [selectKey, setSelectKey] = import_react186.useState(0), [enabledByDefault, setEnabledByDefault] = import_react186.useState(configEnabled ?? !1), [showInstallHint, setShowInstallHint] = import_react186.useState(!1), [isExtensionInstalled, setIsExtensionInstalled] = import_react186.useState(installed), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = !1, $3[0] = t1;
  else
    t1 = $3[0];
  let isHomespace = t1, t2;
  if ($3[1] !== mcpClients)
    t2 = mcpClients.find(_temp272), $3[1] = mcpClients, $3[2] = t2;
  else
    t2 = $3[2];
  let isConnected3 = t2?.type === "connected", t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = function(url3) {
      if (isHomespace)
        openBrowser(url3);
      else
        openInChrome(url3);
    }, $3[3] = t3;
  else
    t3 = $3[3];
  let openUrl = t3, t4;
  if ($3[4] !== enabledByDefault)
    t4 = function(action2) {
      bb22:
        switch (action2) {
          case "install-extension": {
            setSelectKey(_temp346), setShowInstallHint(!0), openUrl(CHROME_EXTENSION_URL);
            break bb22;
          }
          case "reconnect": {
            setSelectKey(_temp435), isChromeExtensionInstalled().then((installed_0) => {
              if (setIsExtensionInstalled(installed_0), installed_0)
                setShowInstallHint(!1);
            }), openUrl(CHROME_RECONNECT_URL);
            break bb22;
          }
          case "manage-permissions": {
            setSelectKey(_temp525), openUrl(CHROME_PERMISSIONS_URL);
            break bb22;
          }
          case "toggle-default": {
            let newValue = !enabledByDefault;
            saveGlobalConfig((current) => ({
              ...current,
              claudeInChromeDefaultEnabled: newValue
            })), setEnabledByDefault(newValue);
          }
        }
    }, $3[4] = enabledByDefault, $3[5] = t4;
  else
    t4 = $3[5];
  let handleAction = t4, options2;
  if ($3[6] !== enabledByDefault || $3[7] !== isExtensionInstalled) {
    options2 = [];
    let requiresExtensionSuffix = isExtensionInstalled ? "" : " (requires extension)";
    if (!isExtensionInstalled && !isHomespace) {
      let t53;
      if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
        t53 = {
          label: "Install Chrome extension",
          value: "install-extension"
        }, $3[9] = t53;
      else
        t53 = $3[9];
      options2.push(t53);
    }
    let t52;
    if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
        children: "Manage permissions"
      }, void 0, !1, void 0, this), $3[10] = t52;
    else
      t52 = $3[10];
    let t62;
    if ($3[11] !== requiresExtensionSuffix)
      t62 = {
        label: /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(jsx_dev_runtime345.Fragment, {
          children: [
            t52,
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              dimColor: !0,
              children: requiresExtensionSuffix
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        value: "manage-permissions"
      }, $3[11] = requiresExtensionSuffix, $3[12] = t62;
    else
      t62 = $3[12];
    let t72;
    if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
      t72 = /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
        children: "Reconnect extension"
      }, void 0, !1, void 0, this), $3[13] = t72;
    else
      t72 = $3[13];
    let t82;
    if ($3[14] !== requiresExtensionSuffix)
      t82 = {
        label: /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(jsx_dev_runtime345.Fragment, {
          children: [
            t72,
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              dimColor: !0,
              children: requiresExtensionSuffix
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        value: "reconnect"
      }, $3[14] = requiresExtensionSuffix, $3[15] = t82;
    else
      t82 = $3[15];
    let t92 = `Enabled by default: ${enabledByDefault ? "Yes" : "No"}`, t102;
    if ($3[16] !== t92)
      t102 = {
        label: t92,
        value: "toggle-default"
      }, $3[16] = t92, $3[17] = t102;
    else
      t102 = $3[17];
    options2.push(t62, t82, t102), $3[6] = enabledByDefault, $3[7] = isExtensionInstalled, $3[8] = options2;
  } else
    options2 = $3[8];
  let isDisabled = isWSL || !isClaudeAISubscriber2, t5;
  if ($3[18] !== onDone)
    t5 = () => onDone(), $3[18] = onDone, $3[19] = t5;
  else
    t5 = $3[19];
  let t6;
  if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
      children: "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. Navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests."
    }, void 0, !1, void 0, this), $3[20] = t6;
  else
    t6 = $3[20];
  let t7;
  if ($3[21] !== isWSL)
    t7 = isWSL && /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
      color: "error",
      children: "Claude in Chrome is not supported in WSL at this time."
    }, void 0, !1, void 0, this), $3[21] = isWSL, $3[22] = t7;
  else
    t7 = $3[22];
  let t8;
  if ($3[23] !== isClaudeAISubscriber2)
    t8 = !isClaudeAISubscriber2 && /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
      color: "error",
      children: "Claude in Chrome requires a claude.ai subscription."
    }, void 0, !1, void 0, this), $3[23] = isClaudeAISubscriber2, $3[24] = t8;
  else
    t8 = $3[24];
  let t9;
  if ($3[25] !== handleAction || $3[26] !== isConnected3 || $3[27] !== isDisabled || $3[28] !== isExtensionInstalled || $3[29] !== options2 || $3[30] !== selectKey || $3[31] !== showInstallHint)
    t9 = !isDisabled && /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(jsx_dev_runtime345.Fragment, {
      children: [
        !isHomespace && /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              children: [
                "Status:",
                " ",
                isConnected3 ? /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
                  color: "success",
                  children: "Enabled"
                }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
                  color: "inactive",
                  children: "Disabled"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              children: [
                "Extension:",
                " ",
                isExtensionInstalled ? /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
                  color: "success",
                  children: "Installed"
                }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
                  color: "warning",
                  children: "Not detected"
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(Select, {
          options: options2,
          onChange: handleAction,
          hideIndexes: !0
        }, selectKey, !1, void 0, this),
        showInstallHint && /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
          color: "warning",
          children: [
            "Once installed, select ",
            '"Reconnect extension"',
            " to connect."
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "Usage: "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              children: "claude --chrome"
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              dimColor: !0,
              children: " or "
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
              children: "claude --no-chrome"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on."
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[25] = handleAction, $3[26] = isConnected3, $3[27] = isDisabled, $3[28] = isExtensionInstalled, $3[29] = options2, $3[30] = selectKey, $3[31] = showInstallHint, $3[32] = t9;
  else
    t9 = $3[32];
  let t10;
  if ($3[33] === Symbol.for("react.memo_cache_sentinel"))
    t10 = /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Learn more: https://code.claude.com/docs/en/chrome"
    }, void 0, !1, void 0, this), $3[33] = t10;
  else
    t10 = $3[33];
  let t11;
  if ($3[34] !== t7 || $3[35] !== t8 || $3[36] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t6,
        t7,
        t8,
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[34] = t7, $3[35] = t8, $3[36] = t9, $3[37] = t11;
  else
    t11 = $3[37];
  let t12;
  if ($3[38] !== t11 || $3[39] !== t5)
    t12 = /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(Dialog, {
      title: "Claude in Chrome (Beta)",
      onCancel: t5,
      color: "chromeYellow",
      children: t11
    }, void 0, !1, void 0, this), $3[38] = t11, $3[39] = t5, $3[40] = t12;
  else
    t12 = $3[40];
  return t12;
}
function _temp525(k3) {
  return k3 + 1;
}
function _temp435(k_0) {
  return k_0 + 1;
}
function _temp346(k_1) {
  return k_1 + 1;
}
function _temp272(c3) {
  return c3.name === CLAUDE_IN_CHROME_MCP_SERVER_NAME;
}
function _temp166(s2) {
  return s2.mcp.clients;
}
var import_compiler_runtime271, import_react186, jsx_dev_runtime345, CHROME_EXTENSION_URL = "https://claude.ai/chrome", CHROME_PERMISSIONS_URL = "https://clau.de/chrome/permissions", CHROME_RECONNECT_URL = "https://clau.de/chrome/reconnect", call55 = async function(onDone) {
  let isExtensionInstalled = await isChromeExtensionInstalled(), config11 = getGlobalConfig(), isSubscriber = isClaudeAISubscriber(), isWSL = env3.isWslEnvironment();
  return /* @__PURE__ */ jsx_dev_runtime345.jsxDEV(ClaudeInChromeMenu, {
    onDone,
    isExtensionInstalled,
    configEnabled: config11.claudeInChromeDefaultEnabled,
    isClaudeAISubscriber: isSubscriber,
    isWSL
  }, void 0, !1, void 0, this);
};
var init_chrome = __esm(() => {
  init_select();
  init_Dialog();
  init_ink2();
  init_AppState();
  init_auth14();
  init_browser();
  init_common3();
  init_setup2();
  init_config4();
  init_env();
  init_envUtils();
  import_compiler_runtime271 = __toESM(require_react_compiler_runtime_development(), 1), import_react186 = __toESM(require_react_development(), 1), jsx_dev_runtime345 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
