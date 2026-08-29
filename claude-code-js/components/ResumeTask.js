// Original: src/components/ResumeTask.tsx
function ResumeTask({
  onSelect,
  onCancel,
  isEmbedded = !1
}) {
  let {
    rows
  } = useTerminalSize(), [sessions, setSessions] = import_react312.useState([]), [currentRepo, setCurrentRepo] = import_react312.useState(null), [loading, setLoading] = import_react312.useState(!0), [loadErrorType, setLoadErrorType] = import_react312.useState(null), [retrying, setRetrying] = import_react312.useState(!1), [hasCompletedTeleportErrorFlow, setHasCompletedTeleportErrorFlow] = import_react312.useState(!1), [focusedIndex, setFocusedIndex] = import_react312.useState(1), escKey = useShortcutDisplay("confirm:no", "Confirmation", "Esc"), loadSessions = import_react312.useCallback(async () => {
    try {
      setLoading(!0), setLoadErrorType(null);
      let detectedRepo = await detectCurrentRepository();
      setCurrentRepo(detectedRepo), logForDebugging(`Current repository: ${detectedRepo || "not detected"}`);
      let codeSessions = await fetchCodeSessionsFromSessionsAPI(), filteredSessions = codeSessions;
      if (detectedRepo)
        filteredSessions = codeSessions.filter((session2) => {
          if (!session2.repo)
            return !1;
          return `${session2.repo.owner.login}/${session2.repo.name}` === detectedRepo;
        }), logForDebugging(`Filtered ${filteredSessions.length} sessions for repo ${detectedRepo} from ${codeSessions.length} total`);
      let sortedSessions = [...filteredSessions].sort((a2, b) => {
        let dateA = new Date(a2.updated_at);
        return new Date(b.updated_at).getTime() - dateA.getTime();
      });
      setSessions(sortedSessions);
    } catch (err2) {
      let errorMessage4 = err2 instanceof Error ? err2.message : String(err2);
      logForDebugging(`Error loading code sessions: ${errorMessage4}`), setLoadErrorType(determineErrorType(errorMessage4));
    } finally {
      setLoading(!1), setRetrying(!1);
    }
  }, []), handleRetry = () => {
    setRetrying(!0), loadSessions();
  };
  useKeybinding("confirm:no", onCancel, {
    context: "Confirmation"
  }), use_input_default((input, key3) => {
    if (key3.ctrl && input === "c") {
      onCancel();
      return;
    }
    if (key3.ctrl && input === "r" && loadErrorType) {
      handleRetry();
      return;
    }
    if (loadErrorType !== null && key3.return) {
      onCancel();
      return;
    }
  });
  let handleErrorComplete = import_react312.useCallback(() => {
    setHasCompletedTeleportErrorFlow(!0), loadSessions();
  }, [setHasCompletedTeleportErrorFlow, loadSessions]);
  if (!hasCompletedTeleportErrorFlow)
    return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(TeleportError, {
      onComplete: handleErrorComplete
    }, void 0, !1, void 0, this);
  if (loading)
    return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
          flexDirection: "row",
          children: [
            /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(Spinner, {}, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
              bold: !0,
              children: "Loading Claude Code sessions\u2026"
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          dimColor: !0,
          children: retrying ? "Retrying\u2026" : "Fetching your Claude Code sessions\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (loadErrorType)
    return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          bold: !0,
          color: "error",
          children: "Error loading Claude Code sessions"
        }, void 0, !1, void 0, this),
        renderErrorSpecificGuidance(loadErrorType),
        /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          dimColor: !0,
          children: [
            "Press ",
            /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
              bold: !0,
              children: "Ctrl+R"
            }, void 0, !1, void 0, this),
            " to retry \xB7 Press",
            " ",
            /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
              bold: !0,
              children: escKey
            }, void 0, !1, void 0, this),
            " to cancel"
          ]
        }, void 0, !0, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  if (sessions.length === 0)
    return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      padding: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          bold: !0,
          children: [
            "No Claude Code sessions found",
            currentRepo && /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
              children: [
                " for ",
                currentRepo
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Press ",
              /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
                bold: !0,
                children: escKey
              }, void 0, !1, void 0, this),
              " to cancel"
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this);
  let sessionMetadata = sessions.map((session_0) => ({
    ...session_0,
    timeString: formatRelativeTime(new Date(session_0.updated_at))
  })), maxTimeStringLength = Math.max(UPDATED_STRING.length, ...sessionMetadata.map((meta) => meta.timeString.length)), options2 = sessionMetadata.map(({
    timeString,
    title,
    id
  }) => {
    return {
      label: `${timeString.padEnd(maxTimeStringLength, " ")}  ${title}`,
      value: id
    };
  }), layoutOverhead = 7, maxVisibleOptions = Math.max(1, isEmbedded ? Math.min(sessions.length, 5, rows - 6 - layoutOverhead) : Math.min(sessions.length, rows - 1 - layoutOverhead)), maxHeight = maxVisibleOptions + layoutOverhead, showScrollPosition = sessions.length > maxVisibleOptions;
  return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    padding: 1,
    height: maxHeight,
    children: [
      /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
        bold: !0,
        children: [
          "Select a session to resume",
          showScrollPosition && /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " ",
              "(",
              focusedIndex,
              " of ",
              sessions.length,
              ")"
            ]
          }, void 0, !0, void 0, this),
          currentRepo && /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              " (",
              currentRepo,
              ")"
            ]
          }, void 0, !0, void 0, this),
          ":"
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: 1,
        flexGrow: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
            marginLeft: 2,
            children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                UPDATED_STRING.padEnd(maxTimeStringLength, " "),
                SPACE_BETWEEN_TABLE_COLUMNS,
                "Session Title"
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(Select, {
            visibleOptionCount: maxVisibleOptions,
            options: options2,
            onChange: (value) => {
              let session_1 = sessions.find((s2) => s2.id === value);
              if (session_1)
                onSelect(session_1);
            },
            onFocus: (value_0) => {
              let index2 = options2.findIndex((o5) => o5.value === value_0);
              if (index2 >= 0)
                setFocusedIndex(index2 + 1);
            }
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          dimColor: !0,
          children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(Byline, {
            children: [
              /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(KeyboardShortcutHint, {
                shortcut: "\u2191/\u2193",
                action: "select"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(KeyboardShortcutHint, {
                shortcut: "Enter",
                action: "confirm"
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ConfigurableShortcutHint, {
                action: "confirm:no",
                context: "Confirmation",
                fallback: "Esc",
                description: "cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function determineErrorType(errorMessage4) {
  let message = errorMessage4.toLowerCase();
  if (message.includes("fetch") || message.includes("network") || message.includes("timeout"))
    return "network";
  if (message.includes("auth") || message.includes("token") || message.includes("permission") || message.includes("oauth") || message.includes("not authenticated") || message.includes("/login") || message.includes("console account") || message.includes("403"))
    return "auth";
  if (message.includes("api") || message.includes("rate limit") || message.includes("500") || message.includes("529"))
    return "api";
  return "other";
}
function renderErrorSpecificGuidance(errorType) {
  switch (errorType) {
    case "network":
      return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
        marginY: 1,
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Check your internet connection"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    case "auth":
      return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
        marginY: 1,
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
            dimColor: !0,
            children: "Teleport requires a Claude account"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Run ",
              /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
                bold: !0,
                children: "/login"
              }, void 0, !1, void 0, this),
              ' and select "Claude account with subscription"'
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    case "api":
      return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
        marginY: 1,
        flexDirection: "column",
        children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Sorry, Claude encountered an error"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    case "other":
      return /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedBox_default, {
        marginY: 1,
        flexDirection: "row",
        children: /* @__PURE__ */ jsx_dev_runtime475.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Sorry, Claude Code encountered an error"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
  }
}
var import_react312, jsx_dev_runtime475, UPDATED_STRING = "Updated", SPACE_BETWEEN_TABLE_COLUMNS = "  ";
var init_ResumeTask = __esm(() => {
  init_useTerminalSize();
  init_api2();
  init_ink2();
  init_useKeybinding();
  init_useShortcutDisplay();
  init_debug();
  init_detectRepository();
  init_format();
  init_ConfigurableShortcutHint();
  init_CustomSelect();
  init_Byline();
  init_KeyboardShortcutHint();
  init_Spinner2();
  init_TeleportError();
  import_react312 = __toESM(require_react_development(), 1), jsx_dev_runtime475 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
