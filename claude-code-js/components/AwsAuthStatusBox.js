// Original: src/components/AwsAuthStatusBox.tsx
function AwsAuthStatusBox() {
  let $3 = import_compiler_runtime352.c(11), t0;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t0 = AwsAuthStatusManager.getInstance().getStatus(), $3[0] = t0;
  else
    t0 = $3[0];
  let [status2, setStatus] = import_react290.useState(t0), t1, t2;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t1 = () => {
      return AwsAuthStatusManager.getInstance().subscribe(setStatus);
    }, t2 = [], $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  if (import_react290.useEffect(t1, t2), !status2.isAuthenticating && !status2.error && status2.output.length === 0)
    return null;
  if (!status2.isAuthenticating && !status2.error)
    return null;
  let t3;
  if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedText, {
      bold: !0,
      color: "permission",
      children: "Cloud Authentication"
    }, void 0, !1, void 0, this), $3[3] = t3;
  else
    t3 = $3[3];
  let t4;
  if ($3[4] !== status2.output)
    t4 = status2.output.length > 0 && /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: 1,
      children: status2.output.slice(-5).map(_temp289)
    }, void 0, !1, void 0, this), $3[4] = status2.output, $3[5] = t4;
  else
    t4 = $3[5];
  let t5;
  if ($3[6] !== status2.error)
    t5 = status2.error && /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedText, {
        color: "error",
        children: status2.error
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[6] = status2.error, $3[7] = t5;
  else
    t5 = $3[7];
  let t6;
  if ($3[8] !== t4 || $3[9] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: "permission",
      paddingX: 1,
      marginY: 1,
      children: [
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[8] = t4, $3[9] = t5, $3[10] = t6;
  else
    t6 = $3[10];
  return t6;
}
function _temp289(line, index2) {
  let m4 = line.match(URL_RE);
  if (!m4)
    return /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedText, {
      dimColor: !0,
      children: line
    }, index2, !1, void 0, this);
  let url3 = m4[0], start = m4.index ?? 0, before2 = line.slice(0, start), after2 = line.slice(start + url3.length);
  return /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      before2,
      /* @__PURE__ */ jsx_dev_runtime451.jsxDEV(Link, {
        url: url3,
        children: url3
      }, void 0, !1, void 0, this),
      after2
    ]
  }, index2, !0, void 0, this);
}
var import_compiler_runtime352, import_react290, jsx_dev_runtime451, URL_RE;
var init_AwsAuthStatusBox = __esm(() => {
  init_ink2();
  init_awsAuthStatusManager();
  import_compiler_runtime352 = __toESM(require_react_compiler_runtime_development(), 1), import_react290 = __toESM(require_react_development(), 1), jsx_dev_runtime451 = __toESM(require_react_jsx_dev_runtime_development(), 1), URL_RE = /https?:\/\/\S+/;
});
