// Original: src/commands/session/session.tsx
var exports_session = {};
__export(exports_session, {
  call: () => call32
});
function SessionInfo(t0) {
  let $3 = import_compiler_runtime219.c(19), {
    onDone
  } = t0, remoteSessionUrl = useAppState(_temp131), [qrCode, setQrCode] = import_react161.useState(""), t1, t2;
  if ($3[0] !== remoteSessionUrl)
    t1 = () => {
      if (!remoteSessionUrl)
        return;
      let url3 = remoteSessionUrl;
      (async function() {
        let qr = await $toString(url3, {
          type: "utf8",
          errorCorrectionLevel: "L"
        });
        setQrCode(qr);
      })().catch(_temp250);
    }, t2 = [remoteSessionUrl], $3[0] = remoteSessionUrl, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react161.useEffect(t1, t2);
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = {
      context: "Confirmation"
    }, $3[3] = t3;
  else
    t3 = $3[3];
  if (useKeybinding("confirm:no", onDone, t3), !remoteSessionUrl) {
    let t42;
    if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
      t42 = /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(Pane, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
            color: "warning",
            children: "Not in remote mode. Start with `claude --remote` to use this command."
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "(press esc to close)"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[4] = t42;
    else
      t42 = $3[4];
    return t42;
  }
  let T0, t4, t5;
  if ($3[5] !== qrCode) {
    let lines2 = qrCode.split(`
`).filter(_temp333), isLoading = lines2.length === 0;
    if (T0 = Pane, $3[9] === Symbol.for("react.memo_cache_sentinel"))
      t4 = /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedBox_default, {
        marginBottom: 1,
        children: /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
          bold: !0,
          children: "Remote session"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[9] = t4;
    else
      t4 = $3[9];
    t5 = isLoading ? /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Generating QR code\u2026"
    }, void 0, !1, void 0, this) : lines2.map(_temp427), $3[5] = qrCode, $3[6] = T0, $3[7] = t4, $3[8] = t5;
  } else
    T0 = $3[6], t4 = $3[7], t5 = $3[8];
  let t6;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "Open in browser: "
    }, void 0, !1, void 0, this), $3[10] = t6;
  else
    t6 = $3[10];
  let t7;
  if ($3[11] !== remoteSessionUrl)
    t7 = /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: [
        t6,
        /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
          color: "ide",
          children: remoteSessionUrl
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[11] = remoteSessionUrl, $3[12] = t7;
  else
    t7 = $3[12];
  let t8;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "(press esc to close)"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[13] = t8;
  else
    t8 = $3[13];
  let t9;
  if ($3[14] !== T0 || $3[15] !== t4 || $3[16] !== t5 || $3[17] !== t7)
    t9 = /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(T0, {
      children: [
        t4,
        t5,
        t7,
        t8
      ]
    }, void 0, !0, void 0, this), $3[14] = T0, $3[15] = t4, $3[16] = t5, $3[17] = t7, $3[18] = t9;
  else
    t9 = $3[18];
  return t9;
}
function _temp427(line_0, i5) {
  return /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(ThemedText, {
    children: line_0
  }, i5, !1, void 0, this);
}
function _temp333(line) {
  return line.length > 0;
}
function _temp250(e) {
  logForDebugging("QR code generation failed", e);
}
function _temp131(s2) {
  return s2.remoteSessionUrl;
}
var import_compiler_runtime219, import_react161, jsx_dev_runtime276, call32 = async (onDone) => {
  return /* @__PURE__ */ jsx_dev_runtime276.jsxDEV(SessionInfo, {
    onDone
  }, void 0, !1, void 0, this);
};
var init_session = __esm(() => {
  init_server();
  init_Pane();
  init_ink2();
  init_useKeybinding();
  init_AppState();
  init_debug();
  import_compiler_runtime219 = __toESM(require_react_compiler_runtime_development(), 1), import_react161 = __toESM(require_react_development(), 1), jsx_dev_runtime276 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
