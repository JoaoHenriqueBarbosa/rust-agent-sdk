// Original: src/components/messages/ShutdownMessage.tsx
function ShutdownRequestDisplay(t0) {
  let $3 = import_compiler_runtime81.c(7), {
    request: request2
  } = t0, t1;
  if ($3[0] !== request2.from)
    t1 = /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
      marginBottom: 1,
      children: /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedText, {
        color: "warning",
        bold: !0,
        children: [
          "Shutdown request from ",
          request2.from
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[0] = request2.from, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== request2.reason)
    t2 = request2.reason && /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
      children: /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedText, {
        children: [
          "Reason: ",
          request2.reason
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = request2.reason, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== t1 || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
        borderStyle: "round",
        borderColor: "warning",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1,
        children: [
          t1,
          t2
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t1, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
function ShutdownRejectedDisplay(t0) {
  let $3 = import_compiler_runtime81.c(8), {
    response: response7
  } = t0, t1;
  if ($3[0] !== response7.from)
    t1 = /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedText, {
      color: "subtle",
      bold: !0,
      children: [
        "Shutdown rejected by ",
        response7.from
      ]
    }, void 0, !0, void 0, this), $3[0] = response7.from, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== response7.reason)
    t2 = /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      borderStyle: "dashed",
      borderColor: "subtle",
      borderLeft: !1,
      borderRight: !1,
      paddingX: 1,
      children: /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedText, {
        children: [
          "Reason: ",
          response7.reason
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[2] = response7.reason, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
    t3 = /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
      marginTop: 1,
      children: /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Teammate is continuing to work. You may request shutdown again later."
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== t1 || $3[6] !== t2)
    t4 = /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ThemedBox_default, {
        borderStyle: "round",
        borderColor: "subtle",
        flexDirection: "column",
        paddingX: 1,
        paddingY: 1,
        children: [
          t1,
          t2,
          t3
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = t1, $3[6] = t2, $3[7] = t4;
  else
    t4 = $3[7];
  return t4;
}
function tryRenderShutdownMessage(content) {
  let request2 = isShutdownRequest(content);
  if (request2)
    return /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ShutdownRequestDisplay, {
      request: request2
    }, void 0, !1, void 0, this);
  if (isShutdownApproved(content))
    return null;
  let rejected = isShutdownRejected(content);
  if (rejected)
    return /* @__PURE__ */ jsx_dev_runtime92.jsxDEV(ShutdownRejectedDisplay, {
      response: rejected
    }, void 0, !1, void 0, this);
  return null;
}
function getShutdownMessageSummary(content) {
  let request2 = isShutdownRequest(content);
  if (request2)
    return `[Shutdown Request from ${request2.from}]${request2.reason ? ` ${request2.reason}` : ""}`;
  let approved = isShutdownApproved(content);
  if (approved)
    return `[Shutdown Approved] ${approved.from} is now exiting`;
  let rejected = isShutdownRejected(content);
  if (rejected)
    return `[Shutdown Rejected] ${rejected.from}: ${rejected.reason}`;
  return null;
}
var import_compiler_runtime81, jsx_dev_runtime92;
var init_ShutdownMessage = __esm(() => {
  init_ink2();
  init_teammateMailbox();
  import_compiler_runtime81 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime92 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
