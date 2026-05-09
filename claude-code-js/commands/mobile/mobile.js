// Original: src/commands/mobile/mobile.tsx
var exports_mobile = {};
__export(exports_mobile, {
  call: () => call27
});
function MobileQRCode(t0) {
  let $3 = import_compiler_runtime195.c(52), {
    onDone
  } = t0, [platform6, setPlatform] = import_react141.useState("ios"), t1;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t1 = {
      ios: "",
      android: ""
    }, $3[0] = t1;
  else
    t1 = $3[0];
  let [qrCodes, setQrCodes] = import_react141.useState(t1), {
    url: url3
  } = PLATFORMS[platform6], qrCode = qrCodes[platform6], t2, t3;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t2 = () => {
      (async function() {
        let [ios, android] = await Promise.all([$toString(PLATFORMS.ios.url, {
          type: "utf8",
          errorCorrectionLevel: "L"
        }), $toString(PLATFORMS.android.url, {
          type: "utf8",
          errorCorrectionLevel: "L"
        })]);
        setQrCodes({
          ios,
          android
        });
      })().catch(_temp114);
    }, t3 = [], $3[1] = t2, $3[2] = t3;
  else
    t2 = $3[1], t3 = $3[2];
  import_react141.useEffect(t2, t3);
  let t4;
  if ($3[3] !== onDone)
    t4 = () => {
      onDone();
    }, $3[3] = onDone, $3[4] = t4;
  else
    t4 = $3[4];
  let handleClose = t4, t5;
  if ($3[5] === Symbol.for("react.memo_cache_sentinel"))
    t5 = {
      context: "Confirmation"
    }, $3[5] = t5;
  else
    t5 = $3[5];
  useKeybinding("confirm:no", handleClose, t5);
  let t6;
  if ($3[6] !== onDone)
    t6 = function(e) {
      if (e.key === "q" || e.ctrl && e.key === "c") {
        e.preventDefault(), onDone();
        return;
      }
      if (e.key === "tab" || e.key === "left" || e.key === "right")
        e.preventDefault(), setPlatform(_temp241);
    }, $3[6] = onDone, $3[7] = t6;
  else
    t6 = $3[7];
  let handleKeyDown = t6, T0, T1, t10, t11, t12, t13, t7, t8, t9;
  if ($3[8] !== handleKeyDown || $3[9] !== qrCode) {
    let lines2 = qrCode.split(`
`).filter(_temp328);
    if (T1 = Pane, T0 = ThemedBox_default, t7 = "column", t8 = 0, t9 = !0, t10 = handleKeyDown, $3[19] === Symbol.for("react.memo_cache_sentinel"))
      t11 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
        children: " "
      }, void 0, !1, void 0, this), t12 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
        children: " "
      }, void 0, !1, void 0, this), $3[19] = t11, $3[20] = t12;
    else
      t11 = $3[19], t12 = $3[20];
    t13 = lines2.map(_temp424), $3[8] = handleKeyDown, $3[9] = qrCode, $3[10] = T0, $3[11] = T1, $3[12] = t10, $3[13] = t11, $3[14] = t12, $3[15] = t13, $3[16] = t7, $3[17] = t8, $3[18] = t9;
  } else
    T0 = $3[10], T1 = $3[11], t10 = $3[12], t11 = $3[13], t12 = $3[14], t13 = $3[15], t7 = $3[16], t8 = $3[17], t9 = $3[18];
  let t14, t15;
  if ($3[21] === Symbol.for("react.memo_cache_sentinel"))
    t14 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      children: " "
    }, void 0, !1, void 0, this), t15 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      children: " "
    }, void 0, !1, void 0, this), $3[21] = t14, $3[22] = t15;
  else
    t14 = $3[21], t15 = $3[22];
  let t16 = platform6 === "ios", t17 = platform6 === "ios", t18;
  if ($3[23] !== t16 || $3[24] !== t17)
    t18 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      bold: t16,
      underline: t17,
      children: "iOS"
    }, void 0, !1, void 0, this), $3[23] = t16, $3[24] = t17, $3[25] = t18;
  else
    t18 = $3[25];
  let t19;
  if ($3[26] === Symbol.for("react.memo_cache_sentinel"))
    t19 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " / "
    }, void 0, !1, void 0, this), $3[26] = t19;
  else
    t19 = $3[26];
  let t20 = platform6 === "android", t21 = platform6 === "android", t22;
  if ($3[27] !== t20 || $3[28] !== t21)
    t22 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      bold: t20,
      underline: t21,
      children: "Android"
    }, void 0, !1, void 0, this), $3[27] = t20, $3[28] = t21, $3[29] = t22;
  else
    t22 = $3[29];
  let t23;
  if ($3[30] !== t18 || $3[31] !== t22)
    t23 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      children: [
        t18,
        t19,
        t22
      ]
    }, void 0, !0, void 0, this), $3[30] = t18, $3[31] = t22, $3[32] = t23;
  else
    t23 = $3[32];
  let t24;
  if ($3[33] === Symbol.for("react.memo_cache_sentinel"))
    t24 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "(tab to switch, esc to close)"
    }, void 0, !1, void 0, this), $3[33] = t24;
  else
    t24 = $3[33];
  let t25;
  if ($3[34] !== t23)
    t25 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      gap: 2,
      children: [
        t23,
        t24
      ]
    }, void 0, !0, void 0, this), $3[34] = t23, $3[35] = t25;
  else
    t25 = $3[35];
  let t26;
  if ($3[36] !== url3)
    t26 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
      dimColor: !0,
      children: url3
    }, void 0, !1, void 0, this), $3[36] = url3, $3[37] = t26;
  else
    t26 = $3[37];
  let t27;
  if ($3[38] !== T0 || $3[39] !== t10 || $3[40] !== t11 || $3[41] !== t12 || $3[42] !== t13 || $3[43] !== t25 || $3[44] !== t26 || $3[45] !== t7 || $3[46] !== t8 || $3[47] !== t9)
    t27 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(T0, {
      flexDirection: t7,
      tabIndex: t8,
      autoFocus: t9,
      onKeyDown: t10,
      children: [
        t11,
        t12,
        t13,
        t14,
        t15,
        t25,
        t26
      ]
    }, void 0, !0, void 0, this), $3[38] = T0, $3[39] = t10, $3[40] = t11, $3[41] = t12, $3[42] = t13, $3[43] = t25, $3[44] = t26, $3[45] = t7, $3[46] = t8, $3[47] = t9, $3[48] = t27;
  else
    t27 = $3[48];
  let t28;
  if ($3[49] !== T1 || $3[50] !== t27)
    t28 = /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(T1, {
      children: t27
    }, void 0, !1, void 0, this), $3[49] = T1, $3[50] = t27, $3[51] = t28;
  else
    t28 = $3[51];
  return t28;
}
function _temp424(line_0, i5) {
  return /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(ThemedText, {
    children: line_0
  }, i5, !1, void 0, this);
}
function _temp328(line) {
  return line.length > 0;
}
function _temp241(prev) {
  return prev === "ios" ? "android" : "ios";
}
function _temp114() {}
async function call27(onDone) {
  return /* @__PURE__ */ jsx_dev_runtime246.jsxDEV(MobileQRCode, {
    onDone
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime195, import_react141, jsx_dev_runtime246, PLATFORMS;
var init_mobile = __esm(() => {
  init_server();
  init_Pane();
  init_ink2();
  init_useKeybinding();
  import_compiler_runtime195 = __toESM(require_react_compiler_runtime_development(), 1), import_react141 = __toESM(require_react_development(), 1), jsx_dev_runtime246 = __toESM(require_react_jsx_dev_runtime_development(), 1), PLATFORMS = {
    ios: {
      url: "https://apps.apple.com/app/claude-by-anthropic/id6473753684"
    },
    android: {
      url: "https://play.google.com/store/apps/details?id=com.anthropic.claude"
    }
  };
});
