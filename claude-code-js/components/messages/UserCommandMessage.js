// Original: src/components/messages/UserCommandMessage.tsx
function UserCommandMessage(t0) {
  let $3 = import_compiler_runtime74.c(19), {
    addMargin,
    param: t1
  } = t0, {
    text: text2
  } = t1, t2;
  if ($3[0] !== text2)
    t2 = extractTag(text2, COMMAND_MESSAGE_TAG), $3[0] = text2, $3[1] = t2;
  else
    t2 = $3[1];
  let commandMessage = t2, t3;
  if ($3[2] !== text2)
    t3 = extractTag(text2, "command-args"), $3[2] = text2, $3[3] = t3;
  else
    t3 = $3[3];
  let args = t3, isSkillFormat = extractTag(text2, "skill-format") === "true";
  if (!commandMessage)
    return null;
  if (isSkillFormat) {
    let t42 = addMargin ? 1 : 0, t52;
    if ($3[4] === Symbol.for("react.memo_cache_sentinel"))
      t52 = /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedText, {
        color: "subtle",
        children: [
          figures_default.pointer,
          " "
        ]
      }, void 0, !0, void 0, this), $3[4] = t52;
    else
      t52 = $3[4];
    let t62;
    if ($3[5] !== commandMessage)
      t62 = /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedText, {
        children: [
          t52,
          /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedText, {
            color: "text",
            children: [
              "Skill(",
              commandMessage,
              ")"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this), $3[5] = commandMessage, $3[6] = t62;
    else
      t62 = $3[6];
    let t72;
    if ($3[7] !== t42 || $3[8] !== t62)
      t72 = /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: t42,
        backgroundColor: "userMessageBackground",
        paddingRight: 1,
        children: t62
      }, void 0, !1, void 0, this), $3[7] = t42, $3[8] = t62, $3[9] = t72;
    else
      t72 = $3[9];
    return t72;
  }
  let t4;
  if ($3[10] !== args || $3[11] !== commandMessage)
    t4 = [commandMessage, args].filter(Boolean), $3[10] = args, $3[11] = commandMessage, $3[12] = t4;
  else
    t4 = $3[12];
  let content = `/${t4.join(" ")}`, t5 = addMargin ? 1 : 0, t6;
  if ($3[13] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedText, {
      color: "subtle",
      children: [
        figures_default.pointer,
        " "
      ]
    }, void 0, !0, void 0, this), $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== content)
    t7 = /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedText, {
      children: [
        t6,
        /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedText, {
          color: "text",
          children: content
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[14] = content, $3[15] = t7;
  else
    t7 = $3[15];
  let t8;
  if ($3[16] !== t5 || $3[17] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime84.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginTop: t5,
      backgroundColor: "userMessageBackground",
      paddingRight: 1,
      children: t7
    }, void 0, !1, void 0, this), $3[16] = t5, $3[17] = t7, $3[18] = t8;
  else
    t8 = $3[18];
  return t8;
}
var import_compiler_runtime74, jsx_dev_runtime84;
var init_UserCommandMessage = __esm(() => {
  init_figures();
  init_xml();
  init_ink2();
  init_messages3();
  import_compiler_runtime74 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime84 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
