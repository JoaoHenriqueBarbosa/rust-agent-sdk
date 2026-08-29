// Original: src/components/messages/UserChannelMessage.tsx
var exports_UserChannelMessage = {};
__export(exports_UserChannelMessage, {
  UserChannelMessage: () => UserChannelMessage
});
function displayServerName(name3) {
  let i5 = name3.lastIndexOf(":");
  return i5 === -1 ? name3 : name3.slice(i5 + 1);
}
function UserChannelMessage(t0) {
  let $3 = import_compiler_runtime85.c(29), {
    addMargin,
    param: t1
  } = t0, {
    text: text2
  } = t1, T0, T1, T2, t2, t3, t4, t5, t6, t7, truncated, user;
  if ($3[0] !== addMargin || $3[1] !== text2) {
    t7 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let m4 = CHANNEL_RE.exec(text2);
      if (!m4) {
        t7 = null;
        break bb0;
      }
      let [, source, attrs, content] = m4;
      user = USER_ATTR_RE.exec(attrs ?? "")?.[1];
      let body = (content ?? "").trim().replace(/\s+/g, " ");
      if (truncated = truncateToWidth(body, TRUNCATE_AT), T2 = ThemedBox_default, t6 = addMargin ? 1 : 0, T1 = ThemedText, $3[13] === Symbol.for("react.memo_cache_sentinel"))
        t4 = /* @__PURE__ */ jsx_dev_runtime96.jsxDEV(ThemedText, {
          color: "suggestion",
          children: CHANNEL_ARROW
        }, void 0, !1, void 0, this), $3[13] = t4;
      else
        t4 = $3[13];
      t5 = " ", T0 = ThemedText, t2 = !0, t3 = displayServerName(source ?? "");
    }
    $3[0] = addMargin, $3[1] = text2, $3[2] = T0, $3[3] = T1, $3[4] = T2, $3[5] = t2, $3[6] = t3, $3[7] = t4, $3[8] = t5, $3[9] = t6, $3[10] = t7, $3[11] = truncated, $3[12] = user;
  } else
    T0 = $3[2], T1 = $3[3], T2 = $3[4], t2 = $3[5], t3 = $3[6], t4 = $3[7], t5 = $3[8], t6 = $3[9], t7 = $3[10], truncated = $3[11], user = $3[12];
  if (t7 !== Symbol.for("react.early_return_sentinel"))
    return t7;
  let t8 = user ? ` \xB7 ${user}` : "", t9;
  if ($3[14] !== T0 || $3[15] !== t2 || $3[16] !== t3 || $3[17] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime96.jsxDEV(T0, {
      dimColor: t2,
      children: [
        t3,
        t8,
        ":"
      ]
    }, void 0, !0, void 0, this), $3[14] = T0, $3[15] = t2, $3[16] = t3, $3[17] = t8, $3[18] = t9;
  else
    t9 = $3[18];
  let t10;
  if ($3[19] !== T1 || $3[20] !== t4 || $3[21] !== t5 || $3[22] !== t9 || $3[23] !== truncated)
    t10 = /* @__PURE__ */ jsx_dev_runtime96.jsxDEV(T1, {
      children: [
        t4,
        t5,
        t9,
        " ",
        truncated
      ]
    }, void 0, !0, void 0, this), $3[19] = T1, $3[20] = t4, $3[21] = t5, $3[22] = t9, $3[23] = truncated, $3[24] = t10;
  else
    t10 = $3[24];
  let t11;
  if ($3[25] !== T2 || $3[26] !== t10 || $3[27] !== t6)
    t11 = /* @__PURE__ */ jsx_dev_runtime96.jsxDEV(T2, {
      marginTop: t6,
      children: t10
    }, void 0, !1, void 0, this), $3[25] = T2, $3[26] = t10, $3[27] = t6, $3[28] = t11;
  else
    t11 = $3[28];
  return t11;
}
var import_compiler_runtime85, jsx_dev_runtime96, CHANNEL_RE, USER_ATTR_RE, TRUNCATE_AT = 60;
var init_UserChannelMessage = __esm(() => {
  init_figures2();
  init_xml();
  init_ink2();
  init_format();
  import_compiler_runtime85 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime96 = __toESM(require_react_jsx_dev_runtime_development(), 1), CHANNEL_RE = new RegExp(`<${CHANNEL_TAG}\\s+source="([^"]+)"([^>]*)>\\n?([\\s\\S]*?)\\n?</${CHANNEL_TAG}>`), USER_ATTR_RE = /\buser="([^"]+)"/;
});
