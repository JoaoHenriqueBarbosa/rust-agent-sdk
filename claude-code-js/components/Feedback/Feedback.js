// function: Feedback
function Feedback({
  abortSignal,
  messages,
  initialDescription,
  onDone,
  backgroundTasks = {}
}) {
  let [step, setStep] = import_react94.useState("userInput"), [cursorOffset, setCursorOffset] = import_react94.useState(0), [description, setDescription] = import_react94.useState(initialDescription ?? ""), [feedbackId, setFeedbackId] = import_react94.useState(null), [error44, setError] = import_react94.useState(null), [envInfo, setEnvInfo] = import_react94.useState({
    isGit: !1,
    gitState: null
  }), [title, setTitle] = import_react94.useState(null), textInputColumns = useTerminalSize().columns - 4;
  import_react94.useEffect(() => {
    async function loadEnvInfo() {
      let isGit = await getIsGit(), gitState = null;
      if (isGit)
        gitState = await getGitState();
      setEnvInfo({
        isGit,
        gitState
      });
    }
    loadEnvInfo();
  }, []);
  let submitReport = import_react94.useCallback(async () => {
    setStep("submitting"), setError(null), setFeedbackId(null);
    let sanitizedErrors = getSanitizedErrorLogs(), lastAssistantMessageId = getLastAssistantMessage(messages)?.requestId ?? null, [diskTranscripts, rawTranscriptJsonl] = await Promise.all([loadAllSubagentTranscriptsFromDisk(), loadRawTranscriptJsonl()]), teammateTranscripts = extractTeammateTranscriptsFromTasks(backgroundTasks), subagentTranscripts = {
      ...diskTranscripts,
      ...teammateTranscripts
    }, reportData = {
      latestAssistantMessageId: lastAssistantMessageId,
      message_count: messages.length,
      datetime: (/* @__PURE__ */ new Date()).toISOString(),
      description,
      platform: env3.platform,
      gitRepo: envInfo.isGit,
      terminal: env3.terminal,
      version: "2.1.90",
      transcript: normalizeMessagesForAPI(messages),
      errors: sanitizedErrors,
      lastApiRequest: getLastAPIRequest(),
      ...Object.keys(subagentTranscripts).length > 0 && {
        subagentTranscripts
      },
      ...rawTranscriptJsonl && {
        rawTranscriptJsonl
      }
    }, [result, t2] = await Promise.all([submitFeedback(reportData, abortSignal), generateTitle(description, abortSignal)]);
    if (setTitle(t2), result.success) {
      if (result.feedbackId)
        setFeedbackId(result.feedbackId), logEvent("tengu_bug_report_submitted", {
          feedback_id: result.feedbackId,
          last_assistant_message_id: lastAssistantMessageId
        }), logEventTo1P("tengu_bug_report_description", {
          feedback_id: result.feedbackId,
          description: redactSensitiveInfo(description)
        });
      setStep("done");
    } else {
      if (result.isZdrOrg)
        setError("Feedback collection is not available for organizations with custom data retention policies.");
      else
        setError("Could not submit feedback. Please try again later.");
      setStep("userInput");
    }
  }, [description, envInfo.isGit, messages]), handleCancel = import_react94.useCallback(() => {
    if (step === "done") {
      if (error44)
        onDone("Error submitting feedback / bug report", {
          display: "system"
        });
      else
        onDone("Feedback / bug report submitted", {
          display: "system"
        });
      return;
    }
    onDone("Feedback / bug report cancelled", {
      display: "system"
    });
  }, [step, error44, onDone]);
  return useKeybinding("confirm:no", handleCancel, {
    context: "Settings",
    isActive: step === "userInput"
  }), use_input_default((input, key3) => {
    if (step === "done") {
      if (key3.return && title) {
        let issueUrl = createGitHubIssueUrl(feedbackId ?? "", title, description, getSanitizedErrorLogs());
        openBrowser(issueUrl);
      }
      if (error44)
        onDone("Error submitting feedback / bug report", {
          display: "system"
        });
      else
        onDone("Feedback / bug report submitted", {
          display: "system"
        });
      return;
    }
    if (error44 && step !== "userInput") {
      onDone("Error submitting feedback / bug report", {
        display: "system"
      });
      return;
    }
    if (step === "consent" && (key3.return || input === " "))
      submitReport();
  }), /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(Dialog, {
    title: "Submit Feedback / Bug Report",
    onCancel: handleCancel,
    isCancelActive: step !== "userInput",
    inputGuide: (exitState) => exitState.pending ? /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
      children: [
        "Press ",
        exitState.keyName,
        " again to exit"
      ]
    }, void 0, !0, void 0, this) : step === "userInput" ? /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "continue"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : step === "consent" ? /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(Byline, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(KeyboardShortcutHint, {
          shortcut: "Enter",
          action: "submit"
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ConfigurableShortcutHint, {
          action: "confirm:no",
          context: "Confirmation",
          fallback: "Esc",
          description: "cancel"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this) : null,
    children: [
      step === "userInput" && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        gap: 1,
        children: [
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
            children: "Describe the issue below:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(TextInput, {
            value: description,
            onChange: (value) => {
              if (setDescription(value), error44)
                setError(null);
            },
            columns: textInputColumns,
            onSubmit: () => setStep("consent"),
            onExitMessage: () => onDone("Feedback cancelled", {
              display: "system"
            }),
            cursorOffset,
            onChangeCursorOffset: setCursorOffset,
            showCursor: !0
          }, void 0, !1, void 0, this),
          error44 && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
            flexDirection: "column",
            gap: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                color: "error",
                children: error44
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                dimColor: !0,
                children: "Edit and press Enter to retry, or Esc to cancel"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      step === "consent" && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
            children: "This report will include:"
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
            marginLeft: 2,
            flexDirection: "column",
            children: [
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                children: [
                  "- Your feedback / bug description:",
                  " ",
                  /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: description
                  }, void 0, !1, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                children: [
                  "- Environment info:",
                  " ",
                  /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      env3.platform,
                      ", ",
                      env3.terminal,
                      ", v",
                      "2.1.90"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              envInfo.gitState && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                children: [
                  "- Git repo metadata:",
                  " ",
                  /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                    dimColor: !0,
                    children: [
                      envInfo.gitState.branchName,
                      envInfo.gitState.commitHash ? `, ${envInfo.gitState.commitHash.slice(0, 7)}` : "",
                      envInfo.gitState.remoteUrl ? ` @ ${envInfo.gitState.remoteUrl}` : "",
                      !envInfo.gitState.isHeadOnRemote && ", not synced",
                      !envInfo.gitState.isClean && ", has local changes"
                    ]
                  }, void 0, !0, void 0, this)
                ]
              }, void 0, !0, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                children: "- Current session transcript"
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
              wrap: "wrap",
              dimColor: !0,
              children: [
                "We will use your feedback to debug related issues or to improve",
                " ",
                "Claude Code's functionality (eg. to reduce the risk of bugs occurring in the future)."
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
              children: [
                "Press ",
                /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                  bold: !0,
                  children: "Enter"
                }, void 0, !1, void 0, this),
                " to confirm and submit."
              ]
            }, void 0, !0, void 0, this)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this),
      step === "submitting" && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
        flexDirection: "row",
        gap: 1,
        children: /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
          children: "Submitting report\u2026"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this),
      step === "done" && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          error44 ? /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
            color: "error",
            children: error44
          }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
            color: "success",
            children: "Thank you for your report!"
          }, void 0, !1, void 0, this),
          feedbackId && /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
            dimColor: !0,
            children: [
              "Feedback ID: ",
              feedbackId
            ]
          }, void 0, !0, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedBox_default, {
            marginTop: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                children: "Press "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                bold: !0,
                children: "Enter "
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime164.jsxDEV(ThemedText, {
                children: "to open your browser and draft a GitHub issue, or any other key to close."
              }, void 0, !1, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
