// function: AttachmentMessage
function AttachmentMessage({
  attachment,
  addMargin,
  verbose,
  isTranscriptMode
}) {
  let bg = useSelectedMessageBg(), isDemoEnv = !1;
  if (isAgentSwarmsEnabled() && attachment.type === "teammate_mailbox") {
    let visibleMessages = attachment.messages.filter((msg) => {
      if (isShutdownApproved(msg.text))
        return !1;
      try {
        let parsed = jsonParse(msg.text);
        return parsed?.type !== "idle_notification" && parsed?.type !== "teammate_terminated";
      } catch {
        return !0;
      }
    });
    if (visibleMessages.length === 0)
      return null;
    return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: visibleMessages.map((msg_0, idx) => {
        let parsedMsg = null;
        try {
          parsedMsg = jsonParse(msg_0.text);
        } catch {}
        if (parsedMsg?.type === "task_assignment")
          return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
            paddingLeft: 2,
            children: [
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                children: [
                  BLACK_CIRCLE,
                  " "
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                children: "Task assigned: "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                bold: !0,
                children: [
                  "#",
                  parsedMsg.taskId
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                children: [
                  " - ",
                  parsedMsg.subject
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  " (from ",
                  parsedMsg.assignedBy || msg_0.from,
                  ")"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, idx, !0, void 0, this);
        let planApprovalElement = tryRenderPlanApprovalMessage(msg_0.text, msg_0.from);
        if (planApprovalElement)
          return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(import_react68.default.Fragment, {
            children: planApprovalElement
          }, idx, !1, void 0, this);
        let inkColor = toInkColor(msg_0.color), formattedContent = formatTeammateMessageContent(msg_0.text) ?? msg_0.text;
        return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(TeammateMessageContent, {
          displayName: msg_0.from,
          inkColor,
          content: formattedContent,
          summary: msg_0.summary,
          isTranscriptMode
        }, idx, !1, void 0, this);
      })
    }, void 0, !1, void 0, this);
  }
  switch (attachment.type) {
    case "directory":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Listed directory ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath + sep13
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    case "file":
    case "already_read_file":
      if (attachment.content.type === "notebook")
        return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
          children: [
            "Read ",
            /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
              bold: !0,
              children: attachment.displayPath
            }, void 0, !1, void 0, this),
            " (",
            attachment.content.file.cells.length,
            " cells)"
          ]
        }, void 0, !0, void 0, this);
      if (attachment.content.type === "file_unchanged")
        return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
          children: [
            "Read ",
            /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
              bold: !0,
              children: attachment.displayPath
            }, void 0, !1, void 0, this),
            " (unchanged)"
          ]
        }, void 0, !0, void 0, this);
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Read ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath
          }, void 0, !1, void 0, this),
          " (",
          attachment.content.type === "text" ? `${attachment.content.file.numLines}${attachment.truncated ? "+" : ""} lines` : formatFileSize(attachment.content.file.originalSize),
          ")"
        ]
      }, void 0, !0, void 0, this);
    case "compact_file_reference":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Referenced file ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    case "pdf_reference":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Referenced PDF ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath
          }, void 0, !1, void 0, this),
          " (",
          attachment.pageCount,
          " pages)"
        ]
      }, void 0, !0, void 0, this);
    case "selected_lines_in_ide":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "\u29C9 Selected",
          " ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.lineEnd - attachment.lineStart + 1
          }, void 0, !1, void 0, this),
          " ",
          "lines from ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath
          }, void 0, !1, void 0, this),
          " in",
          " ",
          attachment.ideName
        ]
      }, void 0, !0, void 0, this);
    case "nested_memory":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Loaded ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    case "relevant_memories":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        marginTop: addMargin ? 1 : 0,
        backgroundColor: bg,
        children: [
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            children: [
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
                minWidth: 2
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  "Recalled ",
                  /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                    bold: !0,
                    children: attachment.memories.length
                  }, void 0, !1, void 0, this),
                  " ",
                  attachment.memories.length === 1 ? "memory" : "memories",
                  !isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(jsx_dev_runtime101.Fragment, {
                    children: [
                      " ",
                      /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(CtrlOToExpand, {}, void 0, !1, void 0, this)
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          (verbose || isTranscriptMode) && attachment.memories.map((m4) => /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(MessageResponse, {
                children: /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                  dimColor: !0,
                  children: /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(FilePathLink, {
                    filePath: m4.path,
                    children: basename16(m4.path)
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this),
              isTranscriptMode && /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
                paddingLeft: 5,
                children: /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
                  children: /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Ansi, {
                    children: m4.content
                  }, void 0, !1, void 0, this)
                }, void 0, !1, void 0, this)
              }, void 0, !1, void 0, this)
            ]
          }, m4.path, !0, void 0, this))
        ]
      }, void 0, !0, void 0, this);
    case "dynamic_skill": {
      let skillCount = attachment.skillNames.length;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Loaded",
          " ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: [
              skillCount,
              " ",
              plural(skillCount, "skill")
            ]
          }, void 0, !0, void 0, this),
          " ",
          "from ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.displayPath
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    }
    case "skill_listing": {
      if (attachment.isInitial)
        return null;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.skillCount
          }, void 0, !1, void 0, this),
          " ",
          plural(attachment.skillCount, "skill"),
          " available"
        ]
      }, void 0, !0, void 0, this);
    }
    case "agent_listing_delta": {
      if (attachment.isInitial || attachment.addedTypes.length === 0)
        return null;
      let count3 = attachment.addedTypes.length;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: count3
          }, void 0, !1, void 0, this),
          " agent ",
          plural(count3, "type"),
          " available"
        ]
      }, void 0, !0, void 0, this);
    }
    case "queued_command": {
      let text2 = typeof attachment.prompt === "string" ? attachment.prompt : getContentText(attachment.prompt) || "", hasImages = attachment.imagePasteIds && attachment.imagePasteIds.length > 0;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(UserTextMessage, {
            addMargin,
            param: {
              text: text2,
              type: "text"
            },
            verbose,
            isTranscriptMode
          }, void 0, !1, void 0, this),
          hasImages && attachment.imagePasteIds?.map((id) => /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(UserImageMessage, {
            imageId: id
          }, id, !1, void 0, this))
        ]
      }, void 0, !0, void 0, this);
    }
    case "plan_file_reference":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Plan file referenced (",
          getDisplayPath(attachment.planFilePath),
          ")"
        ]
      }, void 0, !0, void 0, this);
    case "invoked_skills": {
      if (attachment.skills.length === 0)
        return null;
      let skillNames = attachment.skills.map((s_0) => s_0.name).join(", ");
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Skills restored (",
          skillNames,
          ")"
        ]
      }, void 0, !0, void 0, this);
    }
    case "diagnostics":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(DiagnosticsDisplay, {
        attachment,
        verbose
      }, void 0, !1, void 0, this);
    case "mcp_resource":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Read MCP resource ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.name
          }, void 0, !1, void 0, this),
          " from",
          " ",
          attachment.server
        ]
      }, void 0, !0, void 0, this);
    case "command_permissions":
      return null;
    case "async_hook_response": {
      if (attachment.hookEvent === "SessionStart" && !verbose)
        return null;
      if (!verbose && !isTranscriptMode)
        return null;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          "Async hook ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.hookEvent
          }, void 0, !1, void 0, this),
          " completed"
        ]
      }, void 0, !0, void 0, this);
    }
    case "hook_blocking_error": {
      if (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")
        return null;
      let stderr = attachment.blockingError.blockingError.trim();
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(jsx_dev_runtime101.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
            color: "error",
            children: [
              attachment.hookName,
              " hook returned blocking error"
            ]
          }, void 0, !0, void 0, this),
          stderr ? /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
            color: "error",
            children: stderr
          }, void 0, !1, void 0, this) : null
        ]
      }, void 0, !0, void 0, this);
    }
    case "hook_non_blocking_error": {
      if (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")
        return null;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        color: "error",
        children: [
          attachment.hookName,
          " hook error"
        ]
      }, void 0, !0, void 0, this);
    }
    case "hook_error_during_execution":
      if (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")
        return null;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          attachment.hookName,
          " hook warning"
        ]
      }, void 0, !0, void 0, this);
    case "hook_success":
      return null;
    case "hook_stopped_continuation":
      if (attachment.hookEvent === "Stop" || attachment.hookEvent === "SubagentStop")
        return null;
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        color: "warning",
        children: [
          attachment.hookName,
          " hook stopped continuation: ",
          attachment.message
        ]
      }, void 0, !0, void 0, this);
    case "hook_system_message":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          attachment.hookName,
          " says: ",
          attachment.content
        ]
      }, void 0, !0, void 0, this);
    case "hook_permission_decision": {
      let action2 = attachment.decision === "allow" ? "Allowed" : "Denied";
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(Line, {
        children: [
          action2,
          " by ",
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            bold: !0,
            children: attachment.hookEvent
          }, void 0, !1, void 0, this),
          " hook"
        ]
      }, void 0, !0, void 0, this);
    }
    case "task_status":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(TaskStatusMessage, {
        attachment
      }, void 0, !1, void 0, this);
    case "teammate_shutdown_batch":
      return /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        width: "100%",
        marginTop: 1,
        backgroundColor: bg,
        children: [
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              BLACK_CIRCLE,
              " "
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              attachment.count,
              " ",
              plural(attachment.count, "teammate"),
              " shut down gracefully"
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this);
    default:
      return attachment.type, null;
  }
}
