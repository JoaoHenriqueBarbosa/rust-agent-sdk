// Original: src/components/messageActions.tsx
function isNavigableMessage(msg) {
  switch (msg.type) {
    case "assistant": {
      let b = msg.message.content[0];
      return b?.type === "text" && !isEmptyMessageText(b.text) && !SYNTHETIC_MESSAGES.has(b.text) || b?.type === "tool_use" && b.name in PRIMARY_INPUT;
    }
    case "user": {
      if (msg.isMeta || msg.isCompactSummary)
        return !1;
      let b = msg.message.content[0];
      if (b?.type !== "text")
        return !1;
      if (SYNTHETIC_MESSAGES.has(b.text))
        return !1;
      return !stripSystemReminders(b.text).startsWith("<");
    }
    case "system":
      switch (msg.subtype) {
        case "api_metrics":
        case "stop_hook_summary":
        case "turn_duration":
        case "memory_saved":
        case "agents_killed":
        case "away_summary":
        case "thinking":
          return !1;
      }
      return !0;
    case "grouped_tool_use":
    case "collapsed_read_search":
      return !0;
    case "attachment":
      switch (msg.attachment.type) {
        case "queued_command":
        case "diagnostics":
        case "hook_blocking_error":
        case "hook_error_during_execution":
          return !0;
      }
      return !1;
  }
}
function toolCallOf(msg) {
  if (msg.type === "assistant") {
    let b = msg.message.content[0];
    if (b?.type === "tool_use")
      return {
        name: b.name,
        input: b.input
      };
  }
  if (msg.type === "grouped_tool_use") {
    let b = msg.messages[0]?.message.content[0];
    if (b?.type === "tool_use")
      return {
        name: msg.toolName,
        input: b.input
      };
  }
  return;
}
function action(a2) {
  return a2;
}
function isApplicable(a2, c3) {
  if (!a2.types.includes(c3.msgType))
    return !1;
  return !a2.applies || a2.applies(c3);
}
function useSelectedMessageBg() {
  return import_react34.default.useContext(MessageActionsSelectedContext) ? "messageActionsBackground" : void 0;
}
function useMessageActions(cursor, setCursor, navRef, caps) {
  let cursorRef = import_react34.useRef(cursor);
  cursorRef.current = cursor;
  let capsRef = import_react34.useRef(caps);
  capsRef.current = caps;
  let handlers = import_react34.useMemo(() => {
    let h4 = {
      "messageActions:prev": () => navRef.current?.navigatePrev(),
      "messageActions:next": () => navRef.current?.navigateNext(),
      "messageActions:prevUser": () => navRef.current?.navigatePrevUser(),
      "messageActions:nextUser": () => navRef.current?.navigateNextUser(),
      "messageActions:top": () => navRef.current?.navigateTop(),
      "messageActions:bottom": () => navRef.current?.navigateBottom(),
      "messageActions:escape": () => setCursor((c3) => c3?.expanded ? {
        ...c3,
        expanded: !1
      } : null),
      "messageActions:ctrlc": () => setCursor(null)
    };
    for (let key2 of new Set(MESSAGE_ACTIONS.map((a_1) => a_1.key)))
      h4[`messageActions:${key2}`] = () => {
        let c_0 = cursorRef.current;
        if (!c_0)
          return;
        let a_0 = MESSAGE_ACTIONS.find((a2) => a2.key === key2 && isApplicable(a2, c_0));
        if (!a_0)
          return;
        if (a_0.stays) {
          setCursor((c_1) => c_1 ? {
            ...c_1,
            expanded: !c_1.expanded
          } : null);
          return;
        }
        let m4 = navRef.current?.getSelected();
        if (!m4)
          return;
        a_0.run(m4, capsRef.current), setCursor(null);
      };
    return h4;
  }, [setCursor, navRef]);
  return {
    enter: import_react34.useCallback(() => {
      logEvent("tengu_message_actions_enter", {}), navRef.current?.enterCursor();
    }, [navRef]),
    handlers
  };
}
function MessageActionsBar(t0) {
  let $3 = import_compiler_runtime21.c(28), {
    cursor
  } = t0, T0, T1, t1, t2, t3, t4, t5, t6, t7;
  if ($3[0] !== cursor) {
    let applicable = MESSAGE_ACTIONS.filter((a2) => isApplicable(a2, cursor));
    if (T1 = ThemedBox_default, t4 = "column", t5 = 0, t6 = 1, $3[10] === Symbol.for("react.memo_cache_sentinel"))
      t7 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedBox_default, {
        borderStyle: "single",
        borderTop: !0,
        borderBottom: !1,
        borderLeft: !1,
        borderRight: !1,
        borderDimColor: !0
      }, void 0, !1, void 0, this), $3[10] = t7;
    else
      t7 = $3[10];
    T0 = ThemedBox_default, t1 = 2, t2 = 1, t3 = applicable.map((a_0, i5) => {
      let label = typeof a_0.label === "function" ? a_0.label(cursor) : a_0.label;
      return /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(import_react34.default.Fragment, {
        children: [
          i5 > 0 && /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
            dimColor: !0,
            children: " \xB7 "
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
            bold: !0,
            dimColor: !1,
            children: a_0.key
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              label
            ]
          }, void 0, !0, void 0, this)
        ]
      }, a_0.key, !0, void 0, this);
    }), $3[0] = cursor, $3[1] = T0, $3[2] = T1, $3[3] = t1, $3[4] = t2, $3[5] = t3, $3[6] = t4, $3[7] = t5, $3[8] = t6, $3[9] = t7;
  } else
    T0 = $3[1], T1 = $3[2], t1 = $3[3], t2 = $3[4], t3 = $3[5], t4 = $3[6], t5 = $3[7], t6 = $3[8], t7 = $3[9];
  let t10, t11, t12, t8, t9;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t8 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " \xB7 "
    }, void 0, !1, void 0, this), t9 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
      bold: !0,
      dimColor: !1,
      children: [
        figures_default.arrowUp,
        figures_default.arrowDown
      ]
    }, void 0, !0, void 0, this), t10 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " navigate \xB7 "
    }, void 0, !1, void 0, this), t11 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
      bold: !0,
      dimColor: !1,
      children: "esc"
    }, void 0, !1, void 0, this), t12 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(ThemedText, {
      dimColor: !0,
      children: " back"
    }, void 0, !1, void 0, this), $3[11] = t10, $3[12] = t11, $3[13] = t12, $3[14] = t8, $3[15] = t9;
  else
    t10 = $3[11], t11 = $3[12], t12 = $3[13], t8 = $3[14], t9 = $3[15];
  let t13;
  if ($3[16] !== T0 || $3[17] !== t1 || $3[18] !== t2 || $3[19] !== t3)
    t13 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(T0, {
      paddingX: t1,
      paddingY: t2,
      children: [
        t3,
        t8,
        t9,
        t10,
        t11,
        t12
      ]
    }, void 0, !0, void 0, this), $3[16] = T0, $3[17] = t1, $3[18] = t2, $3[19] = t3, $3[20] = t13;
  else
    t13 = $3[20];
  let t14;
  if ($3[21] !== T1 || $3[22] !== t13 || $3[23] !== t4 || $3[24] !== t5 || $3[25] !== t6 || $3[26] !== t7)
    t14 = /* @__PURE__ */ jsx_dev_runtime24.jsxDEV(T1, {
      flexDirection: t4,
      flexShrink: t5,
      paddingY: t6,
      children: [
        t7,
        t13
      ]
    }, void 0, !0, void 0, this), $3[21] = T1, $3[22] = t13, $3[23] = t4, $3[24] = t5, $3[25] = t6, $3[26] = t7, $3[27] = t14;
  else
    t14 = $3[27];
  return t14;
}
function stripSystemReminders(text2) {
  let t2 = text2.trimStart();
  while (t2.startsWith("<system-reminder>")) {
    let end = t2.indexOf("</system-reminder>");
    if (end < 0)
      break;
    t2 = t2.slice(end + 18).trimStart();
  }
  return t2;
}
function copyTextOf(msg) {
  switch (msg.type) {
    case "user": {
      let b = msg.message.content[0];
      return b?.type === "text" ? stripSystemReminders(b.text) : "";
    }
    case "assistant": {
      let b = msg.message.content[0];
      if (b?.type === "text")
        return b.text;
      let tc = toolCallOf(msg);
      return tc ? PRIMARY_INPUT[tc.name]?.extract(tc.input) ?? "" : "";
    }
    case "grouped_tool_use":
      return msg.results.map(toolResultText).filter(Boolean).join(`

`);
    case "collapsed_read_search":
      return msg.messages.flatMap((m4) => m4.type === "user" ? [toolResultText(m4)] : m4.type === "grouped_tool_use" ? m4.results.map(toolResultText) : []).filter(Boolean).join(`

`);
    case "system":
      if ("content" in msg)
        return msg.content;
      if ("error" in msg)
        return String(msg.error);
      return msg.subtype;
    case "attachment": {
      let a2 = msg.attachment;
      if (a2.type === "queued_command") {
        let p4 = a2.prompt;
        return typeof p4 === "string" ? p4 : p4.flatMap((b) => b.type === "text" ? [b.text] : []).join(`
`);
      }
      return `[${a2.type}]`;
    }
  }
}
function toolResultText(r4) {
  let b = r4.message.content[0];
  if (b?.type !== "tool_result")
    return "";
  let c3 = b.content;
  if (typeof c3 === "string")
    return c3;
  if (!c3)
    return "";
  return c3.flatMap((x4) => x4.type === "text" ? [x4.text] : []).join(`
`);
}
var import_compiler_runtime21, import_react34, jsx_dev_runtime24, NAVIGABLE_TYPES, str = (k3) => (i5) => typeof i5[k3] === "string" ? i5[k3] : void 0, PRIMARY_INPUT, MESSAGE_ACTIONS, MessageActionsSelectedContext, InVirtualListContext;
var init_messageActions = __esm(() => {
  init_figures();
  init_ink2();
  init_useKeybinding();
  init_messages3();
  import_compiler_runtime21 = __toESM(require_react_compiler_runtime_development(), 1), import_react34 = __toESM(require_react_development(), 1), jsx_dev_runtime24 = __toESM(require_react_jsx_dev_runtime_development(), 1), NAVIGABLE_TYPES = ["user", "assistant", "grouped_tool_use", "collapsed_read_search", "system", "attachment"];
  PRIMARY_INPUT = {
    Read: {
      label: "path",
      extract: str("file_path")
    },
    Edit: {
      label: "path",
      extract: str("file_path")
    },
    Write: {
      label: "path",
      extract: str("file_path")
    },
    NotebookEdit: {
      label: "path",
      extract: str("notebook_path")
    },
    Bash: {
      label: "command",
      extract: str("command")
    },
    Grep: {
      label: "pattern",
      extract: str("pattern")
    },
    Glob: {
      label: "pattern",
      extract: str("pattern")
    },
    WebFetch: {
      label: "url",
      extract: str("url")
    },
    WebSearch: {
      label: "query",
      extract: str("query")
    },
    Task: {
      label: "prompt",
      extract: str("prompt")
    },
    Agent: {
      label: "prompt",
      extract: str("prompt")
    },
    Tmux: {
      label: "command",
      extract: (i5) => Array.isArray(i5.args) ? `tmux ${i5.args.join(" ")}` : void 0
    }
  };
  MESSAGE_ACTIONS = [action({
    key: "enter",
    label: (s2) => s2.expanded ? "collapse" : "expand",
    types: ["grouped_tool_use", "collapsed_read_search", "attachment", "system"],
    stays: !0,
    run: () => {}
  }), action({
    key: "enter",
    label: "edit",
    types: ["user"],
    run: (m4, c3) => void c3.edit(m4)
  }), action({
    key: "c",
    label: "copy",
    types: NAVIGABLE_TYPES,
    run: (m4, c3) => c3.copy(copyTextOf(m4))
  }), action({
    key: "p",
    label: (s2) => `copy ${PRIMARY_INPUT[s2.toolName].label}`,
    types: ["grouped_tool_use", "assistant"],
    applies: (s2) => s2.toolName != null && (s2.toolName in PRIMARY_INPUT),
    run: (m4, c3) => {
      let tc = toolCallOf(m4);
      if (!tc)
        return;
      let val = PRIMARY_INPUT[tc.name]?.extract(tc.input);
      if (val)
        c3.copy(val);
    }
  })];
  MessageActionsSelectedContext = import_react34.default.createContext(!1), InVirtualListContext = import_react34.default.createContext(!1);
});
