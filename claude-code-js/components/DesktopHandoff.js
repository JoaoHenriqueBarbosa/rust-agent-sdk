// Original: src/components/DesktopHandoff.tsx
function getDownloadUrl() {
  switch (process.platform) {
    case "win32":
      return "https://claude.ai/api/desktop/win32/x64/exe/latest/redirect";
    default:
      return "https://claude.ai/api/desktop/darwin/universal/dmg/latest/redirect";
  }
}
function DesktopHandoff(t0) {
  let $3 = import_compiler_runtime132.c(20), {
    onDone
  } = t0, [state3, setState] = import_react96.useState("checking"), [error44, setError] = import_react96.useState(null), [downloadMessage, setDownloadMessage] = import_react96.useState(""), t1;
  if ($3[0] !== error44 || $3[1] !== onDone || $3[2] !== state3)
    t1 = (input) => {
      if (state3 === "error") {
        onDone(error44 ?? "Unknown error", {
          display: "system"
        });
        return;
      }
      if (state3 === "prompt-download") {
        if (input === "y" || input === "Y")
          openBrowser(getDownloadUrl()).catch(_temp64), onDone(`Starting download. Re-run /desktop once you\u2019ve installed the app.
Learn more at ${DESKTOP_DOCS_URL}`, {
            display: "system"
          });
        else if (input === "n" || input === "N")
          onDone(`The desktop app is required for /desktop. Learn more at ${DESKTOP_DOCS_URL}`, {
            display: "system"
          });
      }
    }, $3[0] = error44, $3[1] = onDone, $3[2] = state3, $3[3] = t1;
  else
    t1 = $3[3];
  use_input_default(t1);
  let t2, t3;
  if ($3[4] !== onDone)
    t2 = () => {
      (async function() {
        setState("checking");
        let installStatus = await getDesktopInstallStatus();
        if (installStatus.status === "not-installed") {
          setDownloadMessage("Claude Desktop is not installed."), setState("prompt-download");
          return;
        }
        if (installStatus.status === "version-too-old") {
          setDownloadMessage(`Claude Desktop needs to be updated (found v${installStatus.version}, need v1.1.2396+).`), setState("prompt-download");
          return;
        }
        setState("flushing"), await flushSessionStorage(), setState("opening");
        let result = await openCurrentSessionInDesktop();
        if (!result.success) {
          setError(result.error ?? "Failed to open Claude Desktop"), setState("error");
          return;
        }
        setState("success"), setTimeout(_temp214, 500, onDone);
      })().catch((err2) => {
        setError(errorMessage(err2)), setState("error");
      });
    }, t3 = [onDone], $3[4] = onDone, $3[5] = t2, $3[6] = t3;
  else
    t2 = $3[5], t3 = $3[6];
  if (import_react96.useEffect(t2, t3), state3 === "error") {
    let t42;
    if ($3[7] !== error44)
      t42 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(ThemedText, {
        color: "error",
        children: [
          "Error: ",
          error44
        ]
      }, void 0, !0, void 0, this), $3[7] = error44, $3[8] = t42;
    else
      t42 = $3[8];
    let t52;
    if ($3[9] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Press any key to continue\u2026"
      }, void 0, !1, void 0, this), $3[9] = t52;
    else
      t52 = $3[9];
    let t62;
    if ($3[10] !== t42)
      t62 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 2,
        children: [
          t42,
          t52
        ]
      }, void 0, !0, void 0, this), $3[10] = t42, $3[11] = t62;
    else
      t62 = $3[11];
    return t62;
  }
  if (state3 === "prompt-download") {
    let t42;
    if ($3[12] !== downloadMessage)
      t42 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(ThemedText, {
        children: downloadMessage
      }, void 0, !1, void 0, this), $3[12] = downloadMessage, $3[13] = t42;
    else
      t42 = $3[13];
    let t52;
    if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(ThemedText, {
        children: "Download now? (y/n)"
      }, void 0, !1, void 0, this), $3[14] = t52;
    else
      t52 = $3[14];
    let t62;
    if ($3[15] !== t42)
      t62 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        paddingX: 2,
        children: [
          t42,
          t52
        ]
      }, void 0, !0, void 0, this), $3[15] = t42, $3[16] = t62;
    else
      t62 = $3[16];
    return t62;
  }
  let t4;
  if ($3[17] === Symbol.for("react.memo_cache_sentinel"))
    t4 = {
      checking: "Checking for Claude Desktop\u2026",
      flushing: "Saving session\u2026",
      opening: "Opening Claude Desktop\u2026",
      success: "Opening in Claude Desktop\u2026"
    }, $3[17] = t4;
  else
    t4 = $3[17];
  let t5 = t4[state3], t6;
  if ($3[18] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime168.jsxDEV(LoadingState, {
      message: t5
    }, void 0, !1, void 0, this), $3[18] = t5, $3[19] = t6;
  else
    t6 = $3[19];
  return t6;
}
async function _temp214(onDone_0) {
  onDone_0("Session transferred to Claude Desktop", {
    display: "system"
  }), await gracefulShutdown(0, "other");
}
function _temp64() {}
var import_compiler_runtime132, import_react96, jsx_dev_runtime168, DESKTOP_DOCS_URL = "https://clau.de/desktop";
var init_DesktopHandoff = __esm(() => {
  init_ink2();
  init_browser();
  init_desktopDeepLink();
  init_errors();
  init_gracefulShutdown();
  init_sessionStorage();
  init_LoadingState();
  import_compiler_runtime132 = __toESM(require_react_compiler_runtime_development(), 1), import_react96 = __toESM(require_react_development(), 1), jsx_dev_runtime168 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
