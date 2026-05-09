// function: BridgeStatusMessage
function BridgeStatusMessage(t0) {
  let $3 = import_compiler_runtime95.c(13), {
    message,
    addMargin
  } = t0, bg = useSelectedMessageBg(), t1 = addMargin ? 1 : 0, t2;
  if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
    t2 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      minWidth: 2
    }, void 0, !1, void 0, this), $3[0] = t2;
  else
    t2 = $3[0];
  let t3;
  if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
          color: "suggestion",
          children: "/remote-control"
        }, void 0, !1, void 0, this),
        " is active. Code in CLI or at"
      ]
    }, void 0, !0, void 0, this), $3[1] = t3;
  else
    t3 = $3[1];
  let t4;
  if ($3[2] !== message.url)
    t4 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(Link, {
      url: message.url,
      children: message.url
    }, void 0, !1, void 0, this), $3[2] = message.url, $3[3] = t4;
  else
    t4 = $3[3];
  let t5;
  if ($3[4] !== message.upgradeNudge)
    t5 = message.upgradeNudge && /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        "\u23BF ",
        message.upgradeNudge
      ]
    }, void 0, !0, void 0, this), $3[4] = message.upgradeNudge, $3[5] = t5;
  else
    t5 = $3[5];
  let t6;
  if ($3[6] !== t4 || $3[7] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t3,
        t4,
        t5
      ]
    }, void 0, !0, void 0, this), $3[6] = t4, $3[7] = t5, $3[8] = t6;
  else
    t6 = $3[8];
  let t7;
  if ($3[9] !== bg || $3[10] !== t1 || $3[11] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime106.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: t1,
      backgroundColor: bg,
      width: 999,
      children: [
        t2,
        t6
      ]
    }, void 0, !0, void 0, this), $3[9] = bg, $3[10] = t1, $3[11] = t6, $3[12] = t7;
  else
    t7 = $3[12];
  return t7;
}
