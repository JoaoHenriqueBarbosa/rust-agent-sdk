// Original: src/components/Spinner/TeammateSpinnerLine.tsx
function getMessagePreview(messages) {
  if (!messages?.length)
    return [];
  let allLines = [], maxLineLength = 80;
  for (let i5 = messages.length - 1;i5 >= 0 && allLines.length < 3; i5--) {
    let msg = messages[i5];
    if (!msg || msg.type !== "user" && msg.type !== "assistant" || !msg.message?.content?.length)
      continue;
    let content = msg.message.content;
    for (let block2 of content) {
      if (allLines.length >= 3)
        break;
      if (!block2 || typeof block2 !== "object")
        continue;
      if ("type" in block2 && block2.type === "tool_use" && "name" in block2) {
        let input = "input" in block2 ? block2.input : null, toolLine = `Using ${block2.name}\u2026`;
        if (input) {
          let desc = input.description || input.prompt || input.command || input.query || input.pattern;
          if (desc)
            toolLine = desc.split(`
`)[0] ?? toolLine;
        }
        allLines.push(truncateToWidth(toolLine, maxLineLength));
      } else if ("type" in block2 && block2.type === "text" && "text" in block2) {
        let textLines = block2.text.split(`
`).filter((l3) => l3.trim());
        for (let j4 = textLines.length - 1;j4 >= 0 && allLines.length < 3; j4--) {
          let line = textLines[j4];
          if (!line)
            continue;
          allLines.push(truncateToWidth(line, maxLineLength));
        }
      }
    }
  }
  return allLines.reverse();
}
function TeammateSpinnerLine({
  teammate,
  isLast,
  isSelected,
  isForegrounded,
  allIdle,
  showPreview
}) {
  let [randomVerb] = import_react57.useState(() => teammate.spinnerVerb ?? sample_default(getSpinnerVerbs())), [pastTenseVerb] = import_react57.useState(() => teammate.pastTenseVerb ?? sample_default(TURN_COMPLETION_VERBS)), isHighlighted = isSelected || isForegrounded, treeChar = isHighlighted ? isLast ? "\u2558\u2550" : "\u255E\u2550" : isLast ? "\u2514\u2500" : "\u251C\u2500", nameColor = toInkColor(teammate.identity.color), {
    columns
  } = useTerminalSize(), idleStartRef = import_react57.useRef(null), frozenDurationRef = import_react57.useRef(null);
  if (teammate.isIdle && idleStartRef.current === null)
    idleStartRef.current = Date.now();
  else if (!teammate.isIdle)
    idleStartRef.current = null;
  if (!allIdle && frozenDurationRef.current !== null)
    frozenDurationRef.current = null;
  let idleElapsedTime = useElapsedTime(idleStartRef.current ?? Date.now(), teammate.isIdle && !allIdle);
  if (allIdle && frozenDurationRef.current === null)
    frozenDurationRef.current = formatDuration(Math.max(0, Date.now() - teammate.startTime - (teammate.totalPausedMs ?? 0)));
  let displayTime = allIdle ? frozenDurationRef.current ?? (() => {
    throw Error(`frozenDurationRef is null for idle teammate ${teammate.identity.agentName}`);
  })() : idleElapsedTime, basePrefix = 8, fullAgentName = `@${teammate.identity.agentName}`, fullNameWidth = stringWidth(fullAgentName), toolUseCount = teammate.progress?.toolUseCount ?? 0, tokenCount = teammate.progress?.tokenCount ?? 0, statsText = ` \xB7 ${toolUseCount} tool ${toolUseCount === 1 ? "use" : "uses"} \xB7 ${formatNumber(tokenCount)} tokens`, statsWidth = stringWidth(statsText), selectHintText = ` \xB7 ${TEAMMATE_SELECT_HINT}`, selectHintWidth = stringWidth(selectHintText), viewHintWidth = stringWidth(" \xB7 enter to view"), minActivityWidth = 25, spaceWithFullName = columns - basePrefix - fullNameWidth - 2, showName = columns >= 60 && spaceWithFullName >= minActivityWidth, nameWidth = showName ? fullNameWidth + 2 : 0, availableForActivity = columns - basePrefix - nameWidth, showViewHint = isSelected && !isForegrounded && availableForActivity > viewHintWidth + statsWidth + minActivityWidth + 5, showSelectHint = isHighlighted && availableForActivity > selectHintWidth + (showViewHint ? viewHintWidth : 0) + statsWidth + minActivityWidth + 5, showStats = availableForActivity > statsWidth + minActivityWidth + 5, extrasCost = (showStats ? statsWidth : 0) + (showSelectHint ? selectHintWidth : 0) + (showViewHint ? viewHintWidth : 0), activityMaxWidth = Math.max(minActivityWidth, availableForActivity - extrasCost - 1), activityText = (() => {
    let activities = teammate.progress?.recentActivities;
    if (activities && activities.length > 0) {
      let summary = summarizeRecentActivities(activities);
      if (summary)
        return truncateToWidth(summary, activityMaxWidth);
    }
    let desc = teammate.progress?.lastActivity?.activityDescription;
    if (desc)
      return truncateToWidth(desc, activityMaxWidth);
    return randomVerb;
  })(), renderStatus = () => {
    if (teammate.shutdownRequested)
      return /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "[stopping]"
      }, void 0, !1, void 0, this);
    if (teammate.awaitingPlanApproval)
      return /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
        color: "warning",
        children: "[awaiting approval]"
      }, void 0, !1, void 0, this);
    if (teammate.isIdle) {
      if (allIdle)
        return /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            pastTenseVerb,
            " for ",
            displayTime
          ]
        }, void 0, !0, void 0, this);
      return /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "Idle for ",
          idleElapsedTime
        ]
      }, void 0, !0, void 0, this);
    }
    if (isHighlighted)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
      dimColor: !0,
      children: activityText?.endsWith("\u2026") ? activityText : `${activityText}\u2026`
    }, void 0, !1, void 0, this);
  }, previewLines = showPreview ? getMessagePreview(teammate.messages) : [], previewTreeChar = isLast ? "   " : "\u2502  ";
  return /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: [
      /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedBox_default, {
        paddingLeft: 3,
        children: [
          /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            color: isSelected ? "suggestion" : void 0,
            bold: isSelected,
            children: isSelected ? figures_default.pointer : " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !isSelected,
            children: [
              treeChar,
              " "
            ]
          }, void 0, !0, void 0, this),
          showName && /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            color: isSelected ? "suggestion" : nameColor,
            children: [
              "@",
              teammate.identity.agentName
            ]
          }, void 0, !0, void 0, this),
          showName && /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !isSelected,
            children: ": "
          }, void 0, !1, void 0, this),
          renderStatus(),
          showStats && /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              "\xB7 ",
              toolUseCount,
              " tool ",
              toolUseCount === 1 ? "use" : "uses",
              " \xB7",
              " ",
              formatNumber(tokenCount),
              " tokens"
            ]
          }, void 0, !0, void 0, this),
          showSelectHint && /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " \xB7 ",
              TEAMMATE_SELECT_HINT
            ]
          }, void 0, !0, void 0, this),
          showViewHint && /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \xB7 enter to view"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      previewLines.map((line, idx) => /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedBox_default, {
        paddingLeft: 3,
        children: [
          /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              previewTreeChar,
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime68.jsxDEV(ThemedText, {
            dimColor: !0,
            children: line
          }, void 0, !1, void 0, this)
        ]
      }, idx, !0, void 0, this))
    ]
  }, void 0, !0, void 0, this);
}
var import_react57, jsx_dev_runtime68;
var init_TeammateSpinnerLine = __esm(() => {
  init_figures();
  init_sample();
  init_spinnerVerbs();
  init_turnCompletionVerbs();
  init_useElapsedTime();
  init_useTerminalSize();
  init_stringWidth();
  init_ink2();
  init_collapseReadSearch();
  init_format();
  init_ink3();
  import_react57 = __toESM(require_react_development(), 1), jsx_dev_runtime68 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
