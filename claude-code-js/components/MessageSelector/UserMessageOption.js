// function: UserMessageOption
function UserMessageOption(t0) {
  let $3 = import_compiler_runtime287.c(31), {
    userMessage,
    color: color3,
    dimColor,
    isCurrent,
    paddingRight
  } = t0, {
    columns
  } = useTerminalSize();
  if (isCurrent) {
    let t12;
    if ($3[0] !== color3 || $3[1] !== dimColor)
      t12 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
        width: "100%",
        children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
          italic: !0,
          color: color3,
          dimColor,
          children: "(current)"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = color3, $3[1] = dimColor, $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  let content = userMessage.message.content, lastBlock = typeof content === "string" ? null : content[content.length - 1], T0, T1, t1, t2, t3, t4, t5, t6;
  if ($3[3] !== color3 || $3[4] !== columns || $3[5] !== content || $3[6] !== dimColor || $3[7] !== lastBlock || $3[8] !== paddingRight) {
    t6 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let rawMessageText = typeof content === "string" ? content.trim() : lastBlock && isTextBlock2(lastBlock) ? lastBlock.text.trim() : "(no prompt)", messageText = stripDisplayTags(rawMessageText);
      if (isEmptyMessageText(messageText)) {
        let t72;
        if ($3[17] !== color3 || $3[18] !== dimColor)
          t72 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            width: "100%",
            children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
              italic: !0,
              color: color3,
              dimColor,
              children: "((empty message))"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this), $3[17] = color3, $3[18] = dimColor, $3[19] = t72;
        else
          t72 = $3[19];
        t6 = t72;
        break bb0;
      }
      if (messageText.includes("<bash-input>")) {
        let input = extractTag(messageText, "bash-input");
        if (input) {
          let t72;
          if ($3[20] === Symbol.for("react.memo_cache_sentinel"))
            t72 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
              color: "bashBorder",
              children: "!"
            }, void 0, !1, void 0, this), $3[20] = t72;
          else
            t72 = $3[20];
          t6 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            width: "100%",
            children: [
              t72,
              /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                color: color3,
                dimColor,
                children: [
                  " ",
                  input
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this);
          break bb0;
        }
      }
      if (messageText.includes(`<${COMMAND_MESSAGE_TAG}>`)) {
        let commandMessage = extractTag(messageText, COMMAND_MESSAGE_TAG), args = extractTag(messageText, "command-args"), isSkillFormat = extractTag(messageText, "skill-format") === "true";
        if (commandMessage)
          if (isSkillFormat) {
            t6 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
              flexDirection: "row",
              width: "100%",
              children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                color: color3,
                dimColor,
                children: [
                  "Skill(",
                  commandMessage,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this);
            break bb0;
          } else {
            t6 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
              flexDirection: "row",
              width: "100%",
              children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
                color: color3,
                dimColor,
                children: [
                  "/",
                  commandMessage,
                  " ",
                  args
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this);
            break bb0;
          }
      }
      T1 = ThemedBox_default, t4 = "row", t5 = "100%", T0 = ThemedText, t1 = color3, t2 = dimColor, t3 = paddingRight ? truncate(messageText, columns - paddingRight, !0) : messageText.slice(0, 500).split(`
`).slice(0, 4).join(`
`);
    }
    $3[3] = color3, $3[4] = columns, $3[5] = content, $3[6] = dimColor, $3[7] = lastBlock, $3[8] = paddingRight, $3[9] = T0, $3[10] = T1, $3[11] = t1, $3[12] = t2, $3[13] = t3, $3[14] = t4, $3[15] = t5, $3[16] = t6;
  } else
    T0 = $3[9], T1 = $3[10], t1 = $3[11], t2 = $3[12], t3 = $3[13], t4 = $3[14], t5 = $3[15], t6 = $3[16];
  if (t6 !== Symbol.for("react.early_return_sentinel"))
    return t6;
  let t7;
  if ($3[21] !== T0 || $3[22] !== t1 || $3[23] !== t2 || $3[24] !== t3)
    t7 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(T0, {
      color: t1,
      dimColor: t2,
      children: t3
    }, void 0, !1, void 0, this), $3[21] = T0, $3[22] = t1, $3[23] = t2, $3[24] = t3, $3[25] = t7;
  else
    t7 = $3[25];
  let t8;
  if ($3[26] !== T1 || $3[27] !== t4 || $3[28] !== t5 || $3[29] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(T1, {
      flexDirection: t4,
      width: t5,
      children: t7
    }, void 0, !1, void 0, this), $3[26] = T1, $3[27] = t4, $3[28] = t5, $3[29] = t7, $3[30] = t8;
  else
    t8 = $3[30];
  return t8;
}
