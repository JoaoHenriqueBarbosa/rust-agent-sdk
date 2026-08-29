// function: VerboseToolUse
function VerboseToolUse(t0) {
  let $3 = import_compiler_runtime92.c(24), {
    content,
    tools,
    lookups,
    inProgressToolUseIDs,
    shouldAnimate,
    theme
  } = t0, bg = useSelectedMessageBg(), t1, t2;
  if ($3[0] !== bg || $3[1] !== content.id || $3[2] !== content.input || $3[3] !== content.name || $3[4] !== inProgressToolUseIDs || $3[5] !== lookups || $3[6] !== shouldAnimate || $3[7] !== theme || $3[8] !== tools) {
    t2 = Symbol.for("react.early_return_sentinel");
    bb0: {
      let tool = findToolByName(tools, content.name) ?? findToolByName(getReplPrimitiveTools(), content.name);
      if (!tool) {
        t2 = null;
        break bb0;
      }
      let t3;
      if ($3[11] !== content.id || $3[12] !== lookups.resolvedToolUseIDs)
        t3 = lookups.resolvedToolUseIDs.has(content.id), $3[11] = content.id, $3[12] = lookups.resolvedToolUseIDs, $3[13] = t3;
      else
        t3 = $3[13];
      let isResolved = t3, t4;
      if ($3[14] !== content.id || $3[15] !== lookups.erroredToolUseIDs)
        t4 = lookups.erroredToolUseIDs.has(content.id), $3[14] = content.id, $3[15] = lookups.erroredToolUseIDs, $3[16] = t4;
      else
        t4 = $3[16];
      let isError3 = t4, t5;
      if ($3[17] !== content.id || $3[18] !== inProgressToolUseIDs)
        t5 = inProgressToolUseIDs.has(content.id), $3[17] = content.id, $3[18] = inProgressToolUseIDs, $3[19] = t5;
      else
        t5 = $3[19];
      let isInProgress = t5, resultMsg = lookups.toolResultByToolUseID.get(content.id), rawToolResult = resultMsg?.type === "user" ? resultMsg.toolUseResult : void 0, parsedOutput = tool.outputSchema?.safeParse(rawToolResult), toolResult = parsedOutput?.success ? parsedOutput.data : void 0, parsedInput = tool.inputSchema.safeParse(content.input), input = parsedInput.success ? parsedInput.data : void 0, userFacingName2 = tool.userFacingName(input), toolUseMessage = input ? tool.renderToolUseMessage(input, {
        theme,
        verbose: !0
      }) : null, t6 = shouldAnimate && isInProgress, t7 = !isResolved, t8;
      if ($3[20] !== isError3 || $3[21] !== t6 || $3[22] !== t7)
        t8 = /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ToolUseLoader, {
          shouldAnimate: t6,
          isUnresolved: t7,
          isError: isError3
        }, void 0, !1, void 0, this), $3[20] = isError3, $3[21] = t6, $3[22] = t7, $3[23] = t8;
      else
        t8 = $3[23];
      t1 = /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        backgroundColor: bg,
        children: [
          /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              t8,
              /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
                children: [
                  /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
                    bold: !0,
                    children: userFacingName2
                  }, void 0, !1, void 0, this),
                  toolUseMessage && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
                    children: [
                      "(",
                      toolUseMessage,
                      ")"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              input && tool.renderToolUseTag?.(input)
            ]
          }, void 0, !0, void 0, this),
          isResolved && !isError3 && toolResult !== void 0 && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
            children: tool.renderToolResultMessage?.(toolResult, [], {
              verbose: !0,
              tools,
              theme
            })
          }, void 0, !1, void 0, this)
        ]
      }, content.id, !0, void 0, this);
    }
    $3[0] = bg, $3[1] = content.id, $3[2] = content.input, $3[3] = content.name, $3[4] = inProgressToolUseIDs, $3[5] = lookups, $3[6] = shouldAnimate, $3[7] = theme, $3[8] = tools, $3[9] = t1, $3[10] = t2;
  } else
    t1 = $3[9], t2 = $3[10];
  if (t2 !== Symbol.for("react.early_return_sentinel"))
    return t2;
  return t1;
}
