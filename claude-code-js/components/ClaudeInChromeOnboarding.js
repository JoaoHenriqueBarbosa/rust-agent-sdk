// Original: src/components/ClaudeInChromeOnboarding.tsx
var exports_ClaudeInChromeOnboarding = {};
__export(exports_ClaudeInChromeOnboarding, {
  ClaudeInChromeOnboarding: () => ClaudeInChromeOnboarding
});
function ClaudeInChromeOnboarding(t0) {
  let $3 = import_compiler_runtime372.c(20), {
    onDone
  } = t0, [isExtensionInstalled, setIsExtensionInstalled] = import_react310.default.useState(!1), t1, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      logEvent("tengu_claude_in_chrome_onboarding_shown", {}), isChromeExtensionInstalled().then(setIsExtensionInstalled), saveGlobalConfig(_temp305);
    }, t2 = [], $3[0] = t1, $3[1] = t2;
  else
    t1 = $3[0], t2 = $3[1];
  import_react310.default.useEffect(t1, t2);
  let t3;
  if ($3[2] !== onDone)
    t3 = (_input, key3) => {
      if (key3.return)
        onDone();
    }, $3[2] = onDone, $3[3] = t3;
  else
    t3 = $3[3];
  use_input_default(t3);
  let t4;
  if ($3[4] !== isExtensionInstalled)
    t4 = !isExtensionInstalled && /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(jsx_dev_runtime472.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(Newline, {}, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(Newline, {}, void 0, !1, void 0, this),
        "Requires the Chrome extension. Get started at",
        " ",
        /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(Link, {
          url: CHROME_EXTENSION_URL2
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[4] = isExtensionInstalled, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(ThemedText, {
      children: [
        "Claude in Chrome works with the Chrome extension to let you control your browser directly from Claude Code. You can navigate websites, fill forms, capture screenshots, record GIFs, and debug with console logs and network requests.",
        t4
      ]
    }, void 0, !0, void 0, this), $3[6] = t4, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== isExtensionInstalled)
    t6 = isExtensionInstalled && /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(jsx_dev_runtime472.Fragment, {
      children: [
        " ",
        "(",
        /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(Link, {
          url: CHROME_PERMISSIONS_URL2
        }, void 0, !1, void 0, this),
        ")"
      ]
    }, void 0, !0, void 0, this), $3[8] = isExtensionInstalled, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "Site-level permissions are inherited from the Chrome extension. Manage permissions in the Chrome extension settings to control which sites Claude can browse, click, and type on",
        t6,
        "."
      ]
    }, void 0, !0, void 0, this), $3[10] = t6, $3[11] = t7;
  else
    t7 = $3[11];
  let t8;
  if ($3[12] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(ThemedText, {
      bold: !0,
      color: "chromeYellow",
      children: "/chrome"
    }, void 0, !1, void 0, this), $3[12] = t8;
  else
    t8 = $3[12];
  let t9;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t9 = /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "For more info, use",
        " ",
        t8,
        " ",
        "or visit ",
        /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(Link, {
          url: "https://code.claude.com/docs/en/chrome"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[13] = t9;
  else
    t9 = $3[13];
  let t10;
  if ($3[14] !== t5 || $3[15] !== t7)
    t10 = /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      gap: 1,
      children: [
        t5,
        t7,
        t9
      ]
    }, void 0, !0, void 0, this), $3[14] = t5, $3[15] = t7, $3[16] = t10;
  else
    t10 = $3[16];
  let t11;
  if ($3[17] !== onDone || $3[18] !== t10)
    t11 = /* @__PURE__ */ jsx_dev_runtime472.jsxDEV(Dialog, {
      title: "Claude in Chrome (Beta)",
      onCancel: onDone,
      color: "chromeYellow",
      children: t10
    }, void 0, !1, void 0, this), $3[17] = onDone, $3[18] = t10, $3[19] = t11;
  else
    t11 = $3[19];
  return t11;
}
function _temp305(current) {
  return {
    ...current,
    hasCompletedClaudeInChromeOnboarding: !0
  };
}
var import_compiler_runtime372, import_react310, jsx_dev_runtime472, CHROME_EXTENSION_URL2 = "https://claude.ai/chrome", CHROME_PERMISSIONS_URL2 = "https://clau.de/chrome/permissions";
var init_ClaudeInChromeOnboarding = __esm(() => {
  init_ink2();
  init_setup2();
  init_config4();
  init_Dialog();
  import_compiler_runtime372 = __toESM(require_react_compiler_runtime_development(), 1), import_react310 = __toESM(require_react_development(), 1), jsx_dev_runtime472 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
