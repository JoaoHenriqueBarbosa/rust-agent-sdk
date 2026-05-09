// Original: src/components/AgentProgressLine.tsx
function AgentProgressLine(t0) {
  let $3 = import_compiler_runtime34.c(32), {
    agentType,
    description,
    name: name3,
    descriptionColor,
    taskDescription,
    toolUseCount,
    tokens,
    color: color2,
    isLast,
    isResolved,
    isAsync: t1,
    lastToolInfo,
    hideType: t2
  } = t0, isAsync2 = t1 === void 0 ? !1 : t1, hideType = t2 === void 0 ? !1 : t2, treeChar = isLast ? "\u2514\u2500" : "\u251C\u2500", isBackgrounded = isAsync2 && isResolved, t3;
  if ($3[0] !== isBackgrounded || $3[1] !== isResolved || $3[2] !== lastToolInfo || $3[3] !== taskDescription)
    t3 = () => {
      if (!isResolved)
        return lastToolInfo || "Initializing\u2026";
      if (isBackgrounded)
        return taskDescription ?? "Running in the background";
      return "Done";
    }, $3[0] = isBackgrounded, $3[1] = isResolved, $3[2] = lastToolInfo, $3[3] = taskDescription, $3[4] = t3;
  else
    t3 = $3[4];
  let getStatusText = t3, t4;
  if ($3[5] !== treeChar)
    t4 = /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        treeChar,
        " "
      ]
    }, void 0, !0, void 0, this), $3[5] = treeChar, $3[6] = t4;
  else
    t4 = $3[6];
  let t5 = !isResolved, t6;
  if ($3[7] !== agentType || $3[8] !== color2 || $3[9] !== description || $3[10] !== descriptionColor || $3[11] !== hideType || $3[12] !== name3)
    t6 = hideType ? /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(jsx_dev_runtime39.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
          bold: !0,
          children: name3 ?? description ?? agentType
        }, void 0, !1, void 0, this),
        name3 && description && /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            ": ",
            description
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(jsx_dev_runtime39.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
          bold: !0,
          backgroundColor: color2,
          color: color2 ? "inverseText" : void 0,
          children: agentType
        }, void 0, !1, void 0, this),
        description && /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(jsx_dev_runtime39.Fragment, {
          children: [
            " (",
            /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
              backgroundColor: descriptionColor,
              color: descriptionColor ? "inverseText" : void 0,
              children: description
            }, void 0, !1, void 0, this),
            ")"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[7] = agentType, $3[8] = color2, $3[9] = description, $3[10] = descriptionColor, $3[11] = hideType, $3[12] = name3, $3[13] = t6;
  else
    t6 = $3[13];
  let t7;
  if ($3[14] !== isBackgrounded || $3[15] !== tokens || $3[16] !== toolUseCount)
    t7 = !isBackgrounded && /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(jsx_dev_runtime39.Fragment, {
      children: [
        " \xB7 ",
        toolUseCount,
        " tool ",
        toolUseCount === 1 ? "use" : "uses",
        tokens !== null && /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(jsx_dev_runtime39.Fragment, {
          children: [
            " \xB7 ",
            formatNumber(tokens),
            " tokens"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[14] = isBackgrounded, $3[15] = tokens, $3[16] = toolUseCount, $3[17] = t7;
  else
    t7 = $3[17];
  let t8;
  if ($3[18] !== t5 || $3[19] !== t6 || $3[20] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
      dimColor: t5,
      children: [
        t6,
        t7
      ]
    }, void 0, !0, void 0, this), $3[18] = t5, $3[19] = t6, $3[20] = t7, $3[21] = t8;
  else
    t8 = $3[21];
  let t9;
  if ($3[22] !== t4 || $3[23] !== t8)
    t9 = /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedBox_default, {
      paddingLeft: 3,
      children: [
        t4,
        t8
      ]
    }, void 0, !0, void 0, this), $3[22] = t4, $3[23] = t8, $3[24] = t9;
  else
    t9 = $3[24];
  let t10;
  if ($3[25] !== getStatusText || $3[26] !== isBackgrounded || $3[27] !== isLast)
    t10 = !isBackgrounded && /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedBox_default, {
      paddingLeft: 3,
      flexDirection: "row",
      children: [
        /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
          dimColor: !0,
          children: isLast ? "   \u23BF  " : "\u2502  \u23BF  "
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedText, {
          dimColor: !0,
          children: getStatusText()
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[25] = getStatusText, $3[26] = isBackgrounded, $3[27] = isLast, $3[28] = t10;
  else
    t10 = $3[28];
  let t11;
  if ($3[29] !== t10 || $3[30] !== t9)
    t11 = /* @__PURE__ */ jsx_dev_runtime39.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t9,
        t10
      ]
    }, void 0, !0, void 0, this), $3[29] = t10, $3[30] = t9, $3[31] = t11;
  else
    t11 = $3[31];
  return t11;
}
var import_compiler_runtime34, jsx_dev_runtime39;
var init_AgentProgressLine = __esm(() => {
  init_ink2();
  init_format();
  import_compiler_runtime34 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime39 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
