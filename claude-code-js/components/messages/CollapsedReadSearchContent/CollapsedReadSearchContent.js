// function: CollapsedReadSearchContent
function CollapsedReadSearchContent({
  message,
  inProgressToolUseIDs,
  shouldAnimate,
  verbose,
  tools,
  lookups,
  isActiveGroup
}) {
  let bg = useSelectedMessageBg(), {
    searchCount: rawSearchCount,
    readCount: rawReadCount,
    listCount: rawListCount,
    replCount,
    memorySearchCount,
    memoryReadCount,
    memoryWriteCount,
    messages: groupMessages
  } = message, [theme] = useTheme(), toolUseIds = getToolUseIdsFromCollapsedGroup(message), anyError = toolUseIds.some((id) => lookups.erroredToolUseIDs.has(id)), hasMemoryOps = memorySearchCount > 0 || memoryReadCount > 0 || memoryWriteCount > 0, hasTeamMemoryOps = !1, maxReadCountRef = import_react70.useRef(0), maxSearchCountRef = import_react70.useRef(0), maxListCountRef = import_react70.useRef(0), maxMcpCountRef = import_react70.useRef(0), maxBashCountRef = import_react70.useRef(0);
  maxReadCountRef.current = Math.max(maxReadCountRef.current, rawReadCount), maxSearchCountRef.current = Math.max(maxSearchCountRef.current, rawSearchCount), maxListCountRef.current = Math.max(maxListCountRef.current, rawListCount), maxMcpCountRef.current = Math.max(maxMcpCountRef.current, message.mcpCallCount ?? 0), maxBashCountRef.current = Math.max(maxBashCountRef.current, message.bashCount ?? 0);
  let readCount = maxReadCountRef.current, searchCount = maxSearchCountRef.current, listCount = maxListCountRef.current, mcpCallCount = maxMcpCountRef.current, gitOpBashCount = message.gitOpBashCount ?? 0, bashCount = isFullscreenEnvEnabled() ? Math.max(0, maxBashCountRef.current - gitOpBashCount) : 0, hasNonMemoryOps = searchCount > 0 || readCount > 0 || listCount > 0 || replCount > 0 || mcpCallCount > 0 || bashCount > 0 || gitOpBashCount > 0, readPaths = message.readFilePaths, searchArgs = message.searchArgs, incomingHint = message.latestDisplayHint;
  if (incomingHint === void 0) {
    let lastSearchRaw = searchArgs?.at(-1), lastSearch = lastSearchRaw !== void 0 ? `"${lastSearchRaw}"` : void 0, lastRead = readPaths?.at(-1);
    incomingHint = lastRead !== void 0 ? getDisplayPath(lastRead) : lastSearch;
  }
  if (isActiveGroup)
    for (let id_0 of toolUseIds) {
      if (!inProgressToolUseIDs.has(id_0))
        continue;
      let latest = lookups.progressMessagesByToolUseID.get(id_0)?.at(-1)?.data;
      if (latest?.type === "repl_tool_call" && latest.phase === "start") {
        let input = latest.toolInput;
        incomingHint = input.file_path ?? (input.pattern ? `"${input.pattern}"` : void 0) ?? input.command ?? latest.toolName;
      }
    }
  let displayedHint = useMinDisplayTime(incomingHint, MIN_HINT_DISPLAY_MS);
  if (verbose) {
    let toolUses = [];
    for (let msg of groupMessages)
      if (msg.type === "assistant")
        toolUses.push(msg);
      else if (msg.type === "grouped_tool_use")
        toolUses.push(...msg.messages);
    return /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        toolUses.map((msg_0) => {
          let content = msg_0.message.content[0];
          if (content?.type !== "tool_use")
            return null;
          return /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(VerboseToolUse, {
            content,
            tools,
            lookups,
            inProgressToolUseIDs,
            shouldAnimate,
            theme
          }, content.id, !1, void 0, this);
        }),
        message.hookInfos && message.hookInfos.length > 0 && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(jsx_dev_runtime103.Fragment, {
          children: [
            /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "  \u23BF  ",
                "Ran ",
                message.hookCount,
                " PreToolUse",
                " ",
                message.hookCount === 1 ? "hook" : "hooks",
                " (",
                formatSecondsShort(message.hookTotalMs ?? 0),
                ")"
              ]
            }, void 0, !0, void 0, this),
            message.hookInfos.map((info, idx) => /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "     \u23BF ",
                info.command,
                " (",
                formatSecondsShort(info.durationMs ?? 0),
                ")"
              ]
            }, `hook-${idx}`, !0, void 0, this))
          ]
        }, void 0, !0, void 0, this),
        message.relevantMemories?.map((m4) => /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                "  \u23BF  ",
                "Recalled ",
                basename17(m4.path)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
              paddingLeft: 5,
              children: /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
                children: /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(Ansi, {
                  children: m4.content
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, m4.path, !0, void 0, this))
      ]
    }, void 0, !0, void 0, this);
  }
  if (!hasMemoryOps && !0 && !hasNonMemoryOps)
    return null;
  let shellProgressSuffix = "";
  if (isFullscreenEnvEnabled() && isActiveGroup) {
    let elapsed, lines2 = 0;
    for (let id_1 of toolUseIds) {
      if (!inProgressToolUseIDs.has(id_1))
        continue;
      let data = lookups.progressMessagesByToolUseID.get(id_1)?.at(-1)?.data;
      if (data?.type !== "bash_progress" && data?.type !== "powershell_progress")
        continue;
      if (elapsed === void 0 || data.elapsedTimeSeconds > elapsed)
        elapsed = data.elapsedTimeSeconds, lines2 = data.totalLines;
    }
    if (elapsed !== void 0 && elapsed >= 2) {
      let time3 = formatDuration(elapsed * 1000);
      shellProgressSuffix = lines2 > 0 ? ` (${time3} \xB7 ${lines2} ${lines2 === 1 ? "line" : "lines"})` : ` (${time3})`;
    }
  }
  let nonMemParts = [];
  function pushPart(key2, verb, body) {
    let isFirst = nonMemParts.length === 0;
    if (!isFirst)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, `comma-${key2}`, !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        isFirst ? verb[0].toUpperCase() + verb.slice(1) : verb,
        " ",
        body
      ]
    }, key2, !0, void 0, this));
  }
  if (isFullscreenEnvEnabled() && message.commits?.length) {
    let byKind = {
      committed: "committed",
      amended: "amended commit",
      "cherry-picked": "cherry-picked"
    };
    for (let kind of ["committed", "amended", "cherry-picked"]) {
      let shas = message.commits.filter((c3) => c3.kind === kind).map((c_0) => c_0.sha);
      if (shas.length)
        pushPart(kind, byKind[kind], /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: shas.join(", ")
        }, void 0, !1, void 0, this));
    }
  }
  if (isFullscreenEnvEnabled() && message.pushes?.length) {
    let branches = uniq(message.pushes.map((p4) => p4.branch));
    pushPart("push", "pushed to", /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      bold: !0,
      children: branches.join(", ")
    }, void 0, !1, void 0, this));
  }
  if (isFullscreenEnvEnabled() && message.branches?.length) {
    let byAction = {
      merged: "merged",
      rebased: "rebased onto"
    };
    for (let b of message.branches)
      pushPart(`br-${b.action}-${b.ref}`, byAction[b.action], /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        bold: !0,
        children: b.ref
      }, void 0, !1, void 0, this));
  }
  if (isFullscreenEnvEnabled() && message.prs?.length) {
    let verbs = {
      created: "created",
      edited: "edited",
      merged: "merged",
      commented: "commented on",
      closed: "closed",
      ready: "marked ready"
    };
    for (let pr of message.prs)
      pushPart(`pr-${pr.action}-${pr.number}`, verbs[pr.action], pr.url ? /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(PrBadge, {
        number: pr.number,
        url: pr.url,
        bold: !0
      }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        bold: !0,
        children: [
          "PR #",
          pr.number
        ]
      }, void 0, !0, void 0, this));
  }
  if (searchCount > 0) {
    let isFirst_0 = nonMemParts.length === 0, searchVerb = isActiveGroup ? isFirst_0 ? "Searching for" : "searching for" : isFirst_0 ? "Searched for" : "searched for";
    if (!isFirst_0)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-s", !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        searchVerb,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: searchCount
        }, void 0, !1, void 0, this),
        " ",
        searchCount === 1 ? "pattern" : "patterns"
      ]
    }, "search", !0, void 0, this));
  }
  if (readCount > 0) {
    let isFirst_1 = nonMemParts.length === 0, readVerb = isActiveGroup ? isFirst_1 ? "Reading" : "reading" : isFirst_1 ? "Read" : "read";
    if (!isFirst_1)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-r", !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        readVerb,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: readCount
        }, void 0, !1, void 0, this),
        " ",
        readCount === 1 ? "file" : "files"
      ]
    }, "read", !0, void 0, this));
  }
  if (listCount > 0) {
    let isFirst_2 = nonMemParts.length === 0, listVerb = isActiveGroup ? isFirst_2 ? "Listing" : "listing" : isFirst_2 ? "Listed" : "listed";
    if (!isFirst_2)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-l", !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        listVerb,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: listCount
        }, void 0, !1, void 0, this),
        " ",
        listCount === 1 ? "directory" : "directories"
      ]
    }, "list", !0, void 0, this));
  }
  if (replCount > 0) {
    let replVerb = isActiveGroup ? "REPL'ing" : "REPL'd";
    if (nonMemParts.length > 0)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-repl", !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        replVerb,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: replCount
        }, void 0, !1, void 0, this),
        " ",
        replCount === 1 ? "time" : "times"
      ]
    }, "repl", !0, void 0, this));
  }
  if (mcpCallCount > 0) {
    let serverLabel = message.mcpServerNames?.map((n5) => n5.replace(/^claude\.ai /, "")).join(", ") || "MCP", isFirst_3 = nonMemParts.length === 0, verb_0 = isActiveGroup ? isFirst_3 ? "Querying" : "querying" : isFirst_3 ? "Queried" : "queried";
    if (!isFirst_3)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-mcp", !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        verb_0,
        " ",
        serverLabel,
        mcpCallCount > 1 && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(jsx_dev_runtime103.Fragment, {
          children: [
            " ",
            /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
              bold: !0,
              children: mcpCallCount
            }, void 0, !1, void 0, this),
            " times"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, "mcp", !0, void 0, this));
  }
  if (isFullscreenEnvEnabled() && bashCount > 0) {
    let isFirst_4 = nonMemParts.length === 0, verb_1 = isActiveGroup ? isFirst_4 ? "Running" : "running" : isFirst_4 ? "Ran" : "ran";
    if (!isFirst_4)
      nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-bash", !1, void 0, this));
    nonMemParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        verb_1,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: bashCount
        }, void 0, !1, void 0, this),
        " bash",
        " ",
        bashCount === 1 ? "command" : "commands"
      ]
    }, "bash", !0, void 0, this));
  }
  let hasPrecedingNonMem = nonMemParts.length > 0, memParts = [];
  if (memoryReadCount > 0) {
    let isFirst_5 = !hasPrecedingNonMem && memParts.length === 0, verb_2 = isActiveGroup ? isFirst_5 ? "Recalling" : "recalling" : isFirst_5 ? "Recalled" : "recalled";
    if (!isFirst_5)
      memParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-mr", !1, void 0, this));
    memParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        verb_2,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: memoryReadCount
        }, void 0, !1, void 0, this),
        " ",
        memoryReadCount === 1 ? "memory" : "memories"
      ]
    }, "mem-read", !0, void 0, this));
  }
  if (memorySearchCount > 0) {
    let isFirst_6 = !hasPrecedingNonMem && memParts.length === 0, verb_3 = isActiveGroup ? isFirst_6 ? "Searching" : "searching" : isFirst_6 ? "Searched" : "searched";
    if (!isFirst_6)
      memParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-ms", !1, void 0, this));
    memParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: `${verb_3} memories`
    }, "mem-search", !1, void 0, this));
  }
  if (memoryWriteCount > 0) {
    let isFirst_7 = !hasPrecedingNonMem && memParts.length === 0, verb_4 = isActiveGroup ? isFirst_7 ? "Writing" : "writing" : isFirst_7 ? "Wrote" : "wrote";
    if (!isFirst_7)
      memParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        children: ", "
      }, "comma-mw", !1, void 0, this));
    memParts.push(/* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
      children: [
        verb_4,
        " ",
        /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
          bold: !0,
          children: memoryWriteCount
        }, void 0, !1, void 0, this),
        " ",
        memoryWriteCount === 1 ? "memory" : "memories"
      ]
    }, "mem-write", !0, void 0, this));
  }
  return /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    marginTop: 1,
    backgroundColor: bg,
    children: [
      /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          isActiveGroup ? /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ToolUseLoader, {
            shouldAnimate: !0,
            isUnresolved: !0,
            isError: anyError
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
            minWidth: 2
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
            dimColor: !isActiveGroup,
            children: [
              nonMemParts,
              memParts,
              null,
              isActiveGroup && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
                children: "\u2026"
              }, "ellipsis", !1, void 0, this),
              " ",
              /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      isActiveGroup && displayedHint !== void 0 && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: [
          /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
            width: 5,
            flexShrink: 0,
            children: /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
              dimColor: !0,
              children: "  \u23BF  "
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            flexGrow: 1,
            children: displayedHint.split(`
`).map((line, i5, arr) => /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
              dimColor: !0,
              children: [
                line,
                i5 === arr.length - 1 && shellProgressSuffix
              ]
            }, `hint-${i5}`, !0, void 0, this))
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      message.hookTotalMs !== void 0 && message.hookTotalMs > 0 && /* @__PURE__ */ jsx_dev_runtime103.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "  \u23BF  ",
          "Ran ",
          message.hookCount,
          " PreToolUse",
          " ",
          message.hookCount === 1 ? "hook" : "hooks",
          " (",
          formatSecondsShort(message.hookTotalMs),
          ")"
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
