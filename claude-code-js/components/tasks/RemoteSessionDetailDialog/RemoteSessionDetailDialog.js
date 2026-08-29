// function: RemoteSessionDetailDialog
function RemoteSessionDetailDialog({
  session: session2,
  toolUseContext,
  onDone,
  onBack,
  onKill
}) {
  let [isTeleporting, setIsTeleporting] = import_react163.useState(!1), [teleportError, setTeleportError] = import_react163.useState(null), lastMessages = import_react163.useMemo(() => {
    if (session2.isUltraplan || session2.isRemoteReview)
      return [];
    return normalizeMessages(toInternalMessages(session2.log)).filter((_) => _.type !== "progress").slice(-3);
  }, [session2]);
  if (session2.isUltraplan)
    return /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(UltraplanSessionDetail, {
      session: session2,
      onDone,
      onBack,
      onKill
    }, void 0, !1, void 0, this);
  if (session2.isRemoteReview)
    return /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ReviewSessionDetail, {
      session: session2,
      onDone,
      onBack,
      onKill
    }, void 0, !1, void 0, this);
  let handleClose = () => onDone("Remote session details dismissed", {
    display: "system"
  }), handleKeyDown = (e) => {
    if (e.key === " ")
      e.preventDefault(), onDone("Remote session details dismissed", {
        display: "system"
      });
    else if (e.key === "left" && onBack)
      e.preventDefault(), onBack();
    else if (e.key === "t" && !isTeleporting)
      e.preventDefault(), handleTeleport();
    else if (e.key === "return")
      e.preventDefault(), handleClose();
  };
  async function handleTeleport() {
    setIsTeleporting(!0), setTeleportError(null);
    try {
      await teleportResumeCodeSession(session2.sessionId);
    } catch (err2) {
      setTeleportError(errorMessage(err2));
    } finally {
      setIsTeleporting(!1);
    }
  }
  let displayTitle = truncateToWidth(session2.title, 50), displayStatus = session2.status === "pending" ? "starting" : session2.status;
  return /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    tabIndex: 0,
    autoFocus: !0,
    onKeyDown: handleKeyDown,
    children: /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Dialog, {
      title: "Remote session details",
      onCancel: handleClose,
      color: "background",
      inputGuide: (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
        children: [
          "Press ",
          exitState.keyName,
          " again to exit"
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Byline, {
        children: [
          onBack && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(KeyboardShortcutHint, {
            shortcut: "\u2190",
            action: "go back"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(KeyboardShortcutHint, {
            shortcut: "Esc/Enter/Space",
            action: "close"
          }, void 0, !1, void 0, this),
          !isTeleporting && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(KeyboardShortcutHint, {
            shortcut: "t",
            action: "teleport"
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      children: [
        /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          children: [
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Status"
                }, void 0, !1, void 0, this),
                ":",
                " ",
                displayStatus === "running" || displayStatus === "starting" ? /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  color: "background",
                  children: displayStatus
                }, void 0, !1, void 0, this) : displayStatus === "completed" ? /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  color: "success",
                  children: displayStatus
                }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  color: "error",
                  children: displayStatus
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Runtime"
                }, void 0, !1, void 0, this),
                ":",
                " ",
                formatDuration((session2.endTime ?? Date.now()) - session2.startTime)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
              wrap: "truncate-end",
              children: [
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Title"
                }, void 0, !1, void 0, this),
                ": ",
                displayTitle
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Progress"
                }, void 0, !1, void 0, this),
                ":",
                " ",
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(RemoteSessionProgress, {
                  session: session2
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Session URL"
                }, void 0, !1, void 0, this),
                ":",
                " ",
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Link, {
                  url: getRemoteTaskSessionUrl(session2.sessionId),
                  children: /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: getRemoteTaskSessionUrl(session2.sessionId)
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        session2.log.length > 0 && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
          flexDirection: "column",
          marginTop: 1,
          children: [
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
              children: [
                /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Recent messages"
                }, void 0, !1, void 0, this),
                ":"
              ]
            }, void 0, !0, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
              flexDirection: "column",
              height: 10,
              overflowY: "hidden",
              children: lastMessages.map((msg, i5) => /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(Message4, {
                message: msg,
                lookups: EMPTY_LOOKUPS,
                addMargin: i5 > 0,
                tools: toolUseContext.options.tools,
                commands: toolUseContext.options.commands,
                verbose: toolUseContext.options.verbose,
                inProgressToolUseIDs: /* @__PURE__ */ new Set,
                progressMessagesForMessage: [],
                shouldAnimate: !1,
                shouldShowDot: !1,
                style: "condensed",
                isTranscriptMode: !1,
                isStatic: !0
              }, i5, !1, void 0, this))
            }, void 0, !1, void 0, this),
            /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
              marginTop: 1,
              children: /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
                dimColor: !0,
                italic: !0,
                children: [
                  "Showing last ",
                  lastMessages.length,
                  " of ",
                  session2.log.length,
                  " ",
                  "messages"
                ]
              }, void 0, !0, void 0, this)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this),
        teleportError && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedBox_default, {
          marginTop: 1,
          children: /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
            color: "error",
            children: [
              "Teleport failed: ",
              teleportError
            ]
          }, void 0, !0, void 0, this)
        }, void 0, !1, void 0, this),
        isTeleporting && /* @__PURE__ */ jsx_dev_runtime287.jsxDEV(ThemedText, {
          color: "background",
          children: "Teleporting to session\u2026"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this)
  }, void 0, !1, void 0, this);
}
