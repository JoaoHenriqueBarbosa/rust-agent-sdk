// Original: src/components/messages/UserResourceUpdateMessage.tsx
function parseUpdates(text2) {
  let updates = [], resourceRegex = /<mcp-resource-update\s+server="([^"]+)"\s+uri="([^"]+)"[^>]*>(?:[\s\S]*?<reason>([^<]+)<\/reason>)?/g, match;
  while ((match = resourceRegex.exec(text2)) !== null)
    updates.push({
      kind: "resource",
      server: match[1] ?? "",
      target: match[2] ?? "",
      reason: match[3]
    });
  let pollingRegex = /<mcp-polling-update\s+type="([^"]+)"\s+server="([^"]+)"\s+tool="([^"]+)"[^>]*>(?:[\s\S]*?<reason>([^<]+)<\/reason>)?/g;
  while ((match = pollingRegex.exec(text2)) !== null)
    updates.push({
      kind: "polling",
      server: match[2] ?? "",
      target: match[3] ?? "",
      reason: match[4]
    });
  return updates;
}
function formatUri(uri7) {
  if (uri7.startsWith("file://")) {
    let path16 = uri7.slice(7), parts = path16.split("/");
    return parts[parts.length - 1] || path16;
  }
  if (uri7.length > 40)
    return uri7.slice(0, 39) + "\u2026";
  return uri7;
}
function UserResourceUpdateMessage(t0) {
  let $3 = import_compiler_runtime80.c(12), {
    addMargin,
    param: t1
  } = t0, {
    text: text2
  } = t1, T0, t2, t3, t4, t5;
  if ($3[0] !== addMargin || $3[1] !== text2) {
    t5 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let updates = parseUpdates(text2);
      if (updates.length === 0) {
        t5 = null;
        break bb0;
      }
      T0 = ThemedBox_default, t2 = "column", t3 = addMargin ? 1 : 0, t4 = updates.map(_temp18);
    }
    $3[0] = addMargin, $3[1] = text2, $3[2] = T0, $3[3] = t2, $3[4] = t3, $3[5] = t4, $3[6] = t5;
  } else
    T0 = $3[2], t2 = $3[3], t3 = $3[4], t4 = $3[5], t5 = $3[6];
  if (t5 !== Symbol.for("react.early_return_sentinel"))
    return t5;
  let t6;
  if ($3[7] !== T0 || $3[8] !== t2 || $3[9] !== t3 || $3[10] !== t4)
    t6 = /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(T0, {
      flexDirection: t2,
      marginTop: t3,
      children: t4
    }, void 0, !1, void 0, this), $3[7] = T0, $3[8] = t2, $3[9] = t3, $3[10] = t4, $3[11] = t6;
  else
    t6 = $3[11];
  return t6;
}
function _temp18(update, i5) {
  return /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(ThemedBox_default, {
    children: /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(ThemedText, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(ThemedText, {
          color: "success",
          children: REFRESH_ARROW
        }, void 0, !1, void 0, this),
        " ",
        /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            update.server,
            ":"
          ]
        }, void 0, !0, void 0, this),
        " ",
        /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(ThemedText, {
          color: "suggestion",
          children: update.kind === "resource" ? formatUri(update.target) : update.target
        }, void 0, !1, void 0, this),
        update.reason && /* @__PURE__ */ jsx_dev_runtime91.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            " \xB7 ",
            update.reason
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, i5, !1, void 0, this);
}
var import_compiler_runtime80, jsx_dev_runtime91;
var init_UserResourceUpdateMessage = __esm(() => {
  init_figures2();
  init_ink2();
  import_compiler_runtime80 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime91 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
